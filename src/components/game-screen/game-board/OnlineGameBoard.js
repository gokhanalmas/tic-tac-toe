import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeGameMove } from '../../../store/onlineGame';
import BoardCell from './board-cell/BoardCell';
import { GameBoardWrapper } from './GameBoardStyles';

const OnlineGameBoard = () => {
  const dispatch = useDispatch();
  const onlineGame = useSelector((state) => state.onlineGame);
  const { roomId, playerMark, gameData } = onlineGame;
  
  if (!gameData) {
    return <div>Oyun verisi yükleniyor...</div>;
  }
  
  const { currentBoard, turn, winnerCombo } = gameData;
  const isPlayerTurn = turn === playerMark;
  
  const handleCellClick = (index) => {
    // Hücre zaten işaretlenmişse veya oyuncunun sırası değilse tıklamaya izin verme
    if (typeof currentBoard[index] !== 'number' || !isPlayerTurn) {
      return;
    }
    
    // Sunucuya hamle bilgisini gönder
    dispatch(makeGameMove(roomId, index));
  };
  
  // Framer motion için varyantlar
  const BoardVariants = {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: { opacity: 0, x: -200, transition: { duration: 1 } },
  };
  
  return (
    <GameBoardWrapper
      initial="initial"
      animate="animate"
      exit="exit"
      variants={BoardVariants}
    >
      {currentBoard.map((mark, ind) => (
        <BoardCell
          key={ind}
          mark={mark}
          index={ind}
          isWinCell={winnerCombo && winnerCombo.includes(ind)}
          onCellClick={() => handleCellClick(ind)}
          isPlayerTurn={isPlayerTurn}
        />
      ))}
    </GameBoardWrapper>
  );
};

export default OnlineGameBoard;