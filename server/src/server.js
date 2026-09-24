import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Connect to MongoDB Atlas (or local fallback)
connectDB();

// Initialize Socket.io for real-time notifications and chat
export const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 ShareWay Server listening on http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Database:     MongoDB Atlas`);
  console.log(`   Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});
