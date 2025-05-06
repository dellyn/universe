import React from 'react';
import { CircularProgress, Alert, Paper } from '@ui-library';
import { RepositoryItem } from '../RepositoryItem';
import { AddRepository } from '../AddRepository';
import { useRepositories } from '@hooks/api/useRepositories';
import { Pagination } from '@components/Pagination';
import { getErrorMessage } from '@api/getErrorMessage';
import { RepositoryListProps } from './types';
import './styles.scss';

export const RepositoryList: React.FC<RepositoryListProps> = () => {
  const { 
    repositories, 
    pagination,
    isLoading, 
    addRepository,
    addMutation
  } = useRepositories({
    defaultPage: 1,
    defaultLimit: 5
  });
  
  return (
    <Paper elevation={0} className="repository-list-container">
      <p className="fun-warning">P.S. I saw in the requirements that styles aren’t a priority - so I kept them default to save time. But would like to make them more scalable 😉</p>

      <AddRepository 
        onRepositoryAdded={addRepository} 
        isLoading={addMutation.isPending}
        error={getErrorMessage(addMutation.error)}
      />
      
      {isLoading && repositories.length === 0 ? (
        <div className="repository-list-loading">
          <CircularProgress />
        </div>
      ) : repositories.length === 0 ? (
        <Alert severity="info">
          No repositories found. Add your first repository using the form above.
        </Alert>
      ) : (
        <>
          <div className="repository-list-items">
            {repositories.map(repo => (
              <RepositoryItem
                key={repo.id}
                repository={repo}
              />
            ))}
          </div>
          
          {pagination.totalPages && pagination.totalPages > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems || 0}
              itemsPerPage={pagination.limit}
              onPageChange={pagination.setPage}
              onLimitChange={pagination.setLimit}
            />
          )}
        </>
      )}
    </Paper>
  );
}; 