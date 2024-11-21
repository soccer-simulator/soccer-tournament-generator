import { createMapFnUndefined } from '../../utils/map.ts';
import { createUnionTypeGuard } from '../../utils/type-guard.ts';

import { componentType } from './const.ts';
import { ComponentSize, ComponentType } from './types.ts';

export const isComponentType = createUnionTypeGuard(componentType);

export const componentTypeClassName: Record<ComponentType, string> = {
  primary: 'is-primary',
  link: 'is-link',
  info: 'is-info',
  success: 'is-success',
  warning: 'is-warning',
  danger: 'is-danger'
} as const;

export const getComponentTypeClassName = createMapFnUndefined<ComponentType, string>(componentTypeClassName);

export const getComponentSizeClassName = createMapFnUndefined<ComponentSize, string>({
  small: 'is-small',
  normal: 'is-normal',
  medium: 'is-medium',
  large: 'is-large'
});
