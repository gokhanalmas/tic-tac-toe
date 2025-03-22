import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as MarkX } from '../../../assets/icon-x.svg';
import { ReactComponent as MarkO } from '../../../assets/icon-o.svg';

import { leaveGame, startNextRound } from '../../../store/onlineGame';
import { gameActions } from '../../../store/game';

import {
  ResultInfo,
  ResultHeaderWrapper,
  ResultHeader,
} from '../end-game-modal-content/EndGameModalContentStyles';

import { ButtonWrapper, Button } from '../ModalStyles';

const OnlineGameModalContent = () => {
  const dispatch = useDispatch();
  const onlineGame = useSelector((state) => state.onlineGame);
  
  const { gameData, roomId, playerMark } = onlineGame;
  
  if (!gameData) {
    return <div>Yükleniyor...</div>;
  }
  
  const { winner } = gameData;
  
  const quitHandler = () => {
    dispatch(gameActions.toggleModal());
    dispatch(leaveGame(roomId));
    dispatch(gameActions.resetGame());
  };
  
  const nextRoundHandler = () => {
    dispatch(gameActions.toggleModal());
    dispatch(startNextRound(roomId));
  };
  
  // Başlık için renk belirleme
  let headerColor = '--color-light-blue';
  
  if (winner === 'o') {
    headerColor = '--color-light-yellow';
  } else if (winner === 'ties') {
    headerColor = '--color-silver';
  }
  
  // Sonuç bilgi metnini alma
  let resultInfoText;
  if (winner !== 'ties') {
    resultInfoText = winner === playerMark ? 'kazandın!' : 'kaybettin!';
  }
  
  return (
    <>
      {resultInfoText && <ResultInfo>{resultInfoText}</ResultInfo>}
      <ResultHeaderWrapper>
        {winner === 'x' && <MarkX />}
        {winner === 'o' && <MarkO />}
        <ResultHeader color={headerColor}>
          {(winner === 'x' || winner === 'o') && 'tur alındı'}
          {winner === 'ties' && 'tur berabere'}
        </ResultHeader>
      </ResultHeaderWrapper>
      <ButtonWrapper>
        <Button type="silver" onClick={quitHandler}>
          çık
        </Button>
        <Button type="yellow" onClick={nextRoundHandler}>
          sonraki tur
        </Button>
      </ButtonWrapper>
    </>
  );
};

export default OnlineGameModalContent;