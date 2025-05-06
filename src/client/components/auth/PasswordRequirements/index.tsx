import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box } from '@ui-library';
import { Check, Close } from '@mui/icons-material';
import { passwordRequirements } from '@packages/validation/password';

interface PasswordRequirementProps {
  password: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementProps> = ({ password }) => {
  const hasMinLength = password.length >= passwordRequirements.minLength;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  const requirements = [
    {
      label: `At least ${passwordRequirements.minLength} characters`,
      satisfied: hasMinLength
    },
    {
      label: 'At least one uppercase letter',
      satisfied: hasUppercase
    },
    {
      label: 'At least one lowercase letter',
      satisfied: hasLowercase
    }
  ];

  return (
    <Box mt={1} mb={2}>
      <List dense>
        {requirements.map((req, index) => (
          <ListItem key={index} sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {req.satisfied ? 
                <Check fontSize="small" color="success" /> : 
                <Close fontSize="small" color="error" />
              }
            </ListItemIcon>
            <ListItemText 
              primary={req.label} 
              primaryTypographyProps={{ 
                variant: 'body2',
                color: req.satisfied ? 'success.main' : 'error.main'
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}; 