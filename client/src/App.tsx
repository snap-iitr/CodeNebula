import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Loading from './pages/Loading';
import MainGame from './pages/MainGame';
import FriendsPage from './pages/FriendsPage';
import Profile from './pages/Profile';
import AuthWrapper from './utils/AuthWrapper';
import ProfileAuth from './utils/ProfileAuth';
import Setjwt from './utils/Setjwt';
import Disconnect from './utils/Disconnect';
import { SocketProvider } from './utils/SocketContext';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Landing status={0} />} />
        <Route path="/connect-more" element={<Landing status={1} />} />
        <Route path="/home" element={<AuthWrapper type={1}><Home /></AuthWrapper>} />
        <Route path="/friends" element={<AuthWrapper type={1}><FriendsPage /></AuthWrapper>} />
        <Route path="/loading" element={<AuthWrapper type={2}><SocketProvider><Loading /></SocketProvider></AuthWrapper>} />
        <Route path="/game" element={<AuthWrapper type={3}><SocketProvider><MainGame /></SocketProvider></AuthWrapper>} />
        <Route path="/profile/:UserId" element={<ProfileAuth><Profile /></ProfileAuth>} />
        <Route path="/setjwt" element={<Setjwt />} />
        <Route path="/disconnect" element={<Disconnect />} />
      </Routes>
  );
}

export default App
