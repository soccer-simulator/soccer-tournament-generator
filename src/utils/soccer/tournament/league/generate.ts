import { LeagueTournament, Team } from '../../../../types/soccer.ts';
import { drawTeams } from '../../teams';
import { generateChampionshipMatchDays } from '../championship/generate.ts';
import { generateTeams } from '../team.ts';

export function generateLeagueTournament(teamsCount: number, inputTeams: Array<Team> = []): LeagueTournament {
  let teams: Array<Team>;
  if (inputTeams.length === 0) {
    teams = generateTeams(teamsCount, true);
  } else {
    teams = drawTeams(inputTeams.slice(0, teamsCount));
  }
  return { teams, matchDays: generateChampionshipMatchDays(teams) };
}
