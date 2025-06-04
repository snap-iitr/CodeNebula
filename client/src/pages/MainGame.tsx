import React, { useEffect , useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../utils/SocketContext';

type LocationState = {
  opponent: string;
  username: string;
  walletAddress: string;
  roomID: string;
  html: string;
};

declare global {
  interface Window {
    renderMath?: () => void;
  }
}

const MainGame: React.FC = () => {

  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setstate] = useState<LocationState>();

  
  useEffect(() =>{
    if(location.state) console.log(location.state),setstate(location.state);
    else navigate('/home');
  },[location.state, navigate]);

  // Socket events
  useEffect(() => {
    if(!state) return;
    if (!socket || !state.roomID) return;

    // Join the room explicitly
    if (socket.connected) {
      socket.emit('joined_room', { roomID: state.roomID });
      socket.disconnect(); // Disconnect immediately after joining
    }
    else navigate('/home');

    const onGameWon = ({ winnerId }: { winnerId: string }) => {
      if (winnerId === socket.id) {
        // setWinnerMessage('🎉 You won!');
      } else {
        // setWinnerMessage('😞 You lost.');
      }
    };

    const onGameTied = () => {
      // setWinnerMessage('⏱ Time’s up! Game tied.');
    };
    
    socket.on('game_won', onGameWon);
    socket.on('game_tied', onGameTied);

    return () => {
      socket.off('game_won', onGameWon);
      socket.off('game_tied', onGameTied);
    };
  }, [socket, state]);

  return (
    <>
      <div>Main Game Page</div>
      <div>Opponent: {state?.opponent}</div>
      <div>Username: {state?.username}</div>
      <div>Wallet Address: {state?.walletAddress}</div>
      <div>Room ID: {state?.roomID}</div>
      <iframe
        title="Game Frame"
        srcDoc={state?.html}
        style={{ width: '100%', height: '100vh', border: 'none' }}
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  );
}

export default MainGame;