import { jsPDF as Pdf } from 'jspdf';

import ubuntuRegularUrl from '../assets/Ubuntu-Regular.ttf';
import {
  groupAvailableTeamsCount,
  knockoutAvailableTeamsCount,
  leagueAvailableTeamsCount
} from '../constants/soccer.ts';
import { TournamentType } from '../types/soccer.ts';

import { extractBinaryFileDataFromBase64, loadBinaryFileAsBase64 } from './fs.ts';
import { createMapFn } from './map.ts';

export const getTournamentTypeLabel = createMapFn<TournamentType, string>({
  league: 'Лига',
  group: 'Групповой турнир + Плей-офф',
  knockout: 'Кубок'
});

export const getTournamentTypeAvailableTeamsCount = createMapFn<TournamentType, ReadonlyArray<number>>({
  league: leagueAvailableTeamsCount,
  group: groupAvailableTeamsCount,
  knockout: knockoutAvailableTeamsCount
});

export async function generateTournament(type: TournamentType, teamsCount: number): Promise<void> {
  const fontBinary = await loadBinaryFileAsBase64(ubuntuRegularUrl);
  const { data: fontData } = extractBinaryFileDataFromBase64(fontBinary);
  const pdf = new Pdf({ orientation: 'landscape', format: 'a4', unit: 'mm' });
  pdf.addFileToVFS('Ubuntu-Regular.ttf', fontData);
  pdf.addFont('Ubuntu-Regular.ttf', 'Ubuntu', 'normal');
  pdf.setFont('Ubuntu');
  pdf.setFontSize(22);
  pdf.text(getTournamentTypeLabel(type), 10, 20);
  pdf.save('tournament.pdf');
}
