import classNames from 'classnames';

import { LabelProps } from './types.ts';

export const Label = (props: LabelProps) => {
  const { className: originalClassName, children } = props;

  const className = classNames('label', originalClassName);

  return <div className={className}>{children}</div>;
};
