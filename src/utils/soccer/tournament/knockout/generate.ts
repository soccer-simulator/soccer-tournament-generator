import { KnockoutTournament, Team } from '../../../../types/soccer.ts';
import { drawTeams } from '../../teams';
import { generateTeams } from '../team.ts';

export function generateKnockoutTournament(teamsCount: number, inputTeams: Array<Team> = []): KnockoutTournament {
  let teams: Array<Team>;
  if (inputTeams.length === 0) {
    teams = generateTeams(teamsCount, true);
  } else {
    teams = drawTeams(inputTeams.slice(0, teamsCount));
  }
  return { teams };
}
