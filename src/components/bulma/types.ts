import { componentType } from './const.ts';

export type ComponentType = (typeof componentType)[number];

export type ComponentSize = 'small' | 'default' | 'normal' | 'medium' | 'large';
