import { io } from 'socket.io-client';

// Socket.IO bağlantısını oluştur - çevre değişkenleriyle yapılandırma
const getSocketURL = () => {
  // .env dosyalarından tanımlanmış SOCKET_URL değerini al
  const envSocketUrl = process.env.REACT_APP_SOCKET_URL;
  
  // Eğer çevre değişkeni tanımlanmışsa, onu kullan
  if (envSocketUrl) {
    return envSocketUrl;
  }
  
  // Çevre değişkeni tanımlanmamışsa, mevcut domain'i kullan (production için)
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  return `${protocol}//${window.location.host}`;
};

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(getSocketURL(), {
      withCredentials: false,
      transports: ['websocket', 'polling'],
      path: '/socket.io' // Standart Socket.IO yolu
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