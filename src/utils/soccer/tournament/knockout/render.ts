import { jsPDF as Pdf } from 'jspdf';

import { KnockoutTournament, Match, RenderOptions, Team } from '../../../../types/soccer.ts';
import { pagePaddingVertical } from '../const.ts';
import { renderMatchTable } from '../match.ts';
import {
  getPageRenderSize,
  getPageRenderWidth,
  getTableHeight,
  getTableSizes,
  resolveRenderScale,
  resolveRenderShiftX,
  resolveRenderShiftY,
  resolveRenderWidth
} from '../render.ts';

export function getKnockoutRoundsCount(teamsCount: number): number {
  let count = teamsCount;
  let roundsCount = 0;
  while (count > 1) {
    count /= 2;
    roundsCount += 1;
  }

  if (count !== 1) {
    throw new TypeError(`Invalid count of teams (${count}) for knockout tournament`);
  }

  return roundsCount;
}

export function getKnockoutMatchWidthByCount(pdf: Pdf, matchesCount: number, scale = 1): number {
  return (getPageRenderSize(pdf).width - (matchesCount - 1) * getTableSizes(scale).gap) / matchesCount;
}

type KnockoutStageRenderOptions = RenderOptions & {
  matchWidth: number;
  roundsCount: number;
  round?: number;
};

export function renderKnockoutStage(teams: Array<Team>, pdf: Pdf, options: KnockoutStageRenderOptions): void {
  const scale = resolveRenderScale(options);
  const width = resolveRenderWidth(options);
  const shiftX = resolveRenderShiftX(options);
  const shiftY = resolveRenderShiftY(options);

  const { matchWidth, roundsCount, round = 0 } = options;

  const matches: Array<Match> = [];
  for (let i = 0; i < teams.length / 2; i += 1) {
    matches.push({ team1: teams[2 * i], team2: teams[2 * i + 1] });
  }

  const stageWidth = width === 'auto' ? getPageRenderSize(pdf).width : width;
  const matchTableHeight = getTableHeight(2, scale, true);

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const firstHalf = i < matches.length / 2;
    const shiftIndex = firstHalf ? i : i - matches.length / 2;

    renderMatchTable(match, pdf, {
      ...options,
      width: matchWidth,
      shiftX: firstHalf ? shiftX : shiftX + stageWidth - matchWidth,
      shiftY: shiftY + shiftIndex * Math.pow(2, round) * matchTableHeight
    });
  }

  if (teams.length > 4) {
    const nextRoundTeams: Array<Team> = [];
    for (let i = 0; i < teams.length / 2; i += 1) {
      nextRoundTeams.push({ id: i + 1, name: '' });
    }
    const tableGap = getTableSizes(scale).gap;

    renderKnockoutStage(nextRoundTeams, pdf, {
      scale,
      width: stageWidth - 2 * (matchWidth + tableGap),
      shiftX: shiftX + matchWidth + tableGap,
      shiftY:
        shiftY +
        (round > 0 ? Math.pow(2, round - 1) : 1) * getTableHeight(2, scale, true) -
        (round === 0 ? getTableHeight(2, scale, true) / 2 : 0),
      matchWidth,
      roundsCount,
      round: round + 1
    });
  }
}

export function renderKnockoutTournament(tournament: KnockoutTournament, pdf: Pdf): void {
  const { teams } = tournament;

  const roundsCount = getKnockoutRoundsCount(teams.length);

  let scale: number = 1;
  let matchWidth: number;
  if (roundsCount >= 4) {
    if (roundsCount === 5) {
      scale = 0.75;
    } else if (roundsCount === 6) {
      scale = 0.3;
    } else {
      // TODO: consider alternative rendering
    }
    matchWidth = getKnockoutMatchWidthByCount(pdf, 2 * (roundsCount - 1), scale);
  } else {
    matchWidth = getKnockoutMatchWidthByCount(pdf, 2 * roundsCount - 1, scale);
  }

  renderKnockoutStage(teams, pdf, {
    scale,
    shiftY: pagePaddingVertical,
    matchWidth,
    roundsCount
  });

  if (roundsCount >= 4) {
    const shiftX = (getPageRenderWidth(pdf) - matchWidth) / 2;
    const tableGap = getTableSizes(scale).gap;
    const height =
      Math.pow(2, roundsCount - 3) * getTableHeight(2, scale, true) - getTableHeight(1, scale) - 0.5 * tableGap;
    const finalShiftY = (height - getTableHeight(2, scale, true)) / 2;
    const thirdShiftY =
      Math.pow(2, roundsCount - 2) * getTableHeight(2, scale, true) - finalShiftY - getTableHeight(2, scale, true);

    renderMatchTable({ team1: { id: 1, name: '' }, team2: { id: 2, name: '' } }, pdf, {
      scale,
      width: matchWidth,
      shiftX,
      shiftY: pagePaddingVertical + finalShiftY
    });

    renderMatchTable({ team1: { id: 1, name: '' }, team2: { id: 2, name: '' } }, pdf, {
      scale,
      width: matchWidth,
      shiftX,
      shiftY: pagePaddingVertical + thirdShiftY
    });
  }
}
