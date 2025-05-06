import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import { TextFieldProps } from './types';
import classNames from 'classnames';

export const TextField = ({
  className,
  ...props
}: TextFieldProps) => {
  return (
    <MuiTextField
      className={classNames(className, 'text-field')}
      {...props}
    />
  );
};

