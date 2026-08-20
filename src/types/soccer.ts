import { CLUB_COMPETITIONS, REGIONS, NATIONAL_COMPETITIONS, TOURNAMENT_TYPES } from '../constants/soccer.ts';

import { NamedEntity } from './index.ts';

export type TournamentType = (typeof TOURNAMENT_TYPES)[number];
export type Region = (typeof REGIONS)[number];
export type NationalCompetition = (typeof NATIONAL_COMPETITIONS)[number];
export type ClubCompetition = (typeof CLUB_COMPETITIONS)[number];
export type Competition = NationalCompetition | ClubCompetition;

export type Team = NamedEntity & {
  shortName: string;
  prefix?: string;
};

export type NationalTeam = Team & {
  region: Region;
};

export type ClubTeam = Team & {
  country: ClubCompetition;
};

export type Group = {
  name: string;
  teams: Array<Team>;
  matchDays: Array<MatchDay>;
};

export type LeagueTournament = {
  teams: Array<Team>;
  matchDays: Array<MatchDay>;
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
  scale?: number;
  width?: number;
  shiftX?: number;
  shiftY?: number;
};
