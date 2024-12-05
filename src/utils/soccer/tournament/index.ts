import { jsPDF as Pdf } from 'jspdf';

import ubuntuMediumUrl from '../../../assets/Ubuntu-Medium.ttf';
import ubuntuRegularUrl from '../../../assets/Ubuntu-Regular.ttf';
import { Team, Tournament, TournamentType } from '../../../types/soccer.ts';
import { extractBinaryFileDataFromBase64, loadBinaryFileAsBase64 } from '../../fs.ts';

import { generateGroupTournament } from './group/generate.ts';
import { renderGroupTournament } from './group/render.ts';
import { generateKnockoutTournament } from './knockout/generate.ts';
import { renderKnockoutTournament } from './knockout/render.ts';
import { generateLeagueTournament } from './league/generate.ts';
import { renderLeagueTournament } from './league/render.ts';

export function generateTournament(type: TournamentType, teamsCount: number, teams: Array<Team> = []): Tournament {
  if (type === 'league') {
    return { type, ...generateLeagueTournament(teamsCount, teams) };
  }
  if (type === 'group') {
    return { type, ...generateGroupTournament(teamsCount, teams) };
  }
  if (type === 'knockout') {
    return { type, ...generateKnockoutTournament(teamsCount, teams) };
  }
  throw new TypeError(`Tournament type "${type}" is not supported`);
}

export function renderTournament(tournament: Tournament, pdf: Pdf): void {
  const { type } = tournament;
  if (type === 'league') {
    renderLeagueTournament(tournament, pdf);
  } else if (type === 'group') {
    renderGroupTournament(tournament, pdf);
  } else if (type === 'knockout') {
    renderKnockoutTournament(tournament, pdf);
  }
}

export async function generateTournamentPdf(
  type: TournamentType,
  teamsCount: number,
  teams: Array<Team> = []
): Promise<void> {
  const tournament = generateTournament(type, teamsCount, teams);
  const fontBinaries = await Promise.all([
    loadBinaryFileAsBase64(ubuntuRegularUrl),
    loadBinaryFileAsBase64(ubuntuMediumUrl)
  ]);
  const [ubuntuRegular, ubuntuMedium] = fontBinaries.map(extractBinaryFileDataFromBase64);
  const pdf = new Pdf({ orientation: 'landscape', format: 'a4', unit: 'px' });
  pdf.addFileToVFS('Ubuntu-Regular.ttf', ubuntuRegular.data);
  pdf.addFont('Ubuntu-Regular.ttf', 'Ubuntu', 'normal');
  pdf.addFileToVFS('Ubuntu-Medium.ttf', ubuntuMedium.data);
  pdf.addFont('Ubuntu-Medium.ttf', 'Ubuntu', 'bold');
  pdf.setFont('Ubuntu');
  renderTournament(tournament, pdf);
  pdf.save('tournament.pdf');
}
