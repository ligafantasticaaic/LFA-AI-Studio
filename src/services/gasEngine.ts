import {
  Player,
  TeamToken,
  LineupEntry,
  LineupPlayerDetail,
  TeamLineupResponse,
  StandingScore,
  TransferRecord,
  DraftRecord,
  ScheduleRecord,
  AccountingData,
  FinalPrize,
  FinalBalanceDetail,
  TeamJornadasReportResponse
} from '../types/league';

// Constants matching Código.gs exactly
export const MAX_TEAM_VALUE = 200;
export const MAX_DRAFT_PLAYERS_PER_TEAM = 11;
export const WEEKLY_CONTRIBUTION = 1.5;
export const TRANSFER_COST = 2;
export const FREE_TRANSFERS_PER_TEAM = 3;
export const ADMIN_PASSWORD = 'admin';

export function parseCleanNumber(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/[^0-9.,-]/g, '').trim();
  if (!str) return 0;
  let normalized = str;
  if (normalized.includes(',') && !normalized.includes('.')) {
    normalized = normalized.replace(',', '.');
  } else if (normalized.includes(',') && normalized.includes('.')) {
    normalized = normalized.replace(/\./g, '').replace(',', '.');
  }
  const n = parseFloat(normalized);
  return isNaN(n) ? 0 : n;
}

// Initial Starter Dataset
const INITIAL_TEAMS: string[] = [
  'Galácticos FC',
  'Tiki-Taka United',
  'La Saeta Rubia',
  'Furia Rojiblanca',
  'Boquerones CF',
  'Dream Team 92',
];

const INITIAL_TOKENS: TeamToken[] = [
  { team: 'Galácticos FC', token: 'a81e9f12-4c22-44b2-9d21-9128aa90c811' },
  { team: 'Tiki-Taka United', token: 'b73d8a45-5e33-41c3-8e32-8239bb01d922' },
  { team: 'La Saeta Rubia', token: 'c64e7b56-6f44-42d4-9f43-7340cc12e033' },
  { team: 'Furia Rojiblanca', token: 'd55f6c67-7a55-43e5-af54-6451dd23f144' },
  { team: 'Boquerones CF', token: 'e46a5d78-8b66-44f6-b065-5562ee34a255' },
  { team: 'Dream Team 92', token: 'f37b4e89-9c77-45a7-c176-4673ff45b366' },
];

const INITIAL_REAL_TEAMS: string[] = [
  'ALV', 'ATH', 'ATM', 'BAR', 'BET', 'CEL', 'ESP', 'GET', 'GIR', 
  'MLL', 'OSA', 'RAY', 'RMA', 'RSO', 'SEV', 'VAL', 'VIL', 'LEG', 'LPA', 'VLD'
];

