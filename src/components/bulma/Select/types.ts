import { ReactNode } from 'react';

import { ConfigArray, Primitive } from '../../../types';
import { ComponentSize, ComponentType } from '../types.ts';

export type SelectType = ComponentType;
export type SelectSize = ComponentSize;

export type SelectOption<T extends Primitive = number> = {
  value: T;
  label: ReactNode;
};

export type SelectProps<T extends Primitive = number, O extends SelectOption<T> = SelectOption<T>> = {
  className?: string;
  type?: SelectType;
  size?: SelectSize;
  fullWidth?: boolean;
  options?: ConfigArray<O>;
  value?: T;
  onChange?: (value?: T) => void;
};
