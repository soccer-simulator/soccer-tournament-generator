export type Primitive = number | string | boolean;

export interface Fn {
  apply(this: Fn, thisArg: unknown, argArray?: unknown): unknown;
  call(this: Fn, thisArg: unknown, ...argArray: Array<unknown>): unknown;
  bind(this: Fn, thisArg: unknown, ...argArray: Array<unknown>): unknown;
  toString(): string;
  prototype: unknown;
  readonly length: number;
  arguments: unknown;
  caller: Fn;
}

export type ConfigArray<T> = Array<T> | ReadonlyArray<T>;

export type IdentifiedEntity<T extends Primitive = number> = {
  id: T;
};

export type NamedEntity<T extends Primitive = number> = IdentifiedEntity<T> & {
  name: string;
};

export type IncludeKeys<O, T> = {
  [K in keyof O as O[K] extends T ? K : never]: O[K];
};

export type ExcludeKeys<O, T> = {
  [K in keyof O as O[K] extends T ? never : K]: O[K];
};
