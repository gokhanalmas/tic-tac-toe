import { createSlice } from '@reduxjs/toolkit';
import { getSocket, createRoom, joinRoom, makeMove, nextRound, quitGame } from '../services/socketService';

const initialState = {
  isOnlineMode: false,
  isHost: false,
  roomId: null,
  playerName: '',
  playerMark: 'x',
  opponentName: '',
  opponentMark: 'o',
  isConnected: false,
  waitingForOpponent: false,
  errorMessage: null,
  gameData: null
};

const onlineGameSlice = createSlice({
  name: 'onlineGame',
  initialState,
  reducers: {
    setOnlineMode(state, action) {
      state.isOnlineMode = action.payload;
    },
    setPlayerName(state, action) {
      state.playerName = action.payload;
    },
    setPlayerMark(state, action) {
      state.playerMark = action.payload;
    },
    setRoomId(state, action) {
      state.roomId = action.payload;
    },
    setIsHost(state, action) {
      state.isHost = action.payload;
    },
    setWaitingForOpponent(state, action) {
      state.waitingForOpponent = action.payload;
    },
    setIsConnected(state, action) {
      state.isConnected = action.payload;
    },
    setOpponentInfo(state, action) {
      state.opponentName = action.payload.name;
      state.opponentMark = action.payload.mark;
    },
    setGameData(state, action) {
      state.gameData = action.payload;
    },
    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
    resetOnlineGame(state) {
      return initialState;
    }
  }
});

// Thunk'lar
export const initializeOnlineGame = () => {
  return (dispatch) => {
    const socket = getSocket();
    
    // Socket olaylarını dinle
    socket.on('room_created', (data) => {
      dispatch(onlineGameActions.setRoomId(data.roomId));
      dispatch(onlineGameActions.setIsHost(true));
      dispatch(onlineGameActions.setWaitingForOpponent(true));
      dispatch(onlineGameActions.setGameData(data.gameData));
      dispatch(onlineGameActions.setIsConnected(true));
    });
    
    socket.on('room_joined', (data) => {
      dispatch(onlineGameActions.setRoomId(data.roomId));
      dispatch(onlineGameActions.setPlayerMark(data.mark));
      dispatch(onlineGameActions.setGameData(data.gameData));
      dispatch(onlineGameActions.setIsConnected(true));
      
      // Rakip bilgilerini ayarla
      const opponent = data.gameData.players.find(p => p.id !== socket.id);
      if (opponent) {
        dispatch(onlineGameActions.setOpponentInfo({
          name: opponent.playerName,
          mark: opponent.mark
        }));
      }
    });
    
    socket.on('game_update', (data) => {
      dispatch(onlineGameActions.setGameData(data.gameData));
      dispatch(onlineGameActions.setWaitingForOpponent(false));
      
      // Rakip bilgilerini güncelle (eğer yeni bir oyuncu katıldıysa)
      const opponent = data.gameData.players.find(p => p.id !== socket.id);
      if (opponent) {
        dispatch(onlineGameActions.setOpponentInfo({
          name: opponent.playerName,
          mark: opponent.mark
        }));
      }
    });
    
    socket.on('player_left', () => {
      dispatch(onlineGameActions.setWaitingForOpponent(true));
    });
    
    socket.on('error', (data) => {
      dispatch(onlineGameActions.setErrorMessage(data.message));
    });
  };
};

export const createGameRoom = (playerName, mark) => {
  return (dispatch) => {
    dispatch(onlineGameActions.setPlayerName(playerName));
    dispatch(onlineGameActions.setPlayerMark(mark));
    createRoom({ playerName, mark });
  };
};

export const joinGameRoom = (roomId, playerName) => {
  return (dispatch) => {
    dispatch(onlineGameActions.setPlayerName(playerName));
    joinRoom({ roomId, playerName });
  };
};

export const makeGameMove = (roomId, index) => {
  return () => {
    makeMove({ roomId, index });
  };
};

export const startNextRound = (roomId) => {
  return () => {
    nextRound({ roomId });
  };
};

export const leaveGame = (roomId) => {
  return (dispatch) => {
    quitGame({ roomId });
    dispatch(onlineGameActions.resetOnlineGame());
  };
};

export const onlineGameActions = onlineGameSlice.actions;

export default onlineGameSlice;