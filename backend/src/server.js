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

app.use(cors());
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