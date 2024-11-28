import { Group, GroupTournament, Match, MatchDay, Team } from '../../../../types/soccer.ts';
import { generateTeams } from '../team.ts';

function prepareRoundRobinTeams(teams: Array<Team>): { teams1: Array<Team>; teams2: Array<Team> } {
  if (teams.length % 2 === 1) {
    throw new Error('Count of teams must be even');
  }

  const teams1 = teams.slice(0, teams.length / 2);
  const teams2 = teams.slice(teams.length / 2, teams.length);
  teams2.reverse();

  return { teams1, teams2 };
}

function rotateRoundRobinTeams(teams1: Array<Team>, teams2: Array<Team>): void {
  const [team1] = teams1.splice(1, 1);
  const [team2] = teams2.splice(teams2.length - 1, 1);
  teams1.push(team2);
  teams2.unshift(team1);
}

export function generateGroupTournamentMatchDays(teams: Array<Team>): Array<MatchDay> {
  const matchDaysCount = teams.length - 1;

  const { teams1, teams2 } = prepareRoundRobinTeams(teams);

  const matchDays: Array<MatchDay> = [];
  for (let i = 0; i < matchDaysCount; i += 1) {
    const number = i + 1;
    const matches: Array<Match> = [];

    const swap = i % 2 === 1;

    rotateRoundRobinTeams(teams1, teams2);

    teams1.forEach((team1, j) => {
      const team2 = teams2[j];
      const match: Match = {
        team1: j < teams1.length - 1 && swap ? team2 : team1,
        team2: j < teams1.length - 1 && swap ? team1 : team2
      };
      matches.push(match);
    });

    matchDays.push({ number, matches });
  }

  return matchDays;
}

export function generateGroupTournament(teamsCount: number): GroupTournament {
  const teamsPerGroup = 4;
  const groupsCount = teamsCount / teamsPerGroup;
  const groups: Array<Group> = [];

  const teams = generateTeams(teamsCount, false);

  for (let i = 0; i < groupsCount; i += 1) {
    const name = String.fromCharCode(65 + i);
    const groupTeams: Array<Team> = teams.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
    groups.push({ name, teams: groupTeams, matchDays: generateGroupTournamentMatchDays(groupTeams) });
  }

  return { groups };
}
