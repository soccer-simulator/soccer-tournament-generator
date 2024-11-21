import { Context, createContext as createReactContext, useContext as useReactContext } from 'react';

export function createContext<T>(): Context<T | undefined> {
  return createReactContext<T | undefined>(undefined);
}

export function useContext<T>(context: Context<T | undefined>): T {
  const contextValue = useReactContext<T | undefined>(context);
  if (contextValue === undefined) {
    throw new TypeError('Context value is not passed using context provider');
  }
  return contextValue;
}
