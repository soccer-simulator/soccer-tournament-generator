import { Primitive } from '../../../types';

const SERIALIZED_SELECT_VALUE_PREFIX_SEPARATOR = ':::';
const SERIALIZED_SELECT_VALUE_NUMBER_PREFIX = 'number';
const SERIALIZED_SELECT_VALUE_STRING_PREFIX = 'string';
const SERIALIZED_SELECT_VALUE_BOOLEAN_PREFIX = 'boolean';

export function serializeSelectValue<T extends Primitive>(value: T): string {
  let prefix: string;
  if (typeof value === 'number') {
    prefix = SERIALIZED_SELECT_VALUE_NUMBER_PREFIX;
  } else if (typeof value === 'string') {
    prefix = SERIALIZED_SELECT_VALUE_STRING_PREFIX;
  } else {
    prefix = SERIALIZED_SELECT_VALUE_BOOLEAN_PREFIX;
  }
  return `${prefix}${SERIALIZED_SELECT_VALUE_PREFIX_SEPARATOR}${value}`;
}

export function deserializeSelectValue<T extends Primitive>(serialized: string): T {
  const items = serialized.split(SERIALIZED_SELECT_VALUE_PREFIX_SEPARATOR);
  if (items.length === 2) {
    try {
      const prefix = items[0];
      const value = items[1];

      if (prefix === 'number') {
        return Number(value) as T;
      }
      if (prefix === 'string') {
        return value as T;
      }
      if (prefix === 'boolean') {
        return Boolean(value) as T;
      }
    } catch (_) {
      // Do nothing here, error will be thrown below
    }
  }

  throw new TypeError(`Unable to deserialize select value "${serialized}"`);
}
