import { jsPDF as Pdf } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Match, MatchDay, RenderOptions } from '../../../types/soccer.ts';

import { headerSize2, pagePaddingVertical } from './const.ts';
import {
  applyTableRenderOptions,
  getPageAvailableRenderHeight,
  getPageRenderWidth,
  getTableHeight,
  getTableSizes,
  resolveRenderScale,
  resolveRenderShiftX,
  resolveRenderShiftY,
  resolveRenderWidth
} from './render.ts';
import { getDefaultTableStyles } from './table.ts';
import { renderText } from './text.ts';

export function getMatchScoreCellWidth(scale: number) {
  return scale * 25;
}

export function renderMatchTable(match: Match, pdf: Pdf, options?: RenderOptions): void {
  const { team1, team2, score1, score2 } = match;

  const scale = resolveRenderScale(options);
  const scoreCellWidth = getMatchScoreCellWidth(scale);

  autoTable(pdf, {
    theme: 'grid',
    ...applyTableRenderOptions(pdf, options),
    styles: getDefaultTableStyles(scale),
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
  const scale = resolveRenderScale(options);
  const width = resolveRenderWidth(options);
  const shiftX = resolveRenderShiftX(options);
  let shiftY = resolveRenderShiftY(options);
  const { matchesPerRow = 4 } = options || {};

  const tableHeight = getTableHeight(2, scale);
  const tableGap = getTableSizes(scale).gap;

  const renderWidth = typeof width === 'number' ? width : getPageRenderWidth(pdf);

  if (getPageAvailableRenderHeight(shiftY, pdf) < headerSize2 + tableGap + tableHeight) {
    pdf.addPage();
    shiftY = pagePaddingVertical;
  }

  const { number, matches } = matchDay;
  shiftY =
    renderText(`Тур ${number}`, pdf, {
      shiftX,
      shiftY,
      font: 'Ubuntu',
      fontStyle: 'bold',
      fontSize: headerSize2
    }) + tableGap;

  const rowsCount = Math.ceil(matches.length / matchesPerRow);

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const width = (renderWidth - (matchesPerRow - 1) * tableGap) / matchesPerRow;

    const rowIndex = Math.floor(i / matchesPerRow);
    const columnIndex = i % matchesPerRow;

    if (columnIndex === 0 && getPageAvailableRenderHeight(shiftY, pdf) < tableHeight) {
      pdf.addPage();
      shiftY = pagePaddingVertical;
    }

    renderMatchTable(match, pdf, {
      width,
      shiftX: shiftX + columnIndex * (width + tableGap),
      shiftY: shiftY + rowIndex * (tableHeight + tableGap)
    });
  }

  return shiftY + rowsCount * (tableHeight + tableGap);
}

export function renderMatchDays(matchDays: Array<MatchDay>, pdf: Pdf, options?: RenderOptions): number {
  let shiftY = resolveRenderShiftY(options);
  matchDays.forEach((matchDay) => {
    shiftY = renderMatchDay(matchDay, pdf, { ...options, width: getPageRenderWidth(pdf), shiftY: shiftY });
  });
  return shiftY;
}
