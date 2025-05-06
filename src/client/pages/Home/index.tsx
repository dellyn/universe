import React from 'react';
import { RepositoryList } from '@components/Repositories/RepositoryList';

export const Home: React.FC = () => {
  return (
    <div className="home-page">
      <RepositoryList />
    </div>
  );
};
