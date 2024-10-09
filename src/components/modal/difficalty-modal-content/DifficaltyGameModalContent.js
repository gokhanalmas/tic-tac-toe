import React from 'react';
import { useDispatch } from 'react-redux';

import { gameActions } from '../../../store/game';

import {
  DifficultyList,
  DifficultyItem,
  Header,
} from './DifficaltyGameModalContentStyles';

const DifficaltyGameModalContent = () => {
  const dispatch = useDispatch();

  const selectDifficultyHandler = (e) => {
    dispatch(gameActions.setGameMode('pvcpu'));

    dispatch(gameActions.toggleModal());

    dispatch(gameActions.setDifficalty(e.target.dataset.difficulty));
    setTimeout(() => {
      dispatch(gameActions.startNewGame());
    }, 500);
  };
  return (
    <>
      <Header>Zorluk seviyesini seç</Header>
      <DifficultyList>
        <DifficultyItem
          data-difficulty="ease"
          onClick={selectDifficultyHandler}
        >
          kolay
        </DifficultyItem>
        <DifficultyItem
          data-difficulty="normal"
          onClick={selectDifficultyHandler}
        >
          normal
        </DifficultyItem>
        <DifficultyItem
          data-difficulty="hard"
          onClick={selectDifficultyHandler}
        >
          zor
        </DifficultyItem>
      </DifficultyList>
    </>
  );
};

export default DifficaltyGameModalContent;
