import { ReactNode } from 'react';

export type CheckboxProps = {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
  children?: ReactNode;
};
