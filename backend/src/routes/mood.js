const router = require('express').Router();
const { logMood, getMoods } = require('../controllers/moodController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', logMood);
router.get('/', getMoods);

module.exports = router;
