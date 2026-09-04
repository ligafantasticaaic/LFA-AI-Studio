export interface Player {
  name: string;
  realTeam: string;
  position: 'Portero' | 'Defensa' | 'Medio' | 'Delantero' | string;
  value: number | '';
  status: 'Disponible' | 'Fichado' | 'Abandona Liga';
  totalPoints?: number;
  jornadasPoints?: Record<number, number>;
  jornadasGoals?: Record<number, number>;
  jornadasDef?: Record<number, number>;
}

export interface TeamToken {
  team: string;
  token: string;
}

export interface LineupEntry {
  team: string;
  jornada: number;
  playerName: string;
  realTeam: string;
  position: string;
  value: number | '';
}

export interface LineupPlayerDetail {
  name: string;
  realTeam: string;
  position: string;
  value: number | '';
  points: number | '';
  goals: number | '';
  pDef: number | '';
}

export interface TeamLineupResponse {
  players: LineupPlayerDetail[];
  totalPoints: string;
  totalValue: string;
  totalGoals: number;
  totalDefensivePoints: number;
  error?: string;
}

export interface StandingScore {
  teamName: string;
  score: string | number;
}

export interface TransferRecord {
  timestamp: string;
  team: string;
  jornada: number;
  playerOut: string;
  playerIn: string;
  cost: number;
  type?: 'Normal' | 'Abandono';
}

export interface DraftRecord {
  timestamp: string;
  team: string;
  playerName: string;
  realTeam: string;
  position: string;
  value: number | '';
}

export interface ScheduleRecord {
  jornada: number;
  realTeam: string;
  deadlineIsoString: string;
}

export interface TeamBalanceDetail {
  team: string;
  contributions: string;
  transferFees: string;
  prizes: string;
  balance: string;
}

export interface FinalPrize {
  type: string;
  team: string;
  percentage?: string;
  prize?: string;
  categoryPrize?: string;
  balanceFinal?: string;
  totalFinal?: string;
}

export interface FinalBalanceDetail {
  team: string;
  balanceJornadas: string;
  premioFinal: string;
  totalFinal: string;
}

export interface AccountingData {
  maxJornada: number;
  numTeams: number;
  totalContributions: string;
  totalTransferFees: string;
  totalPrizeMoneyAwarded: string;
  finalCajaBeforeFinalPrizes: string;
  finalCajaAfterFinalPrizes?: string;
  teamBalanceDetails: TeamBalanceDetail[];
  finalPrizes: FinalPrize[];
  finalPrizeAmounts: Record<string, string>;
  finalBalanceDetails?: FinalBalanceDetail[];
  isFinalJornada: boolean;
  error?: string;
}

export interface TeamJornadasReportRow {
  name: string;
  realTeam: string;
  position: string;
  jornadasDetails: Array<{
    pts: number | string;
    goles: number | string;
    defPts: number | string;
  }>;
}

export interface TeamJornadasReportResponse {
  success: boolean;
  message?: string;
  teamName?: string;
  jornadas?: number[];
  rows?: TeamJornadasReportRow[];
}

export interface ClubStyle {
  code: string;
  name: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
}

export interface NotificationConfig {
  githubRepo: string;
  githubToken: string;
  telegramBotToken: string;
  telegramChatId: string;
  directTelegram: boolean;
}

export interface LeagueConfig {
  gasUrl: string;
  firstContributionJornada: number;
  customClubStyles: ClubStyle[];
  notificationConfig: NotificationConfig;
  updatedAt: string | null;
  updatedBy?: string;
}

