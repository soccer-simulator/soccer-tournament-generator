import { StoreInterface } from '../../interfaces.ts';
import { ConfigArray, ExcludeKeys, Fn } from '../../types';

export type PersistableStore = StoreInterface;

export type PersistableValue = Record<string, unknown>;
export type PersistableSerializedValue = object;

export type PersistablePropertyName<S extends PersistableStore> = keyof ExcludeKeys<S, Fn>;

export type PersistablePropertySerializer<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
> = (value: S[N]) => PersistableSerializedValue;

export type PersistablePropertyDeserializer<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
> = (serializedValue: PersistableSerializedValue) => S[N];

export type PersistablePropertySerializationOptions<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
> =
  | { serialize: PersistablePropertySerializer<S, N>; deserialize: PersistablePropertyDeserializer<S, N> }
  | { serialize?: never; deserialize?: never };

export type PersistableProperty<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
> = {
  [K in N]: { name: K } & PersistablePropertySerializationOptions<S, K>;
}[N];

export interface PersistableStorage {
  load(key: string): Promise<string | undefined>;
  save(key: string, value: string): Promise<void>;
}

export type PersistableOptions<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
> = {
  key: string;
  storage: PersistableStorage;
  properties: ConfigArray<N | PersistableProperty<S, N>>;
};
