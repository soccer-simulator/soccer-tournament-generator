import { jsPDF as Pdf } from 'jspdf';
import { TableWidthType, UserOptions } from 'jspdf-autotable';

import { RenderOptions } from '../../../types/soccer.ts';

import { pagePaddingHorizontal, pagePaddingVertical } from './const.ts';

const baseTableCellHeight = 20;
const baseTableGap = 12;

export function getPageRenderWidth(pdf: Pdf): number {
  return pdf.internal.pageSize.width - 2 * pagePaddingHorizontal;
}

export function getPageRenderHeight(pdf: Pdf): number {
  return pdf.internal.pageSize.height - 2 * pagePaddingVertical;
}

export function getPageRenderSize(pdf: Pdf): { width: number; height: number } {
  return { width: getPageRenderWidth(pdf), height: getPageRenderHeight(pdf) };
}

export function getPageAvailableRenderHeight(shiftY: number, pdf: Pdf): number {
  return getPageRenderHeight(pdf) - shiftY - pagePaddingVertical;
}

type TableSizes = {
  cellHeight: number;
  gap: number;
};

export function getTableSizes(scale = 1): TableSizes {
  return { cellHeight: baseTableCellHeight * scale, gap: baseTableGap * scale };
}

export function getTableHeight(rowsCount: number, scale: number, addGap = false): number {
  return rowsCount * getTableSizes(scale).cellHeight + (addGap ? baseTableGap : 0);
}

export function resolveRenderScale(options?: RenderOptions): number {
  const { scale = 1 } = options || {};
  return scale;
}

export function resolveRenderWidth(options?: RenderOptions): Exclude<TableWidthType, 'wrap'> {
  const { width = 'auto' } = options || {};
  return width;
}

export function resolveRenderShiftX(options?: RenderOptions): number {
  const { shiftX = 0 } = options || {};
  return shiftX;
}

export function resolveRenderShiftY(options?: RenderOptions): number {
  const { shiftY = 0 } = options || {};
  return shiftY;
}

export function applyTableRenderOptions(
  pdf: Pdf,
  options?: RenderOptions
): { tableWidth: number; startY: number } & Required<Pick<UserOptions, 'margin'>> {
  const width = resolveRenderWidth(options);
  const shiftX = resolveRenderShiftX(options);
  const shiftY = resolveRenderShiftY(options);

  return {
    tableWidth: typeof width === 'number' ? width : getPageRenderWidth(pdf),
    startY: shiftY,
    margin: { left: pagePaddingHorizontal + shiftX, right: width === 'auto' ? pagePaddingHorizontal : undefined }
  };
}
