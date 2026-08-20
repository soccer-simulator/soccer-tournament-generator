import { action, computed, IReactionDisposer, observable, reaction, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';

import { TEAM_ORDERS, TOURNAMENT_TYPES } from './constants/soccer.ts';
import { StoreInterface } from './interfaces.ts';
import { Team, TournamentType, Competition, TeamOrder } from './types/soccer.ts';
import { createContext } from './utils/context.ts';
import { disposePersistableStore, makeStorePersistable } from './utils/persist/persist.ts';
import { LocalPersistableStorage } from './utils/persist/storage.ts';
import { createPersistableLiteralPropertySerializationOptions } from './utils/persist/utils.ts';
import { getTournamentTypeAvailableTeamsCount, isNationalCompetition, isCompetitionCountry } from './utils/soccer';
import { getClubTeams } from './utils/soccer/teams/clubs.ts';
import { getNationalTeams } from './utils/soccer/teams/national.ts';

const DEFAULT_TOURNAMENT_TYPE: TournamentType = 'group';
const DEFAULT_GROUP_TEAMS_COUNT: number = 4;
const DEFAULT_LEAGUE_MATCH_DAYS: boolean = true;
const DEFAULT_TEAM_ORDER: TeamOrder = 'default';

export class AppStore implements StoreInterface {
  @observable accessor initialized = false;

  @observable accessor competition: Competition | undefined = undefined;

  @observable accessor tournamentType: TournamentType = DEFAULT_TOURNAMENT_TYPE;

  @observable accessor teamsCount = getTournamentTypeAvailableTeamsCount(DEFAULT_TOURNAMENT_TYPE, 0)[0];

  @observable accessor groupTeamsCount = DEFAULT_GROUP_TEAMS_COUNT;

  @observable accessor teamOrder = DEFAULT_TEAM_ORDER;

  @observable accessor leagueMatchDays = DEFAULT_LEAGUE_MATCH_DAYS;

  @observable accessor selectedTeamIds: Array<number> = [];

  disposeTeams: IReactionDisposer;

  disposeAvailableTeamsCount: IReactionDisposer;

  constructor() {
    this.disposeTeams = reaction(
      () => ({ teams: this.teams.slice(), count: this.teamsCount }),
      () => {
        this.resetTeamSelection();
      }
    );

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

  @computed get availableTeamsCount(): ReadonlyArray<number> {
    return getTournamentTypeAvailableTeamsCount(this.tournamentType, this.teams.length);
  }

  @computed get teams(): Array<Team> {
    if (isNationalCompetition(this.competition)) {
      return getNationalTeams(this.competition);
    }
    if (isCompetitionCountry(this.competition)) {
      return getClubTeams(this.competition);
    }
    return [];
  }

  @computed get orderedTeams(): Array<Team> {
    const orderedTeams = [...this.teams];
    orderedTeams.sort((team1, team2) => team1.name.localeCompare(team2.name));
    return orderedTeams;
  }

  @computed get evaluatedTeams(): Array<Team> {
    return this.teamOrder !== 'default' ? this.orderedTeams : this.teams;
  }

  @computed get selectedTeams(): Array<Team> {
    return this.evaluatedTeams.filter((team) => {
      return this.selectedTeamIds.includes(team.id);
    });
  }

  teamSelected = computedFn((team: number | Team): boolean => {
    const teamId = typeof team === 'number' ? team : team.id;
    return this.selectedTeamIds.includes(teamId);
  });

  @computed get teamSelectionValid(): boolean {
    return this.teamsCount === this.selectedTeamIds.length;
  }

  async init(): Promise<void> {
    this.resetTeamSelection();

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
        {
          name: 'teamOrder',
          ...createPersistableLiteralPropertySerializationOptions<AppStore, 'teamOrder'>(TEAM_ORDERS)
        },
        'leagueMatchDays',
        'selectedTeamIds'
      ]
    });

    runInAction(() => {
      this.initialized = true;
    });
  }

  async dispose(): Promise<void> {
    this.disposeTeams();
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

  @action setTeamOrder(teamOrder: TeamOrder): void {
    this.teamOrder = teamOrder;
  }

  @action setLeagueMatchDays(leagueMatchDays: boolean): void {
    this.leagueMatchDays = leagueMatchDays;
  }

  @action setTeamSelected(team: number | Team, selected: boolean): void {
    const teamId = typeof team === 'number' ? team : team.id;
    if (selected && !this.selectedTeamIds.includes(teamId)) {
      this.selectedTeamIds.push(teamId);
    } else if (!selected) {
      const index = this.selectedTeamIds.indexOf(teamId);
      if (index >= 0) {
        this.selectedTeamIds.splice(index, 1);
      }
    }
  }

  @action resetTeamSelection(): void {
    this.selectedTeamIds = this.teams.slice(0, this.teamsCount).map((team) => team.id);
  }
}

export const AppStoreContext = createContext<AppStore>();
