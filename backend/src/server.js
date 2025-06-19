require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { initializeSocket } = require('./utils/socket');

const authRoutes = require('./routes/auth');
const fbRoutes = require('./routes/feedback');

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
// app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(cors({
  origin: [
    "https://feedback-system-hb6m.vercel.app",
    "https://feedback-system-hb6m-5h2ha6s54-sumit-kumars-projects-b887fe80.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/feedback', fbRoutes);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
});
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB connection error:', err);
});