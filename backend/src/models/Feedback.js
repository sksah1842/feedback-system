const mongoose = require('mongoose');
const FeedbackSchema = new mongoose.Schema({
  productId: String,
  name: String,
  email: String,
  text: { type: String, required: true },
  rating: { type: Number, min:1, max:5, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Feedback', FeedbackSchema);
