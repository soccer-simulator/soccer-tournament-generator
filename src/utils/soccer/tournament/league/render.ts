import { jsPDF as Pdf } from 'jspdf';

import { LeagueTournament } from '../../../../types/soccer.ts';
import { renderChampionshipTable } from '../championship/render.ts';
import { pagePaddingVertical } from '../const.ts';
import { renderMatchDays } from '../match.ts';
import { getTableSizes } from '../render.ts';
import { RenderTournamentOptions } from '../types.ts';

export function renderLeagueTournament(
  tournament: LeagueTournament,
  pdf: Pdf,
  options?: RenderTournamentOptions
): void {
  const { renderLeagueMatchDays = false } = options ?? {};

  const { teams, matchDays } = tournament;

  const shiftY = renderChampionshipTable(teams, pdf, {
    shiftY: pagePaddingVertical
  });

  if (renderLeagueMatchDays) {
    renderMatchDays(matchDays, pdf, { shiftY: shiftY + getTableSizes().gap });
  }
}
