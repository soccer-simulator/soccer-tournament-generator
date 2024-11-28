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

export function renderMatchTable(match: Match, pdf: Pdf, options?: RenderOptions): void {
  const { team1, team2, score1, score2 } = match;
  autoTable(pdf, {
    theme: 'grid',
    ...applyTableRenderOptions(pdf, options),
    styles: defaultTableStyles,
    body: [
      [team1.name, score1 || ''],
      [team2.name, score2 || '']
    ]
  });
}

export function renderMatchDay(matchDay: MatchDay, pdf: Pdf, options?: RenderOptions): number {
  const width = resolveRenderWidth(options);
  const shiftX = resolveRenderShiftX(options);
  const shiftY = resolveRenderShiftY(options);

  const renderWidth = typeof width === 'number' ? width : getPageRenderWidth(pdf);

  const matchesPerRow = 2;

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

  return shiftY + headerSize2 + tableGap + (matches.length / matchesPerRow) * getTableHeight(2, true);
}
