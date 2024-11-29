import { jsPDF as Pdf } from 'jspdf';
import { TableWidthType, UserOptions } from 'jspdf-autotable';

import { RenderOptions } from '../../../types/soccer.ts';

import { pagePaddingHorizontal, pagePaddingVertical, tableCellHeight, tableGap } from './const.ts';

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

export function getTableHeight(rowsCount: number, addGap = false): number {
  return rowsCount * tableCellHeight + (addGap ? tableGap : 0);
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
