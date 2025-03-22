import { io } from 'socket.io-client';

// Socket.IO bağlantısını oluştur
// Gerçek dağıtımda kendi sunucu adresinizi kullanın
const SOCKET_URL = 'http://localhost:3001';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: false,
      transports: ['websocket', 'polling']
    });
    
    // Bağlantı olaylarını dinle
    socket.on('connect', () => {
      console.log('Socket.IO bağlantısı kuruldu');
    });
    
    socket.on('disconnect', () => {
      console.log('Socket.IO bağlantısı kesildi');
    });
    
    socket.on('connect_error', (err) => {
      console.error('Bağlantı hatası:', err);
    });
  }
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const createRoom = (data) => {
  const socket = getSocket();
  socket.emit('create_room', data);
};

export const joinRoom = (data) => {
  const socket = getSocket();
  socket.emit('join_room', data);
};

export const makeMove = (data) => {
  const socket = getSocket();
  socket.emit('make_move', data);
};

export const nextRound = (data) => {
  const socket = getSocket();
  socket.emit('next_round', data);
};

export const quitGame = (data) => {
  const socket = getSocket();
  socket.emit('quit_game', data);
};