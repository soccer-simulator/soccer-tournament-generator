import { tournamentTypes } from '../constants/soccer.ts';

import { NamedEntity } from './index.ts';

export type TournamentType = (typeof tournamentTypes)[number];

export type Team = NamedEntity;
