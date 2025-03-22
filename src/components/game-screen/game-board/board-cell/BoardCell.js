import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameActions } from '../../../../store/game';

import { ReactComponent as IconX } from '../../../../assets/icon-x.svg';
import { ReactComponent as IconO } from '../../../../assets/icon-o.svg';
import { ReactComponent as IconXOutline } from '../../../../assets/icon-x-outline.svg';
import { ReactComponent as IconOOutline } from '../../../../assets/icon-o-outline.svg';

import { Cell } from './BoardCellStyles';

const BoardCell = ({ mark, index, isWinCell, onCellClick, isPlayerTurn }) => {
  const game = useSelector((state) => state.game);
  const { gameMode } = game;
  const dispatch = useDispatch();

  const { turn, isCpuTurn } = game;

  const cellClickHandler = () => {
    // Online mod için cell click handler'ını kullan
    if (gameMode === 'online' && onCellClick) {
      onCellClick();
      return;
    }
    
    // Normal oyun modları için orijinal handler'ı kullan
    dispatch(gameActions.updateBoard({ index, turn }));
  };

  let bgColor = 'var(--color-semi-dark-navy)';
  if (isWinCell) {
    bgColor =
      mark === 'x' ? 'var(--color-light-blue)' : 'var(--color-light-yellow)';
  }

  let winCellIcon = isWinCell ? 'winIcon' : '';

  if (mark === 'x') {
    return (
      <Cell isMarked={true} bg={bgColor} isWinCell={isWinCell}>
        <IconX className={`markSelected ${winCellIcon}`} />
      </Cell>
    );
  } else if (mark === 'o') {
    return (
      <Cell isMarked={true} bg={bgColor} isWinCell={isWinCell}>
        <IconO className={`markSelected ${winCellIcon}`} />
      </Cell>
    );
  }

  // Online moddaysa, isPlayerTurn'u kullan
  const isDisabled = gameMode === 'online' 
    ? !isPlayerTurn 
    : isCpuTurn;

  return (
    <Cell
      bg={bgColor}
      isMarked={false}
      onClick={isDisabled ? () => {} : cellClickHandler}
      data-testid={`cell-${index}`}
      data-cputurn={isDisabled}
    >
      {turn === 'x' ? (
        <IconXOutline className="markHover" />
      ) : (
        <IconOOutline className="markHover" />
      )}
    </Cell>
  );
};

export default BoardCell;