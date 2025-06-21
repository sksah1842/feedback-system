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

// const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [
  // process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://feedback-system-t5cs-ejf5m4vai-sumit-kumars-projects-b887fe80.vercel.app', 
  'https://feedback-system-t5cs.vercel.app',
  'http://localhost:5173'
].filter(Boolean);

// app.use(cors({
//   // origin: [
//   //   'https://feedback-system-t5cs-oibhfdiet-sumit-kumars-projects-b887fe80.vercel.app',
//   //   "http://localhost:5173"
//   // ],
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));
// const allowedOrigins = [
//   'https://feedback-system-t5cs-oibhfdiet-sumit-kumars-projects-b887fe80.vercel.app',
//   'http://localhost:5173'
// ];
// console.log('🔥 CORS Middleware Initialized');
// app.use(cors({
//   origin: function (origin, callback) {
//     console.log('🌐 Incoming request from origin:', origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       // callback(new Error('CORS not allowed for this origin: ' + origin));
//       console.warn('❌ CORS blocked origin:', origin);
//       callback(null, false); 
//     }
//   },
//   credentials: true
// }));
// app.options('*', cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       // callback(new Error('CORS not allowed for this origin: ' + origin));
//       console.warn('❌ CORS blocked origin:', origin);
//       callback(null, false); 
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 Incoming request from origin:', origin);
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      console.warn('❌ CORS blocked origin:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply once — handles all routes including preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));



app.use(express.json());
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

app.use('/api/auth', authRoutes);
app.use('/api/feedback', fbRoutes);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
});
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB connection error:', err);
});