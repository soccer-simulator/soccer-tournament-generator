import classNames from 'classnames';

import { defined } from '../../../utils/type-guard.ts';

import { ContainerProps } from './types.ts';
import { getContainerTypeClassName } from './utils.ts';

export const Container = (props: ContainerProps) => {
  const { className: originalClassName, type, children } = props;

  const className = classNames('container', defined(type) ? getContainerTypeClassName : undefined, originalClassName);

  return <div className={className}>{children}</div>;
};
