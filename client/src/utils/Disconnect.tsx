import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SetJWT: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.cookie = `jwt=`;
    navigate('/');
  }, [navigate]);

  return null; // No UI needed, redirects immediately
};

export default SetJWT;
