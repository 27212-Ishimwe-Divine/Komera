const prisma = require('../lib/prisma');

const logMood = async (req, res) => {
  try {
    const { mood, note } = req.body;
    if (!mood || mood < 1 || mood > 5)
      return res.status(400).json({ message: 'Mood must be between 1 and 5' });
    const log = await prisma.moodLog.create({
      data: { userId: req.user.id, mood: parseInt(mood), note },
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMoods = async (req, res) => {
  try {
    const logs = await prisma.moodLog.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { logMood, getMoods };
