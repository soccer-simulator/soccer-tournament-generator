import classNames from 'classnames';

import { defined } from '../../../utils/type-guard.ts';
import { getComponentSizeClassName, isComponentType } from '../utils.ts';

import { ButtonProps } from './types.ts';
import { getButtonTypeClassName } from './utils.ts';

export const Button = (props: ButtonProps) => {
  const { className: originalClassName, type, dark, size, onClick, children } = props;

  const className = classNames(
    'button',
    defined(type) ? getButtonTypeClassName(type) : undefined,
    defined(type) && isComponentType(type) && dark ? 'is-dark' : undefined,
    defined(size) ? getComponentSizeClassName(size) : undefined,

    originalClassName
  );

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};
