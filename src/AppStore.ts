import { action, computed, observable, runInAction } from 'mobx';

import { tournamentTypes } from './constants/soccer.ts';
import { StoreInterface } from './interfaces.ts';
import { Team, TournamentType } from './types/soccer.ts';
import { createContext } from './utils/context.ts';
import { disposePersistableStore, makeStorePersistable } from './utils/persist/persist.ts';
import { LocalPersistableStorage } from './utils/persist/storage.ts';
import { getTournamentTypeAvailableTeamsCount } from './utils/soccer.ts';

const defaultTournamentType: TournamentType = 'group';

export class AppStore implements StoreInterface {
  @observable accessor initialized = false;

  @observable accessor tournamentType: TournamentType = 'group';

  @observable accessor teamsCount = getTournamentTypeAvailableTeamsCount(defaultTournamentType)[0];

  @observable accessor groupTeamsCount = 4;

  @observable accessor teams: Array<Team> = [];

  @computed get groupsCount(): number {
    return this.tournamentType === 'group' ? this.teamsCount / this.groupTeamsCount : 0;
  }

  async init(): Promise<void> {
    await makeStorePersistable<AppStore>(this, {
      key: 'App',
      storage: new LocalPersistableStorage(),
      properties: [
        {
          name: 'tournamentType',
          serialize: (value) => `${value}`,
          deserialize: (value) => {
            const typedValue = value as TournamentType;
            if (!tournamentTypes.includes(typedValue)) {
              throw new TypeError('Unable to deserialize tournament type');
            }
            return typedValue;
          }
        },
        'teamsCount'
      ]
    });
    runInAction(() => {
      this.initialized = true;
    });
  }

  async dispose(): Promise<void> {
    disposePersistableStore(this);
  }

  @action setTournamentType(tournamentType: TournamentType): void {
    this.tournamentType = tournamentType;
    const availableTeamsCount = getTournamentTypeAvailableTeamsCount(tournamentType);
    if (!availableTeamsCount.includes(this.teamsCount)) {
      this.setTeamsCount(availableTeamsCount[0]);
    }
  }

  @action setTeamsCount(teamsCount: number): void {
    this.teamsCount = teamsCount;
  }
}

export const AppStoreContext = createContext<AppStore>();
