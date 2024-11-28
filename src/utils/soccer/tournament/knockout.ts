import { jsPDF as Pdf } from 'jspdf';

import { KnockoutTournament } from '../../../types/soccer.ts';

export function generateKnockoutTournament(teamsCount: number): KnockoutTournament {
  return { teams: [] };
}

export function renderKnockoutTournament(tournament: KnockoutTournament, pdf: Pdf): void {}
