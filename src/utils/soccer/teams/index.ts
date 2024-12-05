import { Team } from '../../../types/soccer.ts';

function randomInteger(min: number, max: number): number {
  const normalizedMin = Math.ceil(min);
  const normalizedMax = Math.floor(max);
  return Math.floor(Math.random() * (normalizedMax - normalizedMin + 1)) + normalizedMin;
}

export function drawTeams(teams: Array<Team>): Array<Team> {
  const drawn: Array<Team> = [];
  for (let i = 0; i < teams.length; i += 1) {
    let team: Team;
    do {
      const index = randomInteger(0, teams.length - 1);
      team = teams[index];
    } while (drawn.findIndex((t) => t.id === team.id) >= 0);
    drawn.push(team);
  }
  return drawn;
}
