import { createMapFnStrict, createArgumentMapFnStrict } from 'map-fn';

import {
  CLUB_COMPETITIONS,
  NATIONAL_COMPETITIONS,
  GROUP_AVAILABLE_TEAMS_COUNT,
  KNOCKOUT_AVAILABLE_TEAMS_COUNT,
  LEAGUE_AVAILABLE_TEAMS_COUNT
} from '../../constants/soccer.ts';
import { ConfigArray } from '../../types';
import { NationalCompetition, ClubCompetition, TournamentType } from '../../types/soccer.ts';
import { createUnionTypeGuard } from '../type-guard.ts';

export const getNationalCompetitionLabel = createMapFnStrict<NationalCompetition, string>({
  worldCup: 'Чемпионат Мира',
  euroCup: 'Чемпионат Европы',
  copaAmerica: 'Кубок Америки',
  concacafCup: 'Кубок КОНКАКАФ',
  africaNationsCup: 'Африканский Кубок Наций',
  asianCup: 'Кубок Азии',
  ofkNationsCup: 'Кубок Наций ОФК'
});

export const getClubCompetitionLabel = createMapFnStrict<ClubCompetition, string>({
  england: 'Чемпионат Англии',
  germany: 'Чемпионат Германии',
  spain: 'Чемпионат Испании',
  italy: 'Чемпионат Италии',
  france: 'Чемпионат Франции'
});

export const getTournamentTypeLabel = createMapFnStrict<TournamentType, string>({
  league: 'Лига',
  group: 'Групповой турнир + Плей-офф',
  knockout: 'Кубок'
});

function normalizeTeamsCount(teamsCount: ConfigArray<number>, maxCount: number): ReadonlyArray<number> {
  return maxCount > 0 ? teamsCount.filter((count) => count <= maxCount) : [...teamsCount];
}

export const getTournamentTypeAvailableTeamsCount = createArgumentMapFnStrict<
  TournamentType,
  ReadonlyArray<number>,
  number
>({
  league: (maxCount) => normalizeTeamsCount(LEAGUE_AVAILABLE_TEAMS_COUNT, maxCount),
  group: (maxCount) => normalizeTeamsCount(GROUP_AVAILABLE_TEAMS_COUNT, maxCount),
  knockout: (maxCount) => normalizeTeamsCount(KNOCKOUT_AVAILABLE_TEAMS_COUNT, maxCount)
});

export const isNationalCompetition = createUnionTypeGuard<NationalCompetition>(NATIONAL_COMPETITIONS);
export const isCompetitionCountry = createUnionTypeGuard<ClubCompetition>(CLUB_COMPETITIONS);
