import { jsPDF as Pdf, TextOptionsLight } from 'jspdf';

import { RenderOptions } from '../../../types/soccer.ts';

import { pagePaddingHorizontal } from './const.ts';
import { resolveRenderShiftX, resolveRenderShiftY } from './render.ts';

type TextRenderOptions = Pick<RenderOptions, 'shiftX' | 'shiftY'> & {
  fontSize: number;
  font?: string;
  fontStyle?: string;
  options?: TextOptionsLight;
};

export function renderText(text: string, pdf: Pdf, options: TextRenderOptions): number {
  const shiftX = resolveRenderShiftX(options);
  const shiftY = resolveRenderShiftY(options);
  const { font, fontStyle, fontSize, options: opts } = options || {};
  if (font !== undefined) {
    pdf.setFont(font, fontStyle);
  }
  pdf.setFontSize(fontSize);
  pdf.text(text, pagePaddingHorizontal + shiftX, shiftY + fontSize, opts);
  return shiftY + fontSize;
}
