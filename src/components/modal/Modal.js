import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';

import RestartGameModalContetnt from './restart-game-modal-content/RestartGameModalContetnt';
import EndGameModalContent from './end-game-modal-content/EndGameModalContent';
import DifficaltyGameModalContent from './difficalty-modal-content/DifficaltyGameModalContent';
import OnlineGameModalContent from './online-game-modal-content/OnlineGameModalContent';

import {
  BackDropWrapper,
  ModalOverlayWrapper,
  ContentWrapper,
} from './ModalStyles';

const Backdrop = () => {
  const backdropVariants = {
    hidden: {
      opacity: 0,
      scaleY: 0,
    },
    visible: {
      opacity: 1,
      scaleY: [0.005, 0.005, 1],
      scaleX: [0, 1, 1],
      transition: { duration: 1 },
    },
    exit: {
      opacity: 0,
      scaleY: [1, 0.005, 0.005],
      scaleX: [1, 1, 0],
      transition: { duration: 1, delay: 0.3 },
    },
  };

  return (
    <BackDropWrapper
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    />
  );
};

const ModalOverlay = () => {
  const game = useSelector((state) => state.game);
  const onlineGame = useSelector((state) => state.onlineGame);

  const { winner, gameIsRunning, gameMode } = game;
  const { gameData } = onlineGame;

  const modalVariants = {
    hidden: {
      scale: 0,
    },
    visible: {
      scale: 1,
      transition: { delay: 0.8, duration: 0.5 },
    },
    exit: {
      scale: 0,
      transition: { duration: 0.5 },
    },
  };

  let modalContent;

  // Online mod için
  if (gameMode === 'online') {
    modalContent = <OnlineGameModalContent />;
  } 
  // Normal oyun modları için
  else if (gameIsRunning) {
    modalContent = winner ? (
      <EndGameModalContent />
    ) : (
      <RestartGameModalContetnt />
    );
  } else {
    modalContent = <DifficaltyGameModalContent />;
  }

  return (
    <ModalOverlayWrapper
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <ContentWrapper>{modalContent}</ContentWrapper>
    </ModalOverlayWrapper>
  );
};

const portalElement = document.getElementById('overlays');

const Modal = (props) => {
  return (
    <Fragment>
      {createPortal(<Backdrop />, portalElement)}
      {createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;