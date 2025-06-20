const Feedback = require('../models/Feedback');
const { emitToAdmin } = require('../utils/socket');

exports.submit = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();

    // Add logging
    console.log('Feedback saved:', feedback);

    // Emit to admin room for real-time updates (with all fields)
    const savedFeedback = await Feedback.findById(feedback._id);
    console.log('About to emit new-feedback:', savedFeedback);
    const { emitToAdmin } = require('../utils/socket');
    emitToAdmin('new-feedback', savedFeedback.toObject());
    console.log('Emitted new-feedback for:', savedFeedback._id);

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(400).json({ message: error.message });
  }
};
exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 50, productId } = req.query;
    const query = productId ? { productId } : {};
    
    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Feedback.countDocuments(query);
    
    res.json(feedback);
  } catch (error) {
    console.error('Feedback list error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: error.message });
  }
};
