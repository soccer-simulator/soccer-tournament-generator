import {
  PersistableProperty,
  PersistablePropertyDeserializer,
  PersistablePropertyName,
  PersistablePropertySerializer,
  PersistableStore,
  PersistableValue
} from './types.ts';

export function defaultPersistableSerializer<T>(value: T): string {
  return JSON.stringify(value);
}

export function defaultPersistableDeserializer<T>(serializeValue: string): T {
  return JSON.parse(serializeValue);
}

export function normalizePersistableProperty<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
>(property: N | PersistableProperty<S, N>): PersistableProperty<S, N> {
  return typeof property === 'object'
    ? property
    : {
        name: property,
        serialize: defaultPersistableSerializer<S[N]>,
        deserialize: defaultPersistableDeserializer<S[N]>
      };
}

export function serializePersistablePropertyValue<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
>(serialize: PersistablePropertySerializer<S, N>, value: S[N]): string | number | boolean {
  return typeof value === 'number' || typeof value === 'boolean' ? value : serialize(value);
}

export function deserializePersistablePropertyValue<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
>(deserialize: PersistablePropertyDeserializer<S, N>, serializedValue: string | number | boolean): S[N] {
  return typeof serializedValue === 'number' || typeof serializedValue === 'boolean'
    ? (serializedValue as S[N])
    : deserialize(serializedValue);
}

export function evaluatePersistableValue(previous: PersistableValue, update: Partial<PersistableValue>) {
  return { ...previous, ...update };
}
