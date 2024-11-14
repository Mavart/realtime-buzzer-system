import { io } from 'socket.io-client';
import type { BuzzerEvents } from './types/buzzer';

// Create socket instance with auto-reconnect
export const socket = io('http://localhost:3001', {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

// Log connection status
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.log('Connection error:', error);
});

export const buzzerEvents: BuzzerEvents = {
  buzz: (playerName: string) => socket.emit('buzz', { playerName }),
  reset: () => socket.emit('reset'),
  setMode: (mode: 'single' | 'multiple') => socket.emit('setMode', { mode }),
};