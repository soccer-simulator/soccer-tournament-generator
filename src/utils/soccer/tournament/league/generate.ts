import { LeagueTournament } from '../../../../types/soccer.ts';
import { generateChampionshipMatchDays } from '../championship/generate.ts';
import { generateTeams } from '../team.ts';

export function generateLeagueTournament(teamsCount: number): LeagueTournament {
  const teams = generateTeams(teamsCount, false);
  return { teams, matchDays: generateChampionshipMatchDays(teams) };
}
