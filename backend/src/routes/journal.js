const router = require('express').Router();
const { createEntry, getEntries, deleteEntry } = require('../controllers/journalController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createEntry);
router.get('/', getEntries);
router.delete('/:id', deleteEntry);

module.exports = router;
