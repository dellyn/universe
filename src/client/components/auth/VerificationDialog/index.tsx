import React from 'react';
import { Dialog, DialogContent } from '@ui-library';
import { VerificationCodeInput } from '@components/auth/VerificationCodeInput';

interface VerificationDialogProps {
  open: boolean;
  onClose: () => void;
}

export const VerificationDialog: React.FC<VerificationDialogProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <VerificationCodeInput 
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}; 