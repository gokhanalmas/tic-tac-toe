import { configureStore } from '@reduxjs/toolkit';

import gameSlice from './game';
import onlineGameSlice from './onlineGame';

//MIDDLEWARE
const localStorageMiddleware = ({ getState }) => {
  return (next) => (action) => {
    const result = next(action);
    localStorage.setItem('tictactoeSettings', JSON.stringify(getState()));
    return result;
  };
};

// Rehydration function
const reHydrateStore = () => {
  if (localStorage.getItem('tictactoeSettings') !== null) {
    return JSON.parse(localStorage.getItem('tictactoeSettings')); // re-hydrate the store
  }
};

const store = configureStore({
  reducer: { 
    game: gameSlice.reducer,
    onlineGame: onlineGameSlice.reducer 
  },
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;