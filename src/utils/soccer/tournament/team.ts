import { Team } from '../../../types/soccer.ts';

export function generateTeams(teamsCount: number, emptyNames = true): Array<Team> {
  const teams: Array<Team> = [];
  for (let i = 0; i < teamsCount; i += 1) {
    teams.push({ id: i + 1, name: emptyNames ? '' : `Team ${i + 1}` });
  }
  return teams;
}
