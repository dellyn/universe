import React, { useState } from 'react';
import { Button, TextField, Typography, Paper } from '@ui-library';
import { useAuth } from '@hooks/auth/useAuth';
import { LoginSelectors } from '@tests/e2e/pages/Login';
import { LoginProps } from './types';
import './styles.scss';

export const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <Paper className="login-container" id={LoginSelectors.Container}>
      <Typography variant="h5" className="login-title" id={LoginSelectors.Title}>Login</Typography>
      
      {error && (
        <Typography className="login-error" id={LoginSelectors.Error}>{error}</Typography>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          className="login-form-field"
          id={LoginSelectors.EmailInput}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
        />
        
        <TextField
          className="login-form-field"
          id={LoginSelectors.PasswordInput}
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
        />
        
        <Button 
          className="login-submit-button"
          id={LoginSelectors.SubmitButton}
          type="submit" 
          variant="contained"
          disabled={isLoading || !password || !email}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Paper>
  );
}; 