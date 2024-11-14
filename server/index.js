import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the public directory
app.use(express.static(join(__dirname, '../public')));

let buzzerState = {
  locked: false,
  winner: null,
  timestamp: null,
  mode: 'single',
  responses: []
};

// Track connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current buzzer state to new connections
  socket.emit('buzzerState', buzzerState);
  
  // Send current users list to all clients
  const sendUsersList = () => {
    const usersList = Array.from(connectedUsers.values());
    io.emit('connectedUsers', usersList);
  };

  socket.on('playerJoin', ({ playerName }) => {
    connectedUsers.set(socket.id, { id: socket.id, name: playerName, joinedAt: Date.now() });
    sendUsersList();
  });

  socket.on('buzz', ({ playerName }) => {
    const timestamp = Date.now();
    
    if (buzzerState.mode === 'single') {
      if (!buzzerState.locked) {
        buzzerState = {
          ...buzzerState,
          locked: true,
          winner: playerName,
          timestamp,
          responses: [{ playerName, timestamp }]
        };
      }
    } else {
      // Multiple mode
      if (!buzzerState.responses.some(r => r.playerName === playerName)) {
        buzzerState = {
          ...buzzerState,
          responses: [...buzzerState.responses, { playerName, timestamp }]
        };
      }
    }
    
    io.emit('buzzerState', buzzerState);
  });

  socket.on('setMode', ({ mode }) => {
    buzzerState = {
      locked: false,
      winner: null,
      timestamp: null,
      mode,
      responses: []
    };
    io.emit('buzzerState', buzzerState);
  });

  socket.on('reset', () => {
    buzzerState = {
      locked: false,
      winner: null,
      timestamp: null,
      mode: buzzerState.mode,
      responses: []
    };
    io.emit('buzzerState', buzzerState);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
    sendUsersList();
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});