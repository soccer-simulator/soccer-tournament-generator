import { PersistableStorage } from './types.ts';

export class LocalPersistableStorage implements PersistableStorage {
  load(key: string): Promise<string | undefined> {
    const value = window.localStorage.getItem(key);
    return Promise.resolve(value === null ? undefined : value);
  }

  save(key: string, value: string): Promise<void> {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  }
}
