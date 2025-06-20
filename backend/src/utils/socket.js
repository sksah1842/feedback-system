const { Server } = require('socket.io');

let io = null;

function initializeSocket(server) {
  if (io) return io; // Prevent re-initialization!
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173", // Frontend URL
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });
  
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Handle admin room joining
    socket.on('join-admin', () => {
      socket.join('admin-room');
      console.log('👑 Admin joined room:', socket.id);
      socket.emit('admin-joined', { message: 'Successfully joined admin room' });
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Client disconnected:', socket.id, 'Reason:', reason);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  });
  console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
  console.log('🚀 Socket.io server initialized');
  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

function emitToAdmin(event, data) {
  const socketIO = getIO();
  socketIO.to('admin-room').emit(event, data);
  console.log(`📤 Emitted ${event} to admin room:`, data);
}

module.exports = {
  initializeSocket,
  getIO,
  emitToAdmin
};