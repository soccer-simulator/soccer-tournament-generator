import classNames from 'classnames';

import { ControlProps } from './types.ts';

export const Control = (props: ControlProps) => {
  const { className: originalClassName, children } = props;

  const className = classNames('control', originalClassName);

  return <div className={className}>{children}</div>;
};
