const Feedback = require('../models/Feedback');
const { emitToAdmin } = require('../utils/socket');

exports.submit = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    
    // Emit to admin room for real-time updates
    emitToAdmin('new-feedback', feedback);
    
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
