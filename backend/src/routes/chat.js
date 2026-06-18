const router = require('express').Router();
const { chat, getSessions } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', chat);
router.get('/sessions', getSessions);

module.exports = router;
