import { action, makeObservable, observable, runInAction } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

import { StoreInterface } from './interfaces.ts';
import { Team, TournamentType } from './types/soccer.ts';
import { createContext } from './utils/context.ts';

export class AppStore implements StoreInterface {
  @observable accessor initialized = false;

  @observable accessor tournamentType: TournamentType = 'group';

  @observable accessor teams: Array<Team> = [];

  constructor() {
    makeObservable(this);
  }

  async init(): Promise<void> {
    await makePersistable(this, {
      name: 'App',
      storage: window.localStorage,
      properties: ['tournamentType', 'teams']
    });
    runInAction(() => {
      this.initialized = true;
    });
  }

  async dispose(): Promise<void> {
    stopPersisting(this);
  }

  @action setTournamentType(tournamentType: TournamentType): void {
    this.tournamentType = tournamentType;
  }
}

export const AppStoreContext = createContext<AppStore>();
