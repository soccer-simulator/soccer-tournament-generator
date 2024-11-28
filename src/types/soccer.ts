import { tournamentTypes } from '../constants/soccer.ts';

import { NamedEntity } from './index.ts';

export type TournamentType = (typeof tournamentTypes)[number];

export type Team = NamedEntity;

export type Group = {
  name: string;
  teams: Array<Team>;
  matchDays: Array<MatchDay>;
};

export type LeagueTournament = {
  teams: Array<Team>;
};

export type GroupTournament = {
  groups: Array<Group>;
};

export type KnockoutTournament = {
  teams: Array<Team>;
};

export type Tournament =
  | ({ type: Extract<TournamentType, 'league'> } & LeagueTournament)
  | ({ type: Extract<TournamentType, 'group'> } & GroupTournament)
  | ({ type: Extract<TournamentType, 'knockout'> } & KnockoutTournament);

export type Match = {
  team1: Team;
  team2: Team;
  score1?: number;
  score2?: number;
};

export type MatchDay = {
  number: number;
  matches: Array<Match>;
};

export type RenderOptions = {
  width?: number;
  shiftX?: number;
  shiftY?: number;
};
