import React from 'react';
import classNames from 'classnames';
import { InputProps } from './types';

export const Input = ({
  className,
  ...props
}: InputProps) => {
  return (
    <input
      className={classNames(className, 'input')}
      {...props}
    />
  );
};
