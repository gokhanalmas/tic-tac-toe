import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { leaveGame } from '../../../store/onlineGame';
import { gameActions } from '../../../store/game';

import { ReactComponent as Logo } from '../../../assets/logo.svg';
import { ReactComponent as MarkO } from '../../../assets/icon-o.svg';
import { ReactComponent as MarkX } from '../../../assets/icon-x.svg';
import { ReactComponent as RestartIcon } from '../../../assets/icon-restart.svg';

import { HeaderWrapper, TurnDisplay, RestartBtn } from './GSHeaderStyles';

const OnlineGSHeader = () => {
  const dispatch = useDispatch();
  const onlineGame = useSelector((state) => state.onlineGame);
  
  const { gameData, roomId, playerMark } = onlineGame;
  
  if (!gameData) {
    return <div>Yükleniyor...</div>;
  }
  
  const { turn } = gameData;
  const isPlayerTurn = turn === playerMark;
  
  const restartHandler = () => {
    dispatch(gameActions.toggleModal());
  };
  
  const quitHandler = () => {
    dispatch(leaveGame(roomId));
    dispatch(gameActions.resetGame());
  };

  const headerVariants = {
    initial: { opacity: 0, y: -200 },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: -200, transition: { duration: 1 } },
  };

  return (
    <HeaderWrapper
      initial="initial"
      animate="animate"
      exit="exit"
      variants={headerVariants}
    >
      <Logo />
      <TurnDisplay>
        {turn === 'x' ? (
          <MarkX className="markDisplay" />
        ) : (
          <MarkO className="markDisplay" />
        )}
        {isPlayerTurn ? 'Senin Sıran' : 'Rakibin Sırası'}
      </TurnDisplay>
      <RestartBtn onClick={quitHandler} data-testid="quit-btn">
        <RestartIcon />
      </RestartBtn>
    </HeaderWrapper>
  );
};

export default OnlineGSHeader;