const INITIAL_PLAYERS: Player[] = [
  // Porteros
  { name: 'Thibaut Courtois', realTeam: 'RMA', position: 'Portero', value: 18, status: 'Fichado', jornadasPoints: { 1: 8, 2: 7, 3: 9, 4: 6, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 0 } },
  { name: 'Marc-André ter Stegen', realTeam: 'BAR', position: 'Portero', value: 16, status: 'Fichado', jornadasPoints: { 1: 6, 2: 9, 3: 6, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 2, 4: 0, 5: 1 } },
  { name: 'Jan Oblak', realTeam: 'ATM', position: 'Portero', value: 16, status: 'Fichado', jornadasPoints: { 1: 7, 2: 6, 3: 8, 4: 7, 5: 9 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 2, 3: 0, 4: 1, 5: 0 } },
  { name: 'Unai Simón', realTeam: 'ATH', position: 'Portero', value: 14, status: 'Fichado', jornadasPoints: { 1: 8, 2: 6, 3: 7, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 1 } },
  { name: 'Álex Remiro', realTeam: 'RSO', position: 'Portero', value: 13, status: 'Fichado', jornadasPoints: { 1: 6, 2: 7, 3: 6, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 } },
  { name: 'David Soria', realTeam: 'GET', position: 'Portero', value: 11, status: 'Fichado', jornadasPoints: { 1: 7, 2: 5, 3: 6, 4: 7, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 2, 3: 1, 4: 1, 5: 2 } },
  { name: 'Paulo Gazzaniga', realTeam: 'GIR', position: 'Portero', value: 10, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 5, 4: 7, 5: 5 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Rui Silva', realTeam: 'BET', position: 'Portero', value: 9, status: 'Disponible', jornadasPoints: { 1: 5, 2: 6, 3: 7, 4: 5, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 0, 4: 2, 5: 1 } },
  { name: 'Stole Dimitrievski', realTeam: 'VAL', position: 'Portero', value: 8, status: 'Disponible', jornadasPoints: { 1: 6, 2: 5, 3: 6, 4: 6, 5: 5 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 2, 3: 1, 4: 2, 5: 2 } },

  // Defensas
  { name: 'Antonio Rüdiger', realTeam: 'RMA', position: 'Defensa', value: 16, status: 'Fichado', jornadasPoints: { 1: 8, 2: 9, 3: 7, 4: 8, 5: 10 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 0 } },
  { name: 'Dani Carvajal', realTeam: 'RMA', position: 'Defensa', value: 15, status: 'Fichado', jornadasPoints: { 1: 7, 2: 8, 3: 9, 4: 6, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 0 } },
  { name: 'Jules Koundé', realTeam: 'BAR', position: 'Defensa', value: 15, status: 'Fichado', jornadasPoints: { 1: 8, 2: 7, 3: 9, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 2, 4: 0, 5: 1 } },
  { name: 'Pau Cubarsí', realTeam: 'BAR', position: 'Defensa', value: 14, status: 'Fichado', jornadasPoints: { 1: 7, 2: 8, 3: 7, 4: 9, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 2, 4: 0, 5: 1 } },
  { name: 'Alejandro Balde', realTeam: 'BAR', position: 'Defensa', value: 13, status: 'Fichado', jornadasPoints: { 1: 7, 2: 7, 3: 8, 4: 7, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 2, 4: 0, 5: 1 } },
  { name: 'Robin Le Normand', realTeam: 'ATM', position: 'Defensa', value: 14, status: 'Fichado', jornadasPoints: { 1: 7, 2: 6, 3: 8, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 2, 3: 0, 4: 1, 5: 0 } },
  { name: 'José María Giménez', realTeam: 'ATM', position: 'Defensa', value: 13, status: 'Fichado', jornadasPoints: { 1: 6, 2: 7, 3: 7, 4: 8, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 2, 3: 0, 4: 1, 5: 0 } },
  { name: 'Daniel Vivian', realTeam: 'ATH', position: 'Defensa', value: 13, status: 'Fichado', jornadasPoints: { 1: 8, 2: 7, 3: 6, 4: 7, 5: 8 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 1 } },
  { name: 'Aitor Paredes', realTeam: 'ATH', position: 'Defensa', value: 11, status: 'Fichado', jornadasPoints: { 1: 6, 2: 6, 3: 7, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 1 } },
  { name: 'Jon Pacheco', realTeam: 'RSO', position: 'Defensa', value: 10, status: 'Fichado', jornadasPoints: { 1: 6, 2: 6, 3: 6, 4: 7, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 } },
  { name: 'Cristhian Mosquera', realTeam: 'VAL', position: 'Defensa', value: 11, status: 'Fichado', jornadasPoints: { 1: 6, 2: 6, 3: 5, 4: 7, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 2, 3: 1, 4: 2, 5: 2 } },
  { name: 'Diego Rico', realTeam: 'GET', position: 'Defensa', value: 10, status: 'Fichado', jornadasPoints: { 1: 7, 2: 6, 3: 6, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 2, 3: 1, 4: 1, 5: 2 } },
  { name: 'Daley Blind', realTeam: 'GIR', position: 'Defensa', value: 12, status: 'Fichado', jornadasPoints: { 1: 7, 2: 6, 3: 7, 4: 8, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Marc Bartra', realTeam: 'BET', position: 'Defensa', value: 10, status: 'Fichado', jornadasPoints: { 1: 8, 2: 6, 3: 6, 4: 6, 5: 7 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 0, 4: 2, 5: 1 } },
  { name: 'Nemanja Gudelj', realTeam: 'SEV', position: 'Defensa', value: 9, status: 'Fichado', jornadasPoints: { 1: 6, 2: 6, 3: 5, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Mika Màrmol', realTeam: 'LPA', position: 'Defensa', value: 9, status: 'Fichado', jornadasPoints: { 1: 6, 2: 6, 3: 6, 4: 5, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 2, 3: 1, 4: 2, 5: 1 } },
  { name: 'Óscar Mingueza', realTeam: 'CEL', position: 'Defensa', value: 13, status: 'Fichado', jornadasPoints: { 1: 9, 2: 10, 3: 6, 4: 8, 5: 7 }, jornadasGoals: { 1: 1, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Raúl Albiol', realTeam: 'VIL', position: 'Defensa', value: 9, status: 'Fichado', jornadasPoints: { 1: 6, 2: 6, 3: 6, 4: 7, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 2, 4: 1, 5: 1 } },
  { name: 'Abdel Abqar', realTeam: 'ALV', position: 'Defensa', value: 8, status: 'Disponible', jornadasPoints: { 1: 6, 2: 5, 3: 6, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 1, 4: 2, 5: 2 } },
  { name: 'Flavien Boyomo', realTeam: 'OSA', position: 'Defensa', value: 10, status: 'Disponible', jornadasPoints: { 1: 8, 2: 7, 3: 6, 4: 8, 5: 6 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Florian Lejeune', realTeam: 'RAY', position: 'Defensa', value: 9, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 5, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 2, 4: 2, 5: 1 } },
  { name: 'Leandro Cabrera', realTeam: 'ESP', position: 'Defensa', value: 8, status: 'Disponible', jornadasPoints: { 1: 5, 2: 6, 3: 6, 4: 5, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 2 } },

  // Centrocampistas
  { name: 'Jude Bellingham', realTeam: 'RMA', position: 'Medio', value: 24, status: 'Fichado', jornadasPoints: { 1: 9, 2: 8, 3: 11, 4: 10, 5: 9 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Federico Valverde', realTeam: 'RMA', position: 'Medio', value: 20, status: 'Fichado', jornadasPoints: { 1: 10, 2: 8, 3: 9, 4: 8, 5: 11 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Pedri González', realTeam: 'BAR', position: 'Medio', value: 21, status: 'Fichado', jornadasPoints: { 1: 8, 2: 10, 3: 9, 4: 11, 5: 9 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Dani Olmo', realTeam: 'BAR', position: 'Medio', value: 19, status: 'Fichado', jornadasPoints: { 1: 11, 2: 11, 3: 10, 4: 9, 5: 12 }, jornadasGoals: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Rodrigo De Paul', realTeam: 'ATM', position: 'Medio', value: 16, status: 'Fichado', jornadasPoints: { 1: 7, 2: 8, 3: 8, 4: 7, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Conor Gallagher', realTeam: 'ATM', position: 'Medio', value: 15, status: 'Fichado', jornadasPoints: { 1: 8, 2: 9, 3: 7, 4: 9, 5: 8 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Oihan Sancet', realTeam: 'ATH', position: 'Medio', value: 16, status: 'Fichado', jornadasPoints: { 1: 10, 2: 7, 3: 9, 4: 8, 5: 10 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Mikel Merino', realTeam: 'RSO', position: 'Medio', value: 15, status: 'Abandona Liga', jornadasPoints: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Martín Zubimendi', realTeam: 'RSO', position: 'Medio', value: 16, status: 'Fichado', jornadasPoints: { 1: 8, 2: 7, 3: 8, 4: 8, 5: 7 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Brais Méndez', realTeam: 'RSO', position: 'Medio', value: 15, status: 'Fichado', jornadasPoints: { 1: 7, 2: 8, 3: 6, 4: 8, 5: 8 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Álex Baena', realTeam: 'VIL', position: 'Medio', value: 18, status: 'Fichado', jornadasPoints: { 1: 9, 2: 9, 3: 8, 4: 10, 5: 11 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Giovani Lo Celso', realTeam: 'BET', position: 'Medio', value: 17, status: 'Fichado', jornadasPoints: { 1: 11, 2: 12, 3: 9, 4: 10, 5: 11 }, jornadasGoals: { 1: 1, 2: 2, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Isco Alarcón', realTeam: 'BET', position: 'Medio', value: 16, status: 'Fichado', jornadasPoints: { 1: 8, 2: 7, 3: 9, 4: 8, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Yangel Herrera', realTeam: 'GIR', position: 'Medio', value: 13, status: 'Fichado', jornadasPoints: { 1: 7, 2: 8, 3: 6, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Pepelu', realTeam: 'VAL', position: 'Medio', value: 12, status: 'Fichado', jornadasPoints: { 1: 7, 2: 6, 3: 7, 4: 7, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Mauro Arambarri', realTeam: 'GET', position: 'Medio', value: 11, status: 'Fichado', jornadasPoints: { 1: 8, 2: 6, 3: 8, 4: 7, 5: 8 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Aimar Oroz', realTeam: 'OSA', position: 'Medio', value: 12, status: 'Fichado', jornadasPoints: { 1: 7, 2: 8, 3: 7, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Lucas Torró', realTeam: 'OSA', position: 'Medio', value: 10, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 7, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Kirian Rodríguez', realTeam: 'LPA', position: 'Medio', value: 11, status: 'Disponible', jornadasPoints: { 1: 6, 2: 7, 3: 6, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Sergi Darder', realTeam: 'MLL', position: 'Medio', value: 11, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 7, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Kike Pérez', realTeam: 'VLD', position: 'Medio', value: 8, status: 'Disponible', jornadasPoints: { 1: 5, 2: 6, 3: 5, 4: 6, 5: 5 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },

  // Delanteros
  { name: 'Kylian Mbappé', realTeam: 'RMA', position: 'Delantero', value: 28, status: 'Fichado', jornadasPoints: { 1: 9, 2: 12, 3: 13, 4: 10, 5: 14 }, jornadasGoals: { 1: 1, 2: 2, 3: 2, 4: 1, 5: 2 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Vinícius Júnior', realTeam: 'RMA', position: 'Delantero', value: 27, status: 'Fichado', jornadasPoints: { 1: 10, 2: 11, 3: 12, 4: 11, 5: 13 }, jornadasGoals: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Robert Lewandowski', realTeam: 'BAR', position: 'Delantero', value: 26, status: 'Fichado', jornadasPoints: { 1: 13, 2: 12, 3: 11, 4: 14, 5: 12 }, jornadasGoals: { 1: 2, 2: 2, 3: 1, 4: 3, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Lamine Yamal', realTeam: 'BAR', position: 'Delantero', value: 25, status: 'Fichado', jornadasPoints: { 1: 11, 2: 12, 3: 13, 4: 12, 5: 14 }, jornadasGoals: { 1: 1, 2: 1, 3: 1, 4: 2, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Raphinha', realTeam: 'BAR', position: 'Delantero', value: 23, status: 'Fichado', jornadasPoints: { 1: 10, 2: 14, 3: 11, 4: 13, 5: 12 }, jornadasGoals: { 1: 1, 2: 3, 3: 1, 4: 2, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Antoine Griezmann', realTeam: 'ATM', position: 'Delantero', value: 23, status: 'Fichado', jornadasPoints: { 1: 10, 2: 9, 3: 11, 4: 10, 5: 12 }, jornadasGoals: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 2 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Julián Álvarez', realTeam: 'ATM', position: 'Delantero', value: 22, status: 'Fichado', jornadasPoints: { 1: 8, 2: 10, 3: 9, 4: 11, 5: 10 }, jornadasGoals: { 1: 0, 2: 1, 3: 1, 4: 1, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Alexander Sørloth', realTeam: 'ATM', position: 'Delantero', value: 18, status: 'Fichado', jornadasPoints: { 1: 9, 2: 7, 3: 8, 4: 9, 5: 8 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Nico Williams', realTeam: 'ATH', position: 'Delantero', value: 22, status: 'Fichado', jornadasPoints: { 1: 9, 2: 10, 3: 8, 4: 11, 5: 10 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Iñaki Williams', realTeam: 'ATH', position: 'Delantero', value: 18, status: 'Fichado', jornadasPoints: { 1: 8, 2: 9, 3: 10, 4: 8, 5: 9 }, jornadasGoals: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Takefusa Kubo', realTeam: 'RSO', position: 'Delantero', value: 19, status: 'Fichado', jornadasPoints: { 1: 9, 2: 8, 3: 10, 4: 8, 5: 9 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Mikel Oyarzabal', realTeam: 'RSO', position: 'Delantero', value: 18, status: 'Fichado', jornadasPoints: { 1: 8, 2: 8, 3: 7, 4: 9, 5: 8 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Ayoze Pérez', realTeam: 'VIL', position: 'Delantero', value: 18, status: 'Fichado', jornadasPoints: { 1: 10, 2: 11, 3: 10, 4: 12, 5: 11 }, jornadasGoals: { 1: 1, 2: 1, 3: 2, 4: 2, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Iago Aspas', realTeam: 'CEL', position: 'Delantero', value: 17, status: 'Fichado', jornadasPoints: { 1: 9, 2: 10, 3: 8, 4: 9, 5: 9 }, jornadasGoals: { 1: 1, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Borja Iglesias', realTeam: 'CEL', position: 'Delantero', value: 14, status: 'Fichado', jornadasPoints: { 1: 8, 2: 9, 3: 7, 4: 8, 5: 8 }, jornadasGoals: { 1: 1, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Ante Budimir', realTeam: 'OSA', position: 'Delantero', value: 15, status: 'Fichado', jornadasPoints: { 1: 8, 2: 8, 3: 9, 4: 8, 5: 9 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Hugo Duro', realTeam: 'VAL', position: 'Delantero', value: 13, status: 'Fichado', jornadasPoints: { 1: 7, 2: 8, 3: 7, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Vedat Muriqi', realTeam: 'MLL', position: 'Delantero', value: 14, status: 'Fichado', jornadasPoints: { 1: 8, 2: 7, 3: 8, 4: 8, 5: 8 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Abel Ruiz', realTeam: 'GIR', position: 'Delantero', value: 12, status: 'Disponible', jornadasPoints: { 1: 7, 2: 8, 3: 6, 4: 7, 5: 7 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Sergio Camello', realTeam: 'RAY', position: 'Delantero', value: 11, status: 'Disponible', jornadasPoints: { 1: 7, 2: 6, 3: 7, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Javi Puado', realTeam: 'ESP', position: 'Delantero', value: 12, status: 'Disponible', jornadasPoints: { 1: 7, 2: 7, 3: 9, 4: 6, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 2, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Juanmi Latasa', realTeam: 'VLD', position: 'Delantero', value: 9, status: 'Disponible', jornadasPoints: { 1: 5, 2: 6, 3: 5, 4: 6, 5: 5 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
];

// Initial Lineups for J1 to J5 (11 players per team, within <= 200M value limit)
const INITIAL_LINEUPS: LineupEntry[] = [];

// Helper to assign 11 players to each team for J1-J5
const TEAM_PLAYER_ASSIGNMENTS: Record<string, string[]> = {
  'Galácticos FC': [
    'Thibaut Courtois', 'Antonio Rüdiger', 'Dani Carvajal', 'Pau Cubarsí', 'Alejandro Balde',
    'Jude Bellingham', 'Federico Valverde', 'Brais Méndez',
    'Kylian Mbappé', 'Vinícius Júnior', 'Hugo Duro'
  ],
  'Tiki-Taka United': [
    'Marc-André ter Stegen', 'Jules Koundé', 'Robin Le Normand', 'Daniel Vivian', 'Jon Pacheco',
    'Pedri González', 'Dani Olmo', 'Martín Zubimendi',
    'Robert Lewandowski', 'Lamine Yamal', 'Iago Aspas'
  ],
  'La Saeta Rubia': [
    'Jan Oblak', 'José María Giménez', 'Aitor Paredes', 'Diego Rico', 'Marc Bartra',
    'Rodrigo De Paul', 'Conor Gallagher', 'Álex Baena',
    'Antoine Griezmann', 'Julián Álvarez', 'Vedat Muriqi'
  ],
  'Furia Rojiblanca': [
    'Unai Simón', 'Daley Blind', 'Cristhian Mosquera', 'Nemanja Gudelj', 'Mika Màrmol',
    'Oihan Sancet', 'Giovani Lo Celso', 'Isco Alarcón',
    'Nico Williams', 'Iñaki Williams', 'Alexander Sørloth'
  ],
  'Boquerones CF': [
    'Álex Remiro', 'Óscar Mingueza', 'Raúl Albiol', 'Pau Cubarsí', 'Alejandro Balde',
    'Yangel Herrera', 'Pepelu', 'Mauro Arambarri',
    'Raphinha', 'Takefusa Kubo', 'Ayoze Pérez'
  ],
  'Dream Team 92': [
    'David Soria', 'Antonio Rüdiger', 'Jules Koundé', 'Robin Le Normand', 'Daniel Vivian',
    'Aimar Oroz', 'Federico Valverde', 'Dani Olmo',
    'Mikel Oyarzabal', 'Borja Iglesias', 'Ante Budimir'
  ]
};

// Generate line-ups across Jornada 1 to 5
for (let j = 1; j <= 5; j++) {
  INITIAL_TEAMS.forEach(team => {
    const playerNames = TEAM_PLAYER_ASSIGNMENTS[team] || [];
    playerNames.forEach(pName => {
      const pData = INITIAL_PLAYERS.find(p => p.name === pName);
      if (pData) {
        INITIAL_LINEUPS.push({
          team,
          jornada: j,
          playerName: pData.name,
          realTeam: pData.realTeam,
          position: pData.position,
          value: pData.value
        });
      }
    });
  });
}

const INITIAL_TRANSFERS: TransferRecord[] = [
  { timestamp: '15/09/2026, 18:30h', team: 'Galácticos FC', jornada: 3, playerOut: 'Mikel Merino', playerIn: 'Brais Méndez', cost: 0, type: 'Abandono' },
  { timestamp: '22/09/2026, 12:15h', team: 'Boquerones CF', jornada: 4, playerOut: 'Abel Ruiz', playerIn: 'Ayoze Pérez', cost: 0, type: 'Normal' },
  { timestamp: '29/09/2026, 21:05h', team: 'Furia Rojiblanca', jornada: 5, playerOut: 'Sergio Camello', playerIn: 'Alexander Sørloth', cost: 2, type: 'Normal' },
];

const INITIAL_DRAFTS: DraftRecord[] = [
  { timestamp: '01/09/2026, 20:00h', team: 'Galácticos FC', playerName: 'Kylian Mbappé', realTeam: 'RMA', position: 'Delantero', value: 28 },
  { timestamp: '01/09/2026, 20:02h', team: 'Tiki-Taka United', playerName: 'Lamine Yamal', realTeam: 'BAR', position: 'Delantero', value: 25 },
  { timestamp: '01/09/2026, 20:05h', team: 'La Saeta Rubia', playerName: 'Antoine Griezmann', realTeam: 'ATM', position: 'Delantero', value: 23 },
  { timestamp: '01/09/2026, 20:07h', team: 'Furia Rojiblanca', playerName: 'Nico Williams', realTeam: 'ATH', position: 'Delantero', value: 22 },
  { timestamp: '01/09/2026, 20:10h', team: 'Boquerones CF', playerName: 'Raphinha', realTeam: 'BAR', position: 'Delantero', value: 23 },
  { timestamp: '01/09/2026, 20:12h', team: 'Dream Team 92', playerName: 'Jude Bellingham', realTeam: 'RMA', position: 'Medio', value: 24 },
];

const INITIAL_SCHEDULES: ScheduleRecord[] = [
  { jornada: 5, realTeam: 'RMA', deadlineIsoString: '2026-09-28T21:00' },
  { jornada: 5, realTeam: 'BAR', deadlineIsoString: '2026-09-28T16:15' },
  { jornada: 5, realTeam: 'ATM', deadlineIsoString: '2026-09-29T18:30' },
  { jornada: 6, realTeam: 'RMA', deadlineIsoString: '2026-10-05T21:00' },
  { jornada: 6, realTeam: 'BAR', deadlineIsoString: '2026-10-05T16:15' },
];

// Engine Class with LocalStorage persistence to ensure live mutations work 100%
class GasEngineService {
  private teams: string[] = [];
  private tokens: TeamToken[] = [];
  private players: Player[] = [];
  private lineups: LineupEntry[] = [];
  private transfers: TransferRecord[] = [];
  private drafts: DraftRecord[] = [];
  private schedules: ScheduleRecord[] = [];
  private gasUrl: string = '';
  private lastSyncTime: string | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try { l(); } catch (e) { console.error('Listener notification error:', e); }
    });
  }

  public getGasUrl(): string {
    if (!this.gasUrl) {
      this.gasUrl = localStorage.getItem('lfa_gas_url') || '';
    }
    return this.gasUrl;
  }

  public setGasUrl(url: string) {
    this.gasUrl = url.trim();
    localStorage.setItem('lfa_gas_url', this.gasUrl);
    this.notify();
  }

  public getLastSyncTime(): string | null {
    if (!this.lastSyncTime) {
      this.lastSyncTime = localStorage.getItem('lfa_last_sync_time');
    }
    return this.lastSyncTime;
  }

  public isRemoteConnected(): boolean {
    return Boolean(this.getGasUrl());
  }

  /**
   * Ejecuta peticiones contra la Web App de Google Apps Script.
   * Lanza Fetch estándar y JSONP de forma concurrente para resolver en el mínimo tiempo posible
   * y superar cualquier bloqueo de CORS o retraso por redirects en iframes.
   */
  private async fetchGasData(baseUrl: string, params: Record<string, string>, timeoutMs = 25000): Promise<any> {
    const cleanUrl = baseUrl.trim();
    if (!cleanUrl) throw new Error('EMPTY_URL');

    if (cleanUrl.includes('/dev')) {
      throw new Error('DEV_URL_ERROR');
    }

    const queryParts = Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    queryParts.push(`_t=${Date.now()}`);
    const sep = cleanUrl.includes('?') ? '&' : '?';
    const fullUrl = cleanUrl + sep + queryParts.join('&');

    return new Promise((resolve, reject) => {
      let isDone = false;
      let fetchDone = false;
      let jsonpDone = false;
      let lastErr: any = null;

      // Timer único para evitar esperas eternas
      const masterTimer = setTimeout(() => {
        if (!isDone) {
          isDone = true;
          cleanup();
          reject(new Error('TIMEOUT_GAS'));
        }
      }, timeoutMs);

      let scriptElement: HTMLScriptElement | null = null;
      let callbackName = '';
      let abortController: AbortController | null = null;

      function cleanup() {
        clearTimeout(masterTimer);
        if (scriptElement && scriptElement.parentNode) {
          scriptElement.parentNode.removeChild(scriptElement);
          scriptElement = null;
        }
        if (callbackName && typeof window !== 'undefined') {
          delete (window as any)[callbackName];
        }
        if (abortController) {
          try {
            abortController.abort();
          } catch {
            // Ignorar
          }
        }
      }

      function onSuccess(data: any) {
        if (isDone) return;
        isDone = true;
        cleanup();
        resolve(data);
      }

      function onFail(err: any, source: 'fetch' | 'jsonp') {
        if (isDone) return;
        lastErr = err;
        if (source === 'fetch') fetchDone = true;
        if (source === 'jsonp') jsonpDone = true;

        // Errores deterministas: Google exige autenticación, URL dev o código HTML antiguo
        if (err && ['AUTH_REQUIRED', 'OLD_GAS_CODE', 'RETURNED_HTML', 'DEV_URL_ERROR'].includes(err.message)) {
          isDone = true;
          cleanup();
          reject(err);
          return;
        }

        // Si ambas estrategias han fallado, rechazar
        if (fetchDone && jsonpDone) {
          isDone = true;
          cleanup();
          reject(lastErr || new Error('NETWORK_ERROR'));
        }
      }

      // 1. Iniciar JSONP (inmune a CORS, pasa el redirect 302 sin preflight)
      if (typeof document !== 'undefined') {
        callbackName = 'lfa_cb_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
        scriptElement = document.createElement('script');
        const jsonpUrl = fullUrl + '&callback=' + callbackName;

        (window as any)[callbackName] = (data: any) => {
          onSuccess(data);
        };

        scriptElement.onerror = () => {
          onFail(new Error('SCRIPT_LOAD_ERROR'), 'jsonp');
        };

        scriptElement.src = jsonpUrl;
        document.head.appendChild(scriptElement);
      } else {
        jsonpDone = true;
      }

      // 2. Iniciar Fetch en paralelo (para soportar respuestas JSON directas si CORS lo permite)
      try {
        abortController = new AbortController();
        fetch(fullUrl, {
          method: 'GET',
          mode: 'cors',
          redirect: 'follow',
          signal: abortController.signal
        }).then(async (res) => {
          if (isDone) return;
          if (!res.ok) {
            onFail(new Error('HTTP_' + res.status), 'fetch');
            return;
          }
          const text = await res.text();
          const trimmed = text.trim();

          if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || text.includes('accounts.google.com')) {
            if (text.includes('ServiceLogin') || text.includes('accounts.google.com')) {
              onFail(new Error('AUTH_REQUIRED'), 'fetch');
              return;
            }
            if (text.includes('Liga Fantástica') || text.includes('Index')) {
              onFail(new Error('OLD_GAS_CODE'), 'fetch');
              return;
            }
            onFail(new Error('RETURNED_HTML'), 'fetch');
            return;
          }

          try {
            const json = JSON.parse(text);
            onSuccess(json);
          } catch {
            onFail(new Error('INVALID_JSON'), 'fetch');
          }
        }).catch((fetchErr) => {
          onFail(fetchErr, 'fetch');
        });
      } catch (e) {
        onFail(e, 'fetch');
      }
    });
  }

  public async testConnection(customUrl?: string): Promise<{ success: boolean; message: string; data?: any; latencyMs?: number; code?: string }> {
    const targetUrl = (customUrl !== undefined ? customUrl : this.getGasUrl()).trim();
    if (!targetUrl) {
      return { success: false, message: 'Introduce una URL válida de Google Apps Script (Web App)' };
    }

    if (targetUrl.includes('/dev')) {
      return {
        success: false,
        code: 'DEV_URL',
        message: '⚠️ Has introducido una URL terminada en "/dev" (modo desarrollador). Esta URL exige inicio de sesión en Google. En Apps Script, haz clic en "Implementar > Nueva implementación > Aplicación web" y copia la URL terminada en "/exec".'
      };
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      return { success: false, message: 'La URL debe comenzar por https://script.google.com/macros/s/...' };
    }

    const startTime = Date.now();
    try {
      const data = await this.fetchGasData(targetUrl, { action: 'ping' }, 14000);
      const latencyMs = Date.now() - startTime;

      if (data && data.error) {
        return {
          success: false,
          latencyMs,
          message: 'Google Apps Script respondió: ' + data.error
        };
      }

      return {
        success: true,
        latencyMs,
        message: '¡Conexión verificada con éxito! Tu Google Sheets responde correctamente.',
        data
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      if (err.message === 'DEV_URL_ERROR') {
        return {
          success: false,
          code: 'DEV_URL',
          message: '⚠️ La URL termina en "/dev". Debes usar la URL de implementación que termina en "/exec".'
        };
      }
      if (err.message === 'AUTH_REQUIRED') {
        return {
          success: false,
          code: 'AUTH_REQUIRED',
          message: '🔒 Google exige autorización de cuenta. En Google Apps Script: "Implementar > Administrar implementaciones > Editar", y en "¿Quién tiene acceso?" elige "Cualquiera" (Anyone).'
        };
      }
      if (err.message === 'OLD_GAS_CODE') {
        return {
          success: false,
          code: 'OLD_CODE',
          message: '⚠️ Tu Web App devolvió la página HTML antigua. En Google Apps Script debes: 1) Pegar el nuevo "Código.gs" (cópialo desde el botón "Código Apps Script"), 2) Guardar (Ctrl+S), y 3) Ir a "Implementar > Administrar implementaciones > Editar > Versión: Nueva versión > Implementar".'
        };
      }
      if (err.message === 'RETURNED_HTML') {
        return {
          success: false,
          code: 'HTML_RESPONSE',
          message: '⚠️ La Web App respondió con HTML en vez de la API JSON. Asegúrate de actualizar el archivo "Código.gs" en tu proyecto de Apps Script y crear una "Nueva versión" en la implementación.'
        };
      }

      return {
        success: false,
        latencyMs,
        message: 'No se pudo conectar con la Web App. Comprueba que: 1) La URL termine en "/exec", 2) Hayas pegado el nuevo "Código.gs", y 3) En Apps Script hayas seleccionado "Nueva versión" en Implementar > Administrar implementaciones.'
      };
    }
  }

  public async syncFromRemote(customUrl?: string): Promise<{ success: boolean; message: string; stats?: any }> {
    const targetUrl = (customUrl !== undefined ? customUrl : this.getGasUrl()).trim();
    if (!targetUrl) {
      return { success: false, message: 'No hay URL de Google Apps Script configurada.' };
    }

    try {
      let data: any;
      try {
        data = await this.fetchGasData(targetUrl, { action: 'getFullSync' }, 25000);
      } catch (firstErr: any) {
        if (firstErr.message === 'TIMEOUT_GAS' || firstErr.message === 'TIMEOUT_JSONP' || firstErr.name === 'AbortError') {
          throw new Error('TIMEOUT_GAS');
        }
        throw firstErr;
      }

      if (data && data.error) {
        return { success: false, message: 'Error de Google Apps Script: ' + data.error };
      }

      let updatedTeamsCount = 0;
      let updatedPlayersCount = 0;

      // Actualizar lista de equipos si viene en la respuesta
      if (Array.isArray(data.teams) && data.teams.length > 0) {
        this.teams = data.teams;
        updatedTeamsCount = data.teams.length;
      }

      // Actualizar jugadores si vienen en la respuesta (con deduplicación por nombre)
      if (Array.isArray(data.players) && data.players.length > 0) {
        const seenPlayers = new Set<string>();
        const uniquePlayers: Player[] = [];

        for (const p of data.players) {
          const rawName = String(p.name || p.Nombre || '').trim();
          if (!rawName) continue;
          const key = rawName.toLowerCase();
          if (!seenPlayers.has(key)) {
            seenPlayers.add(key);
            uniquePlayers.push({
              name: rawName,
              realTeam: String(p.realTeam || p.Equipo_Liga || '').trim(),
              position: p.position || p.Posicion || 'Medio',
              value: Number(p.value || p.Valor) || 10,
              status: (p.status || p.Estado || 'Disponible') as any,
              jornadasPoints: p.jornadasPoints || {},
              jornadasGoals: p.jornadasGoals || {},
              jornadasDef: p.jornadasDef || {}
            });
          }
        }
        this.players = uniquePlayers;
        updatedPlayersCount = this.players.length;
      }

      // Actualizar alineaciones si vienen en la respuesta
      if (Array.isArray(data.lineups) && data.lineups.length > 0) {
        this.lineups = data.lineups.map((l: any) => ({
          team: l.teamName || l.team || l.Equipo,
          jornada: Number(l.jornada || l.Jornada) || 1,
          playerName: l.playerName || l.player || l.Jugador,
          realTeam: l.realTeam || l.Equipo_Liga,
          position: l.position || l.Posicion,
          value: l.value !== undefined ? Number(l.value) : undefined
        }));
      }

      let updatedTransfersCount = 0;
      let updatedDraftsCount = 0;

      // Actualizar historial de fichajes si viene en la respuesta
      const rawTransfers = Array.isArray(data.transfers) ? data.transfers :
                           (Array.isArray(data.transferHistory) ? data.transferHistory :
                           (Array.isArray(data.fichajes) ? data.fichajes :
                           (data.data && Array.isArray(data.data.transfers) ? data.data.transfers :
                           (data.data && Array.isArray(data.data.fichajes) ? data.data.fichajes : null))));

      if (rawTransfers && rawTransfers.length > 0) {
        this.transfers = rawTransfers.map((t: any) => ({
          timestamp: String(t.timestamp || t.date || t['Marca temporal'] || t.Fecha || t['Fecha/Hora'] || t.Hora || '').trim(),
          team: String(t.team || t.Equipo || t.Team || t.Club || t['Nombre Equipo'] || '').trim(),
          jornada: Number(t.jornada || t.Jornada || t.Jor || t.Semana || 1) || 1,
          playerOut: String(t.playerOut || t.Jugador_Sale || t.JugadorSale || t['Jugador Sale'] || t['Jugador que sale'] || t.Sale || t.Baja || t['Jugador Baja'] || t.Saliente || '').trim(),
          playerIn: String(t.playerIn || t.Jugador_Entra || t.JugadorEntra || t['Jugador Entra'] || t['Jugador que entra'] || t.Entra || t.Alta || t['Jugador Alta'] || t.Entrante || t.Fichaje || '').trim(),
          cost: parseCleanNumber(t.cost !== undefined ? t.cost : (t.Coste !== undefined ? t.Coste : (t.Precio !== undefined ? t.Precio : 0))),
          type: ((t.type || t.Tipo || 'Normal') as 'Normal' | 'Abandono')
        })).filter(t => t.team || t.playerOut || t.playerIn);
        updatedTransfersCount = this.transfers.length;
      }

      // Si no vinieron fichajes en getFullSync, consultar endpoint específico como salvaguarda
      if (this.transfers.length === 0) {
        try {
          const tRes = await this.fetchGasData(targetUrl, { action: 'getTransferHistory' }, 10000);
          const auxTransfers = Array.isArray(tRes) ? tRes : (tRes?.data || tRes?.transfers);
          if (Array.isArray(auxTransfers) && auxTransfers.length > 0) {
            this.transfers = auxTransfers.map((t: any) => ({
              timestamp: String(t.timestamp || t.date || t['Marca temporal'] || t.Fecha || t['Fecha/Hora'] || '').trim(),
              team: String(t.team || t.Equipo || t.Team || t.Club || '').trim(),
              jornada: Number(t.jornada || t.Jornada || t.Jor || 1) || 1,
              playerOut: String(t.playerOut || t.Jugador_Sale || t.JugadorSale || t['Jugador Sale'] || t['Jugador que sale'] || t.Sale || t.Baja || '').trim(),
              playerIn: String(t.playerIn || t.Jugador_Entra || t.JugadorEntra || t['Jugador Entra'] || t['Jugador que entra'] || t.Entra || t.Alta || t.Fichaje || '').trim(),
              cost: parseCleanNumber(t.cost !== undefined ? t.cost : (t.Coste !== undefined ? t.Coste : 0)),
              type: ((t.type || t.Tipo || 'Normal') as 'Normal' | 'Abandono')
            })).filter(t => t.team || t.playerOut || t.playerIn);
            updatedTransfersCount = this.transfers.length;
          }
        } catch {
          // No bloqueante
        }
      }

      // Actualizar historial de draft si viene en la respuesta
      const rawDrafts = Array.isArray(data.drafts) ? data.drafts :
                        (Array.isArray(data.draftHistory) ? data.draftHistory :
                        (Array.isArray(data.draft) ? data.draft :
                        (data.data && Array.isArray(data.data.drafts) ? data.data.drafts :
                        (data.data && Array.isArray(data.data.draftHistory) ? data.data.draftHistory : null))));

      if (rawDrafts && rawDrafts.length > 0) {
        this.drafts = rawDrafts.map((d: any) => {
          const pName = String(d.playerName || d.Nombre_Jugador || d['Nombre del Jugador'] || d['Nombre Jugador'] || d.Jugador || d.Nombre || d.Futbolista || d.Player || '').trim();
          let pReal = String(d.realTeam || d.Equipo_Liga || d['Equipo Real'] || d['Equipo_Real'] || d.Club || d['Equipo de la Liga'] || '').trim();
          let pPos = String(d.position || d.Posicion || d['Posición'] || '').trim();
          let pVal = parseCleanNumber(d.value !== undefined ? d.value : (d.Valor !== undefined ? d.Valor : (d.Precio !== undefined ? d.Precio : 0)));

          // Si faltan datos en la hoja, autocompletar desde el catálogo maestro de jugadores
          if ((!pReal || !pPos || pVal === 0) && pName) {
            const matchPlayer = this.players.find(p => p.name.toLowerCase() === pName.toLowerCase());
            if (matchPlayer) {
              if (!pReal) pReal = matchPlayer.realTeam;
              if (!pPos) pPos = matchPlayer.position;
              if (pVal === 0 && matchPlayer.value) pVal = matchPlayer.value;
            }
          }

          return {
            timestamp: String(d.timestamp || d.date || d['Marca temporal'] || d.Fecha || d['Fecha/Hora'] || '').trim(),
            team: String(d.team || d.Equipo || d.Team || d.Club || d['Nombre Equipo'] || '').trim(),
            playerName: pName,
            realTeam: pReal,
            position: pPos || 'Medio',
            value: pVal
          };
        }).filter(d => d.team || d.playerName);
        updatedDraftsCount = this.drafts.length;
      }

      // Si no vinieron drafts en getFullSync, consultar endpoint específico como salvaguarda
      if (this.drafts.length === 0) {
        try {
          const dRes = await this.fetchGasData(targetUrl, { action: 'getDraftHistory' }, 10000);
          const auxDrafts = Array.isArray(dRes) ? dRes : (dRes?.data || dRes?.drafts);
          if (Array.isArray(auxDrafts) && auxDrafts.length > 0) {
            this.drafts = auxDrafts.map((d: any) => ({
              timestamp: String(d.timestamp || d.date || d['Marca temporal'] || d.Fecha || d['Fecha/Hora'] || '').trim(),
              team: String(d.team || d.Equipo || d.Team || d.Club || '').trim(),
              playerName: String(d.playerName || d.Nombre_Jugador || d['Nombre del Jugador'] || d.Jugador || d.Nombre || '').trim(),
              realTeam: String(d.realTeam || d.Equipo_Liga || d['Equipo Real'] || d.Club || '').trim(),
              position: String(d.position || d.Posicion || 'Medio').trim(),
              value: Number(d.value !== undefined ? d.value : (d.Valor !== undefined ? d.Valor : 0)) || 0
            })).filter(d => d.team || d.playerName);
            updatedDraftsCount = this.drafts.length;
          }
        } catch {
          // No bloqueante
        }
      }

      const now = new Date();
      this.lastSyncTime = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }) + ' ' +
                          now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem('lfa_last_sync_time', this.lastSyncTime);
      this.saveState();
      this.notify();

      return {
        success: true,
        message: `Sincronización completada: ${updatedTeamsCount || this.teams.length} equipos, ${updatedPlayersCount || this.players.length} jugadores, ${this.transfers.length} fichajes y ${this.drafts.length} elecciones de draft sincronizados desde Google Sheets.`,
        stats: {
          teams: this.teams.length,
          players: this.players.length,
          transfers: this.transfers.length,
          drafts: this.drafts.length,
          maxJornada: data.maxJornada || this.getMaxJornada()
        }
      };
    } catch (err: any) {
      if (err.message === 'DEV_URL_ERROR') {
        return { success: false, message: 'La URL termina en "/dev". Usa la URL de implementación que termina en "/exec".' };
      }
      if (err.message === 'AUTH_REQUIRED') {
        return { success: false, message: 'Google exige autenticación. Configura "Quién tiene acceso" en "Cualquiera" (Anyone).' };
      }
      if (err.message === 'OLD_GAS_CODE' || err.message === 'RETURNED_HTML') {
        return { success: false, message: 'La Web App devolvió HTML en vez de datos. Pega el nuevo "Código.gs" en Apps Script y publica una "Nueva versión".' };
      }
      if (err.message === 'TIMEOUT_GAS') {
        return {
          success: false,
          message: '⏱️ Tiempo de espera agotado: La versión actual de tu Google Apps Script tarda demasiado en procesar las hojas. Copia el nuevo "Código.gs" optimizado desde la pestaña Conectar, pégalo en tu Apps Script y publica una "Nueva versión". Con el nuevo código tarda menos de 1 segundo.'
        };
      }
      return {
        success: false,
        message: 'Fallo al sincronizar con Google Sheets: ' + (err.message || 'Verifica la URL y permisos.')
      };
    }
  }

  private loadState() {
    try {
      const savedTeams = localStorage.getItem('lfa_teams');
      const savedTokens = localStorage.getItem('lfa_tokens');
      const savedPlayers = localStorage.getItem('lfa_players');
      const savedLineups = localStorage.getItem('lfa_lineups');
      const savedTransfers = localStorage.getItem('lfa_transfers');
      const savedDrafts = localStorage.getItem('lfa_drafts');
      const savedSchedules = localStorage.getItem('lfa_schedules');

      this.teams = savedTeams ? JSON.parse(savedTeams) : [...INITIAL_TEAMS];
      this.tokens = savedTokens ? JSON.parse(savedTokens) : [...INITIAL_TOKENS];
      if (savedPlayers) {
        try {
          const parsed = JSON.parse(savedPlayers);
          if (Array.isArray(parsed)) {
            const seen = new Set<string>();
            const unique: Player[] = [];
            for (const p of parsed) {
              const name = String(p.name || '').trim();
              if (!name) continue;
              const key = name.toLowerCase();
              if (!seen.has(key)) {
                seen.add(key);
                unique.push(p);
              }
            }
            this.players = unique;
          } else {
            this.players = [...INITIAL_PLAYERS];
          }
        } catch {
          this.players = [...INITIAL_PLAYERS];
        }
      } else {
        this.players = [...INITIAL_PLAYERS];
      }
      this.lineups = savedLineups ? JSON.parse(savedLineups) : [...INITIAL_LINEUPS];
      this.transfers = savedTransfers ? JSON.parse(savedTransfers) : [...INITIAL_TRANSFERS];
      this.drafts = savedDrafts ? JSON.parse(savedDrafts) : [...INITIAL_DRAFTS];
      this.schedules = savedSchedules ? JSON.parse(savedSchedules) : [...INITIAL_SCHEDULES];
    } catch {
      this.teams = [...INITIAL_TEAMS];
      this.tokens = [...INITIAL_TOKENS];
      this.players = [...INITIAL_PLAYERS];
      this.lineups = [...INITIAL_LINEUPS];
      this.transfers = [...INITIAL_TRANSFERS];
      this.drafts = [...INITIAL_DRAFTS];
      this.schedules = [...INITIAL_SCHEDULES];
    }
  }

  private saveState() {
    try {
      localStorage.setItem('lfa_teams', JSON.stringify(this.teams));
      localStorage.setItem('lfa_tokens', JSON.stringify(this.tokens));
      localStorage.setItem('lfa_players', JSON.stringify(this.players));
      localStorage.setItem('lfa_lineups', JSON.stringify(this.lineups));
      localStorage.setItem('lfa_transfers', JSON.stringify(this.transfers));
      localStorage.setItem('lfa_drafts', JSON.stringify(this.drafts));
      localStorage.setItem('lfa_schedules', JSON.stringify(this.schedules));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public resetToDefaults() {
    this.teams = [...INITIAL_TEAMS];
    this.tokens = [...INITIAL_TOKENS];
    this.players = [...INITIAL_PLAYERS];
    this.lineups = [...INITIAL_LINEUPS];
    this.transfers = [...INITIAL_TRANSFERS];
    this.drafts = [...INITIAL_DRAFTS];
    this.schedules = [...INITIAL_SCHEDULES];
    this.saveState();
  }

  // --- Identical GAS Backend Functions ---

  public getTeamNames(): string[] {
    return [...this.teams].sort();
  }

  public getNumberOfTeams(): number {
    return this.getTeamNames().length;
  }

  public getMaxJornadaFromPlayersSheet(): number {
    let maxJ = 0;
    this.players.forEach(p => {
      if (p.jornadasPoints) {
        Object.keys(p.jornadasPoints).forEach(k => {
          const num = parseInt(k, 10);
          if (!isNaN(num) && num > maxJ) maxJ = num;
        });
      }
    });
    return maxJ;
  }

  public getMaxJornadaFromAlineacionesSheet(): number {
    if (this.lineups.length === 0) return 0;
    const jNums = this.lineups.map(l => l.jornada).filter(j => !isNaN(j) && j > 0);
    return jNums.length > 0 ? Math.max(...jNums) : 0;
  }

  public getMaxJornada(): number {
    const pMax = this.getMaxJornadaFromPlayersSheet();
    const lMax = this.getMaxJornadaFromAlineacionesSheet();
    return Math.min(pMax, lMax) || pMax || 5;
  }

  public validateTeamToken(teamName: string, token: string): boolean {
    if (!teamName || !token) return false;
    return this.tokens.some(
      t => t.team.trim().toLowerCase() === teamName.trim().toLowerCase() &&
           t.token.trim() === token.trim()
    );
  }

  public getAllPlayersWithDetails(): Player[] {
    return this.players.filter(p => p.name && p.name.trim() !== '');
  }

  public getPlayers(): Player[] {
    return this.getAllPlayersWithDetails();
  }

  public calculateTeamValue(teamName: string, jornada: number): number {
    const playersInLineup = this.lineups
      .filter(l => l.team.trim() === teamName.trim() && l.jornada === jornada && l.playerName.trim() !== '')
      .map(l => l.playerName.trim());

    if (playersInLineup.length === 0) return 0;

    const pMap = new Map(this.players.map(p => [p.name, typeof p.value === 'number' ? p.value : 0]));
    return playersInLineup.reduce((acc, name) => acc + (pMap.get(name) || 0), 0);
  }

  public getRealTeamOfPlayer(playerName: string): string | null {
    const player = this.players.find(p => p.name.trim().toLowerCase() === playerName.trim().toLowerCase());
    return player ? player.realTeam : null;
  }

  public isTeamOpenForJornada(jornada: number, realTeam: string): boolean {
    const lastActiveJornada = this.getMaxJornadaFromPlayersSheet();
    const matchSched = this.schedules.find(
      s => s.jornada === jornada && s.realTeam.toLowerCase() === realTeam.toLowerCase()
    );

    if (matchSched) {
      const deadline = new Date(matchSched.deadlineIsoString);
      if (!isNaN(deadline.getTime())) {
        return new Date() < deadline;
      }
    }

    if (jornada < lastActiveJornada) {
      return false; // Prevent retroactive change
    }

    return true;
  }

  public getTeamLineupData(teamName: string, jornada: number): TeamLineupResponse {
    if (!teamName || !jornada || isNaN(jornada) || jornada <= 0) {
      return { players: [], totalPoints: '0.00', totalValue: '0', totalGoals: 0, totalDefensivePoints: 0, error: 'Selecciona un equipo y jornada válida.' };
    }

    const teamLineups = this.lineups.filter(
      l => l.team.trim() === teamName.trim() && l.jornada === jornada && l.playerName.trim() !== ''
    );

    const playerMap = new Map(this.players.map(p => [p.name, p]));
    let teamTotalPoints = 0;
    let teamTotalValue = 0;
    let teamTotalGoals = 0;
    let teamTotalDefensivePoints = 0;

    const teamPlayers: LineupEntry[] = [];

    teamLineups.forEach(l => {
      const pData = playerMap.get(l.playerName);
      if (pData) {
        const pts = pData.jornadasPoints?.[jornada] ?? '';
        const g = pData.jornadasGoals?.[jornada] ?? '';
        const def = pData.jornadasDef?.[jornada] ?? '';

        teamPlayers.push({
          playerName: l.playerName,
          realTeam: l.realTeam || pData.realTeam,
          position: pData.position,
          value: pData.value,
          team: l.team,
          jornada: l.jornada
        });

        if (typeof pts === 'number') teamTotalPoints += pts;
        if (typeof pData.value === 'number') teamTotalValue += pData.value;
        if (typeof g === 'number') teamTotalGoals += g;
        if (pData.position === 'Portero' || pData.position === 'Defensa') {
          if (typeof def === 'number') teamTotalDefensivePoints += def;
        }
      }
    });

    const positionOrder: Record<string, number> = { 'Portero': 1, 'Defensa': 2, 'Medio': 3, 'Delantero': 4 };
    const playersDetailed: LineupPlayerDetail[] = teamPlayers.map((l): LineupPlayerDetail => {
      const pData = playerMap.get(l.playerName);
      const pts = pData?.jornadasPoints?.[jornada];
      const gls = pData?.jornadasGoals?.[jornada];
      const pdf = pData?.jornadasDef?.[jornada];

      return {
        name: l.playerName,
        realTeam: l.realTeam,
        position: l.position,
        value: l.value,
        points: (typeof pts === 'number' ? pts : '') as number | '',
        goals: (typeof gls === 'number' ? gls : '') as number | '',
        pDef: (typeof pdf === 'number' ? pdf : '') as number | ''
      };
    }).sort((a, b) => (positionOrder[a.position] || 99) - (positionOrder[b.position] || 99) || a.name.localeCompare(b.name));

    return {
      players: playersDetailed,
      totalPoints: teamTotalPoints.toFixed(2),
      totalValue: teamTotalValue.toFixed(0),
      totalGoals: teamTotalGoals,
      totalDefensivePoints: teamTotalDefensivePoints
    };
  }

  public calculateWeeklyScores(jornada: number): StandingScore[] {
    if (isNaN(jornada) || jornada <= 0) return [];
    const teamScores = new Map<string, number>(this.teams.map(t => [t, 0]));
    const playerMap = new Map(this.players.map(p => [p.name, p]));

    this.lineups.forEach(l => {
      if (l.jornada === jornada && teamScores.has(l.team) && l.playerName) {
        const p = playerMap.get(l.playerName);
        const pts = p?.jornadasPoints?.[jornada] || 0;
        teamScores.set(l.team, (teamScores.get(l.team) || 0) + pts);
      }
    });

    return Array.from(teamScores.entries())
      .map(([name, score]) => ({ teamName: name, score: score.toFixed(2) }))
      .sort((a, b) => parseFloat(String(b.score)) - parseFloat(String(a.score)));
  }

  public calculateGeneralScores(maxJornada: number): StandingScore[] {
    if (isNaN(maxJornada) || maxJornada <= 0) return [];
    const teamTotalScores = new Map<string, number>(this.teams.map(t => [t, 0]));
    const playerMap = new Map(this.players.map(p => [p.name, p]));

    this.lineups.forEach(l => {
      if (l.jornada <= maxJornada && teamTotalScores.has(l.team) && l.playerName) {
        const p = playerMap.get(l.playerName);
        const pts = p?.jornadasPoints?.[l.jornada] || 0;
        teamTotalScores.set(l.team, (teamTotalScores.get(l.team) || 0) + pts);
      }
    });

    return Array.from(teamTotalScores.entries())
      .map(([name, score]) => ({ teamName: name, score: score.toFixed(2) }))
      .sort((a, b) => parseFloat(String(b.score)) - parseFloat(String(a.score)));
  }

  public calculateMostGoalsTeams(maxJornada: number): StandingScore[] {
    if (isNaN(maxJornada) || maxJornada <= 0) return [];
    const teamTotalGoals = new Map<string, number>(this.teams.map(t => [t, 0]));
    const playerMap = new Map(this.players.map(p => [p.name, p]));

    this.lineups.forEach(l => {
      if (l.jornada <= maxJornada && teamTotalGoals.has(l.team) && l.playerName) {
        const p = playerMap.get(l.playerName);
        const g = p?.jornadasGoals?.[l.jornada] || 0;
        teamTotalGoals.set(l.team, (teamTotalGoals.get(l.team) || 0) + g);
      }
    });

    return Array.from(teamTotalGoals.entries())
      .map(([name, goals]) => ({ teamName: name, score: goals }))
      .sort((a, b) => Number(b.score) - Number(a.score));
  }

  public calculateLeastConcededTeams(maxJornada: number): StandingScore[] {
    if (isNaN(maxJornada) || maxJornada <= 0) return [];
    const teamTotalPDef = new Map<string, number>(this.teams.map(t => [t, 0]));
    const playerMap = new Map(this.players.map(p => [p.name, p]));

    this.lineups.forEach(l => {
      if (l.jornada <= maxJornada && teamTotalPDef.has(l.team) && l.playerName) {
        const p = playerMap.get(l.playerName);
        if (p && (p.position === 'Portero' || p.position === 'Defensa')) {
          const def = p?.jornadasDef?.[l.jornada] || 0;
          teamTotalPDef.set(l.team, (teamTotalPDef.get(l.team) || 0) + def);
        }
      }
    });

    return Array.from(teamTotalPDef.entries())
      .map(([name, pDef]) => ({ teamName: name, score: pDef }))
      .sort((a, b) => Number(a.score) - Number(b.score));
  }

  public getPlayersForMercado(): Player[] {
    const positionOrder: Record<string, number> = { 'Portero': 1, 'Defensa': 2, 'Medio': 3, 'Delantero': 4, 'N/A': 99 };
    const seen = new Set<string>();
    return this.players
      .filter(p => {
        if (!p.name || !p.name.trim() || p.status === 'Abandona Liga') return false;
        const key = `${p.name.trim().toLowerCase()}_${p.realTeam?.trim().toLowerCase() || ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(p => {
        let total = 0;
        if (p.jornadasPoints) {
          Object.values(p.jornadasPoints).forEach(val => {
            if (typeof val === 'number') total += val;
          });
        }
        return {
          ...p,
          totalPoints: parseFloat(total.toFixed(2))
        };
      })
      .sort((a, b) => {
        const eq = a.realTeam.localeCompare(b.realTeam);
        if (eq !== 0) return eq;
        return (positionOrder[a.position] || 99) - (positionOrder[b.position] || 99);
      });
  }

  public getTeamPlayersForJornada(teamName: string, jornada: number): string[] {
    if (!teamName || isNaN(jornada) || jornada <= 0) return [];
    const seen = new Set<string>();
    return this.lineups
      .filter(l => l.team.trim() === teamName.trim() && l.jornada === jornada && l.playerName.trim() !== '')
      .map(l => l.playerName.trim())
      .filter(name => {
        const key = name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort();
  }

  public getAvailablePlayersForJornada(jornada: number): Player[] {
    if (isNaN(jornada) || jornada <= 0) return [];
    const assignedPlayers = new Set(
      this.lineups
        .filter(l => l.jornada === jornada && l.playerName)
        .map(l => l.playerName.trim().toLowerCase())
    );

    const seen = new Set<string>();
    return this.players
      .filter(p => {
        if (!p.name || !p.name.trim() || p.status === 'Abandona Liga') return false;
        const lowerName = p.name.trim().toLowerCase();
        if (assignedPlayers.has(lowerName)) return false;
        const key = `${lowerName}_${p.realTeam?.trim().toLowerCase() || ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => {
        const teamComp = a.realTeam.localeCompare(b.realTeam);
        if (teamComp !== 0) return teamComp;
        return a.name.localeCompare(b.name);
      });
  }

  public getAvailablePlayersForDraft(): Player[] {
    return this.getAvailablePlayersForJornada(1);
  }

  public processTransfer(
    teamName: string,
    token: string,
    jornada: number,
    playerOut: string | string[],
    playerIn: string | string[],
    isAbandonment: boolean | boolean[]
  ): { success: boolean; message: string } {
    if (Array.isArray(playerOut) && Array.isArray(playerIn)) {
      const transfers = playerOut.map((pOut, idx) => ({
        playerOut: pOut,
        playerIn: playerIn[idx],
        isAbandonment: Array.isArray(isAbandonment) ? isAbandonment[idx] : !!isAbandonment
      }));
      return this.processMultipleTransfers(teamName, token, jornada, transfers);
    }

    return this.processMultipleTransfers(teamName, token, jornada, [{
      playerOut: String(playerOut),
      playerIn: String(playerIn),
      isAbandonment: !!isAbandonment
    }]);
  }

  public processMultipleTransfers(
    teamName: string,
    token: string,
    jornada: number,
    transfers: Array<{ playerOut: string; playerIn: string; isAbandonment?: boolean }>
  ): { success: boolean; message: string } {
    if (!this.validateTeamToken(teamName, token)) {
      return { success: false, message: 'Error de autenticación: Token inválido o equipo incorrecto.' };
    }

    jornada = parseInt(String(jornada), 10);
    teamName = teamName.trim();

    if (!teamName || isNaN(jornada) || jornada <= 0 || !Array.isArray(transfers) || transfers.length === 0) {
      return { success: false, message: 'Datos incompletos o lista de fichajes vacía.' };
    }

    const playerMap = new Map(this.players.map(p => [p.name, p]));
    const currentLineupsForJornada = this.lineups.filter(l => l.jornada === jornada);

    // 1. Validar integridad de la solicitud
    const playersOutSet = new Set<string>();
    const playersInSet = new Set<string>();

    for (let i = 0; i < transfers.length; i++) {
      const t = transfers[i];
      const pOut = (t.playerOut || '').trim();
      const pIn = (t.playerIn || '').trim();

      if (!pOut || !pIn) {
        return { success: false, message: `El fichaje #${i + 1} tiene datos incompletos.` };
      }
      if (pOut === pIn) {
        return { success: false, message: `En el fichaje #${i + 1}, el jugador que entra (${pIn}) no puede ser el mismo que sale.` };
      }
      if (playersOutSet.has(pOut)) {
        return { success: false, message: `El jugador saliente "${pOut}" está duplicado en la lista de fichajes.` };
      }
      if (playersInSet.has(pIn)) {
        return { success: false, message: `El jugador entrante "${pIn}" está duplicado en la lista de fichajes.` };
      }

      playersOutSet.add(pOut);
      playersInSet.add(pIn);

      const isPlayerOutInTeam = currentLineupsForJornada.some(
        l => l.team.trim() === teamName && l.playerName.trim() === pOut
      );
      if (!isPlayerOutInTeam) {
        return { success: false, message: `El jugador "${pOut}" no está alineado en "${teamName}" para la Jornada ${jornada}.` };
      }

      const existingTeamForIn = currentLineupsForJornada.find(l => l.playerName.trim() === pIn);
      if (existingTeamForIn && existingTeamForIn.team.trim() !== teamName) {
        return { success: false, message: `El jugador "${pIn}" ya pertenece a "${existingTeamForIn.team}" en la Jornada ${jornada}.` };
      }

      const realTeamOut = this.getRealTeamOfPlayer(pOut);
      const realTeamIn = this.getRealTeamOfPlayer(pIn);

      if (!realTeamOut || !realTeamIn) {
        return { success: false, message: `Error: No se pudo verificar el equipo de procedencia o destino para "${pOut}" o "${pIn}".` };
      }

      if (!this.isTeamOpenForJornada(jornada, realTeamOut)) {
        return { success: false, message: `Fichaje cancelado: El jugador "${pOut}" está bloqueado porque su equipo (${realTeamOut}) ya jugó o inició su partido.` };
      }

      if (!this.isTeamOpenForJornada(jornada, realTeamIn)) {
        return { success: false, message: `Fichaje cancelado: El jugador "${pIn}" está bloqueado porque su equipo (${realTeamIn}) ya jugó o inició su partido.` };
      }
    }

    // 2. Comprobar valor máximo de equipo
    let totalOutVal = 0;
    let totalInVal = 0;

    transfers.forEach(t => {
      const pOutD = playerMap.get(t.playerOut.trim());
      const pInD = playerMap.get(t.playerIn.trim());
      totalOutVal += typeof pOutD?.value === 'number' ? pOutD.value : 0;
      totalInVal += typeof pInD?.value === 'number' ? pInD.value : 0;
    });

    const currentVal = this.calculateTeamValue(teamName, jornada);
    const potentialNewVal = currentVal - totalOutVal + totalInVal;

    if (potentialNewVal > MAX_TEAM_VALUE) {
      return {
        success: false,
        message: `El total de fichajes excede el valor máximo del equipo (${MAX_TEAM_VALUE}). Valor actual: ${currentVal}, Nuevo valor previsto: ${potentialNewVal}.`
      };
    }

    // 3. Conteo de fichajes normales para calcular costes
    let normalTransfersCount = this.transfers.filter(
      tr => tr.team.trim() === teamName && tr.type === 'Normal'
    ).length;

    const processedSummary: string[] = [];

    // 4. Aplicar cambios a line-up e historial
    transfers.forEach(t => {
      const pOut = t.playerOut.trim();
      const pIn = t.playerIn.trim();
      const isAbandon = !!t.isAbandonment;
      const pInDetails = playerMap.get(pIn);

      const lineupEntry = this.lineups.find(
        l => l.team.trim() === teamName && l.jornada === jornada && l.playerName.trim() === pOut
      );

      if (lineupEntry && pInDetails) {
        lineupEntry.playerName = pIn;
        lineupEntry.realTeam = pInDetails.realTeam;
        lineupEntry.position = pInDetails.position;
        lineupEntry.value = pInDetails.value;

        let cost = 0;
        let transferType: 'Normal' | 'Abandono' = 'Normal';

        const pOutObj = this.players.find(p => p.name === pOut);
        const pInObj = this.players.find(p => p.name === pIn);

        if (isAbandon) {
          if (pOutObj) pOutObj.status = 'Abandona Liga';
          transferType = 'Abandono';
        } else {
          if (pOutObj) pOutObj.status = 'Disponible';
          if (normalTransfersCount >= FREE_TRANSFERS_PER_TEAM) {
            cost = TRANSFER_COST;
          }
          normalTransfersCount++;
        }

        if (pInObj) pInObj.status = 'Fichado';

        const now = new Date();
        const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ', ' +
                        now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + 'h';

        this.transfers.unshift({
          timestamp: dateStr,
          team: teamName,
          jornada,
          playerOut: pOut,
          playerIn: pIn,
          cost,
          type: transferType
        });

        processedSummary.push(`${pIn} por ${pOut} (${cost === 0 ? 'Gratis' : cost + '€'})`);
      }
    });

    this.saveState();

    return {
      success: true,
      message: `Fichaje(s) completado(s): ${processedSummary.join(', ')}. Nuevo valor del equipo: ${potentialNewVal}M.`
    };
  }

  public processDraftSelection(teamName: string, token: string, playerName: string): { success: boolean; message: string } {
    const JORNADA_DRAFT = 1;
    if (!this.validateTeamToken(teamName, token)) {
      return { success: false, message: 'Error de autenticación: Token inválido o equipo incorrecto.' };
    }

    teamName = teamName.trim();
    playerName = playerName.trim();

    if (!teamName || !playerName) {
      return { success: false, message: 'Datos incompletos. Selecciona equipo y jugador.' };
    }

    const currentLineupsJ1 = this.lineups.filter(l => l.jornada === JORNADA_DRAFT);
    const isAlreadyDrafted = currentLineupsJ1.some(l => l.playerName.trim() === playerName);

    if (isAlreadyDrafted) {
      const draftingTeam = currentLineupsJ1.find(l => l.playerName.trim() === playerName)?.team || 'otro equipo';
      return { success: false, message: `El jugador "${playerName}" ya ha sido seleccionado por "${draftingTeam}".` };
    }

    const playersInTeam = currentLineupsJ1.filter(l => l.team.trim() === teamName);
    if (playersInTeam.length >= MAX_DRAFT_PLAYERS_PER_TEAM) {
      return { success: false, message: `El equipo "${teamName}" ya tiene ${MAX_DRAFT_PLAYERS_PER_TEAM} jugadores seleccionados para el Draft.` };
    }

    const playerDetails = this.players.find(p => p.name === playerName);
    if (!playerDetails) {
      return { success: false, message: `Error: No se encontraron detalles para "${playerName}".` };
    }
    if (playerDetails.status === 'Abandona Liga') {
      return { success: false, message: `El jugador "${playerName}" no está disponible en la liga.` };
    }

    const playerVal = typeof playerDetails.value === 'number' ? playerDetails.value : 0;
    const currentTeamVal = this.calculateTeamValue(teamName, JORNADA_DRAFT);
    const potentialNewVal = currentTeamVal + playerVal;

    if (potentialNewVal > MAX_TEAM_VALUE) {
      return { success: false, message: `La selección excede el valor máximo del equipo (${MAX_TEAM_VALUE}). Valor actual: ${currentTeamVal}, Jugador: ${playerVal}, Potencial: ${potentialNewVal}.` };
    }

    this.lineups.push({
      team: teamName,
      jornada: JORNADA_DRAFT,
      playerName,
      realTeam: playerDetails.realTeam,
      position: playerDetails.position,
      value: playerDetails.value
    });

    playerDetails.status = 'Fichado';

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ', ' +
                    now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + 'h';

    this.drafts.unshift({
      timestamp: dateStr,
      team: teamName,
      playerName,
      realTeam: playerDetails.realTeam,
      position: playerDetails.position,
      value: playerDetails.value
    });

    this.saveState();

    return {
      success: true,
      message: `¡Selección completada! "${playerName}" se une a "${teamName}". Valor actual del equipo: ${potentialNewVal}. Jugadores: ${playersInTeam.length + 1}/${MAX_DRAFT_PLAYERS_PER_TEAM}.`
    };
  }

  public getTransferHistory(): TransferRecord[] {
    return [...this.transfers];
  }

  public getDraftHistory(): DraftRecord[] {
    return [...this.drafts];
  }

  public getAccountingData(): AccountingData {
    const maxJornada = this.getMaxJornadaFromPlayersSheet();
    const numTeams = this.getNumberOfTeams();
    const teamNames = this.getTeamNames();
    const transferHistory = this.getTransferHistory();

    let totalContributions = 0;
    let totalTransferFees = 0;
    let totalPrizeMoneyAwarded = 0;

    const teamBalanceMap = new Map<string, { contributions: number; transferFees: number; prizes: number; balance: number }>();
    teamNames.forEach(name => {
      teamBalanceMap.set(name, { contributions: 0, transferFees: 0, prizes: 0, balance: 0 });
    });

    const findTeamKey = (name: string): string | null => {
      if (!name) return null;
      if (teamBalanceMap.has(name)) return name;
      const clean = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      for (const t of teamNames) {
        const cleanT = t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        if (cleanT === clean || cleanT.includes(clean) || clean.includes(cleanT)) {
          return t;
        }
      }
      return null;
    };

    // 1. Costes de fichajes por equipo
    const teamTransfers = new Map<string, TransferRecord[]>();
    teamNames.forEach(t => teamTransfers.set(t, []));

    transferHistory.forEach(tr => {
      const matched = findTeamKey(tr.team);
      if (matched) {
        teamTransfers.get(matched)?.push(tr);
      }
    });

    teamTransfers.forEach((trList, tName) => {
      const b = teamBalanceMap.get(tName);
      if (!b) return;

      let teamNormalCount = 0;
      let teamFees = 0;

      trList.forEach(tr => {
        const cost = parseCleanNumber(tr.cost);
        const isAbandon = tr.type === 'Abandono' || (tr as any).motivo === 'Abandono';

        if (cost > 0) {
          teamFees += cost;
          if (!isAbandon) teamNormalCount++;
        } else if (!isAbandon) {
          // Aplicar regla oficial de la liga: 3 fichajes gratis por equipo, y 2.00€ para posteriores
          if (teamNormalCount >= FREE_TRANSFERS_PER_TEAM) {
            teamFees += TRANSFER_COST;
            tr.cost = TRANSFER_COST;
          }
          teamNormalCount++;
        }
      });

      b.transferFees = teamFees;
      totalTransferFees += teamFees;
    });

    // 2. Aportes y premios semanales
    for (let j = 4; j <= maxJornada; j++) {
      totalContributions += numTeams * WEEKLY_CONTRIBUTION;
      teamNames.forEach(tName => {
        const b = teamBalanceMap.get(tName);
        if (b) b.contributions += WEEKLY_CONTRIBUTION;
      });

      const weeklyRanking = this.calculateWeeklyScores(j);
      if (weeklyRanking.length > 0 && parseFloat(String(weeklyRanking[0].score)) > 0) {
        const topScore = weeklyRanking[0].score;
        const winners = weeklyRanking.filter(team => team.score === topScore);
        const totalPrize = numTeams * 1;
        const individualPrize = totalPrize / winners.length;
        totalPrizeMoneyAwarded += totalPrize;

        winners.forEach(winner => {
          const matched = findTeamKey(winner.teamName);
          if (matched) {
            const b = teamBalanceMap.get(matched);
            if (b) b.prizes += individualPrize;
          }
        });
      }
    }

    teamBalanceMap.forEach(details => {
      details.balance = details.prizes - details.contributions - details.transferFees;
    });

    const totalCajaBeforeFinalPrizes = totalContributions + totalTransferFees - totalPrizeMoneyAwarded;
    const finalJornada = 38;
    const isFinalJornada = maxJornada >= finalJornada;
    const potToDistribute = Math.max(0, totalCajaBeforeFinalPrizes);

    // 3. Reparto de Premios Finales
    const is6Teams = numTeams === 6;
    const p1Pct = is6Teams ? 0.335 : 0.30;
    const p2Pct = is6Teams ? 0.255 : 0.23;
    const p3Pct = is6Teams ? 0.190 : 0.17;
    const pPenultPct = is6Teams ? 0.0 : 0.10;
    const pGoalsPct = is6Teams ? 0.110 : 0.10;
    const pDefPct = is6Teams ? 0.110 : 0.10;

    const generalScores = this.calculateGeneralScores(maxJornada);
    const mostGoals = this.calculateMostGoalsTeams(maxJornada);
    const leastConceded = this.calculateLeastConcededTeams(maxJornada);

    const teamFinalPrizesMap = new Map<string, number>();
    teamNames.forEach(t => teamFinalPrizesMap.set(t, 0));

    const finalPrizes: FinalPrize[] = [];
    const finalPrizeAmounts: Record<string, string> = {};

    // 1ª Posición General
    if (generalScores.length > 0) {
      const t1 = generalScores[0].teamName;
      const amt1 = potToDistribute * p1Pct;
      teamFinalPrizesMap.set(t1, (teamFinalPrizesMap.get(t1) || 0) + amt1);
      finalPrizes.push({
        type: '1ª Posición General',
        team: t1,
        percentage: (p1Pct * 100).toFixed(1) + '%',
        prize: amt1.toFixed(2),
        categoryPrize: amt1.toFixed(2)
      });
      finalPrizeAmounts['1ª Posición General'] = amt1.toFixed(2);
    }

    // 2ª Posición General
    if (generalScores.length > 1) {
      const t2 = generalScores[1].teamName;
      const amt2 = potToDistribute * p2Pct;
      teamFinalPrizesMap.set(t2, (teamFinalPrizesMap.get(t2) || 0) + amt2);
      finalPrizes.push({
        type: '2ª Posición General',
        team: t2,
        percentage: (p2Pct * 100).toFixed(1) + '%',
        prize: amt2.toFixed(2),
        categoryPrize: amt2.toFixed(2)
      });
      finalPrizeAmounts['2ª Posición General'] = amt2.toFixed(2);
    }

    // 3ª Posición General
    if (generalScores.length > 2) {
      const t3 = generalScores[2].teamName;
      const amt3 = potToDistribute * p3Pct;
      teamFinalPrizesMap.set(t3, (teamFinalPrizesMap.get(t3) || 0) + amt3);
      finalPrizes.push({
        type: '3ª Posición General',
        team: t3,
        percentage: (p3Pct * 100).toFixed(1) + '%',
        prize: amt3.toFixed(2),
        categoryPrize: amt3.toFixed(2)
      });
      finalPrizeAmounts['3ª Posición General'] = amt3.toFixed(2);
    }

    // Penúltima Posición General (si no son 6 equipos)
    if (!is6Teams && generalScores.length >= 4) {
      const tPenult = generalScores[generalScores.length - 2].teamName;
      const amtPenult = potToDistribute * pPenultPct;
      teamFinalPrizesMap.set(tPenult, (teamFinalPrizesMap.get(tPenult) || 0) + amtPenult);
      finalPrizes.push({
        type: 'Penúltima Posición General',
        team: tPenult,
        percentage: (pPenultPct * 100).toFixed(1) + '%',
        prize: amtPenult.toFixed(2),
        categoryPrize: amtPenult.toFixed(2)
      });
      finalPrizeAmounts['Penúltima Posición General'] = amtPenult.toFixed(2);
    }

    // Equipo Más Goleador
    if (mostGoals.length > 0) {
      const topGoals = mostGoals[0].score;
      const winners = mostGoals.filter(t => t.score === topGoals);
      const totalGoalsPrize = potToDistribute * pGoalsPct;
      const indGoalsPrize = totalGoalsPrize / winners.length;
      winners.forEach(w => {
        teamFinalPrizesMap.set(w.teamName, (teamFinalPrizesMap.get(w.teamName) || 0) + indGoalsPrize);
      });
      finalPrizes.push({
        type: 'Equipo Más Goleador',
        team: winners.map(w => w.teamName).join(', '),
        percentage: (pGoalsPct * 100).toFixed(1) + '%',
        prize: totalGoalsPrize.toFixed(2),
        categoryPrize: totalGoalsPrize.toFixed(2)
      });
      finalPrizeAmounts['Equipo Más Goleador'] = totalGoalsPrize.toFixed(2);
    }

    // Equipo Menos Goleado
    if (leastConceded.length > 0) {
      const topDef = leastConceded[0].score;
      const winners = leastConceded.filter(t => t.score === topDef);
      const totalDefPrize = potToDistribute * pDefPct;
      const indDefPrize = totalDefPrize / winners.length;
      winners.forEach(w => {
        teamFinalPrizesMap.set(w.teamName, (teamFinalPrizesMap.get(w.teamName) || 0) + indDefPrize);
      });
      finalPrizes.push({
        type: 'Equipo Menos Goleado',
        team: winners.map(w => w.teamName).join(', '),
        percentage: (pDefPct * 100).toFixed(1) + '%',
        prize: totalDefPrize.toFixed(2),
        categoryPrize: totalDefPrize.toFixed(2)
      });
      finalPrizeAmounts['Equipo Menos Goleado'] = totalDefPrize.toFixed(2);
    }

    // 4. Balance Final Definitivo por Equipo (Liquidación)
    const finalBalanceDetails: FinalBalanceDetail[] = Array.from(teamBalanceMap.entries()).map(([team, details]) => {
      const balJornadas = details.balance;
      const pFinal = teamFinalPrizesMap.get(team) || 0;
      const totalFin = balJornadas + pFinal;
      return {
        team,
        balanceJornadas: balJornadas.toFixed(2),
        premioFinal: pFinal.toFixed(2),
        totalFinal: totalFin.toFixed(2)
      };
    }).sort((a, b) => parseFloat(b.totalFinal) - parseFloat(a.totalFinal));

    // Tras el reparto final de premios realizado al final de la Jornada 38, la caja acumulada es 0
    const finalCajaAfterFinalPrizes = "0.00";

    return {
      maxJornada,
      numTeams,
      totalContributions: totalContributions.toFixed(2),
      totalTransferFees: totalTransferFees.toFixed(2),
      totalPrizeMoneyAwarded: totalPrizeMoneyAwarded.toFixed(2),
      finalCajaBeforeFinalPrizes: totalCajaBeforeFinalPrizes.toFixed(2),
      finalCajaAfterFinalPrizes,
      teamBalanceDetails: Array.from(teamBalanceMap.entries()).map(([team, details]) => ({
        team,
        contributions: details.contributions.toFixed(2),
        transferFees: details.transferFees.toFixed(2),
        prizes: details.prizes.toFixed(2),
        balance: details.balance.toFixed(2)
      })).sort((a, b) => a.team.localeCompare(b.team)),
      finalPrizes,
      finalPrizeAmounts,
      finalBalanceDetails,
      isFinalJornada
    };
  }

  // --- Gráficas Helpers ---
  public getInitialChartData() {
    return {
      teams: this.getTeamNames(),
      maxJornada: this.getMaxJornada()
    };
  }

  public getTeamWeeklyScoresChartData(teamName: string) {
    const maxJornada = this.getMaxJornada();
    const labels: string[] = [];
    const scores: number[] = [];

    for (let j = 1; j <= maxJornada; j++) {
      labels.push(`J${j}`);
      const weekly = this.calculateWeeklyScores(j);
      const teamScore = weekly.find(t => t.teamName === teamName);
      scores.push(teamScore ? parseFloat(String(teamScore.score)) : 0);
    }
    return { labels, scores };
  }

  public getGroupedWeeklyScores() {
    const teamNames = this.getTeamNames();
    const maxJornada = this.getMaxJornada();
    if (maxJornada === 0) return { labels: [], datasets: [] };

    const labels = Array.from({ length: maxJornada }, (_, i) => `J${i + 1}`);
    const datasets = teamNames.map(teamName => {
      const data: number[] = [];
      for (let j = 1; j <= maxJornada; j++) {
        const weekly = this.calculateWeeklyScores(j);
        const score = weekly.find(t => t.teamName === teamName)?.score || 0;
        data.push(parseFloat(String(score)));
      }
      return { label: teamName, data };
    });

    return { labels, datasets };
  }

  public getGeneralEvolutionChartData() {
    const teamNames = this.getTeamNames();
    const maxJornada = this.getMaxJornada();
    const labels = Array.from({ length: maxJornada }, (_, i) => `J${i + 1}`);

    const teamTotals = new Map<string, number>(teamNames.map(t => [t, 0]));
    const datasets = teamNames.map(teamName => {
      const data: number[] = [];
      let total = 0;
      for (let j = 1; j <= maxJornada; j++) {
        const weekly = this.calculateWeeklyScores(j);
        const score = parseFloat(String(weekly.find(t => t.teamName === teamName)?.score || 0));
        total += score;
        data.push(parseFloat(total.toFixed(2)));
      }
      return { label: teamName, data };
    });

    return { labels, datasets };
  }

  // --- Admin API Functions ---

  public verifyAdminPassword(password: string): boolean {
    return String(password || '').trim() === ADMIN_PASSWORD;
  }

  public getTeamTokensAdmin(adminPass: string): { success: boolean; message?: string; tokens: TeamToken[] } {
    if (!this.verifyAdminPassword(adminPass)) {
      return { success: false, message: 'Acceso no autorizado.', tokens: [] };
    }
    return { success: true, tokens: [...this.tokens] };
  }

  public addTeamTokenWeb(adminPass: string, teamName: string, tokenValue?: string): { success: boolean; message: string } {
    if (!this.verifyAdminPassword(adminPass)) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }
    const team = (teamName || '').trim();
    if (!team) return { success: false, message: 'El nombre del equipo no puede estar vacío.' };

    const token = (tokenValue || '').trim() || crypto.randomUUID();

    if (!this.teams.includes(team)) {
      this.teams.push(team);
    }

    const existingIdx = this.tokens.findIndex(t => t.team.toLowerCase() === team.toLowerCase());
    if (existingIdx !== -1) {
      this.tokens[existingIdx].token = token;
    } else {
      this.tokens.push({ team, token });
    }

    this.saveState();
    return { success: true, message: `Equipo '${team}' añadido correctamente con token.` };
  }

  public editTeamTokenWeb(adminPass: string, oldTeamName: string, newTeamName: string, newTokenValue: string): { success: boolean; message: string } {
    if (!this.verifyAdminPassword(adminPass)) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }
    const oldTarget = (oldTeamName || '').trim().toLowerCase();
    const newTeam = (newTeamName || '').trim();
    const newToken = (newTokenValue || '').trim();

    if (!newTeam || !newToken) {
      return { success: false, message: 'El nombre y el token no pueden estar vacíos.' };
    }

    const tokenEntry = this.tokens.find(t => t.team.toLowerCase() === oldTarget);
    if (!tokenEntry) return { success: false, message: 'No se encontró el equipo para editar.' };

    tokenEntry.team = newTeam;
    tokenEntry.token = newToken;

    const teamIdx = this.teams.findIndex(t => t.toLowerCase() === oldTarget);
    if (teamIdx !== -1) {
      this.teams[teamIdx] = newTeam;
    }

    // Update lineups & histories
    this.lineups.forEach(l => {
      if (l.team.toLowerCase() === oldTarget) l.team = newTeam;
    });
    this.transfers.forEach(tr => {
      if (tr.team.toLowerCase() === oldTarget) tr.team = newTeam;
    });
    this.drafts.forEach(d => {
      if (d.team.toLowerCase() === oldTarget) d.team = newTeam;
    });

    this.saveState();
    return { success: true, message: 'Equipo y token actualizados correctamente.' };
  }

  public deleteTeamTokenWeb(adminPass: string, teamName: string): { success: boolean; message: string } {
    if (!this.verifyAdminPassword(adminPass)) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }
    const target = (teamName || '').trim().toLowerCase();
    this.tokens = this.tokens.filter(t => t.team.toLowerCase() !== target);
    this.teams = this.teams.filter(t => t.toLowerCase() !== target);
    this.saveState();
    return { success: true, message: `Equipo '${teamName}' eliminado.` };
  }

  public generateTeamTokensWeb(adminPass: string): { success: boolean; message: string } {
    if (!this.verifyAdminPassword(adminPass)) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }
    this.tokens = this.teams.map(team => ({
      team,
      token: crypto.randomUUID()
    }));
    this.saveState();
    return { success: true, message: `Se generaron ${this.tokens.length} tokens correctamente.` };
  }

  public copyLastJornadaAlineacionesWeb(adminPass: string): { success: boolean; message: string } {
    if (!this.verifyAdminPassword(adminPass)) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }
    const maxLineupsJ = this.getMaxJornadaFromAlineacionesSheet();
    const targetJornada = maxLineupsJ + 1;

    const lastLineup = this.lineups.filter(l => l.jornada === maxLineupsJ && l.playerName);
    if (lastLineup.length === 0) {
      return { success: false, message: `No se encontraron alineaciones en la Jornada ${maxLineupsJ}.` };
    }

    const playerMap = new Map(this.players.map(p => [p.name, p]));
    const newJornadaData: LineupEntry[] = lastLineup.map(l => {
      const pD = playerMap.get(l.playerName);
      return {
        team: l.team,
        jornada: targetJornada,
        playerName: l.playerName,
        realTeam: pD?.realTeam || l.realTeam || 'N/A',
        position: pD?.position || l.position || 'N/A',
        value: pD?.value ?? l.value ?? ''
      };
    });

    this.lineups.push(...newJornadaData);
    this.saveState();
    return { success: true, message: `Se copiaron ${newJornadaData.length} alineaciones de la J${maxLineupsJ} a la J${targetJornada}.` };
  }

  public saveScheduleDeadline(adminPass: string, jornada: number, realTeam: string, deadlineIsoString: string): { success: boolean; message: string } {
    if (!this.verifyAdminPassword(adminPass)) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }
    jornada = parseInt(String(jornada), 10);
    realTeam = realTeam.trim();

    const existingIdx = this.schedules.findIndex(s => s.jornada === jornada && s.realTeam.toLowerCase() === realTeam.toLowerCase());
    if (existingIdx !== -1) {
      this.schedules[existingIdx].deadlineIsoString = deadlineIsoString;
    } else {
      this.schedules.push({ jornada, realTeam, deadlineIsoString });
    }

    this.saveState();
    return { success: true, message: `Límite registrado para ${realTeam} (J${jornada}): ${deadlineIsoString}` };
  }

  public getRealTeamsList(): string[] {
    return [...INITIAL_REAL_TEAMS].sort();
  }

  public getAdminTeamNamesList(adminPass: string): string[] {
    if (!this.verifyAdminPassword(adminPass)) return [];
    return this.getTeamNames();
  }

  public getTeamJornadasReport(adminPass: string, teamName: string, startJ: number, endJ: number): TeamJornadasReportResponse {
    if (!this.verifyAdminPassword(adminPass)) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }
    startJ = parseInt(String(startJ), 10);
    endJ = parseInt(String(endJ), 10);

    const jornadasList: number[] = [];
    for (let j = startJ; j <= endJ; j++) jornadasList.push(j);

    const playerMap = new Map(this.players.map(p => [p.name, p]));
    const teamPlayersSet = new Set<string>();

    this.lineups.forEach(l => {
      if (l.team.trim() === teamName.trim() && l.jornada >= startJ && l.jornada <= endJ && l.playerName) {
        teamPlayersSet.add(l.playerName.trim());
      }
    });

    const rows = Array.from(teamPlayersSet).map(pName => {
      const pData = playerMap.get(pName);
      const jDetails = jornadasList.map(j => {
        const isInLineup = this.lineups.some(l => l.team.trim() === teamName.trim() && l.jornada === j && l.playerName.trim() === pName);
        if (!isInLineup) {
          return { pts: '-', goles: '-', defPts: '-' };
        }
        return {
          pts: pData?.jornadasPoints?.[j] ?? 0,
          goles: pData?.jornadasGoals?.[j] ?? 0,
          defPts: pData?.jornadasDef?.[j] ?? 0
        };
      });

      return {
        name: pName,
        realTeam: pData?.realTeam || 'N/A',
        position: pData?.position || 'N/A',
        jornadasDetails: jDetails
      };
    });

    return {
      success: true,
      teamName,
      jornadas: jornadasList,
      rows
    };
  }
}

export const gasEngine = new GasEngineService();
