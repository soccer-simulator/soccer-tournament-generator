import { TournamentType } from '../types/soccer.ts';

import { createMapFn } from './map.ts';

export const getTournamentTypeLabel = createMapFn<TournamentType, string>({
  league: 'Лига',
  group: 'Групповой турнир + Плей-офф',
  knockout: 'Кубок'
});
