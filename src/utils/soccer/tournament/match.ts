import { jsPDF as Pdf } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Match, MatchDay, RenderOptions } from '../../../types/soccer.ts';

import { defaultTableStyles, headerSize2, pagePaddingHorizontal, tableGap } from './const.ts';
import {
  applyTableRenderOptions,
  getPageRenderWidth,
  getTableHeight,
  resolveRenderShiftX,
  resolveRenderShiftY,
  resolveRenderWidth
} from './render.ts';

const scoreCellWidth = 25;

export function renderMatchTable(match: Match, pdf: Pdf, options?: RenderOptions): void {
  const { team1, team2, score1, score2 } = match;
  autoTable(pdf, {
    theme: 'grid',
    ...applyTableRenderOptions(pdf, options),
    styles: defaultTableStyles,
    body: [
      [
        { title: 'team', content: team1.name },
        { title: 'score', content: score1 || '', styles: { cellWidth: scoreCellWidth } }
      ],
      [
        { title: 'team', content: team2.name },
        { title: 'score', content: score2 || '', styles: { cellWidth: scoreCellWidth } }
      ]
    ]
  });
}

type MatchDayRenderOptions = RenderOptions & {
  matchesPerRow?: number;
};

export function renderMatchDay(matchDay: MatchDay, pdf: Pdf, options?: MatchDayRenderOptions): number {
  const width = resolveRenderWidth(options);
  const shiftX = resolveRenderShiftX(options);
  const shiftY = resolveRenderShiftY(options);
  const { matchesPerRow = 2 } = options || {};

  const renderWidth = typeof width === 'number' ? width : getPageRenderWidth(pdf);

  const { number, matches } = matchDay;
  pdf.setFont('Ubuntu', 'bold');
  pdf.setFontSize(headerSize2);
  pdf.text(`Тур ${number}`, pagePaddingHorizontal + shiftX, shiftY + headerSize2);

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const width = (renderWidth - (matchesPerRow - 1) * tableGap) / matchesPerRow;
    const rowIndex = i % matchesPerRow;
    renderMatchTable(match, pdf, {
      width,
      shiftX: shiftX + rowIndex * (width + tableGap),
      shiftY: shiftY + headerSize2 + tableGap
    });
  }

  return shiftY + headerSize2 + tableGap + Math.ceil(matches.length / matchesPerRow) * getTableHeight(2, true);
}
