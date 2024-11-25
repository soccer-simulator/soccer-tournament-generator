import { StoreInterface } from '../../interfaces.ts';
import { ConfigArray, ExcludeKeys, Fn } from '../../types';

export type PersistableValue = Record<string, unknown>;
export type PersistableStore = StoreInterface;

export type PersistablePropertyName<S extends PersistableStore> = keyof ExcludeKeys<S, Fn>;

export type PersistablePropertySerializer<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
> = (value: S[N]) => string;

export type PersistablePropertyDeserializer<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
> = (serializedValue: string) => S[N];

export type PersistableProperty<
  S extends PersistableStore,
  N extends PersistablePropertyName<S> = PersistablePropertyName<S>
> = {
  [K in N]: {
    name: K;
    serialize: PersistablePropertySerializer<S, K>;
    deserialize: PersistablePropertyDeserializer<S, K>;
  };
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
