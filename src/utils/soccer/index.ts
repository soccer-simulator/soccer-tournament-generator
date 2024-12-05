import {
  groupAvailableTeamsCount,
  knockoutAvailableTeamsCount,
  leagueAvailableTeamsCount
} from '../../constants/soccer.ts';
import { ConfigArray } from '../../types';
import { Competition, TournamentType } from '../../types/soccer.ts';
import { createMapFn, createMapFnWithOptions } from '../map.ts';

export const getTournamentTypeLabel = createMapFn<TournamentType, string>({
  league: 'Лига',
  group: 'Групповой турнир + Плей-офф',
  knockout: 'Кубок'
});

export const getCompetitionLabel = createMapFn<Competition, string>({
  worldCup: 'Чемпионат Мира',
  euroCup: 'Чемпионат Европы'
});

function normalizeTeamsCount(teamsCount: ConfigArray<number>, maxCount: number): ReadonlyArray<number> {
  return maxCount > 0 ? teamsCount.filter((count) => count <= maxCount) : [...teamsCount];
}

export const getTournamentTypeAvailableTeamsCount = createMapFnWithOptions<
  TournamentType,
  ReadonlyArray<number>,
  number
>({
  league: (maxCount) => normalizeTeamsCount(leagueAvailableTeamsCount, maxCount),
  group: (maxCount) => normalizeTeamsCount(groupAvailableTeamsCount, maxCount),
  knockout: (maxCount) => normalizeTeamsCount(knockoutAvailableTeamsCount, maxCount)
});
