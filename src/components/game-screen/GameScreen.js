import React from 'react';
import { useSelector } from 'react-redux';
import { GameScreenWrapper } from './GameScreenStyles';
import GSHeader from './header/GSHeader';
import GSFooter from './footer/GSFooter';
import GameBoard from './game-board/GameBoard';
import OnlineGameBoard from './game-board/OnlineGameBoard';
import OnlineGSFooter from './footer/OnlineGSFooter';
import OnlineGSHeader from './header/OnlineGSHeader';

const GameScreen = () => {
  const game = useSelector((state) => state.game);
  const { gameMode } = game;
  
  // Online mod için farklı bileşenler göster
  if (gameMode === 'online') {
    return (
      <GameScreenWrapper data-testid="game-screen">
        <OnlineGSHeader />
        <OnlineGameBoard />
        <OnlineGSFooter />
      </GameScreenWrapper>
    );
  }
  
  // Normal oyun modları için standart bileşenleri göster
  return (
    <GameScreenWrapper data-testid="game-screen">
      <GSHeader />
      <GameBoard />
      <GSFooter />
    </GameScreenWrapper>
  );
};

export default GameScreen;