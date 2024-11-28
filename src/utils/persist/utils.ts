import z from 'zod';

import { ConfigArray, Primitive } from '../../types';
import { createZodLiteralUnionSchema } from '../zod.ts';

import {
  PersistableProperty,
  PersistablePropertyDeserializer,
  PersistablePropertyName,
  PersistablePropertySerializationOptions,
  PersistablePropertySerializer,
  PersistableSerializedValue,
  PersistableStore,
  PersistableValue
} from './types.ts';

const stringSchema = z.object({ __type: z.literal('string'), value: z.string() });
const numberSchema = z.object({ __type: z.literal('number'), value: z.number() });
const booleanSchema = z.object({ __type: z.literal('boolean'), value: z.boolean() });
const primitiveSchema = z.union([stringSchema, numberSchema, booleanSchema]);

export function defaultPersistableSerializer<T>(value: T): PersistableSerializedValue {
  const serializableValue = { __type: typeof value, value };
  if (primitiveSchema.safeParse(serializableValue).success) {
    return serializableValue;
  }
  return value as PersistableSerializedValue;
}

export function defaultPersistableDeserializer<T>(serializedValue: PersistableSerializedValue): T {
  const result = primitiveSchema.safeParse(serializedValue);
  return result.success ? (result.data.value as T) : (serializedValue as T);
}

export function createPersistableLiteralPropertySerializationOptions<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
>(values: S[N] extends Primitive ? ConfigArray<S[N]> : never): PersistablePropertySerializationOptions<S, N> {
  return {
    serialize: (value) => {
      const schema = createZodLiteralUnionSchema(values);
      if (!schema.safeParse(value).success) {
        throw new TypeError('Unable to serialize literal');
      }
      return { __type: 'literal', value };
    },
    deserialize: (serialized): S[N] => {
      const schema = z.object({ __type: z.literal('literal'), value: createZodLiteralUnionSchema(values) });
      const result = schema.safeParse(serialized);
      if (!result.success) {
        throw new TypeError('Unable to deserialize literal');
      }
      return result.data.value as S[N];
    }
  };
}

export function normalizePersistableProperty<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
>(property: N | PersistableProperty<S, N>): PersistableProperty<S, N> {
  return typeof property === 'object' ? property : { name: property };
}

export function serializePersistablePropertyValue<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
>(value: S[N], serialize?: PersistablePropertySerializer<S, N>): PersistableSerializedValue {
  return serialize ? serialize(value) : defaultPersistableSerializer(value);
}

export function deserializePersistablePropertyValue<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
>(serializedValue: PersistableSerializedValue, deserialize?: PersistablePropertyDeserializer<S, N>): S[N] {
  if (deserialize !== undefined) {
    return deserialize(serializedValue);
  }
  return defaultPersistableDeserializer(serializedValue);
}

export function evaluatePersistableValue(previous: PersistableValue, update: Partial<PersistableValue>) {
  return { ...previous, ...update };
}
