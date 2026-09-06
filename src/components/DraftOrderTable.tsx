import React, { useState, useEffect } from 'react';
import { gasEngine } from '../services/gasEngine';
import { DraftRoundOrder } from '../types/league';
import { 
  Trophy, 
  Shuffle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  AlertCircle,
  Sparkles,
  CloudUpload
} from 'lucide-react';

interface DraftOrderTableProps {
  onSelectTeam?: (teamName: string) => void;
  selectedTeam?: string;
}

export const DraftOrderTable: React.FC<DraftOrderTableProps> = ({ 
  onSelectTeam,
  selectedTeam 
}) => {
  const [order, setOrder] = useState<DraftRoundOrder[]>(gasEngine.getDraftOrder());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveFeedback, setSaveFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const isPlayerMode = gasEngine.isPlayerMode();

  const updateState = () => {
    setOrder(gasEngine.getDraftOrder());
  };

  useEffect(() => {
    const unsub = gasEngine.subscribe(updateState);
    return unsub;
  }, []);

  const turn = gasEngine.getCurrentDraftTurn();
  const pickCounts = gasEngine.getDraftPicksCountByTeam();
  const teams = gasEngine.getTeams();
  const totalTeams = teams.length;
  const maxPicks = totalTeams * 11;
  const isComplete = turn.isComplete || (maxPicks > 0 && turn.totalPicks >= maxPicks);

  // Sorteo aleatorio de las 11 rondas respetando turnos por orden
  const handleRandomize = () => {
    if (turn.totalPicks > 0) {
      const confirmReset = window.confirm(
        'Ya se han realizado elecciones en el Draft. ¿Deseas sortear un nuevo orden de elección aleatorio?'
      );
      if (!confirmReset) return;
    }
    const newOrder = gasEngine.generateRandomDraftOrder(true);
    setOrder(newOrder);
    setSaveFeedback({
      type: 'success',
      text: '¡Nuevo orden aleatorio sorteado con éxito para las 11 rondas!'
    });
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  // Guardar orden directamente en Google Sheets (pestaña 'Draft')
  const handleSyncToSheets = async () => {
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      const res = await gasEngine.syncDraftOrderToGoogleSheets();
      setSaveFeedback({
        type: res.success ? 'success' : 'error',
        text: res.message
      });
    } catch (err: any) {
      setSaveFeedback({
        type: 'error',
        text: 'Error de conexión: ' + (err?.message || err)
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveFeedback(null), 5000);
    }
  };

  // Encontrar el número máximo de filas entre todas las rondas
  const maxRows = Math.max(
    totalTeams,
    ...order.map(o => o.teams?.length || 0)
  );

  return (
    <div id="draft-order-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl relative overflow-hidden">
      {/* Luz ambiental de fondo */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cabecera con Estado del Turno y Botones */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Trophy className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Orden de Elección del Draft (11 Rondas)
            </h3>
            {isComplete ? (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                ✓ Completado
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full animate-pulse">
                En curso: R{turn.round}
              </span>
            )}
          </div>
        </div>

        {/* Acciones del Orden */}
        <div className="flex flex-wrap items-center gap-2">
          {!isPlayerMode && (
            <button
              type="button"
              id="btn-sortear-draft"
              onClick={handleRandomize}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition"
              title="Sortear un orden aleatorio para las 11 rondas de elección"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span>Sortear Orden</span>
            </button>
          )}

          {!isPlayerMode && gasEngine.getGasUrl() && (
            <button
              type="button"
              id="btn-sync-sheets-draft"
              onClick={handleSyncToSheets}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition disabled:opacity-50"
              title="Guardar orden en la pestaña 'Draft' de Google Sheets"
            >
              <CloudUpload className="w-3.5 h-3.5 text-sky-400" />
              <span>{isSaving ? 'Guardando...' : 'Subir a Sheets'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner de Feedback */}
      {saveFeedback && (
        <div className={`mt-3 p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
          saveFeedback.type === 'success' 
            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
        }`}>
          {saveFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{saveFeedback.text}</span>
        </div>
      )}

      {/* Widget de Turno Actual */}
      <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isComplete ? 'Estado del Draft' : 'Turno de Elección Actual'}
            </div>
            {isComplete ? (
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Todas las 11 rondas completadas! ({turn.totalPicks} jugadores elegidos)</span>
              </div>
            ) : (
              <div className="text-base font-black text-white flex items-center gap-2">
                <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-4">
                  {turn.activeTeam || 'Siguiente equipo'}
                </span>
                <span className="text-xs font-normal text-slate-400">
                  (Ronda {turn.round} de 11 — Turno #{turn.teamIndex + 1} de {totalTeams})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Barra de progreso global */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Progreso del Draft</span>
              <span className="font-semibold text-slate-200">
                {turn.totalPicks} / {maxPicks}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${maxPicks > 0 ? Math.min(100, Math.round((turn.totalPicks / maxPicks) * 100)) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de 11 Columnas / Rondas */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 shadow-inner bg-slate-950/40">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700 text-xs font-bold text-slate-300">
              <th className="py-2.5 px-3 text-center w-12 text-slate-400 border-r border-slate-800 sticky left-0 bg-slate-800/90 backdrop-blur z-10">
                #
              </th>
              {Array.from({ length: 11 }).map((_, rIdx) => {
                const roundNum = rIdx + 1;
                const isCurrentRound = !isComplete && turn.round === roundNum;
                const isPastRound = isComplete || turn.round > roundNum;
                return (
                  <th 
                    key={`th-round-${roundNum}`}
                    className={`py-2.5 px-3 text-center border-r border-slate-800 last:border-r-0 whitespace-nowrap transition-colors ${
                      isCurrentRound 
                        ? 'bg-amber-500/20 text-amber-300 border-b-2 border-b-amber-400 font-black' 
                        : isPastRound
                        ? 'text-slate-400 font-medium'
                        : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Ronda {roundNum}</span>
                      {isCurrentRound && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {Array.from({ length: maxRows }).map((_, rowIdx) => (
              <tr key={`draft-order-row-${rowIdx}`} className="hover:bg-slate-800/30 transition-colors">
                {/* Número de turno en la ronda */}
                <td className="py-2 px-2 text-center text-slate-400 font-mono font-medium border-r border-slate-800 sticky left-0 bg-slate-950/90 backdrop-blur z-10">
                  {rowIdx + 1}º
                </td>

                {/* Celdas para cada una de las 11 rondas */}
                {Array.from({ length: 11 }).map((_, colIdx) => {
                  const roundNum = colIdx + 1;
                  const roundData = order[colIdx];
                  const teamName = roundData?.teams?.[rowIdx] || '';
                  
                  if (!teamName) {
                    return (
                      <td key={`cell-${roundNum}-${rowIdx}`} className="py-2 px-2 text-center text-slate-600 border-r border-slate-800 last:border-r-0">
                        -
                      </td>
                    );
                  }

                  // ¿Cuántos fichajes lleva este equipo?
                  const teamPicks = pickCounts[teamName] ?? 
                    (Object.keys(pickCounts).find(k => k.toLowerCase() === teamName.toLowerCase()) 
                      ? pickCounts[Object.keys(pickCounts).find(k => k.toLowerCase() === teamName.toLowerCase())!] 
                      : 0);

                  // Si el equipo ya ha completado al menos esta ronda, está difuminado
                  const isCompleted = teamPicks >= roundNum;

                  // ¿Es este equipo exactamente el que está en turno ahora mismo?
                  const isCurrentActiveTurn = !isComplete && 
                    turn.round === roundNum && 
                    turn.teamIndex === rowIdx &&
                    turn.activeTeam.toLowerCase() === teamName.toLowerCase();

                  const isSelectedInForm = selectedTeam && selectedTeam.toLowerCase() === teamName.toLowerCase();

                  return (
                    <td 
                      key={`cell-${roundNum}-${rowIdx}`}
                      className="py-1.5 px-2 border-r border-slate-800 last:border-r-0 text-center align-middle"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectTeam?.(teamName)}
                        title={
                          isCompleted
                            ? `${teamName}: Selección completada para la Ronda ${roundNum}`
                            : isCurrentActiveTurn
                            ? `¡Turno actual! Click para seleccionar a ${teamName}`
                            : `${teamName}: Turno pendiente (Ronda ${roundNum})`
                        }
                        className={`w-full py-1.5 px-2 rounded-lg text-xs transition-all duration-300 flex items-center justify-between gap-1 text-left ${
                          isCompleted
                            ? 'opacity-25 blur-[0.4px] line-through text-slate-500 bg-slate-900/30 border border-slate-900/80 scale-[0.98]'
                            : isCurrentActiveTurn
                            ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-200 font-bold shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30 scale-[1.02]'
                            : isSelectedInForm
                            ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 font-medium'
                            : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 font-medium'
                        }`}
                      >
                        <span className="truncate max-w-[90px] sm:max-w-[110px]">
                          {teamName}
                        </span>
                        
                        {isCompleted && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 inline-block" />
                        )}

                        {isCurrentActiveTurn && (
                          <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-400/30 px-1 py-0.2 rounded shrink-0">
                            TURNO
                          </span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de Fichajes por Equipo */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Fichajes completados por equipo:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {teams.map(t => {
            const count = pickCounts[t] || 0;
            const isFinished = count >= 11;
            return (
              <span 
                key={`badge-count-${t}`}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                  isFinished 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                {t}: <strong className={isFinished ? 'text-emerald-400' : 'text-amber-300'}>{count}/11</strong>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
