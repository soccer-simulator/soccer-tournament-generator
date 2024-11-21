import { ReactNode } from 'react';

export type ContainerType = 'widescreen' | 'fullhd' | 'max-desktop' | 'max-widescreen' | 'fluid';

export type ContainerProps = {
  className?: string;
  type?: ContainerType;
  children?: ReactNode;
};
