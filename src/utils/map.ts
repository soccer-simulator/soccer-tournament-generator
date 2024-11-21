export class MappingError extends TypeError {}

export type MapFnInput = string | number;
export type MapFnCustomTransformer<I extends MapFnInput, O> = (input: I) => O | undefined;

export type MapFnDefaultValue<O> = Exclude<O, (...args: Array<unknown>) => unknown>;
export type MapFnDefaultValueFn<I extends MapFnInput, O> = (input: I) => O;
export type MapFnDefaultValueCombined<I extends MapFnInput, O> = MapFnDefaultValue<O> | MapFnDefaultValueFn<I, O>;

export type MapFnOptions<I extends MapFnInput, O> = {
  customTransformer?: MapFnCustomTransformer<I, O>;
  defaultValue?: MapFnDefaultValueCombined<I, O>;
  errorMessage?: (input: I) => string;
};
export type MapFnUndefinedOptions<I extends MapFnInput, O> = Omit<MapFnOptions<I, O>, 'errorMessage'>;

export type MapFn<I extends MapFnInput, O> = (input: I, mapOptions?: MapFnOptions<I, O>) => O;
export type MapFnUndefined<I extends MapFnInput, O> = (
  input: I,
  mapOptions?: MapFnUndefinedOptions<I, O>
) => O | undefined;

export type MapFnWithOptions<I extends MapFnInput, O, Options = 'object'> = (
  input: I,
  options: Options,
  mapOptions?: MapFnOptions<I, O>
) => O;
export type MapFnUndefinedWithOptions<I extends MapFnInput, O, Options = 'object'> = (
  input: I,
  options: Options,
  mapOptions?: MapFnUndefinedOptions<I, O>
) => O | undefined;

function isMapFnDefaultValueFn<I extends MapFnInput, O>(
  defaultValue: MapFnDefaultValueCombined<I, O>
): defaultValue is MapFnDefaultValueFn<I, O> {
  return typeof defaultValue === 'function';
}

function validateCreateMapFnResult<I extends MapFnInput, O>(
  input: I,
  output: O | undefined,
  createMapOptions?: MapFnOptions<I, O>,
  mapOptions?: MapFnOptions<I, O>
): O {
  const combinedMapOptions: MapFnOptions<I, O> = { ...createMapOptions, ...mapOptions };

  const {
    customTransformer,
    defaultValue,
    errorMessage = (input: I) => `Unable to map "${input}", default value is not provided`
  } = combinedMapOptions;

  const o = output === undefined && typeof customTransformer === 'function' ? customTransformer(input) : output;
  if (o === undefined) {
    if (defaultValue === undefined) {
      throw new MappingError(errorMessage(input));
    }
    return isMapFnDefaultValueFn<I, O>(defaultValue) ? defaultValue(input) : defaultValue;
  }
  return o;
}

function validateCreateMapFnUndefinedResult<I extends MapFnInput, O>(
  input: I,
  output: O | undefined,
  createMapOptions?: MapFnUndefinedOptions<I, O>,
  mapOptions?: MapFnUndefinedOptions<I, O>
): O | undefined {
  const combinedMapOptions: MapFnUndefinedOptions<I, O> = { ...createMapOptions, ...mapOptions };

  const { customTransformer, defaultValue } = combinedMapOptions;

  const o = output === undefined && typeof customTransformer === 'function' ? customTransformer(input) : output;
  if (o === undefined) {
    if (defaultValue === undefined) {
      return undefined;
    }
    return isMapFnDefaultValueFn<I, O>(defaultValue) ? defaultValue(input) : defaultValue;
  }
  return o;
}

export function createMapFn<I extends MapFnInput, O>(
  map: Partial<Record<I, O>>,
  createMapOptions?: MapFnOptions<I, O>
): MapFn<I, O> {
  return (input: I, mapOptions?: MapFnOptions<I, O>): O => {
    const output: O | undefined = map[input];
    return validateCreateMapFnResult<I, O>(input, output, createMapOptions, mapOptions);
  };
}

export function createMapFnUndefined<I extends MapFnInput, O>(
  map: Partial<Record<I, O>>,
  createMapOptions?: MapFnUndefinedOptions<I, O>
): MapFnUndefined<I, O> {
  return (input: I, mapOptions?: MapFnUndefinedOptions<I, O>): O | undefined => {
    const output: O | undefined = map[input];
    return validateCreateMapFnUndefinedResult<I, O>(input, output, createMapOptions, mapOptions);
  };
}

export function createMapFnWithOptions<I extends MapFnInput, O, Options = object>(
  map: Partial<Record<I, (options: Options) => O>>,
  createMapOptions?: MapFnOptions<I, O>
): MapFnWithOptions<I, O, Options> {
  return (input: I, options: Options, mapOptions?: MapFnOptions<I, O>): O => {
    const fn = map[input];
    if (typeof fn !== 'function') {
      return validateCreateMapFnResult<I, O>(input, undefined, createMapOptions, mapOptions);
    }
    const output: O | undefined = fn(options);
    return validateCreateMapFnResult<I, O>(input, output, createMapOptions, mapOptions);
  };
}

export function createMapFnWithOptionsUndefined<I extends MapFnInput, O, Options = object>(
  map: Partial<Record<I, (options: Options) => O>>,
  createMapOptions?: MapFnUndefinedOptions<I, O>
): MapFnUndefinedWithOptions<I, O, Options> {
  return (input: I, options: Options, mapOptions?: MapFnUndefinedOptions<I, O>): O | undefined => {
    const { defaultValue } = { ...createMapOptions, ...mapOptions };
    const fn = map[input];
    const value = fn?.(options);
    if (value !== undefined) {
      return value;
    }
    return defaultValue !== undefined && isMapFnDefaultValueFn<I, O>(defaultValue) ? defaultValue(input) : defaultValue;
  };
}
