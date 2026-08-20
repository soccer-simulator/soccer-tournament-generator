import { LeagueTournament, Team } from '../../../../types/soccer.ts';
import { drawTeams } from '../../teams';
import { generateChampionshipMatchDays } from '../championship/generate.ts';
import { generateTeams } from '../team.ts';
import { TournamentOptions } from '../types.ts';

export function generateLeagueTournament(options: TournamentOptions): LeagueTournament {
  const { teamsCount, teams: inputTeams, teamOrder } = options;
  let teams: Array<Team>;
  if (inputTeams.length === 0) {
    teams = generateTeams(teamsCount, true);
  } else {
    if (teamOrder === 'draw') {
      teams = drawTeams(inputTeams.slice(0, teamsCount));
    } else {
      teams = inputTeams.slice(0, teamsCount);
    }
  }
  return { teams, matchDays: generateChampionshipMatchDays(teams) };
}
