import { Group, GroupTournament, Team } from '../../../../types/soccer.ts';
import { generateChampionshipMatchDays } from '../championship/generate.ts';
import { generateTeams } from '../team.ts';

export function generateGroupTournament(teamsCount: number): GroupTournament {
  const teamsPerGroup = 4;
  const groupsCount = teamsCount / teamsPerGroup;
  const groups: Array<Group> = [];

  const teams = generateTeams(teamsCount, false);

  for (let i = 0; i < groupsCount; i += 1) {
    const name = String.fromCharCode(65 + i);
    const groupTeams: Array<Team> = teams.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
    groups.push({ name, teams: groupTeams, matchDays: generateChampionshipMatchDays(groupTeams) });
  }

  return { groups };
}
