import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import AuthWrapper from './utils/AuthWrapper';
import Setjwt from './utils/Setjwt';
import Disconnect from './utils/Disconnect';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Landing status={0} />} />
        <Route path="/connect-more" element={<Landing status={1} />} />
        <Route path="/home" element={<AuthWrapper><Home /></AuthWrapper>} />
        <Route path="/setjwt" element={<Setjwt />} />
        <Route path="/disconnect" element={<Disconnect />} />
      </Routes>
  );
}

export default App
