import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as IconX } from '../../assets/icon-x.svg';
import { ReactComponent as IconO } from '../../assets/icon-o.svg';

import {
  SetupWrapper,
  LogoWrapper,
  MarkPicker,
  Header,
  MarkWrapper,
  Mark,
  Info,
  ModeButton,
} from './SetupStyles';
import { gameActions } from '../../store/game';
import { onlineGameActions } from '../../store/onlineGame';
import OnlineSetup from './OnlineSetup';

const Setup = () => {
  const game = useSelector((state) => state.game);
  const onlineGame = useSelector((state) => state.onlineGame);
  const dispatch = useDispatch();

  const { firstPlayerChoice } = game;
  const { isOnlineMode } = onlineGame;

  const selectPvpModeHandler = (e) => {
    dispatch(gameActions.setGameMode(e.target.dataset.mode));
    dispatch(gameActions.startNewGame());
  };

  const selectPvcupModeHandler = () => {
    dispatch(gameActions.toggleModal());
  };

  useEffect(() => {
    dispatch(gameActions.resetWinner());
  }, [dispatch]);

  const logoMarkVariants = {
    initial: { opacity: 0, y: -200 },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: -200, transition: { duration: 1 } },
  };

  const pvcpuVariants = {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: { opacity: 0, x: -200, transition: { duration: 1 } },
  };

  const pvpVariants = {
    initial: { opacity: 0, x: -200 },
    animate: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: { opacity: 0, x: 200, transition: { duration: 1 } },
  };

  // Online mod aktifse, özel Setup göster
  if (isOnlineMode) {
    return <OnlineSetup />;
  }

  return (
    <SetupWrapper>
      <LogoWrapper
        initial="initial"
        animate="animate"
        exit="exit"
        variants={logoMarkVariants}
      >
        <Logo />
      </LogoWrapper>
      <MarkPicker
        initial="initial"
        animate="animate"
        exit="exit"
        variants={logoMarkVariants}
      >
        <Header>oyuncu 1'in işaretini seç</Header>
        <MarkWrapper>
          <Mark
            firstPlayerChoice={firstPlayerChoice === 'x'}
            title="x işareti"
            onClick={() => {
              dispatch(gameActions.setFirstPlayerChoice('x'));
            }}
            aria-pressed={firstPlayerChoice === 'x'}
            type="button"
          >
            <IconX className="mark" />
          </Mark>
          <Mark
            firstPlayerChoice={firstPlayerChoice === 'o'}
            title="o işareti"
            onClick={() => {
              dispatch(gameActions.setFirstPlayerChoice('o'));
            }}
            aria-pressed={firstPlayerChoice === 'o'}
            type="button"
          >
            <IconO className="mark" />
          </Mark>
        </MarkWrapper>
        <Info>hatırla: x önce başlar</Info>
      </MarkPicker>
      
      {/* Online oyun butonu */}
      <ModeButton
        onClick={() => dispatch(onlineGameActions.setOnlineMode(true))}
        style={{ backgroundColor: 'var(--color-light-blue)' }}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pvcpuVariants}
      >
        çevrimiçi oyun (online)
      </ModeButton>
      
      <ModeButton
        onClick={selectPvcupModeHandler}
        data-mode="pvcpu"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pvcpuVariants}
      >
        yeni oyun (ai)
      </ModeButton>
      <ModeButton
        onClick={selectPvpModeHandler}
        data-mode="pvp"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pvpVariants}
      >
        yeni oyun (oyuncuya karşı)
      </ModeButton>
    </SetupWrapper>
  );
};

export default Setup;