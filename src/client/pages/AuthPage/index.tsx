import React from 'react';
import { CircularProgress, Button } from '@ui-library';
import { Login } from '@components/auth/Login';
import { Register } from '@components/auth/Register';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@state/AuthContext';
import { Routes } from '@interfaces';
import './styles.scss';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();
  
  const isLoginRoute = location.pathname === Routes.Login || location.pathname === '/';
  
  if (isLoading) {
    return (
      <div className="auth-page-loading">
        <CircularProgress />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to={Routes.Home} replace />;
  }
  
  return (
    <div className="auth-page-container">
      {isLoginRoute ? (
        <Login />
      ) : (
        <Register />
      )}
      
      <div className="auth-page-toggle-button">
        <Button onClick={() => navigate(isLoginRoute ? Routes.Register : Routes.Login)}>
          {isLoginRoute ? 'Need an account? Register' : 'Already have an account? Login'}
        </Button>
      </div>
    </div>
  );
}; 