export type Primitive = number | string | boolean;

export type ConfigArray<T> = Array<T> | ReadonlyArray<T>;

export type IdentifiedEntity<T extends Primitive = number> = {
  id: T;
};

export type NamedEntity<T extends Primitive = number> = IdentifiedEntity<T> & {
  name: string;
};
