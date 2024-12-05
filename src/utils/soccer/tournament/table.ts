import { Styles } from 'jspdf-autotable';

import { tablePrimaryColor } from './const.ts';
import { getTableSizes } from './render.ts';

export function getDefaultTableStyles(scale: number): Partial<Styles> {
  return {
    font: 'Ubuntu',
    fontStyle: 'normal',
    fontSize: 12 * scale,
    lineColor: tablePrimaryColor,
    minCellHeight: getTableSizes(scale).cellHeight,
    valign: 'middle',
    overflow: 'hidden'
  };
}

export const defaultTableHeadStyles: Partial<Styles> = { fontStyle: 'bold', fillColor: tablePrimaryColor };
