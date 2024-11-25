import { IReactionDisposer, reaction } from 'mobx';

import { PersistableOptions, PersistablePropertyName, PersistableStore, PersistableValue } from './types.ts';
import {
  deserializePersistablePropertyValue,
  evaluatePersistableValue,
  normalizePersistableProperty,
  serializePersistablePropertyValue
} from './utils.ts';

const persistableStores: Record<string, { store: PersistableStore; disposers: Array<IReactionDisposer> }> = {};

export async function makeStorePersistable<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
>(store: S, options: PersistableOptions<S, N>) {
  const { key, storage, properties } = options;

  if (persistableStores[key]) {
    throw new TypeError(`Persistable store "${key}" already exists`);
  }

  let persistableValue: PersistableValue = {};

  const serializedProperties = await storage.load(key);

  if (serializedProperties) {
    try {
      const serialized = JSON.parse(serializedProperties);
      properties.forEach((property) => {
        const { name, deserialize } = normalizePersistableProperty(property);
        const serializedValue = serialized[name];
        try {
          const deserializedValue =
            serializedValue !== undefined && serializedValue !== null
              ? deserializePersistablePropertyValue(serialized[name], deserialize)
              : undefined;
          if (deserializedValue !== undefined) {
            persistableValue[name] = serializedValue;
            store[name] = deserializedValue;
          }
        } catch (_) {
          // Unable to deserialize property
        }
      });
      await storage.save(key, JSON.stringify(persistableValue));
    } catch (_) {
      // Unable to parse stored properties
    }
  }

  const disposers = properties.map((property) => {
    const { name, serialize } = normalizePersistableProperty(property);
    return reaction(
      () => store[name],
      async (value) => {
        const serializedValue = serializePersistablePropertyValue(value, serialize);
        persistableValue = evaluatePersistableValue(persistableValue, { [name]: serializedValue });
        await storage.save(key, JSON.stringify(persistableValue));
      }
    );
  });

  persistableStores[key] = { store, disposers };
}

export function disposePersistableStore<S extends PersistableStore>(store: S): void {
  const keys = Object.keys(persistableStores);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const persisted = persistableStores[key];
    if (!persisted) {
      continue;
    }
    if (persisted.store === store) {
      persisted.disposers.forEach((dispose) => dispose());
      delete persistableStores[key];
      return;
    }
  }
}
