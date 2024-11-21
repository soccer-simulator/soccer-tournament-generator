export function defined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function createUnionTypeGuard<T>(values: ReadonlyArray<T>): (value: unknown) => value is T {
  return function (value: unknown): value is T {
    return values.includes(value as T);
  };
}
