const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../lib/prisma');

const SYSTEM_PROMPT = {
  en: `You are Komera, a compassionate AI mental health companion. Komera means "be strong" in Kinyarwanda. You support users through mental health challenges with empathy, warmth and cultural sensitivity. You are not a replacement for professional therapy but a supportive companion. Always encourage users to seek professional help when needed. If you detect suicidal thoughts or crisis, immediately provide crisis resources and encourage the user to call for help. Be warm, non-judgmental and supportive.`,
  rw: `Uri Komera, inshuti ya AI ifasha abantu mu buzima bwo mu mutwe. Komera bisobanura "gukomera" mu Kinyarwanda. Unfasha abantu mu bibazo byabo by'ubuzima bwo mu mutwe wifashishije impuhwe, ubushyuhe n'ubwenge bw'umuco. Ntabwo usimbuza inzobere mu buvuzi ariko uri inshuti ifasha. Buri gihe shishikariza abakoresha gushaka ubufasha bw'inzobere iyo bikenewe.`,
  fr: `Vous êtes Komera, un compagnon IA compatissant pour la santé mentale. Komera signifie "soyez fort" en kinyarwanda. Vous soutenez les utilisateurs à travers les défis de santé mentale avec empathie, chaleur et sensibilité culturelle. Vous n'êtes pas un substitut à la thérapie professionnelle mais un compagnon de soutien.`
};

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

    const systemPrompt = SYSTEM_PROMPT[language] || SYSTEM_PROMPT.en;

    const MODELS = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite'];
    let reply = '';
    let success = false;
    let lastError;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I am Komera, your compassionate mental health companion. I am here to listen and support you.' }] },
            ...history,
          ],
        });
        const result = await chat.sendMessage(message);
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
