import classNames from 'classnames';

import { Control } from '../Control/Control.tsx';
import { Label } from '../Label/Label.tsx';

import { FieldProps } from './types.ts';

export const Field = (props: FieldProps) => {
  const { className: originalClassName, label, children } = props;

  const className = classNames('field', originalClassName);

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Control>{children}</Control>
    </div>
  );
};
