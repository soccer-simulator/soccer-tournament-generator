import { KnockoutTournament, Team } from '../../../../types/soccer.ts';
import { drawTeams } from '../../teams';
import { generateTeams } from '../team.ts';
import { TournamentOptions } from '../types.ts';

export function generateKnockoutTournament(options: TournamentOptions): KnockoutTournament {
  const { teamsCount, teams: inputTeams } = options;
  let teams: Array<Team>;
  if (inputTeams.length === 0) {
    teams = generateTeams(teamsCount, true);
  } else {
    teams = drawTeams(inputTeams.slice(0, teamsCount));
  }
  return { teams };
}
