const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Prodüksiyonda daha spesifik bir URL ayarlayın
    methods: ["GET", "POST"]
  }
});

// Oyun odalarını saklamak için obje
const gameRooms = {};

io.on('connection', (socket) => {
  console.log(`Kullanıcı bağlandı: ${socket.id}`);

  // Yeni oda oluşturma
  socket.on('create_room', (data) => {
    const roomId = uuidv4().substring(0, 6); // Kısa bir oda ID'si
    
    // Yeni oda bilgilerini oluştur
    gameRooms[roomId] = {
      players: [{
        id: socket.id,
        mark: data.mark, // 'x' veya 'o'
        playerName: data.playerName || 'Oyuncu 1'
      }],
      currentBoard: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      turn: 'x', // x her zaman başlar
      gameState: 'waiting', // waiting, playing, finished
      winner: null,
      winnerCombo: [],
      score: {
        x: 0,
        o: 0,
        ties: 0
      }
    };
    
    // Oyuncuyu odaya kat
    socket.join(roomId);
    
    // Oda bilgilerini istemciye gönder
    socket.emit('room_created', {
      roomId,
      gameData: gameRooms[roomId]
    });
    
    console.log(`Oda oluşturuldu: ${roomId}`);
  });

  // Odaya katılma
  socket.on('join_room', (data) => {
    const { roomId, playerName } = data;
    
    // Oda var mı kontrol et
    if (!gameRooms[roomId]) {
      socket.emit('error', { message: 'Oda bulunamadı' });
      return;
    }
    
    // Oda dolu mu kontrol et
    if (gameRooms[roomId].players.length >= 2) {
      socket.emit('error', { message: 'Oda dolu' });
      return;
    }
    
    // İlk oyuncu X ise, ikinci oyuncu O olur ya da tam tersi
    const mark = gameRooms[roomId].players[0].mark === 'x' ? 'o' : 'x';
    
    // Oyuncuyu odaya ekle
    gameRooms[roomId].players.push({
      id: socket.id,
      mark,
      playerName: playerName || 'Oyuncu 2'
    });
    
    // Oyun durumunu güncelle
    gameRooms[roomId].gameState = 'playing';
    
    // Odaya katıl
    socket.join(roomId);
    
    // Tüm oyunculara güncel oyun bilgilerini gönder
    io.to(roomId).emit('game_update', {
      gameData: gameRooms[roomId]
    });
    
    // İkinci oyuncuya özel bilgi gönder
    socket.emit('room_joined', {
      roomId,
      mark,
      gameData: gameRooms[roomId]
    });
    
    console.log(`Oyuncu ${socket.id} odaya katıldı: ${roomId}`);
  });

  // Oyun hamlesini işle
  socket.on('make_move', (data) => {
    const { roomId, index } = data;
    
    // Oda var mı kontrol et
    if (!gameRooms[roomId]) {
      socket.emit('error', { message: 'Oda bulunamadı' });
      return;
    }
    
    const gameRoom = gameRooms[roomId];
    
    // Oyuncunun sırası mı kontrol et
    const player = gameRoom.players.find(p => p.id === socket.id);
    if (!player || player.mark !== gameRoom.turn) {
      socket.emit('error', { message: 'Sıra sizde değil' });
      return;
    }
    
    // Hamle geçerli mi kontrol et
    if (typeof gameRoom.currentBoard[index] !== 'number') {
      socket.emit('error', { message: 'Geçersiz hamle' });
      return;
    }
    
    // Hamleyi uygula
    gameRoom.currentBoard[index] = gameRoom.turn;
    
    // Kazanan var mı kontrol et
    const winnerResult = checkForWinner(gameRoom.currentBoard);
    if (winnerResult) {
      gameRoom.winner = winnerResult.winner;
      gameRoom.winnerCombo = winnerResult.winnerCombo;
      gameRoom.gameState = 'finished';
      
      // Skoru güncelle
      if (winnerResult.winner !== 'ties') {
        gameRoom.score[winnerResult.winner] += 1;
      } else {
        gameRoom.score.ties += 1;
      }
    }
    
    // Sırayı değiştir
    gameRoom.turn = gameRoom.turn === 'x' ? 'o' : 'x';
    
    // Tüm oyunculara güncel oyun bilgilerini gönder
    io.to(roomId).emit('game_update', {
      gameData: gameRoom
    });
  });

  // Yeni tur başlat
  socket.on('next_round', (data) => {
    const { roomId } = data;
    
    if (gameRooms[roomId]) {
      // Tahtayı sıfırla
      gameRooms[roomId].currentBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      gameRooms[roomId].turn = 'x';
      gameRooms[roomId].winner = null;
      gameRooms[roomId].winnerCombo = [];
      gameRooms[roomId].gameState = 'playing';
      
      // Tüm oyunculara güncel oyun bilgilerini gönder
      io.to(roomId).emit('game_update', {
        gameData: gameRooms[roomId]
      });
    }
  });

  // Oyundan çık
  socket.on('quit_game', (data) => {
    const { roomId } = data;
    
    if (gameRooms[roomId]) {
      // Odadaki oyuncuları bilgilendir
      io.to(roomId).emit('player_left', {
        playerId: socket.id
      });
      
      // Oyuncuyu odadan çıkar
      const playerIndex = gameRooms[roomId].players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        gameRooms[roomId].players.splice(playerIndex, 1);
      }
      
      // Eğer odada oyuncu kalmadıysa odayı sil
      if (gameRooms[roomId].players.length === 0) {
        delete gameRooms[roomId];
      } else {
        // Oyun durumunu beklemeye al
        gameRooms[roomId].gameState = 'waiting';
        // Kalan oyuncuya bilgi gönder
        io.to(roomId).emit('game_update', {
          gameData: gameRooms[roomId]
        });
      }
    }
    
    // Odadan ayrıl
    socket.leave(roomId);
  });

  // Bağlantı kesildiğinde
  socket.on('disconnect', () => {
    console.log(`Kullanıcı ayrıldı: ${socket.id}`);
    
    // Oyuncunun olduğu tüm odaları bul
    for (const roomId in gameRooms) {
      const playerIndex = gameRooms[roomId].players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        // Odadaki oyuncuları bilgilendir
        io.to(roomId).emit('player_left', {
          playerId: socket.id
        });
        
        // Oyuncuyu odadan çıkar
        gameRooms[roomId].players.splice(playerIndex, 1);
        
        // Eğer odada oyuncu kalmadıysa odayı sil
        if (gameRooms[roomId].players.length === 0) {
          delete gameRooms[roomId];
        } else {
          // Oyun durumunu beklemeye al
          gameRooms[roomId].gameState = 'waiting';
          // Kalan oyuncuya bilgi gönder
          io.to(roomId).emit('game_update', {
            gameData: gameRooms[roomId]
          });
        }
      }
    }
  });
});

// Kazanan kontrolü fonksiyonu
function checkLine(a, b, c) {
  if (typeof a === 'number' || typeof b === 'number' || typeof c === 'number')
    return false;
  return a === b && b === c;
}

function checkForWinner(board) {
  // Sütunlar
  for (let i = 0; i < 3; i++) {
    if (checkLine(board[i], board[i + 3], board[i + 6]))
      return {
        winner: board[i],
        winnerCombo: [i, i + 3, i + 6],
      };
  }
  // Satırlar
  for (let i = 0; i < 9; i += 3) {
    if (checkLine(board[i], board[i + 1], board[i + 2]))
      return {
        winner: board[i],
        winnerCombo: [i, i + 1, i + 2],
      };
  }
  // Çaprazlar
  if (checkLine(board[0], board[4], board[8]))
    return { winner: board[0], winnerCombo: [0, 4, 8] };
  if (checkLine(board[2], board[4], board[6]))
    return { winner: board[2], winnerCombo: [2, 4, 6] };

  // Beraberlik kontrolü
  if (!board.filter((cell) => typeof cell === 'number').length) {
    return { winner: 'ties', winnerCombo: [] };
  }
  
  return false;
}

// Sunucuyu başlat
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});