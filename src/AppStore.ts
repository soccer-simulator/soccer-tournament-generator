import { action, computed, IReactionDisposer, observable, reaction, runInAction } from 'mobx';

import { TOURNAMENT_TYPES } from './constants/soccer.ts';
import { StoreInterface } from './interfaces.ts';
import { Team, TournamentType, Competition } from './types/soccer.ts';
import { createContext } from './utils/context.ts';
import { disposePersistableStore, makeStorePersistable } from './utils/persist/persist.ts';
import { LocalPersistableStorage } from './utils/persist/storage.ts';
import { createPersistableLiteralPropertySerializationOptions } from './utils/persist/utils.ts';
import { getTournamentTypeAvailableTeamsCount, isNationalCompetition, isCompetitionCountry } from './utils/soccer';
import { getClubTeams } from './utils/soccer/teams/clubs.ts';
import { getNationalCompetitionTeams } from './utils/soccer/teams/national.ts';

const DEFAULT_TOURNAMENT_TYPE: TournamentType = 'group';
const DEFAULT_RENDER_LEAGUES_MATCH_DAYS: boolean = true;

export class AppStore implements StoreInterface {
  @observable accessor initialized = false;

  @observable accessor competition: Competition | undefined = undefined;

  @observable accessor tournamentType: TournamentType = DEFAULT_TOURNAMENT_TYPE;

  @observable accessor teamsCount = getTournamentTypeAvailableTeamsCount(DEFAULT_TOURNAMENT_TYPE, 0)[0];

  @observable accessor groupTeamsCount = 4;

  @observable accessor renderLeagueMatchDays = DEFAULT_RENDER_LEAGUES_MATCH_DAYS;

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
    if (isNationalCompetition(this.competition)) {
      return getNationalCompetitionTeams(this.competition);
    }
    if (isCompetitionCountry(this.competition)) {
      return getClubTeams(this.competition);
    }
    return [];
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
          ...createPersistableLiteralPropertySerializationOptions<AppStore, 'tournamentType'>(TOURNAMENT_TYPES)
        },
        'teamsCount',
        'competition',
        'renderLeagueMatchDays'
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

  @action setRenderLeagueMatchDays(renderLeagueMatchDays: boolean): void {
    this.renderLeagueMatchDays = renderLeagueMatchDays;
  }
}

export const AppStoreContext = createContext<AppStore>();
