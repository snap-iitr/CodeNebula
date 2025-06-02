import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Landing from './Landing';
import AuthWrapper from './AuthWrapper';
import Setjwt from './Setjwt';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Landing status={0} />} />
        <Route path="/connect-more" element={<Landing status={1} />} />
        <Route path="/home" element={<AuthWrapper><Home /></AuthWrapper>} />
        <Route path="/setjwt" element={<Setjwt />} />
      </Routes>
  );
}

export default App
