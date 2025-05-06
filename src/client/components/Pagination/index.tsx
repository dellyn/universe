import React from 'react';
import { Box } from '@ui-library';
import { PaginationControls } from './PaginationControls';
import { PaginationInfo } from './PaginationInfo';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [5, 10, 25, 50],
}) => {
  if (totalItems === 0) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, flexWrap: 'wrap', gap: 2 }}>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      
      <PaginationInfo
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onLimitChange={onLimitChange}
        pageSizeOptions={pageSizeOptions}
      />
    </Box>
  );
}; 