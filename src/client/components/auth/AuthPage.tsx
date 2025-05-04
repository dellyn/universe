import React, { useState } from 'react';
import { Box, Button, CircularProgress } from '@ui-library';
import { Login } from './Login';
import { Register } from './Register';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@state/AuthContext';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
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
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      {isLogin ? (
        <Login />
      ) : (
        <Register />
      )}
      
      <Box textAlign="center" mt={2}>
        <Button onClick={handleToggle}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </Button>
      </Box>
    </Box>
  );
}; 