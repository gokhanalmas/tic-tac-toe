import React from 'react';
import { useSelector } from 'react-redux';
import { FooterWrapper, ScoreCard } from './GSFooterStyles';
import styled from 'styled-components';

// Özel stiller
const RoomCode = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-semi-dark-navy);
  color: var(--color-silver);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: var(--font-size-body);
  text-align: center;
  
  span {
    font-weight: bold;
    letter-spacing: 2px;
  }
`;

const OnlineGSFooter = () => {
  const onlineGame = useSelector((state) => state.onlineGame);
  const { gameData, playerName, opponentName, playerMark, roomId } = onlineGame;
  
  if (!gameData) {
    return <div>Yükleniyor...</div>;
  }
  
  const { score } = gameData;
  
  const opponentMark = playerMark === 'x' ? 'o' : 'x';
  
  const footerVariants = {
    initial: { opacity: 0, y: 200 },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: 200, transition: { duration: 1 } },
  };

  return (
    <>
      <FooterWrapper
        initial="initial"
        animate="animate"
        exit="exit"
        variants={footerVariants}
      >
        <ScoreCard bgColor="light-blue" data-testid="score-x">
          <h3>X ({playerMark === 'x' ? 'sen' : opponentName || 'rakip'})</h3>
          <p>{score.x}</p>
        </ScoreCard>
        <ScoreCard bgColor="silver" data-testid="score-ties">
          <h3>beraberlikler</h3>
          <p>{score.ties}</p>
        </ScoreCard>
        <ScoreCard bgColor="light-yellow" data-testid="score-o">
          <h3>O ({playerMark === 'o' ? 'sen' : opponentName || 'rakip'})</h3>
          <p>{score.o}</p>
        </ScoreCard>
      </FooterWrapper>
      
      <RoomCode>
        Oda Kodu: <span>{roomId}</span>
      </RoomCode>
    </>
  );
};

export default OnlineGSFooter;