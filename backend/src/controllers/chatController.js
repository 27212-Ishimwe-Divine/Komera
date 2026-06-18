const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../lib/prisma');
const { KOMERA_SYSTEM_PROMPT, KOMERA_ACK } = require('../prompts/komera.system');

const chat = async (req, res) => {
  try {
    const { message, sessionId, language = 'en' } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    let session;
    let history = [];

    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      if (session) {
        history = session.messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));
      }
    }

    if (!session) {
      session = await prisma.chatSession.create({ data: { userId: req.user.id } });
    }

    const systemPrompt = KOMERA_SYSTEM_PROMPT[language] || KOMERA_SYSTEM_PROMPT.en;
    const ack = KOMERA_ACK[language] || KOMERA_ACK.en;

    const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
    let reply = '';
    let success = false;
    let lastError;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chatSession = model.startChat({
          history: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: ack }] },
            ...history,
          ],
        });
        const result = await chatSession.sendMessage(message);
        reply = result.response.text();
        success = true;
        break;
      } catch (err) {
        console.warn(`Failed with model ${modelName}:`, err.message || err);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error('All Gemini models failed');
    }

    await prisma.message.createMany({
      data: [
        { sessionId: session.id, role: 'user', content: message },
        { sessionId: session.id, role: 'model', content: reply },
      ],
    });

    res.json({ reply, sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI service unavailable' });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { chat, getSessions };
