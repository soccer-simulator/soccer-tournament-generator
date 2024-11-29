import { jsPDF as Pdf } from 'jspdf';

import { LeagueTournament } from '../../../../types/soccer.ts';
import { renderChampionshipTable } from '../championship/render.ts';
import { pagePaddingVertical, tableGap } from '../const.ts';
import { renderMatchDays } from '../match.ts';

export function renderLeagueTournament(tournament: LeagueTournament, pdf: Pdf): void {
  const { teams, matchDays } = tournament;

  const shiftY = renderChampionshipTable(teams, pdf, {
    shiftY: pagePaddingVertical
  });

  renderMatchDays(matchDays, pdf, { shiftY: shiftY + tableGap });
}
