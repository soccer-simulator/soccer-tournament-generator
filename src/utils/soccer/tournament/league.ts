import { jsPDF as Pdf } from 'jspdf';

import { LeagueTournament } from '../../../types/soccer.ts';

export function generateLeagueTournament(teamsCount: number): LeagueTournament {
  return { teams: [] };
}

export function renderLeagueTournament(tournament: LeagueTournament, pdf: Pdf): void {}
