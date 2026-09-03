import React, { useState, useEffect } from 'react';
import { gasEngine, ADMIN_PASSWORD } from '../services/gasEngine';
import { TeamToken, TeamJornadasReportResponse } from '../types/league';
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
  Code
} from 'lucide-react';
import { GAS_TEMPLATES } from '../data/gasTemplates';

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
              placeholder="Introduce la clave admin (por defecto: admin)"
              className="flex-1 bg-slate-950 border border-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-md transition cursor-pointer"
            >
              Acceder
            </button>
          </form>
          <p className="text-[11px] text-slate-500">
            * Contraseña por defecto según Código.gs: <strong className="text-slate-400 font-mono">admin</strong>
          </p>
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
                  {realTeams.map(rt => (
                    <option key={rt} value={rt}>{rt}</option>
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
                  {adminTeamsList.map(t => (
                    <option key={t} value={t}>{t}</option>
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
                      <tr key={rIdx} className="hover:bg-slate-800/40">
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
