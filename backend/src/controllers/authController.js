// const Admin = require('../models/Admin');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// exports.login = async (req, res) => {
//   const { username, password } = req.body;
//   const admin = await Admin.findOne({ username });
//   if (!admin || !await bcrypt.compare(password, admin.password))
//     console.log(password, admin.password);
//     return res.status(401).json({ error: 'Invalid credentials' });

//   const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   res.json({ token });
// };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ message: 'Username and password are required' });

        const admin = await Admin.findOne({ username });
        console.log('Found admin:', admin);
        if (admin == null || admin.password == null)
            return res.status(401).json({ message: 'Invalid credentials 123' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1d' });
        res.json({ token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

