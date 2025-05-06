import React from 'react';
import { Box, Button } from '@ui-library';
import KeyboardArrowLeftIcon from '@icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@icons/KeyboardArrowRight';
import { PageNumbers } from './PageNumbers';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Button
        variant="outlined"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        startIcon={<KeyboardArrowLeftIcon />}
        size="small"
      >
        Prev
      </Button>
      
      <PageNumbers
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      
      <Button
        variant="outlined"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        endIcon={<KeyboardArrowRightIcon />}
        size="small"
      >
        Next
      </Button>
    </Box>
  );
}; 