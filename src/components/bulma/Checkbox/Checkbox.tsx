import classNames from 'classnames';
import { ChangeEvent, ChangeEventHandler, useCallback } from 'react';

import { CheckboxProps } from './types.ts';

export const Checkbox = (props: CheckboxProps) => {
  const { className: originalClassName, disabled, value, onChange: originalOnChange, children } = props;

  const className = classNames('checkbox', originalClassName);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event: ChangeEvent<HTMLInputElement>) => {
      originalOnChange?.(event.target.checked);
    },
    [originalOnChange]
  );

  return (
    <label className={className}>
      <input type="checkbox" disabled={disabled} checked={value} onChange={onChange} /> {children}
    </label>
  );
};
