export type Primitive = number | string;

export type IdentifiedEntity<T extends Primitive = number> = {
  id: T;
};

export type NamedEntity<T extends Primitive = number> = IdentifiedEntity<T> & {
  name: string;
};

export type Team = NamedEntity;
