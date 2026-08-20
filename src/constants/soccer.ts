export const TOURNAMENT_TYPES = ['league', 'group', 'knockout'] as const;
export const REGIONS = ['europe', 'southAmerica', 'northAmerica', 'asia', 'africa', 'oceania'] as const;
export const NATIONAL_COMPETITIONS = [
  'worldCup',
  'euroCup',
  'copaAmerica',
  'concacafCup',
  'africaNationsCup',
  'asianCup',
  'ofkNationsCup'
] as const;
export const CLUB_COMPETITIONS = ['england', 'germany', 'spain', 'italy', 'france'] as const;

export const LEAGUE_AVAILABLE_TEAMS_COUNT = [8, 10, 12, 14, 16, 18, 20, 22, 24] as const;
export const GROUP_AVAILABLE_TEAMS_COUNT = [8, 16, 32, 64] as const;
export const KNOCKOUT_AVAILABLE_TEAMS_COUNT = [4, 8, 16, 32, 64] as const;

export const TEAM_ORDERS = ['default', 'alphabetical', 'draw'] as const;
