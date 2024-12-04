import { KnockoutTournament } from '../../../../types/soccer.ts';
import { generateTeams } from '../team.ts';

export function generateKnockoutTournament(teamsCount: number): KnockoutTournament {
  return { teams: generateTeams(teamsCount, false) };
}
