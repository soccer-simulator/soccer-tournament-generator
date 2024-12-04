import { jsPDF as Pdf } from 'jspdf';

import { KnockoutTournament, Match, RenderOptions, Team } from '../../../../types/soccer.ts';
import { pagePaddingVertical, tableGap } from '../const.ts';
import { renderMatchTable } from '../match.ts';
import {
  getPageRenderSize,
  getTableHeight,
  resolveRenderShiftX,
  resolveRenderShiftY,
  resolveRenderWidth
} from '../render.ts';

type KnockoutStageRenderOptions = RenderOptions & {
  round?: number;
};

export function renderKnockoutStage(teams: Array<Team>, pdf: Pdf, options?: KnockoutStageRenderOptions): void {
  const width = resolveRenderWidth(options);
  const shiftX = resolveRenderShiftX(options);
  const shiftY = resolveRenderShiftY(options);
  const { round = 0 } = options || {};

  const matches: Array<Match> = [];
  for (let i = 0; i < teams.length / 2; i += 1) {
    matches.push({ team1: teams[2 * i], team2: teams[2 * i + 1] });
  }

  const stageWidth = width === 'auto' ? getPageRenderSize(pdf).width : width;
  const matchWidth = 100;
  const matchTableHeight = getTableHeight(2, true);

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    if (i < matches.length / 2) {
      renderMatchTable(match, pdf, {
        ...options,
        width: matchWidth,
        shiftX,
        shiftY: shiftY + (i + (round > 0 && i > 0 ? 1 : 0)) * matchTableHeight
      });
    } else {
      const j = i - matches.length / 2;
      renderMatchTable(match, pdf, {
        ...options,
        width: matchWidth,
        shiftX: shiftX + stageWidth - matchWidth,
        shiftY: shiftY + (j + (round > 0 && j > 0 ? 1 : 0)) * matchTableHeight
      });
    }
  }

  if (teams.length > 4) {
    const nextRoundTeams: Array<Team> = [];
    for (let i = 0; i < teams.length / 2; i += 1) {
      nextRoundTeams.push({ id: i + 1, name: '' });
    }
    renderKnockoutStage(nextRoundTeams, pdf, {
      width: stageWidth - 2 * (matchWidth + tableGap),
      shiftX: shiftX + matchWidth + tableGap,
      shiftY: shiftY + (getTableHeight(1) + tableGap / 2),
      round: round + 1
    });
  }
}

export function renderKnockoutTournament(tournament: KnockoutTournament, pdf: Pdf): void {
  const { teams } = tournament;

  let count = teams.length;
  while (count > 1) {
    count /= 2;
  }

  if (count !== 1) {
    throw new TypeError(`Invalid count of teams (${count}) for knockout tournament`);
  }

  renderKnockoutStage(teams, pdf, { shiftY: pagePaddingVertical });
}
