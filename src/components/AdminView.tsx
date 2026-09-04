import React, { useState, useEffect } from 'react';
import { gasEngine, ADMIN_PASSWORD } from '../services/gasEngine';
import { TeamToken, TeamJornadasReportResponse, ClubStyle, NotificationConfig } from '../types/league';
import { 
  Lock, 
  Key, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Copy, 
  Clock, 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  Link2,
  Database,
  Code,
  Palette,
  Send,
  Bell,
  Coins,
  DollarSign,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GAS_TEMPLATES, generateCustomGasCode } from '../data/gasTemplates';

export interface AdminViewProps {
  onOpenConnectionModal?: () => void;
  onOpenExportModal?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onOpenConnectionModal,
  onOpenExportModal
}) => {
  const [adminPass, setAdminPass] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [tokens, setTokens] = useState<TeamToken[]>([]);
  const [realTeams, setRealTeams] = useState<string[]>([]);
  const [adminTeamsList, setAdminTeamsList] = useState<string[]>([]);

  // Google Sheets Remote Connection State
  const [gasUrlInput, setGasUrlInput] = useState<string>(gasEngine.getGasUrl());
  const [isTestingGas, setIsTestingGas] = useState<boolean>(false);
  const [isSyncingGas, setIsSyncingGas] = useState<boolean>(false);
  const [gasFeedback, setGasFeedback] = useState<{ isSuccess: boolean; message: string; stats?: any; latency?: number } | null>(null);
  const [copiedGasCode, setCopiedGasCode] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [, setSyncVersion] = useState<number>(0);

  // 1. Primera Jornada con Aportaciones (j) State
  const [firstJornadaInput, setFirstJornadaInput] = useState<number>(gasEngine.getFirstContributionJornada());

  // 2. Equipos y Colores para Mercado State
  const [clubStylesList, setClubStylesList] = useState<ClubStyle[]>(gasEngine.getClubStyles());
  const [adminClubCode, setAdminClubCode] = useState<string>('');
  const [adminClubName, setAdminClubName] = useState<string>('');
  const [adminClubBg, setAdminClubBg] = useState<string>('#FFFF00');
  const [adminClubText, setAdminClubText] = useState<string>('#000000');
  const [adminClubBorder, setAdminClubBorder] = useState<string>('#005187');
  const [editingClubCode, setEditingClubCode] = useState<string | null>(null);

  // 3. Sistema de Avisos de Fichajes State
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>(gasEngine.getNotificationConfig());
  const [isTestingTelegram, setIsTestingTelegram] = useState<boolean>(false);
  const [isTestingGithub, setIsTestingGithub] = useState<boolean>(false);
  const [telegramTestResult, setTelegramTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [githubTestResult, setGithubTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showTelegramGuide, setShowTelegramGuide] = useState<boolean>(false);
  const [showGithubGuide, setShowGithubGuide] = useState<boolean>(false);

  useEffect(() => {
    const unsub = gasEngine.subscribe(() => {
      setSyncVersion(v => v + 1);
      if (isUnlocked) {
        loadAdminData();
      }
    });
    return unsub;
  }, [isUnlocked, adminPass]);

  // Add team form
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newTeamToken, setNewTeamToken] = useState<string>('');

  // Inline editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTeamName, setEditTeamName] = useState<string>('');
  const [editTokenValue, setEditTokenValue] = useState<string>('');

  // Schedule control
  const [schedJornada, setSchedJornada] = useState<number>(5);
  const [schedRealTeam, setSchedRealTeam] = useState<string>('');
  const [schedDeadline, setSchedDeadline] = useState<string>('');

  // Report generator
  const [reportTeam, setReportTeam] = useState<string>('');
  const [reportStartJornada, setReportStartJornada] = useState<number>(1);
  const [reportEndJornada, setReportEndJornada] = useState<number>(5);
  const [reportData, setReportData] = useState<TeamJornadasReportResponse | null>(null);

  const [alertInfo, setAlertInfo] = useState<{ msg: string; isSuccess: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showAlert = (msg: string, isSuccess: boolean = true) => {
    setAlertInfo({ msg, isSuccess });
    setTimeout(() => {
      setAlertInfo(null);
    }, 6000);
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!adminPass.trim()) {
      showAlert('Introduce la contraseña de administrador.', false);
      return;
    }

    const isValid = gasEngine.verifyAdminPassword(adminPass);
    if (isValid) {
      setIsUnlocked(true);
      loadAdminData();
      showAlert('Panel de administración desbloqueado con éxito.', true);
    } else {
      showAlert('Contraseña de administrador incorrecta.', false);
    }
  };

  const loadAdminData = () => {
    const res = gasEngine.getTeamTokensAdmin(adminPass);
    if (res.success) {
      setTokens(res.tokens);
    }
    const rTeams = gasEngine.getRealTeamsList();
    setRealTeams(rTeams);
    if (rTeams.length > 0) setSchedRealTeam(rTeams[0]);

    const aTeams = gasEngine.getAdminTeamNamesList(adminPass);
    setAdminTeamsList(aTeams);
    if (aTeams.length > 0) setReportTeam(aTeams[0]);

    setFirstJornadaInput(gasEngine.getFirstContributionJornada());
    setClubStylesList(gasEngine.getClubStyles());
    setNotificationConfig(gasEngine.getNotificationConfig());
  };

  // Handlers para 1. Primera Jornada con Aportaciones
  const handleSaveFirstJornada = () => {
    const j = Number(firstJornadaInput);
    if (isNaN(j) || j < 1 || j > 38) {
      showAlert('La jornada debe ser un número entero entre 1 y 38.', false);
      return;
    }
    const res = gasEngine.setFirstContributionJornada(j, adminPass);
    showAlert(res.message, res.success);
  };

  // Handlers para 2. Equipos y Colores para Mercado
  const handleSaveAdminClub = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = adminClubCode.trim().toUpperCase();
    if (!code) {
      showAlert('El código del equipo es obligatorio (ej: VIL, ESP).', false);
      return;
    }
    gasEngine.saveClubStyle({
      code,
      name: adminClubName.trim() || code,
      bgColor: adminClubBg,
      textColor: adminClubText,
      borderColor: adminClubBorder || adminClubBg
    });
    setClubStylesList(gasEngine.getClubStyles());
    setAdminClubCode('');
    setAdminClubName('');
    setEditingClubCode(null);
    showAlert(`Equipo ${code} y sus estilos guardados con éxito.`, true);
  };

  const handleEditClub = (club: ClubStyle) => {
    setEditingClubCode(club.code);
    setAdminClubCode(club.code);
    setAdminClubName(club.name);
    setAdminClubBg(club.bgColor);
    setAdminClubText(club.textColor);
    setAdminClubBorder(club.borderColor || club.bgColor);
  };

  const handleDeleteClub = (code: string) => {
    if (!window.confirm(`¿Eliminar los colores del equipo "${code}"?`)) return;
    gasEngine.deleteClubStyle(code);
    setClubStylesList(gasEngine.getClubStyles());
    showAlert(`Equipo ${code} eliminado.`, true);
  };

  const handleResetClubs = () => {
    if (!window.confirm('¿Restablecer los colores de los equipos a los valores predeterminados?')) return;
    gasEngine.resetClubStyles();
    setClubStylesList(gasEngine.getClubStyles());
    showAlert('Colores restablecidos a los valores oficiales.', true);
  };

  // Handlers para 3. Sistema de Avisos a Telegram y GitHub
  const handleSaveNotifications = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = gasEngine.saveNotificationConfig(notificationConfig, adminPass);
    showAlert(res.message, res.success);
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    setTelegramTestResult(null);
    const res = await gasEngine.testTelegramNotification(notificationConfig);
    setIsTestingTelegram(false);
    setTelegramTestResult(res);
    showAlert(res.message, res.success);
  };

  const handleTestGithub = async () => {
    setIsTestingGithub(true);
    setGithubTestResult(null);
    const res = await gasEngine.testGithubDispatch(notificationConfig);
    setIsTestingGithub(false);
    setGithubTestResult(res);
    showAlert(res.message, res.success);
  };

  const handleCopyCustomGas = () => {
    const code = generateCustomGasCode({
      firstContributionJornada: Number(firstJornadaInput),
      telegramBotToken: notificationConfig.telegramBotToken,
      telegramChatId: notificationConfig.telegramChatId,
      githubRepo: notificationConfig.githubRepo,
      githubToken: notificationConfig.githubToken
    });
    navigator.clipboard.writeText(code);
    setCopiedGasCode(true);
    setTimeout(() => setCopiedGasCode(false), 2500);
    showAlert('¡Código.gs personalizado copiado! Contiene tus tokens y la jornada configurada.', true);
  };

  const handleAddTeam = () => {
    if (!newTeamName.trim()) {
      showAlert('El nombre del equipo es obligatorio.', false);
      return;
    }
    const res = gasEngine.addTeamTokenWeb(adminPass, newTeamName, newTeamToken);
    showAlert(res.message, res.success);
    if (res.success) {
      setNewTeamName('');
      setNewTeamToken('');
      loadAdminData();
    }
  };

  const handleStartEdit = (idx: number, t: TeamToken) => {
    setEditingIndex(idx);
    setEditTeamName(t.team);
    setEditTokenValue(t.token);
  };

  const handleSaveEdit = (oldTeamName: string) => {
    if (!editTeamName.trim() || !editTokenValue.trim()) {
      showAlert('El nombre y el token no pueden estar vacíos.', false);
      return;
    }
    const res = gasEngine.editTeamTokenWeb(adminPass, oldTeamName, editTeamName, editTokenValue);
    showAlert(res.message, res.success);
    if (res.success) {
      setEditingIndex(null);
      loadAdminData();
    }
  };

  const handleDeleteTeam = (teamName: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el equipo "${teamName}" y su token?`)) return;
    const res = gasEngine.deleteTeamTokenWeb(adminPass, teamName);
    showAlert(res.message, res.success);
    if (res.success) {
      loadAdminData();
    }
  };

  const handleRegenerateTokens = () => {
    if (!window.confirm('¿Regenerar tokens para todos los equipos? Los antiguos dejarán de funcionar.')) return;
    const res = gasEngine.generateTeamTokensWeb(adminPass);
    showAlert(res.message, res.success);
    if (res.success) {
      loadAdminData();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showAlert(`Token copiado al portapapeles: ${text}`, true);
    });
  };

  const handleCopyLineups = () => {
    const res = gasEngine.copyLastJornadaAlineacionesWeb(adminPass);
    showAlert(res.message, res.success);
  };

  const handleSaveSchedule = () => {
    if (!schedJornada || !schedRealTeam || !schedDeadline) {
      showAlert('Rellena todos los campos de restricción horaria.', false);
      return;
    }
    const res = gasEngine.saveScheduleDeadline(adminPass, schedJornada, schedRealTeam, schedDeadline);
    showAlert(res.message, res.success);
  };

  const handleGenerateReport = () => {
    if (!reportTeam || !reportStartJornada || !reportEndJornada) {
      showAlert('Por favor, selecciona equipo y rango de jornadas.', false);
      return;
    }
    if (reportStartJornada > reportEndJornada) {
      showAlert('La jornada inicial no puede ser mayor a la final.', false);
      return;
    }
    const res = gasEngine.getTeamJornadasReport(adminPass, reportTeam, reportStartJornada, reportEndJornada);
    if (res.success) {
      setReportData(res);
      showAlert(`Informe generado para ${reportTeam} (J${reportStartJornada}-J${reportEndJornada}).`, true);
    } else {
      showAlert(res.message || 'Error al generar informe', false);
    }
  };

  const exportReportToCSV = () => {
    if (!reportData || !reportData.rows || reportData.rows.length === 0) {
      showAlert('No hay datos de informe para exportar.', false);
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    const headers = ['Jugador', 'Posición', 'Equipo Real'];
    reportData.jornadas?.forEach(j => {
      headers.push(`J${j} Pts`, `J${j} Goles`, `J${j} Pts Def`);
    });
    csvContent += headers.map(h => `"${h}"`).join(',') + '\n';

    reportData.rows.forEach(r => {
      const row = [`"${r.name}"`, `"${r.position}"`, `"${r.realTeam}"`];
      r.jornadasDetails.forEach(d => {
        row.push(String(d.pts), String(d.goles), String(d.defPts));
      });
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Informe_${reportData.teamName}_J${reportData.jornadas?.[0]}_J${reportData.jornadas?.[reportData.jornadas.length - 1]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = () => {
    gasEngine.resetToDefaults();
    loadAdminData();
    setShowResetConfirm(false);
    showAlert('Datos restablecidos a la configuración inicial de la liga.', true);
  };

  const handleTestGasConnection = async () => {
    if (!gasUrlInput.trim()) {
      setGasFeedback({ isSuccess: false, message: 'Introduce la URL de la Web App de Google Apps Script (/exec).' });
      return;
    }
    setIsTestingGas(true);
    setGasFeedback(null);
    const res = await gasEngine.testConnection(gasUrlInput.trim());
    setIsTestingGas(false);
    setGasFeedback({
      isSuccess: !!res.success,
      message: res.message || (res.success ? 'Conexión verificada con éxito' : 'Error al conectar'),
      latency: res.latencyMs
    });
    if (res.success) {
      gasEngine.setGasUrl(gasUrlInput.trim());
    }
  };

  const handleSyncGasNow = async () => {
    if (!gasUrlInput.trim()) {
      setGasFeedback({ isSuccess: false, message: 'Introduce la URL de la Web App de Google Apps Script (/exec).' });
      return;
    }
    gasEngine.setGasUrl(gasUrlInput.trim());
    setIsSyncingGas(true);
    setGasFeedback(null);
    const res = await gasEngine.syncFromRemote(gasUrlInput.trim());
    setIsSyncingGas(false);
    setGasFeedback({
      isSuccess: !!res.success,
      message: res.message,
      stats: res.stats
    });
    if (res.success) {
      loadAdminData();
    }
  };

  const handleCopyGasCode = () => {
    const code = GAS_TEMPLATES['Código.gs'] || '';
    navigator.clipboard.writeText(code);
    setCopiedGasCode(true);
    setTimeout(() => setCopiedGasCode(false), 2000);
  };

  const isGasConnected = gasEngine.isRemoteConnected();
  const lastSyncTime = gasEngine.getLastSyncTime();

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight m-0">
              Panel Admin
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Control de tokens, alineaciones y restricciones horarias
            </p>
          </div>
        </div>

        {isUnlocked && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {showResetConfirm ? (
              <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-500/50 p-1.5 rounded-xl text-xs">
                <span className="text-rose-200 font-bold px-1">¿Restablecer?</span>
                <button
                  onClick={handleResetData}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-2 py-1 rounded-lg text-[11px] transition cursor-pointer"
                >
                  Sí, borrar
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg text-[11px] transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                title="Restablecer datos de prueba a valores iniciales"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Restablecer Datos Demo</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Admin Password Unlock Gate */}
      {!isUnlocked ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 max-w-xl mx-auto">
          <label className="block text-xs font-extrabold text-amber-400 uppercase tracking-widest">
            Clave de Administrador
          </label>
          <form onSubmit={handleUnlock} className="flex gap-3">
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="Introduce la clave de administrador"
              className="flex-1 bg-slate-950 border border-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-md transition cursor-pointer"
            >
              Acceder
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Global Alert Notification */}
          {alertInfo && (
            <div className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              alertInfo.isSuccess 
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300' 
                : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
            }`}>
              {alertInfo.isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{alertInfo.msg}</span>
            </div>
          )}

          {/* Section 0: Enlace & Sincronización con Google Sheets (Apps Script) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight m-0 flex items-center gap-2">
                    <span>Enlace & Sincronización con Google Sheets</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configuración privada de la Web App de Apps Script para sincronizar equipos, jugadores, fichajes y draft
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  isGasConnected 
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' 
                    : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isGasConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isGasConnected ? 'Google Sheets Conectado' : 'Sin Enlazar (Modo Local)'}</span>
                </div>
              </div>
            </div>

            {/* Sync Live Stats Counter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Equipos</span>
                <span className="text-sm font-black text-white font-mono">{gasEngine.getTeamNames().length}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Jugadores</span>
                <span className="text-sm font-black text-white font-mono">{gasEngine.getPlayers().length}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Fichajes</span>
                <span className="text-sm font-black text-amber-400 font-mono">{gasEngine.getTransferHistory().length}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Draft</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{gasEngine.getDraftHistory().length}</span>
              </div>
            </div>

            {/* URL Input & Direct Actions */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                  URL de la Aplicación Web de Google Apps Script:
                </label>
                {lastSyncTime && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    Última sincronización: <strong className="text-emerald-400">{lastSyncTime}</strong>
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={gasUrlInput}
                  onChange={(e) => setGasUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="flex-1 bg-slate-950 border border-slate-700 text-white font-mono text-xs py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestGasConnection}
                    disabled={isTestingGas || isSyncingGas}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingGas ? 'animate-spin text-amber-400' : ''}`} />
                    <span>{isTestingGas ? 'Probando...' : 'Probar Conexión'}</span>
                  </button>
                  <button
                    onClick={handleSyncGasNow}
                    disabled={isTestingGas || isSyncingGas}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGas ? 'animate-spin' : ''}`} />
                    <span>{isSyncingGas ? 'Sincronizando...' : 'Guardar & Sincronizar'}</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                * Debe terminar en <span className="font-mono text-amber-400">/exec</span> (no /dev) y haber sido implementada con acceso para <strong className="text-slate-300">"Cualquiera" (Anyone)</strong>.
              </p>

              {/* Banner de Sincronización Centralizada Multidispositivo */}
              <div className="bg-slate-950/90 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      Sincronización Centralizada Activa
                    </span>
                  </div>
                  {gasEngine.getServerUpdatedAt() && (
                    <span className="text-[10px] font-mono text-slate-400">
                      Servidor actualizado: {new Date(gasEngine.getServerUpdatedAt()!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Como administrador, al introducir o modificar la URL aquí, se guarda en el servidor de la liga. <strong>Todos los participantes que abran la app desde sus móviles, ordenadores o tablets se conectarán automáticamente</strong> a esta misma hoja de cálculo sin tener que hacer nada en sus dispositivos.
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = window.location.origin + window.location.pathname;
                      navigator.clipboard.writeText(shareUrl);
                      showAlert('Enlace de la app copiado. Los participantes pueden abrirlo en su móvil o PC y conectarán directamente.', true);
                    }}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Enlace de la App para Jugadores</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanUrl = gasEngine.getGasUrl();
                      const shareUrl = window.location.origin + window.location.pathname + (cleanUrl ? `?gasUrl=${encodeURIComponent(cleanUrl)}` : '');
                      navigator.clipboard.writeText(shareUrl);
                      showAlert('Enlace con autoconexión directa copiado al portapapeles.', true);
                    }}
                    className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
                  >
                    <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiar Enlace con Autoconexión Directa</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback alert if any */}
            {gasFeedback && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold border flex items-center justify-between gap-2 ${
                gasFeedback.isSuccess 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  {gasFeedback.isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{gasFeedback.message}</span>
                </div>
                {gasFeedback.latency !== undefined && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                    {gasFeedback.latency} ms
                  </span>
                )}
              </div>
            )}

            {/* Quick Action Tools */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
              {onOpenConnectionModal && (
                <button
                  onClick={onOpenConnectionModal}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Abrir Asistente de Conexión y Diagnóstico</span>
                </button>
              )}

              {onOpenExportModal && (
                <button
                  onClick={onOpenExportModal}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Archivos y Código Apps Script</span>
                </button>
              )}

              <button
                onClick={handleCopyGasCode}
                className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedGasCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedGasCode ? '¡Código.gs Copiado!' : 'Copiar Código.gs Actualizado'}</span>
              </button>
            </div>

            {/* Google Sheets Tabs Info Card */}
            <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">Estructura sincronizada con Google Sheets:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                <li><strong className="text-slate-300">Equipos / Tokens:</strong> Lista de equipos participantes y sus tokens de acceso.</li>
                <li><strong className="text-slate-300">Jugadores:</strong> Plantilla completa con valor, posición y puntos por jornada.</li>
                <li><strong className="text-slate-300">Alineaciones:</strong> Los 11 futbolistas alineados por equipo y jornada.</li>
                <li><strong className="text-slate-300">Fichajes:</strong> Historial de sustituciones y coste de mercado (se actualiza automáticamente).</li>
                <li><strong className="text-slate-300">Draft:</strong> Historial de jugadores seleccionados durante el draft inicial.</li>
              </ul>
            </div>
          </div>

          {/* ======================================================== */}
          {/* NUEVA SECCIÓN: 1. Primera Jornada con Aportes y Premios */}
          {/* ======================================================== */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight m-0 flex items-center gap-2">
                    <span>Aportes y Premios de las Jornadas Semanales</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Establece a partir de qué jornada se contabilizan las aportaciones semanales (1.50€ por equipo) y premios
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-xl">
                  Jornada Actual de Inicio: <strong>J{firstJornadaInput}</strong>
                </span>
              </div>
            </div>

            {/* Explicación de Código GAS */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  Equivalente en Google Apps Script (Código.gs):
                </span>
                <span className="text-[10px] text-slate-500 font-mono">variable j en bucle contable</span>
              </div>
              <pre className="text-[11px] font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 text-amber-300/90 overflow-x-auto leading-relaxed">
{`// 2. Calcular Aportes y Premios de las Jornadas semanales
for (let j = ${firstJornadaInput}; j <= maxJornadaPlayers; j++) {
    totalContributions += numTeams * WEEKLY_CONTRIBUTION;
    teamNames.forEach(teamName => {
        if (teamBalanceDetails.has(teamName)) {
            teamBalanceDetails.get(teamName).contributions += WEEKLY_CONTRIBUTION;
        }
    });
}`}
              </pre>
              <p className="text-[11px] text-slate-400">
                Puesto que cada temporada puede comenzar con aportaciones en jornadas distintas (por ejemplo Jornada 4 o Jornada 1), aquí puedes definir el valor exacto de inicio. Al guardarlo se recalcularán automáticamente los saldos contables y balances en la pestaña Balances.
              </p>
            </div>

            {/* Formulario de Configuración de Jornada */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="w-48">
                <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                  Primera Jornada con Aportes (j)
                </label>
                <input
                  type="number"
                  min="1"
                  max="38"
                  value={firstJornadaInput}
                  onChange={(e) => setFirstJornadaInput(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Botones de selección rápida */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Selección Rápida de Jornada
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={`quick-j-${num}`}
                      type="button"
                      onClick={() => setFirstJornadaInput(num)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        firstJornadaInput === num
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      J{num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="self-end">
                <button
                  type="button"
                  onClick={handleSaveFirstJornada}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 px-4 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Jornada de Aportes</span>
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* NUEVA SECCIÓN: 2. Equipos y Colores para el Mercado     */}
          {/* ======================================================== */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight m-0 flex items-center gap-2">
                    <span>Equipos y Colores para la Página de Mercado</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Añade nuevos equipos reales y personaliza sus colores con formato CSS (.team-color-COD)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetClubs}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="Restablecer a colores oficiales predeterminados"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restablecer Oficiales</span>
                </button>
              </div>
            </div>

            {/* Formulario Añadir / Editar Equipo */}
            <form onSubmit={handleSaveAdminClub} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  {editingClubCode ? `Editando Equipo: ${editingClubCode}` : 'Añadir / Personalizar Equipo'}
                </span>
                {editingClubCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingClubCode(null);
                      setAdminClubCode('');
                      setAdminClubName('');
                    }}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {/* Código */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Código (3-4 letras)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={adminClubCode}
                    onChange={(e) => setAdminClubCode(e.target.value.toUpperCase())}
                    placeholder="Ej: VIL"
                    className="w-full bg-slate-900 border border-slate-700 text-white font-mono font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={adminClubName}
                    onChange={(e) => setAdminClubName(e.target.value)}
                    placeholder="Ej: Villarreal CF"
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Color de Fondo */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Color de Fondo
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-lg">
                    <input
                      type="color"
                      value={adminClubBg}
                      onChange={(e) => setAdminClubBg(e.target.value)}
                      className="w-7 h-7 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={adminClubBg}
                      onChange={(e) => setAdminClubBg(e.target.value)}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Color de Texto */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Color del Texto
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-lg">
                    <input
                      type="color"
                      value={adminClubText}
                      onChange={(e) => setAdminClubText(e.target.value)}
                      className="w-7 h-7 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={adminClubText}
                      onChange={(e) => setAdminClubText(e.target.value)}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Color de Borde */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Color de Borde
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-lg">
                    <input
                      type="color"
                      value={adminClubBorder}
                      onChange={(e) => setAdminClubBorder(e.target.value)}
                      className="w-7 h-7 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={adminClubBorder}
                      onChange={(e) => setAdminClubBorder(e.target.value)}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Vista previa en vivo del distintivo y regla CSS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-bold">Vista Previa Mercado:</span>
                  <span
                    className="inline-block px-3 py-1 rounded-md text-xs font-mono font-black shadow-sm border"
                    style={{
                      backgroundColor: adminClubBg,
                      color: adminClubText,
                      borderColor: adminClubBorder
                    }}
                  >
                    {adminClubCode || 'VIL'}
                  </span>
                  <span className="text-xs text-white font-semibold">{adminClubName || 'Villarreal CF'}</span>
                </div>

                <div className="text-[11px] font-mono text-amber-400/90 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  .team-color-{adminClubCode || 'VIL'} {'{'} background-color: {adminClubBg}; color: {adminClubText}; {'}'}
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingClubCode ? 'Actualizar Equipo' : 'Guardar Equipo'}</span>
                </button>
              </div>
            </form>

            {/* Listado de Equipos Configurados */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Equipos Registrados ({clubStylesList.length}):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-64 overflow-y-auto p-1">
                {clubStylesList.map((club) => (
                  <div
                    key={`club-item-${club.code}`}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl flex items-center justify-between gap-2 transition"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-black border shrink-0"
                        style={{
                          backgroundColor: club.bgColor,
                          color: club.textColor,
                          borderColor: club.borderColor || club.bgColor
                        }}
                      >
                        {club.code}
                      </span>
                      <span className="text-[11px] text-slate-300 font-bold truncate" title={club.name}>
                        {club.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEditClub(club)}
                        className="text-slate-400 hover:text-amber-400 p-1 transition cursor-pointer"
                        title="Editar colores"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteClub(club.code)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                        title="Eliminar equipo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* NUEVA SECCIÓN: 3. Sistema de Avisos de Fichajes          */}
          {/* ======================================================== */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight m-0 flex items-center gap-2">
                    <span>Sistema de Avisos de Fichajes</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Notifica en tiempo real a tu grupo de Telegram cada vez que un participante realiza un fichaje
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <input
                    type="checkbox"
                    checked={notificationConfig.enabled}
                    onChange={(e) => setNotificationConfig({ ...notificationConfig, enabled: e.target.checked })}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-200">
                    {notificationConfig.enabled ? 'Avisos Activados' : 'Avisos Desactivados'}
                  </span>
                </label>
              </div>
            </div>

            <form onSubmit={handleSaveNotifications} className="space-y-6">
              {/* BLOQUE A: Telegram Directo (Principal y Recomendado) */}
              <div className="bg-slate-950/70 border border-blue-500/30 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-black text-white uppercase tracking-wide">
                      1. Notificaciones en Telegram (Directo)
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                      Recomendado
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTelegramGuide(!showTelegramGuide)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showTelegramGuide ? 'Ocultar guía' : '¿Cómo obtener el Token y Chat ID?'}</span>
                    {showTelegramGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Guía Desplegable Telegram */}
                {showTelegramGuide && (
                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4 text-xs text-slate-300 space-y-2.5">
                    <p className="font-bold text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      Configura tus avisos en Telegram en 3 sencillos pasos:
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                      <li>
                        <strong className="text-white">Crear el bot:</strong> Abre Telegram, busca a <code className="text-amber-400">@BotFather</code> y envíale el comando <code className="text-amber-400">/newbot</code>. Sigue las instrucciones y te dará un <strong className="text-white">Token HTTP API</strong> (ejemplo: <code className="text-amber-400">748392019:AAHkjl8z9...</code>). Cópialo y pégalo en el campo <em>Telegram Bot Token</em>.
                      </li>
                      <li>
                        <strong className="text-white">Añadir el bot al grupo:</strong> En Telegram, ve al grupo o canal de tu liga y añade a tu bot como miembro (y dale permisos para escribir).
                      </li>
                      <li>
                        <strong className="text-white">Obtener el Chat ID:</strong> Añade al grupo temporalmente al bot <code className="text-amber-400">@RawDataBot</code> o reenvía un mensaje del grupo a <code className="text-amber-400">@userinfobot</code> para ver el ID del grupo (suele ser un número negativo que empieza por <code className="text-amber-400">-100...</code>, por ejemplo <code className="text-amber-400">-1002345678901</code>). Pégalo en <em>Telegram Chat ID</em>.
                      </li>
                    </ol>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Telegram Bot Token */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                      Telegram Bot Token (@BotFather) *
                    </label>
                    <input
                      type="text"
                      value={notificationConfig.telegramBotToken}
                      onChange={(e) => setNotificationConfig({ ...notificationConfig, telegramBotToken: e.target.value.trim() })}
                      placeholder="Ej: 123456789:ABCdefGHIjklmn..."
                      className="w-full bg-slate-900 border border-slate-700 text-white font-mono text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Token numérico con dos puntos entregado por @BotFather (no pongas @nombre_de_usuario).
                    </span>
                  </div>

                  {/* Telegram Chat ID */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                      Telegram Chat ID del Grupo / Canal *
                    </label>
                    <input
                      type="text"
                      value={notificationConfig.telegramChatId}
                      onChange={(e) => setNotificationConfig({ ...notificationConfig, telegramChatId: e.target.value.trim() })}
                      placeholder="Ej: -1001982736450"
                      className="w-full bg-slate-900 border border-slate-700 text-white font-mono text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      ID del grupo (empieza por -100...) o tu ID personal si quieres avisos individuales.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestTelegram}
                    disabled={isTestingTelegram || !notificationConfig.telegramBotToken || !notificationConfig.telegramChatId}
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isTestingTelegram ? 'Enviando prueba a Telegram...' : 'Probar Aviso en Telegram'}</span>
                  </button>

                  {telegramTestResult && (
                    <div className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                      telegramTestResult.success ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                    }`}>
                      {telegramTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                      <span>{telegramTestResult.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* BLOQUE B: GitHub Actions Dispatch (100% Opcional) */}
              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-black text-white uppercase tracking-wide">
                      2. GitHub Actions (Workflow Dispatch)
                    </span>
                    <span className="text-[10px] bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                      100% Opcional
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGithubGuide(!showGithubGuide)}
                    className="text-xs text-amber-400/90 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{showGithubGuide ? 'Ocultar info' : '¿Para qué sirve esto y qué debo poner?'}</span>
                    {showGithubGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Explicación de GitHub */}
                {showGithubGuide ? (
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                    <p className="font-bold text-amber-300">
                      💡 ¿Es obligatorio rellenar GitHub? ¡NO!
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      Si solo quieres que se envíen avisos a tu grupo de Telegram, <strong className="text-white">deja estos dos campos de GitHub completamente vacíos</strong>.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      <strong className="text-amber-300">¿Para qué sirve?</strong> Está pensado únicamente si eres programador y tienes el código de esta aplicación alojado en tu propia cuenta de GitHub, y quieres que cada vez que alguien fiche se dispare automáticamente un Workflow de GitHub Actions (por ejemplo, para actualizar un archivo o compilar la web).
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 pt-1">
                      <li><strong className="text-white">GitHub Repositorio:</strong> tu nombre de usuario y el repositorio (ej: <code className="text-amber-400">usuario/liga-fantastica</code>).</li>
                      <li><strong className="text-white">GitHub PAT:</strong> un token de acceso personal que creas en <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-blue-400 underline">GitHub Settings &rarr; Developer Settings &rarr; Personal access tokens</a> con permiso de <code className="text-amber-400">repo</code>.</li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Nota:</strong> Si solo quieres avisos por Telegram, deja estos campos en blanco. Solo se utilizan si tienes un workflow automático configurado en tu repositorio de GitHub.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* GitHub Repo */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                      GitHub Repositorio (Opcional)
                    </label>
                    <input
                      type="text"
                      value={notificationConfig.githubRepo || ''}
                      onChange={(e) => setNotificationConfig({ ...notificationConfig, githubRepo: e.target.value.trim() })}
                      placeholder="Ej: tu-usuario/liga-fantastica (o déjalo vacío)"
                      className="w-full bg-slate-900 border border-slate-700 text-white font-mono text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                    />
                  </div>

                  {/* GitHub PAT */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                      GitHub Personal Access Token (PAT - Opcional)
                    </label>
                    <input
                      type="password"
                      value={notificationConfig.githubToken || ''}
                      onChange={(e) => setNotificationConfig({ ...notificationConfig, githubToken: e.target.value.trim() })}
                      placeholder="ghp_... (o déjalo vacío)"
                      className="w-full bg-slate-900 border border-slate-700 text-white font-mono text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestGithub}
                    disabled={isTestingGithub || !notificationConfig.githubRepo || !notificationConfig.githubToken}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Code className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isTestingGithub ? 'Disparando GitHub...' : 'Probar Dispatch GitHub'}</span>
                  </button>

                  {githubTestResult && (
                    <div className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                      githubTestResult.success ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                    }`}>
                      {githubTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                      <span>GitHub: {githubTestResult.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción generales */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCopyCustomGas}
                  className="bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código.gs con Avisos Inyectados</span>
                </button>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Configuración de Avisos</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 1: Tokens de Equipos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
                <Key className="w-4 h-4 text-amber-400" />
                Tokens de Equipos
              </h2>
              <button
                onClick={handleRegenerateTokens}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold py-1.5 px-3 rounded-lg transition cursor-pointer"
              >
                Regenerar Todos los Tokens
              </button>
            </div>

            {/* Formulario Añadir Equipo */}
            <div className="flex flex-wrap gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 items-end">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nuevo Equipo</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Nombre equipo"
                  className="w-full bg-slate-900 border border-slate-700 text-white py-1.5 px-3 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Token (Opcional)</label>
                <input
                  type="text"
                  value={newTeamToken}
                  onChange={(e) => setNewTeamToken(e.target.value)}
                  placeholder="Auto-generado si está vacío"
                  className="w-full bg-slate-900 border border-slate-700 text-white py-1.5 px-3 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <button
                onClick={handleAddTeam}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Equipo</span>
              </button>
            </div>

            {/* Tabla de Tokens */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Equipo</th>
                    <th className="p-3">Token Único</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {tokens.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-500">
                        No hay tokens registrados. Haz clic en "Añadir Equipo" o "Regenerar Todos los Tokens".
                      </td>
                    </tr>
                  ) : (
                    tokens.map((t, idx) => {
                      const isEditing = editingIndex === idx;
                      return (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 font-bold text-white">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editTeamName}
                                onChange={(e) => setEditTeamName(e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-white py-1 px-2 rounded text-xs w-full"
                              />
                            ) : (
                              t.team
                            )}
                          </td>
                          <td className="p-3 font-mono text-amber-300">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editTokenValue}
                                onChange={(e) => setEditTokenValue(e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-amber-300 py-1 px-2 rounded text-xs w-full font-mono"
                              />
                            ) : (
                              t.token
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveEdit(t.team)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded text-[11px] cursor-pointer"
                                title="Guardar"
                              >
                                <Check className="w-3.5 h-3.5 inline" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(idx, t)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[11px] border border-slate-700 cursor-pointer"
                                title="Editar"
                              >
                                <Edit3 className="w-3.5 h-3.5 inline" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteTeam(t.team)}
                              className="bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 px-2 py-1 rounded text-[11px] cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>

                            <button
                              onClick={() => copyToClipboard(t.token)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[11px] border border-slate-700 cursor-pointer"
                              title="Copiar Token"
                            >
                              <Copy className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Automatización de Jornadas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h2 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2 m-0 p-0">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              Copiar Alineaciones
            </h2>
            <p className="text-xs text-slate-400">
              Copia automáticamente las alineaciones de la última jornada registrada a la siguiente jornada disponible.
            </p>
            <button
              onClick={handleCopyLineups}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
            >
              Copiar Última Jornada
            </button>
          </div>

          {/* Section 3: Control de Horarios */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2 m-0 p-0">
              <Clock className="w-4 h-4 text-amber-400" />
              Bloqueo de Equipos Reales
            </h2>
            <p className="text-xs text-slate-400">
              Establece la fecha y hora límite para modificaciones de plantilla en un equipo real específico.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jornada</label>
                <input
                  type="number"
                  min="1"
                  value={schedJornada}
                  onChange={(e) => setSchedJornada(parseInt(e.target.value, 10))}
                  placeholder="Ej: 5"
                  className="w-full bg-slate-950 border border-slate-700 text-white py-2 px-3 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Equipo Real</label>
                <select
                  value={schedRealTeam}
                  onChange={(e) => setSchedRealTeam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white py-2 px-3 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-mono"
                >
                  {realTeams.map((rt, idx) => (
                    <option key={`sched-rt-${rt}-${idx}`} value={rt}>{rt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Límite</label>
                <input
                  type="datetime-local"
                  value={schedDeadline}
                  onChange={(e) => setSchedDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white py-2 px-3 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSchedule}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 px-4 rounded-xl transition cursor-pointer"
            >
              Guardar Restricción
            </button>
          </div>

          {/* Section 4: Informe de Resultados por Equipo */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2 m-0 p-0">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              Informe de Resultados por Equipo
            </h2>
            <p className="text-xs text-slate-400">
              Genera una tabla desglosada por jornada (Puntos, Goles y Puntos Defensivos) de los jugadores alineados y exporta a Excel (.csv).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Equipo</label>
                <select
                  value={reportTeam}
                  onChange={(e) => setReportTeam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white py-2 px-3 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                >
                  {adminTeamsList.map((t, idx) => (
                    <option key={`rep-team-${t}-${idx}`} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jornada Inicial</label>
                <input
                  type="number"
                  min="1"
                  value={reportStartJornada}
                  onChange={(e) => setReportStartJornada(parseInt(e.target.value, 10))}
                  placeholder="Ej: 1"
                  className="w-full bg-slate-950 border border-slate-700 text-white py-2 px-3 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jornada Final</label>
                <input
                  type="number"
                  min="1"
                  value={reportEndJornada}
                  onChange={(e) => setReportEndJornada(parseInt(e.target.value, 10))}
                  placeholder="Ej: 5"
                  className="w-full bg-slate-950 border border-slate-700 text-white py-2 px-3 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGenerateReport}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 px-4 rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Generar Tabla</span>
              </button>

              {reportData && reportData.rows && reportData.rows.length > 0 && (
                <button
                  onClick={exportReportToCSV}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Excel (.csv)</span>
                </button>
              )}
            </div>

            {/* Render Report Table */}
            {reportData && reportData.jornadas && (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 pt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[10px]">
                    <tr>
                      <th rowSpan={2} className="p-2 border border-slate-800 align-middle">Jugador</th>
                      <th rowSpan={2} className="p-2 border border-slate-800 align-middle">Pos.</th>
                      <th rowSpan={2} className="p-2 border border-slate-800 align-middle">Equipo Real</th>
                      {reportData.jornadas.map(j => (
                        <th key={j} colSpan={3} className="p-2 border border-slate-800 text-center bg-slate-900">
                          Jornada {j}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {reportData.jornadas.map(j => (
                        <React.Fragment key={`sub-${j}`}>
                          <th className="p-1 border border-slate-800 text-center text-[9px] bg-slate-950">Pts</th>
                          <th className="p-1 border border-slate-800 text-center text-[9px] text-amber-300 bg-slate-950">Gol</th>
                          <th className="p-1 border border-slate-800 text-center text-[9px] text-cyan-300 bg-slate-950">Def</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {reportData.rows?.map((r, rIdx) => (
                      <tr key={`rep-row-${r.name}-${r.realTeam}-${rIdx}`} className="hover:bg-slate-800/40">
                        <td className="p-2 border border-slate-800 font-bold text-white">{r.name}</td>
                        <td className="p-2 border border-slate-800 text-slate-400">{r.position}</td>
                        <td className="p-2 border border-slate-800 text-slate-400 font-mono">{r.realTeam}</td>
                        {r.jornadasDetails.map((d, dIdx) => (
                          <React.Fragment key={`detail-${dIdx}`}>
                            <td className="p-1.5 border border-slate-800 text-center font-mono">{d.pts}</td>
                            <td className="p-1.5 border border-slate-800 text-center font-mono text-amber-300 font-bold">{d.goles}</td>
                            <td className="p-1.5 border border-slate-800 text-center font-mono text-cyan-300 font-bold">{d.defPts}</td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
