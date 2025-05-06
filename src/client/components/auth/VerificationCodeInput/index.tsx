import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, Button, Alert } from '@ui-library';
import { useAuth } from '@hooks/auth/useAuth';
import { validateDigit, handleCodePaste } from './verificationCodeValidation';
import { useAuthContext } from '@state/AuthContext';
import './styles.scss';

interface VerificationCodeInputProps {
  onCancel: () => void;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  onCancel
}) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const { verifyEmailCode, resendVerification} = useAuth();
  const { emailVerificationError, isVerifying} = useAuthContext();
  const err = error || emailVerificationError;

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleChange = (index: number, value: string) => {
    const validValue = validateDigit(value);
    if (validValue === '' && value !== '') return;
    
    const newCode = [...code];
    newCode[index] = validValue;
    setCode(newCode);
    
    if (validValue && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    
    if (validValue && index === 3) {
      const fullCode = newCode.join('');
      if (fullCode.length === 4) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData('text');
    const newCode = handleCodePaste(pastedValue);
    setCode(newCode);
    
    if (newCode[3]) {
      handleVerify(newCode.join(''));
    } else {
      const lastFilledIndex = newCode.findIndex(digit => digit === '') - 1;
      const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : newCode.length - 1;
      inputRefs[focusIndex]?.current?.focus();
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const verificationCode = fullCode || code.join('');
    
    if (verificationCode.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    await verifyEmailCode(verificationCode);

  };

  const handleResend = async () => {
    setError('');
    try {
      await resendVerification();
      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to resend verification code');
    }
  };

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  return (
    <div className="verification-code-container">
      <Typography textAlign="center" mb={3}>
        Please enter the 4-digit verification code sent to your email
      </Typography>
      
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      
      <div className="code-inputs-container">
        {code.map((digit, index) => (
          <TextField
            key={index}
            inputRef={inputRefs[index]}
            variant="outlined"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            sx={{
              width: '60px',
              mx: 1,
              '& input': {
                textAlign: 'center',
                fontSize: '1.5rem',
                p: 1.5
              }
            }}
            inputProps={{
              maxLength: 1,
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            disabled={isVerifying}
          />
        ))}
      </div>
      
      <div className="action-buttons">
        <Button 
          variant="outlined" 
          onClick={onCancel}
          disabled={isVerifying}
          fullWidth
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleVerify()}
          disabled={code.some(d => !d) || isVerifying}
          fullWidth
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </Button>
      </div>
      
      <div className="resend-container">
        <Button 
          variant="text" 
          onClick={handleResend}
          disabled={isVerifying}
        >
          Resend Code
        </Button>
      </div>
    </div>
  );
}; 