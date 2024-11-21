import { createMapFnUndefined } from '../../../utils/map.ts';
import { componentTypeClassName } from '../utils.ts';

import { ButtonType } from './types.ts';

export const getButtonTypeClassName = createMapFnUndefined<ButtonType, string>({
  white: 'is-white',
  light: 'is-light',
  dark: 'is-dark',
  black: 'is-black',
  text: 'is-text',
  ghost: 'is-ghost',
  ...componentTypeClassName
});
