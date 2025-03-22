import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as IconX } from '../../assets/icon-x.svg';
import { ReactComponent as IconO } from '../../assets/icon-o.svg';

import { 
  SetupWrapper, 
  LogoWrapper, 
  MarkPicker, 
  Header, 
  MarkWrapper, 
  Mark, 
  Info, 
  ModeButton 
} from './SetupStyles';

import { onlineGameActions, initializeOnlineGame, createGameRoom, joinGameRoom } from '../../store/onlineGame';
import { gameActions } from '../../store/game';
import { initializeSocket } from '../../services/socketService';

// Yeni stiller
import styled from 'styled-components';

const OnlineWrapper = styled.div`
  background-color: var(--color-semi-dark-navy);
  border-radius: 2rem;
  padding: 2.4rem;
  margin-bottom: 2rem;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.2rem;
  margin: 1rem 0;
  border-radius: 1rem;
  border: none;
  background-color: var(--color-dark-navy);
  color: var(--color-silver);
  font-size: var(--font-size-body);
  font-family: inherit;

  &::placeholder {
    color: var(--color-silver);
    opacity: 0.5;
  }
`;

const RoomInfo = styled.div`
  color: var(--color-light-yellow);
  font-size: var(--font-size-heading-xs);
  text-align: center;
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: var(--color-dark-navy);
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  span {
    font-size: var(--font-size-heading-m);
    font-weight: bold;
    letter-spacing: 3px;
  }
`;

const ErrorMessage = styled.div`
  color: #F2B137;
  background-color: rgba(242, 177, 55, 0.1);
  padding: 0.8rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  text-align: center;
  font-size: var(--font-size-body);
`;

const TabSelector = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  flex: 1;
  background-color: ${props => props.active ? 'var(--color-semi-dark-navy)' : 'var(--color-dark-navy)'};
  color: var(--color-silver);
  border: none;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:first-child {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }
  
  &:last-child {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
  
  &:hover {
    background-color: ${props => props.active ? 'var(--color-semi-dark-navy)' : 'rgba(168, 191, 201, 0.05)'};
  }
`;

const OnlineSetup = () => {
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game);
  const onlineGame = useSelector((state) => state.onlineGame);
  
  const [activeTab, setActiveTab] = useState('create'); // 'create' veya 'join'
  const [playerName, setPlayerName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  
  const { firstPlayerChoice } = game;
  const { isOnlineMode, roomId, waitingForOpponent, errorMessage } = onlineGame;
  
  useEffect(() => {
    // Socket.IO'yu başlat
    if (isOnlineMode) {
      initializeSocket();
      dispatch(initializeOnlineGame());
    }
  }, [isOnlineMode, dispatch]);
  
  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      dispatch(onlineGameActions.setErrorMessage('Lütfen bir oyuncu adı girin'));
      return;
    }
    
    dispatch(createGameRoom(playerName, firstPlayerChoice));
  };
  
  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      dispatch(onlineGameActions.setErrorMessage('Lütfen bir oyuncu adı girin'));
      return;
    }
    
    if (!joinRoomId.trim()) {
      dispatch(onlineGameActions.setErrorMessage('Lütfen bir oda kodu girin'));
      return;
    }
    
    dispatch(joinGameRoom(joinRoomId, playerName));
  };
  
  const enableOnlineMode = () => {
    dispatch(onlineGameActions.setOnlineMode(true));
  };
  
  const startOnlineGame = () => {
    dispatch(gameActions.startNewGame());
    dispatch(gameActions.setGameMode('online'));
  };
  
  // Framer Motion animasyon varyantları
  const logoMarkVariants = {
    initial: { opacity: 0, y: -200 },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: -200, transition: { duration: 1 } },
  };
  
  const buttonVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.8 } },
  };
  
  // Bağlantı durumunu kontrol et
  useEffect(() => {
    if (onlineGame.isConnected && !waitingForOpponent) {
      startOnlineGame();
    }
  }, [onlineGame.isConnected, waitingForOpponent]);
  
  return (
    <SetupWrapper>
      <LogoWrapper
        initial="initial"
        animate="animate"
        exit="exit"
        variants={logoMarkVariants}
      >
        <Logo />
      </LogoWrapper>
      
      <MarkPicker
        initial="initial"
        animate="animate"
        exit="exit"
        variants={logoMarkVariants}
      >
        <Header>oyuncu 1'in işaretini seç</Header>
        <MarkWrapper>
          <Mark
            firstPlayerChoice={firstPlayerChoice === 'x'}
            title="x işareti"
            onClick={() => {
              dispatch(gameActions.setFirstPlayerChoice('x'));
            }}
            aria-pressed={firstPlayerChoice === 'x'}
            type="button"
          >
            <IconX className="mark" />
          </Mark>
          <Mark
            firstPlayerChoice={firstPlayerChoice === 'o'}
            title="o işareti"
            onClick={() => {
              dispatch(gameActions.setFirstPlayerChoice('o'));
            }}
            aria-pressed={firstPlayerChoice === 'o'}
            type="button"
          >
            <IconO className="mark" />
          </Mark>
        </MarkWrapper>
        <Info>hatırla: x önce başlar</Info>
      </MarkPicker>
      
      {!isOnlineMode ? (
        <>
          <ModeButton
            onClick={enableOnlineMode}
            data-mode="online"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={buttonVariants}
          >
            çevrimiçi oyun (online)
          </ModeButton>
          <ModeButton
            onClick={selectPvpModeHandler}
            data-mode="pvp"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={buttonVariants}
          >
            yeni oyun (oyuncuya karşı)
          </ModeButton>
          <ModeButton
            onClick={selectPvcupModeHandler}
            data-mode="pvcpu"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={buttonVariants}
          >
            yeni oyun (ai)
          </ModeButton>
        </>
      ) : (
        <motion.div initial="initial" animate="animate" exit="exit" variants={buttonVariants}>
          <OnlineWrapper>
            <TabSelector>
              <Tab 
                active={activeTab === 'create'} 
                onClick={() => setActiveTab('create')}
              >
                Oda Oluştur
              </Tab>
              <Tab 
                active={activeTab === 'join'} 
                onClick={() => setActiveTab('join')}
              >
                Odaya Katıl
              </Tab>
            </TabSelector>
            
            <Input 
              type="text" 
              placeholder="Oyuncu adınız" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            
            {activeTab === 'create' ? (
              <ModeButton 
                onClick={handleCreateRoom} 
                data-mode="create"
              >
                Oda Oluştur
              </ModeButton>
            ) : (
              <>
                <Input 
                  type="text" 
                  placeholder="Oda Kodu" 
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                />
                <ModeButton 
                  onClick={handleJoinRoom} 
                  data-mode="join"
                >
                  Odaya Katıl
                </ModeButton>
              </>
            )}
            
            {roomId && (
              <RoomInfo>
                <h3>Oda Kodu:</h3>
                <span>{roomId}</span>
                <p>Bu kodu arkadaşınızla paylaşın</p>
              </RoomInfo>
            )}
            
            {waitingForOpponent && (
              <RoomInfo>
                <p>Rakip bekleniyor...</p>
              </RoomInfo>
            )}
            
            {errorMessage && (
              <ErrorMessage>{errorMessage}</ErrorMessage>
            )}
            
            <ModeButton 
              onClick={() => dispatch(onlineGameActions.setOnlineMode(false))} 
              data-mode="back"
            >
              Geri Dön
            </ModeButton>
          </OnlineWrapper>
        </motion.div>
      )}
    </SetupWrapper>
  );
};

export default OnlineSetup;