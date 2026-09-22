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
  TeamJornadasReportResponse,
  ClubStyle,
  NotificationConfig,
  LeagueConfig,
  LeagueTexts,
  DraftRoundOrder
} from '../types/league';
import { generateCustomGasCode } from '../data/gasTemplates';

// Constants matching Código.gs exactly
export const MAX_TEAM_VALUE = 200;
export const MAX_DRAFT_PLAYERS_PER_TEAM = 11;
export const WEEKLY_CONTRIBUTION = 1.5;
export const TRANSFER_COST = 2;
export const FREE_TRANSFERS_PER_TEAM = 3;
export const ADMIN_PASSWORD = 'admin';

export const DEFAULT_CLUB_STYLES: ClubStyle[] = [
  { code: 'RMA', name: 'Real Madrid', bgColor: '#FFFFFF', textColor: '#0f172a', borderColor: '#f59e0b' },
  { code: 'BAR', name: 'FC Barcelona', bgColor: '#004d98', textColor: '#edbb00', borderColor: '#a50044' },
  { code: 'ATM', name: 'Atlético de Madrid', bgColor: '#cb3524', textColor: '#ffffff', borderColor: '#272e61' },
  { code: 'VIL', name: 'Villarreal CF', bgColor: '#FFFF00', textColor: '#000000', borderColor: '#005187' },
  { code: 'ATH', name: 'Athletic Club', bgColor: '#ee2524', textColor: '#ffffff', borderColor: '#000000' },
  { code: 'RSO', name: 'Real Sociedad', bgColor: '#0067b1', textColor: '#ffffff', borderColor: '#ffffff' },
  { code: 'BET', name: 'Real Betis', bgColor: '#00954c', textColor: '#ffffff', borderColor: '#ffffff' },
  { code: 'SEV', name: 'Sevilla FC', bgColor: '#d4001f', textColor: '#ffffff', borderColor: '#ffffff' },
  { code: 'VAL', name: 'Valencia CF', bgColor: '#ee7500', textColor: '#ffffff', borderColor: '#000000' },
  { code: 'ESP', name: 'RCD Espanyol', bgColor: '#007fc8', textColor: '#ffffff', borderColor: '#ffffff' },
  { code: 'GET', name: 'Getafe CF', bgColor: '#00529f', textColor: '#ffffff', borderColor: '#003366' },
  { code: 'CEL', name: 'RC Celta', bgColor: '#87ceeb', textColor: '#082f49', borderColor: '#dc2626' },
  { code: 'ALV', name: 'Deportivo Alavés', bgColor: '#004fa3', textColor: '#ffffff', borderColor: '#ffffff' },
  { code: 'MLL', name: 'RCD Mallorca', bgColor: '#bd1b23', textColor: '#ffffff', borderColor: '#000000' },
  { code: 'OSA', name: 'CA Osasuna', bgColor: '#9e1b32', textColor: '#ffffff', borderColor: '#0a1e3f' },
  { code: 'RAY', name: 'Rayo Vallecano', bgColor: '#ffffff', textColor: '#e11d48', borderColor: '#e11d48' },
  { code: 'GIR', name: 'Girona FC', bgColor: '#d81e05', textColor: '#ffffff', borderColor: '#ffffff' },
  { code: 'LEG', name: 'CD Leganés', bgColor: '#0055a5', textColor: '#ffffff', borderColor: '#ffffff' },
  { code: 'LGD', name: 'CD Leganés', bgColor: '#0055a5', textColor: '#ffffff', borderColor: '#ffffff' },
  { code: 'VLD', name: 'Real Valladolid', bgColor: '#660099', textColor: '#ffffff', borderColor: '#ffffff' },
  { code: 'OVI', name: 'Real Oviedo', bgColor: '#0047ab', textColor: '#ffffff', borderColor: '#ffffff' }
];

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

export function canonicalizeRealTeam(team: string): string {
  if (!team) return '';
  const clean = team.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const aliases: Record<string, string> = {
    'real madrid': 'RMA', 'madrid': 'RMA', 'rma': 'RMA',
    'barcelona': 'BAR', 'fc barcelona': 'BAR', 'barca': 'BAR', 'bar': 'BAR',
    'atletico de madrid': 'ATM', 'atletico': 'ATM', 'atm': 'ATM',
    'athletic club': 'ATH', 'athletic': 'ATH', 'bilbao': 'ATH', 'ath': 'ATH',
    'villarreal': 'VIL', 'vil': 'VIL',
    'real betis': 'BET', 'betis': 'BET', 'bet': 'BET',
    'real sociedad': 'RSO', 'la real': 'RSO', 'sociedad': 'RSO', 'rso': 'RSO',
    'sevilla': 'SEV', 'sevilla fc': 'SEV', 'sev': 'SEV',
    'celta de vigo': 'CEL', 'celta': 'CEL', 'cel': 'CEL',
    'valencia': 'VAL', 'valencia cf': 'VAL', 'val': 'VAL',
    'osasuna': 'OSA', 'ca osasuna': 'OSA', 'osa': 'OSA',
    'rayo vallecano': 'RAY', 'rayo': 'RAY', 'ray': 'RAY',
    'espanyol': 'ESP', 'rcd espanyol': 'ESP', 'esp': 'ESP',
    'girona': 'GIR', 'girona fc': 'GIR', 'gir': 'GIR',
    'leganes': 'LEG', 'cd leganes': 'LEG', 'leg': 'LEG',
    'alaves': 'ALV', 'deportivo alaves': 'ALV', 'alv': 'ALV',
    'mallorca': 'MLL', 'rcd mallorca': 'MLL', 'mll': 'MLL',
    'las palmas': 'LPA', 'ud las palmas': 'LPA', 'lpa': 'LPA',
    'getafe': 'GET', 'getafe cf': 'GET', 'get': 'GET',
    'valladolid': 'VLD', 'real valladolid': 'VLD', 'vld': 'VLD', 'vll': 'VLD'
  };
  return aliases[clean] || clean.toUpperCase();
}

// Initial Starter Dataset
const INITIAL_TEAMS: string[] = [
  'BRIKKOMARIAN',
  'DOVIS',
  'FREDERER',
  'LA AUDINETA',
  'MERENDOLO',
  'PLAYA DE CUEVA',
];

const INITIAL_TOKENS: TeamToken[] = [
  { team: 'BRIKKOMARIAN', token: 'arbitro' },
  { team: 'DOVIS', token: 'porteria' },
  { team: 'FREDERER', token: 'titular' },
  { team: 'LA AUDINETA', token: 'fichaje' },
  { team: 'MERENDOLO', token: 'empate' },
  { team: 'PLAYA DE CUEVA', token: 'suplente' },
];

const INITIAL_REAL_TEAMS: string[] = [
  'ALV', 'ATH', 'ATM', 'BAR', 'BET', 'CEL', 'ESP', 'GET', 'GIR', 
  'MLL', 'OSA', 'RAY', 'RMA', 'RSO', 'SEV', 'VAL', 'VIL', 'LEG', 'LPA', 'VLD'
];

