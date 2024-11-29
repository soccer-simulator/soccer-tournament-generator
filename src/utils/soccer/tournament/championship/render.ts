import { jsPDF as Pdf } from 'jspdf';
import autoTable, { RowInput, Styles } from 'jspdf-autotable';

import { RenderOptions, Team } from '../../../../types/soccer.ts';
import { defaultTableHeadStyles, defaultTableStyles, tableGap } from '../const.ts';
import { applyTableRenderOptions, getTableHeight, resolveRenderShiftY } from '../render.ts';

const numberCellWidth = 25;
const resultCellWidth = 30;
const matchResultCellWidth = 25;
const goalsCellWidth = 25;
const pointsCellWidth = 25;
const placeCellWidth = 25;

const matchResultCellStyles: Partial<Styles> = { cellWidth: matchResultCellWidth, halign: 'center' };
const goalsCellStyles: Partial<Styles> = { cellWidth: goalsCellWidth, halign: 'center' };

export type ChampionshipTableRenderOptions = RenderOptions & {
  staging?: boolean;
  stagingPrefix?: string;
};

export function renderChampionshipTable(
  teams: Array<Team>,
  pdf: Pdf,
  options?: ChampionshipTableRenderOptions
): number {
  const shiftY = resolveRenderShiftY(options);
  const { staging = false, stagingPrefix } = options || {};

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
    const bodyRow: RowInput = {
      number: { content: `${staging && stagingPrefix ? stagingPrefix : ''}${index + 1}`, styles: { halign: 'right' } }
    };
    if (!staging) {
      bodyRow['team'] = { content: team.name, styles: { halign: 'left' } };
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
      const teamNumber =
        data.column.index >= 2 && data.column.index <= 2 + teams.length - 1 ? data.column.index - 1 : 0;
      if (data.row.section === 'body' && data.row.index === teamNumber - 1) {
        pdf.setFillColor(100, 173, 201);
      }
    }
  });

  return tableOptions.startY + getTableHeight(teams.length + 1, true);
}
