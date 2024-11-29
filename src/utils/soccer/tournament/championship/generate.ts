import { Match, MatchDay, Team } from '../../../../types/soccer.ts';

function prepareRoundRobinTeams(teams: Array<Team>): { teams1: Array<Team>; teams2: Array<Team> } {
  if (teams.length % 2 === 1) {
    throw new Error('Count of teams must be even');
  }

  const teams1: Array<Team> = [];
  const teams2: Array<Team> = [];

  teams.forEach((team, i) => {
    if (i % 2 === 0) {
      teams1.push(team);
    } else {
      teams2.push(team);
    }
  });

  return { teams1, teams2 };
}

function rotateRoundRobinTeams(teams1: Array<Team>, teams2: Array<Team>): void {
  const [team1] = teams1.splice(1, 1);
  const [team2] = teams2.splice(teams2.length - 1, 1);
  teams1.push(team2);
  teams2.unshift(team1);
}

export function generateChampionshipMatchDays(teams: Array<Team>): Array<MatchDay> {
  const matchDaysCount = teams.length - 1;

  const { teams1, teams2 } = prepareRoundRobinTeams(teams);

  const matchDays: Array<MatchDay> = [];
  for (let i = 0; i < matchDaysCount; i += 1) {
    const number = i + 1;
    const matches: Array<Match> = [];

    const swap = i % 2 === 1;

    teams1.forEach((team1, j) => {
      const team2 = teams2[j];
      const match: Match = {
        team1: j < teams1.length - 1 && swap ? team2 : team1,
        team2: j < teams1.length - 1 && swap ? team1 : team2
      };
      matches.push(match);
    });

    matchDays.push({ number, matches });

    rotateRoundRobinTeams(teams1, teams2);
  }

  return matchDays;
}
