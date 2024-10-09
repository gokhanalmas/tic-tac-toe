import React from 'react';

import { useSelector } from 'react-redux';

import { FooterWrapper, ScoreCard } from './GSFooterStyles';

const GSFooter = () => {
  const game = useSelector((state) => state.game);

  const { score, playersChoices, gameMode } = game;

  const footerVariants = {
    initial: { opacity: 0, y: 200 },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: 200, transition: { duration: 1 } },
  };

  let textX;
  let textO;

  if (gameMode === 'pvp') {
    textX = playersChoices.p1 === 'x' ? 'o1' : 'o2';
    textO = playersChoices.p1 === 'o' ? 'o1' : 'o2';
  }

  if (gameMode === 'pvcpu') {
    textX = playersChoices.p1 === 'x' ? 'sen' : 'ai';
    textO = playersChoices.p1 === 'o' ? 'sen' : 'ai';
  }

  return (
    <FooterWrapper
      initial="initial"
      animate="animate"
      exit="exit"
      variants={footerVariants}
    >
      <ScoreCard bgColor="light-blue" data-testid="score-x">
        <h3>X ({textX})</h3>
        <p>{score.x}</p>
      </ScoreCard>
      <ScoreCard bgColor="silver" data-testid="score-ties">
        <h3>beraberlikler</h3>
        <p>{score.ties}</p>
      </ScoreCard>
      <ScoreCard bgColor="light-yellow" data-testid="score-o">
        <h3>O ({textO})</h3>
        <p>{score.o}</p>
      </ScoreCard>
    </FooterWrapper>
  );
};

export default GSFooter;
