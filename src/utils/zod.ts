import z, { ZodLiteral } from 'zod';

import { ConfigArray, Primitive } from '../types';

export function isZodLiteralUnion<T extends ZodLiteral<unknown>>(literals: T[]): literals is [T, T, ...T[]] {
  return literals.length >= 2;
}

export function createZodLiteralUnionSchema<T extends Primitive>(values: ConfigArray<T>) {
  const literals = values.map((value) => z.literal(value));
  if (!isZodLiteralUnion(literals)) {
    throw new Error(
      'Literals passed do not meet the criteria for constructing a union schema, the minimum length is 2'
    );
  }
  return z.union(literals);
}
