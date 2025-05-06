import React, { useState } from 'react';
import { Button, TextField, Typography, Paper } from '@ui-library';
import { useAuth } from '@hooks/auth/useAuth';
import { PasswordRequirements } from '../PasswordRequirements';
import { validatePassword } from '@packages/validation/password';
import { RegisterProps } from './types';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@interfaces';
import './styles.scss';

export const Register: React.FC<RegisterProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error: serverError } = useAuth();
  const [clientError, setClientError] = useState('');
  const error = clientError || serverError;
  const navigate = useNavigate();
  
  const passwordValidation = validatePassword(password);
  const isPasswordValid = passwordValidation.isValid;
  const isConfirmMatching = password === confirmPassword;
  const canSubmit = email && isPasswordValid && isConfirmMatching && confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      return setClientError('Password does not meet requirements');
    }
    
    try {
      const result = await register(email, password);
      console.log('Registration result:', result);
      
      // Redirect to home page after registration
      navigate(Routes.Home);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Paper className="register-container">
      <Typography variant="h5" className="register-title">Register</Typography>
      
      {error && (
        <Typography className="register-error">{error}</Typography>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          className="register-form-field"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
        />
        
        <TextField
          className="register-form-field"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
          error={password.length > 0 && !isPasswordValid}
        />
        
        <PasswordRequirements password={password} />
        
        <TextField
          className="register-form-field"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
          error={confirmPassword.length > 0 && !isConfirmMatching}
        />
        
        <Button 
          className="register-submit-button"
          type="submit" 
          variant="contained" 
          disabled={isLoading || !canSubmit}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </Paper>
  );
}; 