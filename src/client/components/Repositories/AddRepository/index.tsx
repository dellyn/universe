import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, CircularProgress, Alert } from '@ui-library';
import { AddRepositoryProps } from './types';
import { validateRepositoryPath, formatRepositoryPath } from '@services/repositoryValidation';
import './styles.scss';

export const AddRepository: React.FC<AddRepositoryProps> = ({ 
  onRepositoryAdded, 
  isLoading = false,
  error = null
}) => {
  const [repoPath, setRepoPath] = useState('');
  const [errMessage, setErrMessage] = useState<string | null>(error);
  const [isValidFormat, setIsValidFormat] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoPath || isLoading || !isValidFormat) return;
    await onRepositoryAdded(formatRepositoryPath(repoPath));
    setRepoPath('');
    setErrMessage(null);
    setIsValidFormat(false);
  };

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setRepoPath(value);
    setIsValidFormat(validateRepositoryPath(value).isValid);
    setErrMessage(null);
  }

  useEffect(() => {
    setErrMessage(error);
  }, [error]);

  return (
    <form className="add-repository-container" onSubmit={handleSubmit}>
      <Typography  className="title">Add GitHub Repository</Typography>
      
      <div className="add-repository-form">
        <TextField
          className="add-repository-input"
          fullWidth
          label="Repository Path"
          placeholder="facebook/react"
          value={repoPath}
          onChange={onChange}
          disabled={isLoading}
          error={repoPath.length > 0 && !isValidFormat}
          helperText={repoPath.length > 0 && !isValidFormat ? "Invalid format. Use owner/repo or url" : ""}
        />
        <Button
          className="add-repository-button"
          type="submit"
          variant="contained"
          disabled={isLoading || !repoPath || !isValidFormat}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Add'}
        </Button>
      </div>
      
      {errMessage && <Alert severity="error" className="add-repository-error">{errMessage}</Alert>}
    </form>
  );
}; 