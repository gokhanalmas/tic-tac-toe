import { Fragment, useEffect } from 'react';
import GlobalStyles from './styles/GlobalStyles';

import { useSelector, useDispatch } from 'react-redux';

import Setup from './components/setup/Setup';
import GameScreen from './components/game-screen/GameScreen';
import Modal from './components/modal/Modal';
import { AnimatePresence } from 'framer-motion';
import { initializeSocket, getSocket, closeSocket } from './services/socketService';
import { initializeOnlineGame } from './store/onlineGame';

function App() {
  const game = useSelector((state) => state.game);
  const onlineGame = useSelector((state) => state.onlineGame);
  const dispatch = useDispatch();

  const { isModalOpened, gameIsRunning } = game;
  const { isOnlineMode } = onlineGame;

  // Socket.IO'yu başlat
  useEffect(() => {
    if (isOnlineMode) {
      initializeSocket();
      dispatch(initializeOnlineGame());
    }
    
    return () => {
      // Temizleme fonksiyonu
      closeSocket();
    };
  }, [isOnlineMode, dispatch]);

  return (
    <Fragment>
      <GlobalStyles />

      <AnimatePresence exitBeforeEnter>
        {gameIsRunning ? <GameScreen key="screen" /> : <Setup key="setup" />}
      </AnimatePresence>
      <AnimatePresence>
        {isModalOpened && <Modal key="modal" />}
      </AnimatePresence>
    </Fragment>
  );
}

export default App;