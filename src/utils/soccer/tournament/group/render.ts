import { jsPDF as Pdf } from 'jspdf';

import { Group, GroupTournament } from '../../../../types/soccer.ts';
import { ChampionshipTableRenderOptions, renderChampionshipTable } from '../championship/render.ts';
import { headerSize1, pagePaddingVertical } from '../const.ts';
import { renderMatchDays } from '../match.ts';
import { getPageRenderWidth, getTableSizes, resolveRenderShiftY } from '../render.ts';
import { renderText } from '../text.ts';

export type GroupTableRenderOptions = Omit<ChampionshipTableRenderOptions, 'stagingPrefix'>;

export function renderGroupTable(group: Group, pdf: Pdf, options?: GroupTableRenderOptions): number {
  let shiftY = resolveRenderShiftY(options);
  const { name, teams } = group;
  shiftY = renderText(`Группа ${name}`, pdf, { shiftY, font: 'Ubuntu', fontStyle: 'bold', fontSize: headerSize1 });
  return renderChampionshipTable(teams, pdf, { ...options, shiftY, stagingPrefix: name });
}

export function renderGroupTournament(tournament: GroupTournament, pdf: Pdf): void {
  const { groups } = tournament;
  groups.forEach((group, index) => {
    if (index > 0) {
      pdf.addPage();
    }

    const { matchDays } = group;

    const pageWidth = getPageRenderWidth(pdf);
    const stagingWidth = 120;
    const shiftY = renderGroupTable(group, pdf, {
      width: pageWidth - getTableSizes().gap - stagingWidth,
      shiftY: pagePaddingVertical
    });

    renderGroupTable(group, pdf, {
      width: stagingWidth,
      shiftX: pageWidth - stagingWidth,
      shiftY: pagePaddingVertical,
      staging: true
    });

    renderMatchDays(matchDays, pdf, { shiftY });
  });
}
