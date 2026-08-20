import { jsPDF as Pdf } from 'jspdf';
import autoTable, { RowInput, Styles } from 'jspdf-autotable';

import { RenderOptions, Team } from '../../../../types/soccer.ts';
import {
  applyTableRenderOptions,
  getPageRenderWidth,
  getTableHeight,
  getTableSizes,
  resolveRenderShiftY,
  resolveRenderWidth
} from '../render.ts';
import { defaultTableHeadStyles, getDefaultTableStyles } from '../table.ts';

const NUMBER_CELL_WIDTH = 25;
const RESULT_CELL_WIDTH = 30;
const MATCH_RESULT_CELL_WIDTH = 25;
const GOALS_CELL_WIDTH = 25;
const POINTS_CELL_WIDTH = 25;
const PLACE_CELL_WIDTH = 25;
const TEAM_CELL_WIDTH = 90;

export type ChampionshipTableRenderOptions = RenderOptions & {
  staging?: boolean;
  stagingPrefix?: string;
};

function getChampionshipTableNaturalWidth(teamsCount: number, staging: boolean): number {
  if (staging) {
    return NUMBER_CELL_WIDTH + TEAM_CELL_WIDTH;
  }
  return (
    NUMBER_CELL_WIDTH +
    TEAM_CELL_WIDTH +
    teamsCount * RESULT_CELL_WIDTH +
    3 * MATCH_RESULT_CELL_WIDTH +
    3 * GOALS_CELL_WIDTH +
    POINTS_CELL_WIDTH +
    PLACE_CELL_WIDTH
  );
}

function resolveChampionshipTableScale(
  teamsCount: number,
  staging: boolean,
  availableWidth: number,
  options?: RenderOptions
): number {
  if (options?.scale !== undefined) {
    return options.scale;
  }
  const naturalWidth = getChampionshipTableNaturalWidth(teamsCount, staging);
  return Math.min(1, availableWidth / naturalWidth);
}

export function renderChampionshipTable(
  teams: Array<Team>,
  pdf: Pdf,
  options?: ChampionshipTableRenderOptions
): number {
  const shiftY = resolveRenderShiftY(options);
  const { staging = false, stagingPrefix } = options || {};

  const width = resolveRenderWidth(options);
  const availableWidth = typeof width === 'number' ? width : getPageRenderWidth(pdf);
  const scale = resolveChampionshipTableScale(teams.length, staging, availableWidth, options);

  const matchResultCellStyles: Partial<Styles> = { cellWidth: MATCH_RESULT_CELL_WIDTH * scale, halign: 'center' };
  const goalsCellStyles: Partial<Styles> = { cellWidth: GOALS_CELL_WIDTH * scale, halign: 'center' };

  const headRow: RowInput = {
    number: { content: '№', styles: { cellWidth: NUMBER_CELL_WIDTH * scale, halign: 'right' } },
    team: {
      content: 'Команда',
      styles: { halign: 'left', ...(scale !== 1 ? { cellWidth: TEAM_CELL_WIDTH * scale } : {}) }
    }
  };

  if (!staging) {
    teams.forEach((team, index) => {
      const { shortName } = team;
      const key = `team-${index + 1}`;
      headRow[key] = {
        content: shortName ? `${index + 1}\n${shortName}` : `${index + 1}`,
        styles: { cellWidth: RESULT_CELL_WIDTH * scale, halign: 'center', fontSize: (shortName ? 7 : 12) * scale }
      };
    });
    headRow['wins'] = { content: 'В', styles: matchResultCellStyles };
    headRow['draws'] = { content: 'Н', styles: matchResultCellStyles };
    headRow['defeats'] = { content: 'П', styles: matchResultCellStyles };
    headRow['goalsScored'] = { content: 'ЗМ', styles: goalsCellStyles };
    headRow['goalsMissed'] = { content: 'ПМ', styles: goalsCellStyles };
    headRow['goalsDifference'] = { content: 'РМ', styles: goalsCellStyles };
    headRow['points'] = { content: 'О', styles: { cellWidth: POINTS_CELL_WIDTH * scale, halign: 'center' } };
    headRow['place'] = { content: 'М', styles: { cellWidth: PLACE_CELL_WIDTH * scale, halign: 'center' } };
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

  const tableOptions = applyTableRenderOptions(pdf, { ...options, shiftY: shiftY + getTableSizes(scale).gap });

  autoTable(pdf, {
    theme: 'grid',
    styles: getDefaultTableStyles(scale),
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

  return tableOptions.startY + getTableHeight(teams.length + 1, scale, true);
}
