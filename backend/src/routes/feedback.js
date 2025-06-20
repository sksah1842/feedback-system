const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submit, list, stats } = require('../controllers/feedbackController');

router.post('/', submit);
router.get('/list', auth, list);
router.get('/stats', auth, stats);
router.get('/test-socket', (req, res) => {
  const { emitToAdmin } = require('../utils/socket');
  const testData = {
    _id: 'test',
    productId: 'test-product',
    name: 'Test User',
    rating: 5,
    text: 'This is a test feedback',
    createdAt: new Date()
  };
  console.log('About to emit test new-feedback:', testData);
  emitToAdmin('new-feedback', testData);
  res.json({ message: 'Test feedback emitted' });
});
module.exports = router;
