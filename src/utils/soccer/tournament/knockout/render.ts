import { jsPDF as Pdf } from 'jspdf';

import { KnockoutTournament, Match, RenderOptions, Team } from '../../../../types/soccer.ts';
import { headerSize1, headerSize2, pagePaddingVertical } from '../const.ts';
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
import { renderText } from '../text.ts';

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
  return (getPageRenderSize(pdf).width - matchesCount * getTableSizes(scale).gap) / matchesCount;
}

type KnockoutStageRenderOptions = RenderOptions & {
  matchWidth: number;
  roundsCount: number;
  round?: number;
};

export function renderKnockoutStage(teams: Array<Team>, pdf: Pdf, options: KnockoutStageRenderOptions): number {
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
      nextRoundTeams.push({ id: i + 1, name: '', shortName: '' });
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

  return shiftY + Math.pow(2, roundsCount - 2) * getTableHeight(2, scale, true);
}

export function renderKnockout(teams: Array<Team>, pdf: Pdf, options?: RenderOptions): void {
  const shiftY = resolveRenderShiftY(options);

  const roundsCount = getKnockoutRoundsCount(teams.length);

  let scale: number = 1;
  if (roundsCount === 4) {
    scale = 0.9;
  } else if (roundsCount === 5) {
    scale = 0.75;
  } else if (roundsCount === 6) {
    scale = 0.3;
  } else {
    // TODO: consider alternative rendering
  }

  const matchWidth = getKnockoutMatchWidthByCount(pdf, 2 * (roundsCount - 1), scale);

  const afterShiftY = renderKnockoutStage(teams, pdf, {
    scale,
    shiftY,
    matchWidth,
    roundsCount
  });

  const tableGap = getTableSizes(scale).gap;

  if (roundsCount > 4) {
    const shiftX = (getPageRenderWidth(pdf) - matchWidth) / 2;

    const matchHeight =
      Math.pow(2, roundsCount - 3) * getTableHeight(2, scale, true) - getTableHeight(1, scale) - tableGap - headerSize2;

    const finalShiftY = (matchHeight - getTableHeight(2, scale, true)) / 2;
    const thirdShiftY =
      (Math.pow(2, roundsCount - 2) - 1) * getTableHeight(2, scale, true) - 0.5 * tableGap - headerSize2 - finalShiftY;

    renderText('Финал', pdf, {
      fontSize: headerSize2,
      fontStyle: 'bold',
      shiftX: shiftX + matchWidth / 2,
      shiftY: shiftY + finalShiftY,
      options: { align: 'center' }
    });

    renderMatchTable({ team1: { id: 1, name: '', shortName: '' }, team2: { id: 2, name: '', shortName: '' } }, pdf, {
      scale,
      width: matchWidth,
      shiftX,
      shiftY: shiftY + finalShiftY + headerSize2 + 0.5 * tableGap
    });

    renderText('3-е место', pdf, {
      fontSize: headerSize2,
      fontStyle: 'bold',
      shiftX: shiftX + matchWidth / 2,
      shiftY: shiftY + thirdShiftY,
      options: { align: 'center' }
    });

    renderMatchTable({ team1: { id: 1, name: '', shortName: '' }, team2: { id: 2, name: '', shortName: '' } }, pdf, {
      scale,
      width: matchWidth,
      shiftX,
      shiftY: shiftY + thirdShiftY + headerSize2 + 0.5 * tableGap
    });
  } else {
    const matchWidth = getPageRenderWidth(pdf) / 3;

    const thirdShiftX = getPageRenderWidth(pdf) * 0.25;
    const finalShiftX = getPageRenderWidth(pdf) * 0.75;

    const matchShiftY = renderText('3-е место', pdf, {
      fontSize: headerSize1,
      fontStyle: 'bold',
      shiftX: thirdShiftX,
      shiftY: afterShiftY,
      options: { align: 'center' }
    });

    renderMatchTable({ team1: { id: 1, name: '', shortName: '' }, team2: { id: 2, name: '', shortName: '' } }, pdf, {
      scale,
      width: matchWidth,
      shiftX: thirdShiftX - matchWidth / 2,
      shiftY: matchShiftY + tableGap
    });

    renderText('Финал', pdf, {
      fontSize: headerSize1,
      fontStyle: 'bold',
      shiftX: finalShiftX,
      shiftY: afterShiftY,
      options: { align: 'center' }
    });

    renderMatchTable({ team1: { id: 1, name: '', shortName: '' }, team2: { id: 2, name: '', shortName: '' } }, pdf, {
      scale,
      width: matchWidth,
      shiftX: finalShiftX - matchWidth / 2,
      shiftY: matchShiftY + tableGap
    });
  }
}

export function renderKnockoutTournament(tournament: KnockoutTournament, pdf: Pdf): void {
  const shiftY = renderText('Кубок', pdf, {
    fontSize: headerSize1,
    fontStyle: 'bold',
    shiftX: getPageRenderWidth(pdf) / 2,
    shiftY: pagePaddingVertical,
    options: { align: 'center' }
  });
  renderKnockout(tournament.teams, pdf, { shiftY: shiftY + getTableSizes().gap });
}