const INITIAL_PLAYERS: Player[] = [
  // Porteros
  { name: 'Thibaut Courtois', realTeam: 'RMA', position: 'Portero', value: 18, status: 'Disponible', jornadasPoints: { 1: 8, 2: 7, 3: 9, 4: 6, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 0 } },
  { name: 'Marc-André ter Stegen', realTeam: 'BAR', position: 'Portero', value: 16, status: 'Disponible', jornadasPoints: { 1: 6, 2: 9, 3: 6, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 2, 4: 0, 5: 1 } },
  { name: 'Jan Oblak', realTeam: 'ATM', position: 'Portero', value: 16, status: 'Disponible', jornadasPoints: { 1: 7, 2: 6, 3: 8, 4: 7, 5: 9 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 2, 3: 0, 4: 1, 5: 0 } },
  { name: 'Unai Simón', realTeam: 'ATH', position: 'Portero', value: 14, status: 'Disponible', jornadasPoints: { 1: 8, 2: 6, 3: 7, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 1 } },
  { name: 'Álex Remiro', realTeam: 'RSO', position: 'Portero', value: 13, status: 'Disponible', jornadasPoints: { 1: 6, 2: 7, 3: 6, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 } },
  { name: 'David Soria', realTeam: 'GET', position: 'Portero', value: 11, status: 'Disponible', jornadasPoints: { 1: 7, 2: 5, 3: 6, 4: 7, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 2, 3: 1, 4: 1, 5: 2 } },
  { name: 'Paulo Gazzaniga', realTeam: 'GIR', position: 'Portero', value: 10, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 5, 4: 7, 5: 5 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Rui Silva', realTeam: 'BET', position: 'Portero', value: 9, status: 'Disponible', jornadasPoints: { 1: 5, 2: 6, 3: 7, 4: 5, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 0, 4: 2, 5: 1 } },
  { name: 'Stole Dimitrievski', realTeam: 'VAL', position: 'Portero', value: 8, status: 'Disponible', jornadasPoints: { 1: 6, 2: 5, 3: 6, 4: 6, 5: 5 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 2, 3: 1, 4: 2, 5: 2 } },

  // Defensas
  { name: 'Antonio Rüdiger', realTeam: 'RMA', position: 'Defensa', value: 16, status: 'Disponible', jornadasPoints: { 1: 8, 2: 9, 3: 7, 4: 8, 5: 10 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 0 } },
  { name: 'Dani Carvajal', realTeam: 'RMA', position: 'Defensa', value: 15, status: 'Disponible', jornadasPoints: { 1: 7, 2: 8, 3: 9, 4: 6, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 0 } },
  { name: 'Jules Koundé', realTeam: 'BAR', position: 'Defensa', value: 15, status: 'Disponible', jornadasPoints: { 1: 8, 2: 7, 3: 9, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 2, 4: 0, 5: 1 } },
  { name: 'Pau Cubarsí', realTeam: 'BAR', position: 'Defensa', value: 14, status: 'Disponible', jornadasPoints: { 1: 7, 2: 8, 3: 7, 4: 9, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 2, 4: 0, 5: 1 } },
  { name: 'Alejandro Balde', realTeam: 'BAR', position: 'Defensa', value: 13, status: 'Disponible', jornadasPoints: { 1: 7, 2: 7, 3: 8, 4: 7, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 2, 4: 0, 5: 1 } },
  { name: 'Robin Le Normand', realTeam: 'ATM', position: 'Defensa', value: 14, status: 'Disponible', jornadasPoints: { 1: 7, 2: 6, 3: 8, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 2, 3: 0, 4: 1, 5: 0 } },
  { name: 'José María Giménez', realTeam: 'ATM', position: 'Defensa', value: 13, status: 'Disponible', jornadasPoints: { 1: 6, 2: 7, 3: 7, 4: 8, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 2, 3: 0, 4: 1, 5: 0 } },
  { name: 'Daniel Vivian', realTeam: 'ATH', position: 'Defensa', value: 13, status: 'Disponible', jornadasPoints: { 1: 8, 2: 7, 3: 6, 4: 7, 5: 8 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 1 } },
  { name: 'Aitor Paredes', realTeam: 'ATH', position: 'Defensa', value: 11, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 7, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 1 } },
  { name: 'Jon Pacheco', realTeam: 'RSO', position: 'Defensa', value: 10, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 6, 4: 7, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 } },
  { name: 'Cristhian Mosquera', realTeam: 'VAL', position: 'Defensa', value: 11, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 5, 4: 7, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 2, 3: 1, 4: 2, 5: 2 } },
  { name: 'Diego Rico', realTeam: 'GET', position: 'Defensa', value: 10, status: 'Disponible', jornadasPoints: { 1: 7, 2: 6, 3: 6, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 2, 3: 1, 4: 1, 5: 2 } },
  { name: 'Daley Blind', realTeam: 'GIR', position: 'Defensa', value: 12, status: 'Disponible', jornadasPoints: { 1: 7, 2: 6, 3: 7, 4: 8, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Marc Bartra', realTeam: 'BET', position: 'Defensa', value: 10, status: 'Disponible', jornadasPoints: { 1: 8, 2: 6, 3: 6, 4: 6, 5: 7 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 0, 4: 2, 5: 1 } },
  { name: 'Nemanja Gudelj', realTeam: 'SEV', position: 'Defensa', value: 9, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 5, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Mika Màrmol', realTeam: 'LPA', position: 'Defensa', value: 9, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 6, 4: 5, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 2, 3: 1, 4: 2, 5: 1 } },
  { name: 'Óscar Mingueza', realTeam: 'CEL', position: 'Defensa', value: 13, status: 'Disponible', jornadasPoints: { 1: 9, 2: 10, 3: 6, 4: 8, 5: 7 }, jornadasGoals: { 1: 1, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Raúl Albiol', realTeam: 'VIL', position: 'Defensa', value: 9, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 6, 4: 7, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 2, 4: 1, 5: 1 } },
  { name: 'Abdel Abqar', realTeam: 'ALV', position: 'Defensa', value: 8, status: 'Disponible', jornadasPoints: { 1: 6, 2: 5, 3: 6, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 1, 4: 2, 5: 2 } },
  { name: 'Flavien Boyomo', realTeam: 'OSA', position: 'Defensa', value: 10, status: 'Disponible', jornadasPoints: { 1: 8, 2: 7, 3: 6, 4: 8, 5: 6 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 2 } },
  { name: 'Florian Lejeune', realTeam: 'RAY', position: 'Defensa', value: 9, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 5, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 1, 3: 2, 4: 2, 5: 1 } },
  { name: 'Leandro Cabrera', realTeam: 'ESP', position: 'Defensa', value: 8, status: 'Disponible', jornadasPoints: { 1: 5, 2: 6, 3: 6, 4: 5, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 2 } },

  // Centrocampistas
  { name: 'Jude Bellingham', realTeam: 'RMA', position: 'Medio', value: 24, status: 'Disponible', jornadasPoints: { 1: 9, 2: 8, 3: 11, 4: 10, 5: 9 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Federico Valverde', realTeam: 'RMA', position: 'Medio', value: 20, status: 'Disponible', jornadasPoints: { 1: 10, 2: 8, 3: 9, 4: 8, 5: 11 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Pedri González', realTeam: 'BAR', position: 'Medio', value: 21, status: 'Disponible', jornadasPoints: { 1: 8, 2: 10, 3: 9, 4: 11, 5: 9 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Dani Olmo', realTeam: 'BAR', position: 'Medio', value: 19, status: 'Disponible', jornadasPoints: { 1: 11, 2: 11, 3: 10, 4: 9, 5: 12 }, jornadasGoals: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Rodrigo De Paul', realTeam: 'ATM', position: 'Medio', value: 16, status: 'Disponible', jornadasPoints: { 1: 7, 2: 8, 3: 8, 4: 7, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Conor Gallagher', realTeam: 'ATM', position: 'Medio', value: 15, status: 'Disponible', jornadasPoints: { 1: 8, 2: 9, 3: 7, 4: 9, 5: 8 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Oihan Sancet', realTeam: 'ATH', position: 'Medio', value: 16, status: 'Disponible', jornadasPoints: { 1: 10, 2: 7, 3: 9, 4: 8, 5: 10 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Mikel Merino', realTeam: 'RSO', position: 'Medio', value: 15, status: 'Abandona Liga', jornadasPoints: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Martín Zubimendi', realTeam: 'RSO', position: 'Medio', value: 16, status: 'Disponible', jornadasPoints: { 1: 8, 2: 7, 3: 8, 4: 8, 5: 7 }, jornadasGoals: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Brais Méndez', realTeam: 'RSO', position: 'Medio', value: 15, status: 'Disponible', jornadasPoints: { 1: 7, 2: 8, 3: 6, 4: 8, 5: 8 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Álex Baena', realTeam: 'VIL', position: 'Medio', value: 18, status: 'Disponible', jornadasPoints: { 1: 9, 2: 9, 3: 8, 4: 10, 5: 11 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Giovani Lo Celso', realTeam: 'BET', position: 'Medio', value: 17, status: 'Disponible', jornadasPoints: { 1: 11, 2: 12, 3: 9, 4: 10, 5: 11 }, jornadasGoals: { 1: 1, 2: 2, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Isco Alarcón', realTeam: 'BET', position: 'Medio', value: 16, status: 'Disponible', jornadasPoints: { 1: 8, 2: 7, 3: 9, 4: 8, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Yangel Herrera', realTeam: 'GIR', position: 'Medio', value: 13, status: 'Disponible', jornadasPoints: { 1: 7, 2: 8, 3: 6, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Pepelu', realTeam: 'VAL', position: 'Medio', value: 12, status: 'Disponible', jornadasPoints: { 1: 7, 2: 6, 3: 7, 4: 7, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Mauro Arambarri', realTeam: 'GET', position: 'Medio', value: 11, status: 'Disponible', jornadasPoints: { 1: 8, 2: 6, 3: 8, 4: 7, 5: 8 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Aimar Oroz', realTeam: 'OSA', position: 'Medio', value: 12, status: 'Disponible', jornadasPoints: { 1: 7, 2: 8, 3: 7, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Lucas Torró', realTeam: 'OSA', position: 'Medio', value: 10, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 7, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Kirian Rodríguez', realTeam: 'LPA', position: 'Medio', value: 11, status: 'Disponible', jornadasPoints: { 1: 6, 2: 7, 3: 6, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Sergi Darder', realTeam: 'MLL', position: 'Medio', value: 11, status: 'Disponible', jornadasPoints: { 1: 6, 2: 6, 3: 7, 4: 6, 5: 6 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Kike Pérez', realTeam: 'VLD', position: 'Medio', value: 8, status: 'Disponible', jornadasPoints: { 1: 5, 2: 6, 3: 5, 4: 6, 5: 5 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },

  // Delanteros
  { name: 'Kylian Mbappé', realTeam: 'RMA', position: 'Delantero', value: 28, status: 'Disponible', jornadasPoints: { 1: 9, 2: 12, 3: 13, 4: 10, 5: 14 }, jornadasGoals: { 1: 1, 2: 2, 3: 2, 4: 1, 5: 2 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Vinícius Júnior', realTeam: 'RMA', position: 'Delantero', value: 27, status: 'Disponible', jornadasPoints: { 1: 10, 2: 11, 3: 12, 4: 11, 5: 13 }, jornadasGoals: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Robert Lewandowski', realTeam: 'BAR', position: 'Delantero', value: 26, status: 'Disponible', jornadasPoints: { 1: 13, 2: 12, 3: 11, 4: 14, 5: 12 }, jornadasGoals: { 1: 2, 2: 2, 3: 1, 4: 3, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Lamine Yamal', realTeam: 'BAR', position: 'Delantero', value: 25, status: 'Disponible', jornadasPoints: { 1: 11, 2: 12, 3: 13, 4: 12, 5: 14 }, jornadasGoals: { 1: 1, 2: 1, 3: 1, 4: 2, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Raphinha', realTeam: 'BAR', position: 'Delantero', value: 23, status: 'Disponible', jornadasPoints: { 1: 10, 2: 14, 3: 11, 4: 13, 5: 12 }, jornadasGoals: { 1: 1, 2: 3, 3: 1, 4: 2, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Antoine Griezmann', realTeam: 'ATM', position: 'Delantero', value: 23, status: 'Disponible', jornadasPoints: { 1: 10, 2: 9, 3: 11, 4: 10, 5: 12 }, jornadasGoals: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 2 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Julián Álvarez', realTeam: 'ATM', position: 'Delantero', value: 22, status: 'Disponible', jornadasPoints: { 1: 8, 2: 10, 3: 9, 4: 11, 5: 10 }, jornadasGoals: { 1: 0, 2: 1, 3: 1, 4: 1, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Alexander Sørloth', realTeam: 'ATM', position: 'Delantero', value: 18, status: 'Disponible', jornadasPoints: { 1: 9, 2: 7, 3: 8, 4: 9, 5: 8 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Nico Williams', realTeam: 'ATH', position: 'Delantero', value: 22, status: 'Disponible', jornadasPoints: { 1: 9, 2: 10, 3: 8, 4: 11, 5: 10 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Iñaki Williams', realTeam: 'ATH', position: 'Delantero', value: 18, status: 'Disponible', jornadasPoints: { 1: 8, 2: 9, 3: 10, 4: 8, 5: 9 }, jornadasGoals: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Takefusa Kubo', realTeam: 'RSO', position: 'Delantero', value: 19, status: 'Disponible', jornadasPoints: { 1: 9, 2: 8, 3: 10, 4: 8, 5: 9 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Mikel Oyarzabal', realTeam: 'RSO', position: 'Delantero', value: 18, status: 'Disponible', jornadasPoints: { 1: 8, 2: 8, 3: 7, 4: 9, 5: 8 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Ayoze Pérez', realTeam: 'VIL', position: 'Delantero', value: 18, status: 'Disponible', jornadasPoints: { 1: 10, 2: 11, 3: 10, 4: 12, 5: 11 }, jornadasGoals: { 1: 1, 2: 1, 3: 2, 4: 2, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Iago Aspas', realTeam: 'CEL', position: 'Delantero', value: 17, status: 'Disponible', jornadasPoints: { 1: 9, 2: 10, 3: 8, 4: 9, 5: 9 }, jornadasGoals: { 1: 1, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Borja Iglesias', realTeam: 'CEL', position: 'Delantero', value: 14, status: 'Disponible', jornadasPoints: { 1: 8, 2: 9, 3: 7, 4: 8, 5: 8 }, jornadasGoals: { 1: 1, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Ante Budimir', realTeam: 'OSA', position: 'Delantero', value: 15, status: 'Disponible', jornadasPoints: { 1: 8, 2: 8, 3: 9, 4: 8, 5: 9 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Hugo Duro', realTeam: 'VAL', position: 'Delantero', value: 13, status: 'Disponible', jornadasPoints: { 1: 7, 2: 8, 3: 7, 4: 8, 5: 7 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Vedat Muriqi', realTeam: 'MLL', position: 'Delantero', value: 14, status: 'Disponible', jornadasPoints: { 1: 8, 2: 7, 3: 8, 4: 8, 5: 8 }, jornadasGoals: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Abel Ruiz', realTeam: 'GIR', position: 'Delantero', value: 12, status: 'Disponible', jornadasPoints: { 1: 7, 2: 8, 3: 6, 4: 7, 5: 7 }, jornadasGoals: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Sergio Camello', realTeam: 'RAY', position: 'Delantero', value: 11, status: 'Disponible', jornadasPoints: { 1: 7, 2: 6, 3: 7, 4: 6, 5: 7 }, jornadasGoals: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Javi Puado', realTeam: 'ESP', position: 'Delantero', value: 12, status: 'Disponible', jornadasPoints: { 1: 7, 2: 7, 3: 9, 4: 6, 5: 8 }, jornadasGoals: { 1: 0, 2: 0, 3: 2, 4: 0, 5: 1 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
  { name: 'Juanmi Latasa', realTeam: 'VLD', position: 'Delantero', value: 9, status: 'Disponible', jornadasPoints: { 1: 5, 2: 6, 3: 5, 4: 6, 5: 5 }, jornadasGoals: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, jornadasDef: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
];

const INITIAL_LINEUPS: LineupEntry[] = [];

export const DEMO_TEAM_NAMES = [
  'galácticos fc',
  'galacticos fc',
  'tiki-taka united',
  'la saeta rubia',
  'furia rojiblanca',
  'boquerones cf',
  'dream team 92'
];

const INITIAL_TRANSFERS: TransferRecord[] = [];
const INITIAL_DRAFTS: DraftRecord[] = [];
const INITIAL_SCHEDULES: ScheduleRecord[] = [];

export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycby0F4hqPcPISguJZGvDAarVkYksTs_ygTIVSl88861d3nxLGW5oKasl9FFuhUPmqEYwlw/exec';

export class GasEngineService {
  private teams: string[] = [];
  private tokens: TeamToken[] = [];
  private players: Player[] = [];
  private lineups: LineupEntry[] = [];
  private transfers: TransferRecord[] = [];
  private drafts: DraftRecord[] = [];
  private schedules: ScheduleRecord[] = [];
  private gasUrl: string = DEFAULT_GAS_URL;
  private firstContributionJornada: number = 5;
  private adminPassword: string = ADMIN_PASSWORD;
  private leagueTexts: LeagueTexts = {
    leagueName: 'Liga Fantástica de Amigos',
    subtitle: 'Panel oficial de competición, mercado y estadísticas',
    season: 'Temporada 2026/27',
    maxTeamValue: 200,
    weeklyContribution: 1.5,
    transferCost: 2,
    freeTransfers: 3
  };
  private customCodeGs: string = '';
  private customClubStyles: ClubStyle[] = [...DEFAULT_CLUB_STYLES];
  private notificationConfig: NotificationConfig = {
    githubRepo: '',
    githubToken: '',
    telegramBotToken: '',
    telegramChatId: '',
    directTelegram: false
  };
  private lastSyncTime: string | null = null;
  private serverUpdatedAt: string | null = null;
  private draftOrder: DraftRoundOrder[] = [];
  private isDraftHiddenState: boolean = false;
  private remoteMaxJornada: number = 0;
  private isSyncingRemote: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
    this.initCentralizedSync();
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    try {
      const savedGasUrl = localStorage.getItem('lfa_gas_url');
      if (savedGasUrl) this.gasUrl = savedGasUrl;

      const savedContrib = localStorage.getItem('lfa_first_contribution_jornada');
      if (savedContrib) this.firstContributionJornada = Number(savedContrib) || 5;

      const savedAdmin = localStorage.getItem('lfa_admin_password');
      if (savedAdmin) this.adminPassword = savedAdmin;

      const savedTeams = localStorage.getItem('lfa_teams');
      this.teams = savedTeams ? JSON.parse(savedTeams) : [...INITIAL_TEAMS];

      const savedTokens = localStorage.getItem('lfa_tokens');
      this.tokens = savedTokens ? JSON.parse(savedTokens) : [...INITIAL_TOKENS];

      const savedPlayers = localStorage.getItem('lfa_players');
      this.players = savedPlayers ? JSON.parse(savedPlayers) : [...INITIAL_PLAYERS];

      const savedLineups = localStorage.getItem('lfa_lineups');
      this.lineups = savedLineups ? JSON.parse(savedLineups) : [...INITIAL_LINEUPS];

      const savedTransfers = localStorage.getItem('lfa_transfers');
      this.transfers = savedTransfers ? JSON.parse(savedTransfers) : [...INITIAL_TRANSFERS];

      const savedDrafts = localStorage.getItem('lfa_drafts');
      this.drafts = savedDrafts ? JSON.parse(savedDrafts) : [...INITIAL_DRAFTS];

      const savedSchedules = localStorage.getItem('lfa_schedules');
      this.schedules = savedSchedules ? JSON.parse(savedSchedules) : [...INITIAL_SCHEDULES];

      const savedStyles = localStorage.getItem('lfa_club_styles');
      this.customClubStyles = savedStyles ? JSON.parse(savedStyles) : [...DEFAULT_CLUB_STYLES];

      const savedNotif = localStorage.getItem('lfa_notification_config');
      if (savedNotif) this.notificationConfig = JSON.parse(savedNotif);

      const savedTexts = localStorage.getItem('lfa_league_texts');
      if (savedTexts) this.leagueTexts = JSON.parse(savedTexts);

      const savedDraftOrder = localStorage.getItem('lfa_draft_order');
      if (savedDraftOrder) this.draftOrder = JSON.parse(savedDraftOrder);

      const savedDraftHidden = localStorage.getItem('lfa_is_draft_hidden');
      if (savedDraftHidden) this.isDraftHiddenState = savedDraftHidden === 'true';

      this.ensureTokensMatchTeams();
    } catch (e) {
      console.error('Error cargando estado desde localStorage:', e);
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('lfa_teams', JSON.stringify(this.teams));
      localStorage.setItem('lfa_tokens', JSON.stringify(this.tokens));
      localStorage.setItem('lfa_players', JSON.stringify(this.players));
      localStorage.setItem('lfa_lineups', JSON.stringify(this.lineups));
      localStorage.setItem('lfa_transfers', JSON.stringify(this.transfers));
      localStorage.setItem('lfa_drafts', JSON.stringify(this.drafts));
      localStorage.setItem('lfa_schedules', JSON.stringify(this.schedules));
      localStorage.setItem('lfa_club_styles', JSON.stringify(this.customClubStyles));
      localStorage.setItem('lfa_notification_config', JSON.stringify(this.notificationConfig));
      localStorage.setItem('lfa_league_texts', JSON.stringify(this.leagueTexts));
      localStorage.setItem('lfa_draft_order', JSON.stringify(this.draftOrder));
      localStorage.setItem('lfa_is_draft_hidden', String(this.isDraftHiddenState));
    } catch (e) {
      console.error('Error guardando estado en localStorage:', e);
    }
  }

  private ensureTokensMatchTeams(): boolean {
    let changed = false;
    const existingTeamNames = new Set(this.tokens.map(t => t.team.toLowerCase().trim()));
    for (const team of this.teams) {
      if (!existingTeamNames.has(team.toLowerCase().trim())) {
        this.tokens.push({ team, token: 'titular' });
        changed = true;
      }
    }
    return changed;
  }

  private initCentralizedSync() {
    if (typeof window === 'undefined') return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlFromParam = urlParams.get('gasUrl') || urlParams.get('gas_url');
      if (urlFromParam && urlFromParam.trim()) {
        const cleanParamUrl = urlFromParam.trim();
        this.gasUrl = cleanParamUrl;
        localStorage.setItem('lfa_gas_url', cleanParamUrl);
        this.pushGasConfigToServer(cleanParamUrl).catch(() => {});
        try {
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch {}
      }
    } catch {}

    this.fetchServerGasConfig(true)
      .then(() => {
        if (this.getGasUrl()) {
          this.syncFromRemote().catch(() => {});
        }
      })
      .catch(() => {
        if (this.getGasUrl()) {
          this.syncFromRemote().catch(() => {});
        }
      });

    window.addEventListener('focus', () => {
      this.fetchServerGasConfig(true).catch(() => {});
      if (this.getGasUrl()) {
        this.syncFromRemote().catch(() => {});
      }
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.getGasUrl()) {
          this.syncFromRemote().catch(() => {});
        }
      });
    }

    setInterval(() => {
      this.fetchServerGasConfig(true).catch(() => {});
    }, 60000);

    setInterval(() => {
      if (this.getGasUrl() && !this.isSyncingRemote && (typeof document === 'undefined' || !document.hidden)) {
        this.syncFromRemote().catch(() => {});
      }
    }, 45000);
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
      const saved = typeof window !== 'undefined' ? localStorage.getItem('lfa_gas_url') : null;
      this.gasUrl = (saved && saved.trim()) ? saved.trim() : DEFAULT_GAS_URL;
    }
    return this.gasUrl;
  }

  public getServerUpdatedAt(): string | null {
    return this.serverUpdatedAt;
  }

  public async fetchServerGasConfig(triggerSyncIfNew = true): Promise<{ gasUrl: string; updatedAt: string | null } | null> {
    try {
      const resp = await fetch('/api/gas-config', { cache: 'no-store' });
      if (!resp.ok) return null;
      const data = await resp.json();
      if (data && typeof data === 'object') {
        let changed = false;
        this.serverUpdatedAt = data.updatedAt || null;

        if (typeof data.gasUrl === 'string') {
          const serverUrl = data.gasUrl.trim();
          if (serverUrl) {
            const currentLocal = this.getGasUrl();
            if (serverUrl !== currentLocal) {
              console.log('[gasEngine] 🔄 URL de Sheets actualizada automáticamente desde el servidor central:', serverUrl);
              this.gasUrl = serverUrl;
              localStorage.setItem('lfa_gas_url', serverUrl);
              changed = true;

              if (triggerSyncIfNew) {
                this.syncFromRemote(serverUrl).catch(err => {
                  console.warn('[gasEngine] Auto-sync post URL update failed:', err);
                });
              }
            }
          }
        }

        if (typeof data.firstContributionJornada === 'number') {
          const sJ = data.firstContributionJornada === 4 ? 5 : data.firstContributionJornada;
          if (sJ !== this.firstContributionJornada) {
            this.firstContributionJornada = sJ;
            localStorage.setItem('lfa_first_contribution_jornada', String(this.firstContributionJornada));
            changed = true;
          }
        }

        if (Array.isArray(data.customClubStyles) && data.customClubStyles.length > 0) {
          this.customClubStyles = data.customClubStyles;
          localStorage.setItem('lfa_club_styles', JSON.stringify(this.customClubStyles));
          changed = true;
        }

        if (Array.isArray(data.teams) && data.teams.length > 0) {
          const seenT = new Set<string>();
          const validTeams: string[] = [];
          for (const t of data.teams) {
            const trimmed = String(t || '').trim();
            const lower = trimmed.toLowerCase();
            if (trimmed && !seenT.has(lower)) {
              seenT.add(lower);
              validTeams.push(trimmed);
            }
          }
          if (validTeams.length > 0) {
            this.teams = validTeams;
            localStorage.setItem('lfa_teams', JSON.stringify(this.teams));
            changed = true;
          }
        }

        if (Array.isArray(data.tokens) && data.tokens.length > 0) {
          this.tokens = data.tokens;
          localStorage.setItem('lfa_tokens', JSON.stringify(this.tokens));
          changed = true;
        }

        if (this.ensureTokensMatchTeams()) {
          changed = true;
        }

        if (data.notificationConfig && typeof data.notificationConfig === 'object') {
          this.notificationConfig = {
            ...this.notificationConfig,
            ...data.notificationConfig
          };
          localStorage.setItem('lfa_notification_config', JSON.stringify(this.notificationConfig));
          changed = true;
        }

        if (data.adminPassword && typeof data.adminPassword === 'string') {
          const sAdmin = data.adminPassword.trim();
          if (sAdmin && sAdmin !== this.adminPassword) {
            this.adminPassword = sAdmin;
            localStorage.setItem('lfa_admin_password', sAdmin);
            changed = true;
          }
        }

        if (data.leagueTexts && typeof data.leagueTexts === 'object') {
          this.leagueTexts = {
            ...this.leagueTexts,
            ...data.leagueTexts
          };
          localStorage.setItem('lfa_league_texts', JSON.stringify(this.leagueTexts));
          changed = true;
        }

        if (typeof data.customCodeGs === 'string' && data.customCodeGs !== this.customCodeGs) {
          this.customCodeGs = data.customCodeGs;
          localStorage.setItem('lfa_custom_code_gs', data.customCodeGs);
          changed = true;
        }

        if (Array.isArray(data.draftOrder) && data.draftOrder.length > 0) {
          this.draftOrder = data.draftOrder;
          localStorage.setItem('lfa_draft_order', JSON.stringify(this.draftOrder));
          changed = true;
        }

        if (typeof data.isDraftHidden === 'boolean') {
          if (this.isDraftHiddenState !== data.isDraftHidden) {
            this.isDraftHiddenState = data.isDraftHidden;
            localStorage.setItem('lfa_is_draft_hidden', String(this.isDraftHiddenState));
            changed = true;
          }
        }

        try {
          const pResp = await fetch('/api/persisted-league', { cache: 'no-store' });
          if (pResp.ok) {
            const pData = await pResp.json();
            if (pData && Array.isArray(pData.transfers) && pData.transfers.length > 0) {
              const seenKeys = new Set<string>();
              this.transfers.forEach(t => {
                const k = `${String(t.team).toLowerCase().trim()}:::${t.jornada}:::${String(t.playerOut).toLowerCase().trim()}:::${String(t.playerIn).toLowerCase().trim()}`;
                seenKeys.add(k);
              });
              let addedTransfers = false;
              for (const pt of pData.transfers) {
                const tLower = String(pt.team || '').toLowerCase().trim();
                if (DEMO_TEAM_NAMES.includes(tLower)) continue;
                const k = `${tLower}:::${pt.jornada}:::${String(pt.playerOut).toLowerCase().trim()}:::${String(pt.playerIn).toLowerCase().trim()}`;
                if (!seenKeys.has(k)) {
                  seenKeys.add(k);
                  this.transfers.unshift(pt);
                  addedTransfers = true;
                }
              }
              if (addedTransfers) {
                localStorage.setItem('lfa_transfers', JSON.stringify(this.transfers));
                changed = true;
              }
            }

            if (pData && Array.isArray(pData.lineupOverrides) && pData.lineupOverrides.length > 0) {
              let appliedOverrides = false;
              for (const ov of pData.lineupOverrides) {
                const tLower = String(ov.team || '').toLowerCase().trim();
                if (DEMO_TEAM_NAMES.includes(tLower)) continue;
                const outLower = String(ov.playerOut || '').toLowerCase().trim();
                const jor = Number(ov.jornada);
                const lEntry = this.lineups.find(l =>
                  l.team.toLowerCase().trim() === tLower &&
                  l.jornada === jor &&
                  l.playerName.toLowerCase().trim() === outLower
                );
                if (lEntry) {
                  lEntry.playerName = ov.playerIn;
                  if (ov.realTeam) lEntry.realTeam = ov.realTeam;
                  if (ov.position) lEntry.position = ov.position;
                  if (ov.value !== undefined) lEntry.value = ov.value;
                  appliedOverrides = true;
                }
              }
              if (appliedOverrides) {
                localStorage.setItem('lfa_lineups', JSON.stringify(this.lineups));
                changed = true;
              }
            }
          }
        } catch {}

        if (changed) {
          this.notify();
        }

        return data;
      }
    } catch (err) {}
    return null;
  }

  public async pushLeagueConfigToServer(partial?: Partial<LeagueConfig>, adminPassword?: string): Promise<boolean> {
    const effectiveGasUrl = (partial?.gasUrl !== undefined && String(partial.gasUrl).trim())
      ? String(partial.gasUrl).trim()
      : (this.getGasUrl() || DEFAULT_GAS_URL);

    const payload = {
      gasUrl: effectiveGasUrl,
      firstContributionJornada: partial?.firstContributionJornada !== undefined ? partial.firstContributionJornada : this.firstContributionJornada,
      teams: partial?.teams !== undefined ? partial.teams : this.teams,
      tokens: partial?.tokens !== undefined ? partial.tokens : this.tokens,
      customClubStyles: partial?.customClubStyles !== undefined ? partial.customClubStyles : this.customClubStyles,
      notificationConfig: partial?.notificationConfig !== undefined ? partial.notificationConfig : this.notificationConfig,
      leagueTexts: partial?.leagueTexts !== undefined ? partial.leagueTexts : this.leagueTexts,
      customCodeGs: partial?.customCodeGs !== undefined ? partial.customCodeGs : this.customCodeGs,
      draftOrder: partial?.draftOrder !== undefined ? partial.draftOrder : this.draftOrder,
      isDraftHidden: partial?.isDraftHidden !== undefined ? partial.isDraftHidden : this.isDraftHiddenState,
      adminPassword: adminPassword || this.adminPassword
    };

    try {
      const resp = await fetch('/api/gas-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const result = await resp.json();
        if (result?.config?.updatedAt) {
          this.serverUpdatedAt = result.config.updatedAt;
        }
        this.notify();
        return true;
      }
    } catch (err) {
      console.warn('[gasEngine] No se pudo sincronizar config con servidor central:', err);
    }
    return false;
  }

  public async pushGasConfigToServer(url: string, adminPassword?: string): Promise<boolean> {
    const clean = (url || '').trim();
    return this.pushLeagueConfigToServer({ gasUrl: clean }, adminPassword);
  }

  public setGasUrl(url: string) {
    this.gasUrl = url.trim();
    localStorage.setItem('lfa_gas_url', this.gasUrl);
    this.pushGasConfigToServer(this.gasUrl).catch(() => {});
    this.notify();
  }

  public getFirstContributionJornada(): number {
    return this.firstContributionJornada;
  }

  public setFirstContributionJornada(j: number, adminPassword?: string): { success: boolean; message: string } {
    const cleanJ = Math.max(1, Math.min(38, Math.round(j || 5)));
    this.firstContributionJornada = cleanJ;
    localStorage.setItem('lfa_first_contribution_jornada', String(cleanJ));
    this.saveState();
    this.notify();
    this.pushLeagueConfigToServer({ firstContributionJornada: cleanJ }, adminPassword).catch(() => {});
    return {
      success: true,
      message: `Primera jornada con aportes establecida en J${cleanJ}. Sincronizada con el servidor.`
    };
  }

  public getClubStyles(): ClubStyle[] {
    return [...this.customClubStyles];
  }

  public getClubBadgeStyle(codeOrName: string): ClubStyle {
    if (!codeOrName) {
      return { code: 'DEF', name: 'Desconocido', bgColor: '#1e293b', textColor: '#e2e8f0', borderColor: '#475569' };
    }
    const clean = codeOrName.trim().toUpperCase();
    const found = this.customClubStyles.find(c => 
      c.code.toUpperCase() === clean || 
      c.name.toUpperCase() === clean ||
      c.name.toUpperCase().includes(clean) ||
      clean.includes(c.code.toUpperCase())
    );
    if (found) return found;

    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return {
      code: clean.slice(0, 4),
      name: codeOrName,
      bgColor: `hsl(${hue}, 70%, 20%)`,
      textColor: '#ffffff',
      borderColor: `hsl(${hue}, 80%, 45%)`
    };
  }

  public saveClubStyle(club: ClubStyle, adminPassword?: string): void {
    const cleanCode = (club.code || '').trim().toUpperCase();
    if (!cleanCode) return;

    const updatedClub: ClubStyle = {
      code: cleanCode,
      name: (club.name || cleanCode).trim(),
      bgColor: club.bgColor || '#FFFF00',
      textColor: club.textColor || '#000000',
      borderColor: club.borderColor || club.bgColor || '#000000'
    };

    const existingIndex = this.customClubStyles.findIndex(c => c.code.toUpperCase() === cleanCode);
    if (existingIndex >= 0) {
      this.customClubStyles[existingIndex] = updatedClub;
    } else {
      this.customClubStyles.push(updatedClub);
    }

    localStorage.setItem('lfa_club_styles', JSON.stringify(this.customClubStyles));
    this.saveState();
    this.notify();
    this.pushLeagueConfigToServer({ customClubStyles: this.customClubStyles }, adminPassword).catch(() => {});
  }

  public deleteClubStyle(code: string, adminPassword?: string): void {
    const cleanCode = (code || '').trim().toUpperCase();
    this.customClubStyles = this.customClubStyles.filter(c => c.code.toUpperCase() !== cleanCode);
    localStorage.setItem('lfa_club_styles', JSON.stringify(this.customClubStyles));
    this.saveState();
    this.notify();
    this.pushLeagueConfigToServer({ customClubStyles: this.customClubStyles }, adminPassword).catch(() => {});
  }

  public resetClubStyles(adminPassword?: string): void {
    this.customClubStyles = [...DEFAULT_CLUB_STYLES];
    localStorage.setItem('lfa_club_styles', JSON.stringify(this.customClubStyles));
    this.saveState();
    this.notify();
    this.pushLeagueConfigToServer({ customClubStyles: this.customClubStyles }, adminPassword).catch(() => {});
  }

  public getNotificationConfig(): NotificationConfig {
    return { ...this.notificationConfig };
  }

  public saveNotificationConfig(config: NotificationConfig, adminPassword?: string): { success: boolean; message: string } {
    this.notificationConfig = { ...config };
    localStorage.setItem('lfa_notification_config', JSON.stringify(this.notificationConfig));
    this.saveState();
    this.notify();
    this.pushLeagueConfigToServer({ notificationConfig: this.notificationConfig }, adminPassword).catch(() => {});
    return {
      success: true,
      message: 'Configuración de avisos guardada y sincronizada correctamente.'
    };
  }

  public async testTelegramNotification(config?: NotificationConfig): Promise<{ success: boolean; message: string }> {
    if (config) {
      this.notificationConfig = { ...this.notificationConfig, ...config };
    }
    const res = await this.testNotification('telegram', {
      equipo: 'Equipo Demo LFA',
      jugadorEntra: 'Pedri (Barcelona)',
      jugadorSale: 'Gavi (Barcelona)',
      coste: 15.5
    });
    return {
      success: res.success,
      message: res.success ? (res.message || 'Mensaje de prueba enviado a Telegram') : (res.error || 'Error al enviar a Telegram')
    };
  }

  public async testGithubDispatch(config?: NotificationConfig): Promise<{ success: boolean; message: string }> {
    if (config) {
      this.notificationConfig = { ...this.notificationConfig, ...config };
    }
    const res = await this.testNotification('github', {
      equipo: 'Equipo Demo LFA',
      jugadorEntra: 'Vinicius Jr (Real Madrid)',
      jugadorSale: 'Rodrygo (Real Madrid)',
      coste: 20.0
    });
    return {
      success: res.success,
      message: res.success ? (res.message || 'Workflow dispatch disparado en GitHub') : (res.error || 'Error al disparar GitHub')
    };
  }

  public async testNotification(testType: 'telegram' | 'github', sampleData?: any): Promise<{ success: boolean; message?: string; error?: string }> {
    const notif = this.notificationConfig;

    if (testType === 'telegram') {
      const token = String(notif.telegramBotToken || '').trim();
      const chatId = String(notif.telegramChatId || '').trim();

      if (!token || !chatId) {
        return {
          success: false,
          error: 'Falta completar el Bot Token de Telegram o el Chat ID del grupo.'
        };
      }
      if (token.startsWith('@')) {
        return {
          success: false,
          error: `Has puesto un nombre de usuario ("${token}") en vez del token. El Bot Token es una clave proporcionada por @BotFather (ej: 123456789:ABCdefGhI...)`
        };
      }
      if (!token.includes(':')) {
        return {
          success: false,
          error: 'El Bot Token de Telegram debe contener dos puntos ":" (ej: 123456789:AAHk...). Consíguelo en @BotFather.'
        };
      }

      const sample = {
        equipo: sampleData?.equipo || 'Equipo Demo LFA',
        jugadorEntra: sampleData?.jugadorEntra || 'Kylian Mbappé (RMA)',
        jugadorSale: sampleData?.jugadorSale || 'Vinicius Jr (RMA)',
        coste: sampleData?.coste !== undefined ? String(sampleData.coste) : '2.00',
        jornada: sampleData?.jornada || 4,
        tipo: sampleData?.tipo || 'Fichaje de Prueba'
      };

      const isRealFichaje = Boolean(sampleData?.tipo && sampleData.tipo !== 'Fichaje de Prueba');
      const title = isRealFichaje ? '🚨 *¡NUEVO FICHAJE CONFIRMADO!* ⚽' : '🚨 *¡PRUEBA DE FICHAJE EN LA LIGA FANTÁSTICA!* ⚽';
      const footer = isRealFichaje ? '🏆 _Liga Fantástica App_' : '✅ _Conexión directa con Telegram verificada correctamente._';
      const text = `${title}\n━━━━━━━━━━━━━━━━━━━━\n🏟 *Equipo:* ${sample.equipo}\n🟢 *Alta:* ${sample.jugadorEntra}\n🔴 *Baja:* ${sample.jugadorSale}\n💰 *Coste:* ${sample.coste} €\n📅 *Jornada:* J${sample.jornada}\n📝 *Tipo:* ${sample.tipo}\n━━━━━━━━━━━━━━━━━━━━\n${footer}`;

      try {
        const resp = await fetch('/api/notify-fichaje-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            testType: 'telegram',
            telegramBotToken: token,
            telegramChatId: chatId,
            sampleData
          })
        });

        const raw = await resp.text();
        let data: any = null;
        try {
          data = JSON.parse(raw);
        } catch {}

        if (resp.ok && data?.success) {
          return { success: true, message: data.message || '¡Mensaje de aviso enviado con éxito a Telegram!' };
        }
        if (data?.error) {
          return { success: false, error: data.error };
        }
      } catch (proxyErr) {
        console.warn('[gasEngine] Falló proxy de telegram, probando llamada directa:', proxyErr);
      }

      try {
        const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
          })
        });

        const tgData = await tgResp.json().catch(() => null);

        if (tgResp.ok && tgData?.ok) {
          return { success: true, message: '¡Mensaje de aviso enviado con éxito a Telegram!' };
        }

        const desc = tgData?.description || `Error HTTP ${tgResp.status}`;
        if (desc.includes('chat not found')) {
          return {
            success: false,
            error: `Chat no encontrado (${chatId}). Verifica que has añadido al bot al grupo o canal, o que has iniciado conversación con él.`
          };
        }
        if (desc.includes('bot was blocked') || desc.includes("bot can't initiate conversation")) {
          return {
            success: false,
            error: 'El bot no tiene permiso para escribir: abre Telegram, busca a tu bot y pulsa "Iniciar" (/start).'
          };
        }
        if (desc.includes('Unauthorized') || tgResp.status === 401) {
          return {
            success: false,
            error: 'Token no autorizado por Telegram. Comprueba que copiaste el token completo exactamente de @BotFather.'
          };
        }

        return { success: false, error: `Telegram error (${tgData?.error_code || tgResp.status}):${desc}` };
      } catch (directErr: any) {
        return {
          success: false,
          error: `No se pudo conectar con Telegram: ${directErr?.message || 'Comprueba el Bot Token y el Chat ID'}.`
        };
      }
    } else if (testType === 'github') {
      const repo = String(notif.githubRepo || '').trim();
      const ghToken = String(notif.githubToken || '').trim();
      if (!repo || !ghToken) {
        return {
          success: false,
          error: 'Falta completar el Repositorio de GitHub (usuario/repo) o el Personal Access Token (PAT).'
        };
      }

      try {
        const ghResp = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${ghToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_type: 'fichaje_realizado',
            client_payload: sampleData || {
              equipo: 'Equipo Demo LFA',
              jugadorEntra: 'Kylian Mbappé (RMA)',
              jugadorSale: 'Vinicius Jr (RMA)',
              coste: '2.00 €',
              jornada: 4,
              tipo: 'Prueba Dispatch'
            }
          })
        });

        if (ghResp.status === 204 || ghResp.ok) {
          return { success: true, message: `Evento 'fichaje_realizado' enviado a GitHub Actions (${repo}) con éxito.` };
        }

        const ghData = await ghResp.json().catch(() => null);
        return { success: false, error: `GitHub API (${ghResp.status}):${ghData?.message || 'Error al disparar workflow'}` };
      } catch (ghErr: any) {
        try {
          const resp = await fetch('/api/notify-fichaje-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              testType: 'github',
              githubRepo: repo,
              githubToken: ghToken,
              sampleData
            })
          });
          const data = await resp.json().catch(() => null);
          if (resp.ok && data?.success) {
            return { success: true, message: data.message };
          }
          if (data?.error) {
            return { success: false, error: data.error };
          }
        } catch {}

        return {
          success: false,
          error: `Error conectando con GitHub: ${ghErr?.message || 'Error de red'}.`
        };
      }
    }

    return { success: false, error: 'Tipo de prueba no reconocido.' };
  }

  public async triggerFichajeNotification(payload: {
    equipo: string;
    jugadorEntra: string;
    jugadorSale: string;
    jornada: number;
    coste: string;
    tipo: string;
  }): Promise<void> {
    const notif = this.notificationConfig;
    if (notif.telegramBotToken && notif.telegramChatId) {
      this.testNotification('telegram', payload).catch(e => console.warn('[gasEngine] Fallo aviso Telegram:', e));
    }
    if (notif.githubRepo && notif.githubToken) {
      this.testNotification('github', payload).catch(e => console.warn('[gasEngine] Fallo dispatch GitHub Actions:', e));
    }
  }

  public async sendTelegramCustomMessage(text: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const notif = this.notificationConfig;
    const cleanBotToken = String(notif.telegramBotToken || '').trim();
    const cleanChatId = String(notif.telegramChatId || '').trim();

    if (!cleanBotToken || !cleanChatId) {
      return { success: false, error: 'Telegram no configurado' };
    }

    try {
      const resp = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramBotToken: cleanBotToken,
          telegramChatId: cleanChatId,
          text
        })
      });
      if (resp.ok) {
        const data = await resp.json().catch(() => null);
        if (data?.success) return { success: true };
      }
    } catch {}

    try {
      let tgResp = await fetch(`https://api.telegram.org/bot${cleanBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
      let tgData = await tgResp.json().catch(() => null);
      if (!tgResp.ok && tgData?.description?.includes("can't parse entities")) {
        tgResp = await fetch(`https://api.telegram.org/bot${cleanBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cleanChatId,
            text: text.replace(/[*_`]/g, '')
          })
        });
        tgData = await tgResp.json().catch(() => null);
      }
      if (tgData?.ok) return { success: true };
      return { success: false, error: tgData?.description };
    } catch (e: any) {
      return { success: false, error: e?.message };
    }
  }

  public async triggerDraftPickNotification(payload: {
    team: string;
    player: string;
    realTeam: string;
    position: string;
    value: number;
    round: number;
    pickNumber: number;
    totalPicks: number;
    nextTeam: string | null;
    nextRound: number | null;
    isComplete: boolean;
  }): Promise<void> {
    const nextLine = payload.isComplete
      ? '🏁 *Estado:* ¡Última elección del Draft completada!'
      : (payload.nextTeam
          ? `👉 *Siguiente turno para elegir:* ⏳ *${payload.nextTeam}* (Ronda ${payload.nextRound || payload.round})`
          : '👉 *Siguiente turno:* Esperando turno');

    const msg = [
      '🎯 *¡ELECCIÓN EN EL DRAFT INICIAL!* ⚽',
      '━━━━━━━━━━━━━━━━━━━━',
      `🏟 *Equipo:* ${payload.team}`,
      `🟢 *Jugador elegido:* ${payload.player} (${payload.realTeam || 'LaLiga'} - ${payload.position})`,
      `💰 *Valor:* ${payload.value} €`,
      `🔢 *Ronda:* Ronda ${payload.round} de 11 (Elección ${payload.pickNumber}/${payload.totalPicks})`,
      '━━━━━━━━━━━━━━━━━━━━',
      nextLine,
      '🏆 _Liga Fantástica de Amigos_'
    ].join('\n');

    this.sendTelegramCustomMessage(msg).catch(err => {
      console.warn('[gasEngine] Fallo al enviar aviso de elección de draft a Telegram:', err);
    });
  }

  public async triggerDraftCompletedNotification(payload: {
    totalPicks: number;
    teamsCount: number;
  }): Promise<void> {
    const msg = [
      '🎉 *¡EL DRAFT INICIAL HA FINALIZADO CON ÉXITO!* 🏆',
      '━━━━━━━━━━━━━━━━━━━━',
      '✅ Todos los equipos participantes han completado sus 11 futbolistas de plantilla.',
      `📊 *Resumen:* ${payload.totalPicks} elecciones realizadas entre los ${payload.teamsCount} equipos.`,
      '⚽ ¡Las plantillas quedan configuradas para la nueva temporada!',
      '━━━━━━━━━━━━━━━━━━━━',
      '🏆 _Liga Fantástica de Amigos_'
    ].join('\n');

    this.sendTelegramCustomMessage(msg).catch(err => {
      console.warn('[gasEngine] Fallo al enviar aviso de fin de draft a Telegram:', err);
    });
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
          } catch {}
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

        if (err && ['AUTH_REQUIRED', 'OLD_GAS_CODE', 'RETURNED_HTML', 'DEV_URL_ERROR'].includes(err.message)) {
          isDone = true;
          cleanup();
          reject(err);
          return;
        }

        if (fetchDone && jsonpDone) {
          isDone = true;
          cleanup();
          reject(lastErr || new Error('NETWORK_ERROR'));
        }
      }

      const isMutatingAction = !!(params && ['transfer', 'draft', 'saveDraftOrder', 'resetSeason'].includes(String(params.action || '')));

      if (isMutatingAction) {
        fetchDone = false;
        jsonpDone = false;

        const startJsonpFallback = () => {
          if (isDone || jsonpDone) return;
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
            onFail(new Error('NO_DOCUMENT_JSONP'), 'jsonp');
          }
        };

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
              startJsonpFallback();
              return;
            }
            const text = await res.text();
            const trimmed = text.trim();
            if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || text.includes('accounts.google.com')) {
              startJsonpFallback();
              return;
            }
            try {
              const data = JSON.parse(trimmed);
              onSuccess(data);
            } catch {
              startJsonpFallback();
            }
          }).catch(() => {
            startJsonpFallback();
          });
        } catch {
          startJsonpFallback();
        }
        return;
      }

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
          message: '⚠️ Tu Web App devolvió la página HTML antigua. En Google Apps Script debes: 1) Pegar el nuevo "Código.gs", 2) Guardar (Ctrl+S), y 3) Ir a "Implementar > Administrar implementaciones > Editar > Versión: Nueva versión > Implementar".'
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

  public async syncFromRemote(customUrl?: string, force = false): Promise<{ success: boolean; message: string; stats?: any }> {
    if (this.isSyncingRemote && !force) {
      return { success: true, message: 'Sincronización en curso...' };
    }
    this.isSyncingRemote = true;

    const safetyTimer = setTimeout(() => {
      this.isSyncingRemote = false;
    }, 32000);

    const targetUrl = (customUrl !== undefined ? customUrl : this.getGasUrl()).trim();
    if (!targetUrl) {
      clearTimeout(safetyTimer);
      this.isSyncingRemote = false;
      return { success: false, message: 'No hay URL de Google Apps Script configurada.' };
    }

    try {
      let data: any = null;

      try {
        const proxyUrl = `/api/gas-sync?customGasUrl=${encodeURIComponent(targetUrl)}&force=${force ? 'true' : 'false'}&_t=${Date.now()}`;
        const ctrl = new AbortController();
        const tId = setTimeout(() => ctrl.abort(), 26000);

        try {
          const proxyRes = await fetch(proxyUrl, { signal: ctrl.signal });
          clearTimeout(tId);
          if (proxyRes.ok) {
            const proxyJson = await proxyRes.json();
            if (proxyJson && proxyJson.success !== false && !proxyJson.error) {
              data = proxyJson;
            }
          }
        } finally {
          clearTimeout(tId);
        }
      } catch {}

      if (!data) {
        try {
          data = await this.fetchGasData(targetUrl, { action: 'getFullSync' }, 25000);
        } catch (firstErr: any) {
          if (firstErr.message === 'TIMEOUT_GAS' || firstErr.message === 'TIMEOUT_JSONP' || firstErr.name === 'AbortError') {
            throw new Error('TIMEOUT_GAS');
          }
          throw firstErr;
        }
      }

      if (data && data.error) {
        return { success: false, message: 'Error de Google Apps Script: ' + data.error };
      }

      if (data && data.maxJornada !== undefined) {
        const parsedMax = Number(data.maxJornada);
        if (!isNaN(parsedMax) && parsedMax > 0) {
          this.remoteMaxJornada = parsedMax;
        }
      }

      let updatedTeamsCount = 0;
      let updatedPlayersCount = 0;

      if (Array.isArray(data.teams) && data.teams.length > 0) {
        const seenTeams = new Set<string>();
        const remoteTeams: string[] = [];
        data.teams.forEach((t: any) => {
          const trimmed = String(t || '').trim();
          const lower = trimmed.toLowerCase();
          if (trimmed && !seenTeams.has(lower)) {
            seenTeams.add(lower);
            remoteTeams.push(trimmed);
          }
        });
        if (remoteTeams.length > 0) {
          this.teams = remoteTeams;
          updatedTeamsCount = this.teams.length;
        }
      }

      if (Array.isArray(data.tokens) && data.tokens.length > 0) {
        this.tokens = data.tokens;
      }

      if (Array.isArray(data.players) && data.players.length > 0) {
        this.players = data.players;
        updatedPlayersCount = this.players.length;
      }

      if (Array.isArray(data.lineups)) {
        this.lineups = data.lineups;
      }

      if (Array.isArray(data.transfers)) {
        this.transfers = data.transfers;
      }

      if (Array.isArray(data.drafts)) {
        this.drafts = data.drafts;
      }

      if (Array.isArray(data.schedules)) {
        this.schedules = data.schedules;
      }

      this.ensureTokensMatchTeams();
      this.saveState();
      this.lastSyncTime = new Date().toISOString();
      localStorage.setItem('lfa_last_sync_time', this.lastSyncTime);
      this.notify();

      return {
        success: true,
        message: 'Sincronización remota completada con éxito.',
        stats: {
          teams: updatedTeamsCount,
          players: updatedPlayersCount
        }
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Fallo al sincronizar datos remotos: ' + (err.message || 'Error de red')
      };
    } finally {
      clearTimeout(safetyTimer);
      this.isSyncingRemote = false;
    }
  }

  // Getters para exponer datos a la app
  public getTeams(): string[] { return [...this.teams]; }
  public getTokens(): TeamToken[] { return [...this.tokens]; }
  public getPlayers(): Player[] { return [...this.players]; }
  public getLineups(): LineupEntry[] { return [...this.lineups]; }
  public getTransfers(): TransferRecord[] { return [...this.transfers]; }
  public getDrafts(): DraftRecord[] { return [...this.drafts]; }
  public getSchedules(): ScheduleRecord[] { return [...this.schedules]; }
  public getLeagueTexts(): LeagueTexts { return { ...this.leagueTexts }; }
  public getDraftOrder(): DraftRoundOrder[] { return [...this.draftOrder]; }
  public isDraftHidden(): boolean { return this.isDraftHiddenState; }
}

export const gasEngine = new GasEngineService();
