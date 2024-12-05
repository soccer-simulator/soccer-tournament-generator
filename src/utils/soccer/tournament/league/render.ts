import { jsPDF as Pdf } from 'jspdf';

import { LeagueTournament } from '../../../../types/soccer.ts';
import { renderChampionshipTable } from '../championship/render.ts';
import { pagePaddingVertical } from '../const.ts';
import { renderMatchDays } from '../match.ts';
import { getTableSizes } from '../render.ts';

export function renderLeagueTournament(tournament: LeagueTournament, pdf: Pdf): void {
  const { teams, matchDays } = tournament;

  const shiftY = renderChampionshipTable(teams, pdf, {
    shiftY: pagePaddingVertical
  });

  renderMatchDays(matchDays, pdf, { shiftY: shiftY + getTableSizes().gap });
}
