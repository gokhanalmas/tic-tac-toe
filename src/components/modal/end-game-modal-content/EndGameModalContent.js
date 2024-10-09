import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as MarkX } from '../../../assets/icon-x.svg';
import { ReactComponent as MarkO } from '../../../assets/icon-o.svg';

import { quitGame } from '../../../store/game';

import { gameActions } from '../../../store/game';

import {
  ResultInfo,
  ResultHeaderWrapper,
  ResultHeader,
} from './EndGameModalContentStyles';

import { ButtonWrapper, Button } from '../ModalStyles';

const EndGameModalContent = () => {
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game);

  const { winner, playersChoices, gameMode } = game;

  const quitHandler = () => {
    dispatch(quitGame());
  };

  const nextRoundHandler = () => {
    dispatch(gameActions.toggleModal());
    dispatch(gameActions.cleanBoard());
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
  if (winner !== 'ties' && gameMode === 'pvp') {
    resultInfoText =
      playersChoices.p1 === winner ? 'oyuncu 1 kazandı!' : 'oyuncu 2 kazandı!';
  }
  if (winner !== 'ties' && gameMode === 'pvcpu') {
    resultInfoText =
      playersChoices.p1 === winner ? 'kazandın!' : 'ah hayır, kaybettin...';
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

export default EndGameModalContent;
