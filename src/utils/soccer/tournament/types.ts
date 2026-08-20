import { Team, TeamOrder } from '../../../types/soccer.ts';

export type TournamentOptions = {
  teamsCount: number;
  teams: Array<Team>;
  teamOrder?: TeamOrder;
  leagueMatchDays?: boolean;
};
