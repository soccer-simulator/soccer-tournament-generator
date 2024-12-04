import { Color, Styles } from 'jspdf-autotable';

export const headerSize1 = 22;
export const headerSize2 = 16;

export const tablePrimaryColor: Color = [6, 122, 165] as const;
export const tableCellHeight = 20;
export const tableGap = 12;

export const pagePaddingHorizontal = 20;
export const pagePaddingVertical = 20;

export const defaultTableStyles: Partial<Styles> = {
  font: 'Ubuntu',
  fontStyle: 'normal',
  fontSize: 12,
  lineColor: tablePrimaryColor,
  minCellHeight: tableCellHeight,
  valign: 'middle'
};

export const defaultTableHeadStyles: Partial<Styles> = { fontStyle: 'bold', fillColor: tablePrimaryColor };
