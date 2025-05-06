import React from 'react';
import { Button, Typography } from '@ui-library';

interface PageNumbersProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PageNumbers: React.FC<PageNumbersProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;
  
  const pages = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;
  
  if (totalPages > 1) {
    pages.push(
      <Button 
        key="first" 
        variant={currentPage === 1 ? 'contained' : 'outlined'} 
        onClick={() => onPageChange(1)}
        size="small"
      >
        1
      </Button>
    );
  }
  
  if (showEllipsisStart) {
    pages.push(<Typography key="ellipsis1" variant="body2" sx={{ mx: 1 }}>...</Typography>);
  }
  
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (i === 1 || i === totalPages) continue;
    
    pages.push(
      <Button
        key={i}
        variant={currentPage === i ? 'contained' : 'outlined'}
        onClick={() => onPageChange(i)}
        size="small"
      >
        {i}
      </Button>
    );
  }
  
  if (showEllipsisEnd) {
    pages.push(<Typography key="ellipsis2" variant="body2" sx={{ mx: 1 }}>...</Typography>);
  }
  
  if (totalPages > 1) {
    pages.push(
      <Button
        key="last"
        variant={currentPage === totalPages ? 'contained' : 'outlined'}
        onClick={() => onPageChange(totalPages)}
        size="small"
      >
        {totalPages}
      </Button>
    );
  }
  
  return <>{pages}</>;
}; 