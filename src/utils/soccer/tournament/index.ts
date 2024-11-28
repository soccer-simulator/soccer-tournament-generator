import { jsPDF as Pdf } from 'jspdf';

import ubuntuMediumUrl from '../../../assets/Ubuntu-Medium.ttf';
import ubuntuRegularUrl from '../../../assets/Ubuntu-Regular.ttf';
import { Tournament, TournamentType } from '../../../types/soccer.ts';
import { extractBinaryFileDataFromBase64, loadBinaryFileAsBase64 } from '../../fs.ts';

import { generateGroupTournament } from './group/generate.ts';
import { renderGroupTournament } from './group/render.ts';
import { generateKnockoutTournament, renderKnockoutTournament } from './knockout.ts';
import { generateLeagueTournament, renderLeagueTournament } from './league.ts';

export function generateTournament(type: TournamentType, teamsCount: number): Tournament {
  if (type === 'league') {
    return { type, ...generateLeagueTournament(teamsCount) };
  }
  if (type === 'group') {
    return { type, ...generateGroupTournament(teamsCount) };
  }
  if (type === 'knockout') {
    return { type, ...generateKnockoutTournament(teamsCount) };
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

export async function generateTournamentPdf(type: TournamentType, teamsCount: number): Promise<void> {
  const tournament = generateTournament(type, teamsCount);
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
  console.log(tournament);
  pdf.save('tournament.pdf');
}
