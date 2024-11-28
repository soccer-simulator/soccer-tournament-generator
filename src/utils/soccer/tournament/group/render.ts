import { jsPDF as Pdf } from 'jspdf';
import autoTable, { RowInput, Styles } from 'jspdf-autotable';

import { Group, GroupTournament, RenderOptions } from '../../../../types/soccer.ts';
import { defaultTableHeadStyles, defaultTableStyles, headerSize1, pagePaddingVertical, tableGap } from '../const.ts';
import { renderMatchDay } from '../match.ts';
import { applyTableRenderOptions, getPageRenderWidth, getTableHeight, resolveRenderShiftY } from '../render.ts';
import { renderText } from '../text.ts';

const numberCellWidth = 25;
const resultCellWidth = 30;
const matchResultCellWidth = 25;
const goalsCellWidth = 25;
const pointsCellWidth = 25;
const placeCellWidth = 25;

const matchResultCellStyles: Partial<Styles> = { cellWidth: matchResultCellWidth, halign: 'center' };
const goalsCellStyles: Partial<Styles> = { cellWidth: goalsCellWidth, halign: 'center' };

type GroupTableRenderOptions = RenderOptions & {
  staging?: boolean;
};

export function renderGroupTable(group: Group, pdf: Pdf, options?: GroupTableRenderOptions): number {
  const { staging = false } = options || {};
  let shiftY = resolveRenderShiftY(options);

  const { name, teams } = group;
  shiftY = renderText(`Группа ${name}`, pdf, { fontSize: headerSize1, shiftY });

  const headRow: RowInput = {
    number: { title: '№', styles: { cellWidth: numberCellWidth, halign: 'right' } },
    team: { title: 'Команда', styles: { halign: 'left' } }
  };

  if (!staging) {
    teams.forEach((_, index) => {
      const key = `team-${index + 1}`;
      headRow[key] = { title: `${index + 1}`, styles: { cellWidth: resultCellWidth, halign: 'center' } };
    });
    headRow['wins'] = { title: 'В', styles: matchResultCellStyles };
    headRow['draws'] = { title: 'Н', styles: matchResultCellStyles };
    headRow['defeats'] = { title: 'П', styles: matchResultCellStyles };
    headRow['goalsScored'] = { title: 'ЗМ', styles: goalsCellStyles };
    headRow['goalsMissed'] = { title: 'ПМ', styles: goalsCellStyles };
    headRow['goalsDifference'] = { title: 'РМ', styles: goalsCellStyles };
    headRow['points'] = { title: 'О', styles: { cellWidth: pointsCellWidth, halign: 'center' } };
    headRow['place'] = { title: 'М', styles: { cellWidth: placeCellWidth, halign: 'center' } };
  }

  const body: Array<RowInput> = teams.map((team, index): RowInput => {
    const { name } = team;
    const bodyRow: RowInput = {
      number: { content: `${index + 1}`, styles: { halign: 'right' } }
    };
    if (!staging) {
      bodyRow['team'] = { content: name, styles: { halign: 'left' } };
    }
    return bodyRow;
  });

  const tableOptions = applyTableRenderOptions(pdf, { ...options, shiftY: shiftY + tableGap });

  autoTable(pdf, {
    theme: 'grid',
    styles: defaultTableStyles,
    headStyles: defaultTableHeadStyles,
    ...tableOptions,
    head: [headRow],
    body,
    willDrawCell: (data) => {
      const teamNumber = data.column.index >= 2 && data.column.index <= 5 ? data.column.index - 1 : 0;
      if (data.row.section === 'body' && data.row.index === teamNumber - 1) {
        pdf.setFillColor(100, 173, 201);
      }
    }
  });

  return tableOptions.startY + getTableHeight(teams.length + 1, true);
}

export function renderGroupMatchDays(group: Group, pdf: Pdf, options?: RenderOptions): number {
  const { matchDays } = group;
  let shiftY = resolveRenderShiftY(options);
  matchDays.forEach((matchDay) => {
    shiftY = renderMatchDay(matchDay, pdf, { ...options, width: getPageRenderWidth(pdf), shiftY: shiftY });
  });
  return shiftY;
}

export function renderGroupTournament(tournament: GroupTournament, pdf: Pdf): void {
  const { groups } = tournament;
  groups.forEach((group) => {
    const pageWidth = getPageRenderWidth(pdf);
    const stagingWidth = 150;
    const shiftY = renderGroupTable(group, pdf, {
      width: pageWidth - tableGap - stagingWidth,
      shiftY: pagePaddingVertical
    });
    renderGroupTable(group, pdf, {
      width: stagingWidth,
      shiftX: pageWidth - stagingWidth,
      shiftY: pagePaddingVertical,
      staging: true
    });
    renderGroupMatchDays(group, pdf, { shiftY });
    pdf.addPage();
  });
}
