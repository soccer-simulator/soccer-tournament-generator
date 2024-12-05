import { action, computed, IReactionDisposer, observable, reaction, runInAction } from 'mobx';

import { tournamentTypes } from './constants/soccer.ts';
import { StoreInterface } from './interfaces.ts';
import { Competition, Team, TournamentType } from './types/soccer.ts';
import { createContext } from './utils/context.ts';
import { disposePersistableStore, makeStorePersistable } from './utils/persist/persist.ts';
import { LocalPersistableStorage } from './utils/persist/storage.ts';
import { createPersistableLiteralPropertySerializationOptions } from './utils/persist/utils.ts';
import { getTournamentTypeAvailableTeamsCount } from './utils/soccer';
import { getCompetitionTeams } from './utils/soccer/teams/countries.ts';

const defaultTournamentType: TournamentType = 'group';

export class AppStore implements StoreInterface {
  @observable accessor initialized = false;

  @observable accessor competition: Competition | undefined = undefined;

  @observable accessor tournamentType: TournamentType = 'group';

  @observable accessor teamsCount = getTournamentTypeAvailableTeamsCount(defaultTournamentType, 0)[0];

  @observable accessor groupTeamsCount = 4;

  disposeAvailableTeamsCount: IReactionDisposer;

  constructor() {
    this.disposeAvailableTeamsCount = reaction(
      () => this.availableTeamsCount.slice(),
      (availableTeamsCount) => {
        if (!availableTeamsCount.includes(this.teamsCount)) {
          this.setTeamsCount(this.availableTeamsCount[0]);
        }
      }
    );
  }

  @computed get groupsCount(): number {
    return this.tournamentType === 'group' ? this.teamsCount / this.groupTeamsCount : 0;
  }

  @computed get teams(): Array<Team> {
    return this.competition ? getCompetitionTeams(this.competition) : [];
  }

  @computed get selectedTeams(): Array<Team> {
    return this.teams.length > 0 ? this.teams.slice(0, this.teamsCount) : [];
  }

  @computed get availableTeamsCount(): ReadonlyArray<number> {
    return getTournamentTypeAvailableTeamsCount(this.tournamentType, this.teams.length);
  }

  async init(): Promise<void> {
    await makeStorePersistable<AppStore>(this, {
      key: 'App',
      storage: new LocalPersistableStorage(),
      properties: [
        {
          name: 'tournamentType',
          ...createPersistableLiteralPropertySerializationOptions<AppStore, 'tournamentType'>(tournamentTypes)
        },
        'teamsCount',
        'competition'
      ]
    });

    runInAction(() => {
      this.initialized = true;
    });
  }

  async dispose(): Promise<void> {
    this.disposeAvailableTeamsCount();
    disposePersistableStore(this);
  }

  @action setCompetition(competition?: Competition): void {
    this.competition = competition;
  }

  @action setTournamentType(tournamentType: TournamentType): void {
    this.tournamentType = tournamentType;
  }

  @action setTeamsCount(teamsCount: number): void {
    this.teamsCount = teamsCount;
  }
}

export const AppStoreContext = createContext<AppStore>();
