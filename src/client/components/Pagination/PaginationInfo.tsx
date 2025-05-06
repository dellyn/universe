import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@ui-library';

interface PaginationInfoProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onLimitChange: (limit: number) => void;
  pageSizeOptions: number[];
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onLimitChange,
  pageSizeOptions,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2">
        {`${startItem}-${endItem} of ${totalItems}`}
      </Typography>
      
      <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
        <InputLabel id="items-per-page-label">Per Page</InputLabel>
        <Select
          labelId="items-per-page-label"
          value={itemsPerPage}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          label="Per Page"
        >
          {pageSizeOptions.map(option => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}; 