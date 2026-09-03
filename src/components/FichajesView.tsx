import React, { useState, useEffect } from 'react';
import { gasEngine, FREE_TRANSFERS_PER_TEAM, TRANSFER_COST, MAX_TEAM_VALUE } from '../services/gasEngine';
import { Player, TransferRecord } from '../types/league';
import confetti from 'canvas-confetti';
import { 
  ArrowLeftRight, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Coins, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface TransferRowState {
  id: string;
  playerOut: string;
  playerIn: string;
  isAbandonment: boolean;
}

export const FichajesView: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [teamToken, setTeamToken] = useState<string>('');
  const [selectedJornada, setSelectedJornada] = useState<number>(5);

  const [playersOutList, setPlayersOutList] = useState<string[]>([]);
  const [availablePlayersIn, setAvailablePlayersIn] = useState<Player[]>([]);
  
  const [transferRows, setTransferRows] = useState<TransferRowState[]>([
    { id: '1', playerOut: '', playerIn: '', isAbandonment: false }
  ]);

  const [transferHistory, setTransferHistory] = useState<TransferRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);

  useEffect(() => {
    const teamList = gasEngine.getTeamNames();
    const maxJ = gasEngine.getMaxJornada();
    setTeams(teamList);
    setSelectedJornada(maxJ || 5);
    setTransferHistory(gasEngine.getTransferHistory());
  }, []);

  useEffect(() => {
    if (selectedTeam && selectedJornada) {
      setPlayersOutList(gasEngine.getTeamPlayersForJornada(selectedTeam, selectedJornada));
      setAvailablePlayersIn(gasEngine.getAvailablePlayersForJornada(selectedJornada));
    } else {
      setPlayersOutList([]);
      setAvailablePlayersIn([]);
    }
  }, [selectedTeam, selectedJornada]);

  const addTransferRow = () => {
    setTransferRows(prev => [
      ...prev,
      { id: String(Date.now()), playerOut: '', playerIn: '', isAbandonment: false }
    ]);
  };

  const removeTransferRow = (id: string) => {
    if (transferRows.length <= 1) return;
    setTransferRows(prev => prev.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof TransferRowState, value: any) => {
    setTransferRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !teamToken.trim() || !selectedJornada) {
      setStatusMessage({
        text: 'Equipo, Token y Jornada son obligatorios.',
        isSuccess: false
      });
      return;
    }

    const transfersPayload = transferRows.map(r => ({
      playerOut: r.playerOut,
      playerIn: r.playerIn,
      isAbandonment: r.isAbandonment
    }));

    for (let i = 0; i < transfersPayload.length; i++) {
      if (!transfersPayload[i].playerOut || !transfersPayload[i].playerIn) {
        setStatusMessage({
          text: 'Por favor, completa todas las selecciones de jugadores en los cambios propuestos.',
          isSuccess: false
        });
        return;
      }
    }

    setIsLoading(true);
    const res = gasEngine.processMultipleTransfers(selectedTeam, teamToken.trim(), selectedJornada, transfersPayload);
    setIsLoading(false);

    setStatusMessage({ text: res.message, isSuccess: res.success });

    if (res.success) {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 }
      });
      setTransferRows([{ id: String(Date.now()), playerOut: '', playerIn: '', isAbandonment: false }]);
      // Refresh lists
      setPlayersOutList(gasEngine.getTeamPlayersForJornada(selectedTeam, selectedJornada));
      setAvailablePlayersIn(gasEngine.getAvailablePlayersForJornada(selectedJornada));
      setTransferHistory(gasEngine.getTransferHistory());
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Rules Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight m-0">
                Gestión de Fichajes
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Mercado de sustituciones con control de valor y restricciones por horario de partido
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Fichajes gratis: <strong className="text-white">{FREE_TRANSFERS_PER_TEAM}</strong> | Coste adicional: <strong className="text-amber-400">{TRANSFER_COST}€</strong></span>
          </div>
        </div>

        {/* Transfer Main Form */}
        <form onSubmit={handleTransferSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                Equipo
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition cursor-pointer"
              >
                <option value="">-- Selecciona Equipo --</option>
                {teams.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                Token de Equipo
              </label>
              <input
                type="text"
                value={teamToken}
                onChange={(e) => setTeamToken(e.target.value)}
                placeholder="Introduce tu token único"
                required
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                Jornada para el Fichaje
              </label>
              <select
                value={selectedJornada}
                onChange={(e) => setSelectedJornada(parseInt(e.target.value, 10))}
                required
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition font-mono cursor-pointer"
              >
                <option value="">-- Selecciona Jornada --</option>
                {Array.from({ length: 38 }, (_, i) => i + 1).map(j => (
                  <option key={j} value={j}>Jornada {j}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Transfer Slots */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider m-0">
                Jugadores a Intercambiar ({transferRows.length})
              </h3>
            </div>

            <div className="space-y-3">
              {transferRows.map((row, idx) => (
                <div 
                  key={row.id} 
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 transition hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Cambio #{idx + 1}
                    </span>
                    {transferRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTransferRow(row.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar este cambio</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Jugador que sale (Jornada actual)
                      </label>
                      <select
                        value={row.playerOut}
                        onChange={(e) => updateRow(row.id, 'playerOut', e.target.value)}
                        required
                        disabled={isLoading || !selectedTeam}
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm py-2 px-3 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="">-- Selecciona Jugador --</option>
                        {playersOutList.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Jugador que entra (Disponibles)
                      </label>
                      <select
                        value={row.playerIn}
                        onChange={(e) => updateRow(row.id, 'playerIn', e.target.value)}
                        required
                        disabled={isLoading || !selectedJornada}
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm py-2 px-3 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="">-- Selecciona Jugador --</option>
                        {availablePlayersIn.map(p => (
                          <option key={p.name} value={p.name}>
                            {p.realTeam} - {p.name} ({p.position}) - Val: {p.value ? `${p.value}M` : '-'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Abandonment Checkbox */}
                  <label className="flex items-center gap-2.5 p-2.5 bg-blue-950/40 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-blue-950/60 transition">
                    <input
                      type="checkbox"
                      checked={row.isAbandonment}
                      onChange={(e) => updateRow(row.id, 'isAbandonment', e.target.checked)}
                      className="w-4 h-4 rounded text-blue-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-blue-300">
                      Sustitución por abandono de Liga (fichaje gratuito)
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={addTransferRow}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-2 px-4 rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir otro cambio</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={isLoading || !selectedTeam}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Realizar Fichaje(s)</span>
            </button>

            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 w-full sm:w-auto ${
                statusMessage.isSuccess
                  ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
              }`}>
                {statusMessage.isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Historial de Fichajes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
          <Clock className="w-4 h-4 text-amber-400" />
          Historial de Fichajes
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Fecha/Hora</th>
                <th className="p-3">Equipo</th>
                <th className="p-3 text-center">Jornada Fichaje</th>
                <th className="p-3">Jugador Sale</th>
                <th className="p-3">Jugador Entra</th>
                <th className="p-3 text-right">Coste (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {transferHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    No hay fichajes registrados.
                  </td>
                </tr>
              ) : (
                transferHistory.map((tr, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{tr.timestamp}</td>
                    <td className="p-3 font-bold text-white">{tr.team}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-300">J{tr.jornada}</td>
                    <td className="p-3 text-rose-400 font-medium">{tr.playerOut}</td>
                    <td className="p-3 text-emerald-400 font-bold">{tr.playerIn}</td>
                    <td className="p-3 text-right font-mono font-extrabold text-amber-400">
                      {tr.cost === 0 ? 'Gratis' : `${tr.cost.toFixed(2)} €`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
