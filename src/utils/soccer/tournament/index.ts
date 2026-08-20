import { jsPDF as Pdf } from 'jspdf';

import ubuntuMediumUrl from '../../../assets/Ubuntu-Medium.ttf';
import ubuntuRegularUrl from '../../../assets/Ubuntu-Regular.ttf';
import { Tournament, TournamentType } from '../../../types/soccer.ts';
import { extractBinaryFileDataFromBase64, loadBinaryFileAsBase64 } from '../../fs.ts';

import { generateGroupTournament } from './group/generate.ts';
import { renderGroupTournament } from './group/render.ts';
import { generateKnockoutTournament } from './knockout/generate.ts';
import { renderKnockoutTournament } from './knockout/render.ts';
import { generateLeagueTournament } from './league/generate.ts';
import { renderLeagueTournament } from './league/render.ts';
import { TournamentOptions } from './types.ts';

export function generateTournament(type: TournamentType, options: TournamentOptions): Tournament {
  if (type === 'league') {
    return { type, ...generateLeagueTournament(options) };
  }
  if (type === 'group') {
    return { type, ...generateGroupTournament(options) };
  }
  if (type === 'knockout') {
    return { type, ...generateKnockoutTournament(options) };
  }
  throw new TypeError(`Tournament type "${type}" is not supported`);
}

export function renderTournament(tournament: Tournament, pdf: Pdf, options?: TournamentOptions): void {
  const { type } = tournament;
  if (type === 'league') {
    renderLeagueTournament(tournament, pdf, options);
  } else if (type === 'group') {
    renderGroupTournament(tournament, pdf);
  } else if (type === 'knockout') {
    renderKnockoutTournament(tournament, pdf);
  }
}

export async function generateTournamentPdf(type: TournamentType, options: TournamentOptions): Promise<void> {
  const tournament = generateTournament(type, options);
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
  renderTournament(tournament, pdf, options);
  pdf.save('tournament.pdf');
}
