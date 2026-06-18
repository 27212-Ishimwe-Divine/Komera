const prisma = require('../lib/prisma');

const createEntry = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const entry = await prisma.journalEntry.create({
      data: { userId: req.user.id, title, content },
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getEntries = async (req, res) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.journalEntry.delete({ where: { id, userId: req.user.id } });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createEntry, getEntries, deleteEntry };
