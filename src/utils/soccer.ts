import {
  groupAvailableTeamsCount,
  knockoutAvailableTeamsCount,
  leagueAvailableTeamsCount
} from '../constants/soccer.ts';
import { TournamentType } from '../types/soccer.ts';

import { createMapFn } from './map.ts';

export const getTournamentTypeLabel = createMapFn<TournamentType, string>({
  league: 'Лига',
  group: 'Групповой турнир + Плей-офф',
  knockout: 'Кубок'
});

export const getTournamentTypeAvailableTeamsCount = createMapFn<TournamentType, ReadonlyArray<number>>({
  league: leagueAvailableTeamsCount,
  group: groupAvailableTeamsCount,
  knockout: knockoutAvailableTeamsCount
});
