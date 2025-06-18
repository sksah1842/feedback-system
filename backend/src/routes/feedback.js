const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submit, list, stats } = require('../controllers/feedbackController');

router.post('/', submit);
router.get('/list', auth, list);
router.get('/stats', auth, stats);

module.exports = router;
