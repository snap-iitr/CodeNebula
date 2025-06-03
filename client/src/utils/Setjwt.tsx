import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SetJWT: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      document.cookie = `jwt=${token}`;
      // Remove token param from URL (optional)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    navigate('/home');
  }, [navigate]);

  return null; // No UI needed, redirects immediately
};

export default SetJWT;
