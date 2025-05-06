import { TextFieldProps as MuiTextFieldProps } from '@mui/material';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
    className?: string;
}