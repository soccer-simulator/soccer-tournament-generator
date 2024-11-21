import classNames from 'classnames';
import { ChangeEvent, ChangeEventHandler, useCallback, useMemo } from 'react';

import { Primitive } from '../../../types';
import { defined } from '../../../utils/type-guard.ts';
import { getComponentSizeClassName, getComponentTypeClassName } from '../utils.ts';

import { SelectProps } from './types.ts';
import { deserializeSelectValue, serializeSelectValue } from './utils.ts';

export const Select = <T extends Primitive = number>(props: SelectProps<T>) => {
  const { className: originalClassName, type, size, options = [], value, onChange: originalOnChange } = props;

  const className = classNames(
    'select',
    defined(type) ? getComponentTypeClassName(type) : undefined,
    defined(size) ? getComponentSizeClassName(size) : undefined,
    originalClassName
  );

  const serializedValue = useMemo(() => {
    return defined(value) ? serializeSelectValue<T>(value) : undefined;
  }, [value]);

  const onChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const { value: serializedValue } = event.target;
      originalOnChange?.(serializedValue.length > 0 ? deserializeSelectValue<T>(serializedValue) : undefined);
    },
    [originalOnChange]
  );

  return (
    <div className={className}>
      <select value={serializedValue} onChange={onChange}>
        {options.map((option) => {
          const { value, label } = option;
          const serializedOptionValue = serializeSelectValue(value);
          return (
            <option key={serializedOptionValue} value={serializedOptionValue}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};
