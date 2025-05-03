import React, { useState } from 'react';
import { Box, Button, Typography } from '@ui-library';
import { Login } from './Login';
import { Register } from './Register';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface AuthPageProps {
  onAuthenticated: (token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    } else if (mode === 'login') {
      setIsLogin(true);
    }
  }, [location.search]);
  
  const handleToggle = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    navigate(`/auth?mode=${newMode ? 'login' : 'register'}`, { replace: true });
  };
  
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      {isLogin ? (
        <Login onLogin={onAuthenticated} />
      ) : (
        <Register onRegister={onAuthenticated} />
      )}
      
      <Box textAlign="center" mt={2}>
        <Button onClick={handleToggle}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </Button>
      </Box>
    </Box>
  );
}; 