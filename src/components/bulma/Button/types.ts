import { MouseEventHandler, ReactNode } from 'react';

import { ComponentSize, ComponentType } from '../types.ts';

export type ButtonBasicType = 'white' | 'light' | 'dark' | 'black' | 'text' | 'ghost';
export type ButtonType = ButtonBasicType | ComponentType;

export type ButtonTypeBasicProps = {
  type?: ButtonBasicType;
  dark?: never;
};

export type ButtonTypeColorizedProps = {
  type?: ComponentType;
  dark?: boolean;
};

export type ButtonTypeProps = ButtonTypeBasicProps | ButtonTypeColorizedProps;

export type ButtonSize = ComponentSize;

export type ButtonProps = ButtonTypeProps & {
  className?: string;
  size?: ButtonSize;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
};
