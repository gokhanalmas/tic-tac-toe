import React from 'react';

import { useDispatch } from 'react-redux';

import { gameActions } from '../../../store/game';
import { quitGame } from '../../../store/game';

import { RestartHeader } from './RestartGameModalContetntStyles';
import { ButtonWrapper, Button } from '../ModalStyles';

const RestartGameModalContetnt = () => {
  const dispatch = useDispatch();

  const cancelHandler = () => {
    dispatch(gameActions.toggleModal());
  };

  const restartHandler = () => {
    dispatch(quitGame());
  };
  return (
    <>
      <RestartHeader>oyunu yeniden başlat?</RestartHeader>
      <ButtonWrapper>
        <Button type="silver" onClick={cancelHandler}>
          hayır, iptal et
        </Button>
        <Button type="yellow" onClick={restartHandler}>
          evet, yeniden başlat
        </Button>
      </ButtonWrapper>
    </>
  );
};

export default RestartGameModalContetnt;
