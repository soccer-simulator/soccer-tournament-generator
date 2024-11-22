export const tournamentTypes = ['league', 'group', 'knockout'] as const;

export const leagueAvailableTeamsCount = [8, 10, 12, 14, 16, 18, 20, 22, 24] as const;
export const groupAvailableTeamsCount = [8, 16, 32, 64] as const;
export const knockoutAvailableTeamsCount = [4, 8, 16, 32, 64, 128] as const;
