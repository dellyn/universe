import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Tooltip, 
  CircularProgress, 
  Divider, 
  Link
} from '@ui-library';
import RefreshIcon from '@icons/Refresh';
import DeleteIcon from '@icons/Delete';
import StarIcon from '@icons/Star';
import AccountTreeIcon from '@icons/AccountTree';
import BugReportIcon from '@icons/BugReport';
import LinkIcon from '@icons/Link';
import { useRepositories } from '@hooks/api/useRepositories';
import { RepositoryItemProps } from './types';
import './styles.scss';

export const RepositoryItem: React.FC<RepositoryItemProps> = ({ 
  repository
}) => {
  const { updateRepository, deleteRepository, isUpdating, isDeleting } = useRepositories();

  const handleUpdateClick = () => updateRepository(repository.id);
  const handleDeleteClick = async () => {
    if (!window.confirm(`Are you sure you want to remove ${repository.owner}/${repository.name}?`)) {
      return;
    }
    deleteRepository(repository.id);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  return (
    <Card variant="outlined" className="repository-item-container">
      <CardContent>
        <div className="repository-item-header">
          <div className="repository-item-info">
            <Typography variant="subtitle1">
              Owner: {repository.owner}
            </Typography>
            <Typography variant="subtitle1">
              Name: {repository.name}
            </Typography>
          </div>
          <div className="repository-item-actions">
            <Tooltip title="Refresh data from GitHub">
              <IconButton 
                color="primary" 
                onClick={handleUpdateClick} 
                disabled={isUpdating}
              >
                {isUpdating ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove repository">
              <IconButton 
                color="error" 
                onClick={handleDeleteClick} 
                disabled={isDeleting}
              >
                {isDeleting ? <CircularProgress size={24} /> : <DeleteIcon />}
              </IconButton>
            </Tooltip>
          </div>
        </div>
        
        <Divider className="repository-item-divider" />
        
        <div className="repository-item-url">
          <Tooltip title="Repository URL">
            <IconButton 
              size="small" 
              href={repository.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Link
            className="repository-item-link"
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography variant="body2">
              {repository.url}
            </Typography>
          </Link>
        </div>
        
        <div className="repository-item-stats">
          <div className="repository-item-stat">
            <StarIcon fontSize="small" color="primary" />
            <Typography variant="body2" className="repository-item-text">
              {repository.stars} stars
            </Typography>
          </div>
          
          <div className="repository-item-stat">
            <AccountTreeIcon fontSize="small" color="primary" />
            <Typography variant="body2" className="repository-item-text">
              {repository.forks} forks
            </Typography>
          </div>
          
          <div className="repository-item-stat">
            <BugReportIcon fontSize="small" color="primary" />
            <Typography variant="body2" className="repository-item-text">
              {repository.issues} issues
            </Typography>
          </div>
          
          <Typography variant="body2" className="repository-item-date">
            Created: {formatDate(repository.createdAt)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}; 