import { io } from 'socket.io-client';
import axios from 'axios';

// Create socket connection with proper configuration
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Connection event handlers
socket.on('connect', () => {
  console.log('✅ Connected to server with ID:', socket.id);
  // Join admin room immediately after connection
  socket.emit('join-admin');
});

socket.on('admin-joined', (data) => {
  console.log('✅ Admin joined room:', data.message);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected from server:', reason);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('🔄 Reconnected after', attemptNumber, 'attempts');
  socket.emit('join-admin');
});

export default {
  onNew(cb) { 
    socket.on('new-feedback', (data) => {
      console.log('📨 New feedback received via socket:', data);
      cb(data);
    }); 
  },
  onConnect(cb) {
    socket.on('connect', cb);
  },
  onDisconnect(cb) {
    socket.on('disconnect', cb);
  },
  getSocket() {
    return socket;
  },
  async submit(data) { 
    return axios.post('/api/feedback', data); 
  },
  async getAll(options = {}) {
    const resp = await axios.get('/api/feedback/list', { params: options, headers: authHeader() });
    return resp.data;
  },
  async getStats(options = {}) {
    const resp = await axios.get('/api/feedback/stats', { params: options, headers: authHeader() });
    return resp.data;
  }
};

function authHeader() {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
