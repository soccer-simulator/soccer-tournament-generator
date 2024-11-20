import { makeObservable, observable, runInAction } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

import { StoreInterface } from './interfaces.ts';
import { Team } from './types.ts';

export class AppStore implements StoreInterface {
  @observable accessor initialized = false;

  @observable accessor teams: Array<Team> = [];

  constructor() {
    makeObservable(this);
  }

  async init(): Promise<void> {
    await makePersistable(this, {
      name: 'App',
      storage: window.localStorage,
      properties: ['teams']
    });
    runInAction(() => {
      this.initialized = true;
    });
  }

  async dispose(): Promise<void> {
    stopPersisting(this);
  }
}
