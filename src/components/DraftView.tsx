import React, { useState, useEffect } from 'react';
import { gasEngine } from '../services/gasEngine';
import { Player, DraftRecord } from '../types/league';
import confetti from 'canvas-confetti';
import { Sparkles, Users, Key, Shield, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export const DraftView: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [draftHistory, setDraftHistory] = useState<DraftRecord[]>([]);

  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [teamToken, setTeamToken] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('Todos');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);

  useEffect(() => {
    refreshDraftData();
  }, []);

  const refreshDraftData = () => {
    setIsLoading(true);
    setTeams(gasEngine.getTeamNames());
    setAvailablePlayers(gasEngine.getAvailablePlayersForDraft());
    setDraftHistory(gasEngine.getDraftHistory());
    setIsLoading(false);
  };

  const handleDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !teamToken.trim() || !selectedPlayer) {
      setStatusMessage({
        text: 'Selecciona un equipo, introduce tu Token y selecciona un jugador.',
        isSuccess: false
      });
      return;
    }

    setIsLoading(true);
    const res = gasEngine.processDraftSelection(selectedTeam, teamToken.trim(), selectedPlayer);
    setIsLoading(false);

    setStatusMessage({ text: res.message, isSuccess: res.success });

    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setSelectedPlayer('');
      refreshDraftData();
    }
  };

  const filteredPlayers = availablePlayers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.realTeam.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPos = positionFilter === 'Todos' || p.position === positionFilter;
    return matchesSearch && matchesPos;
  });

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight m-0">
              Draft Inicial de Jugadores
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Confecciona tu plantilla de 11 jugadores respetando el tope de 200M€
            </p>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleDraftSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                Selección de equipo
              </label>
              <div className="relative">
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
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                Token de Equipo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={teamToken}
                  onChange={(e) => setTeamToken(e.target.value)}
                  placeholder="Introduce tu token único"
                  required
                  disabled={isLoading}
                  className="w-full bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                Selección de jugador (Disponibles)
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition cursor-pointer"
              >
                <option value="">-- Selecciona Jugador --</option>
                {availablePlayers.map(p => (
                  <option key={p.name} value={p.name}>
                    {p.realTeam} - {p.name} ({p.position}) - Val: {p.value ? `${p.value}M` : '-'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Player Quick Filter & Cards Selector */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Buscador Rápido de Jugadores Disponibles ({filteredPlayers.length})
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar por nombre o club..."
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-white pl-8 pr-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <select
                  value={positionFilter}
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs text-white py-1.5 px-2.5 rounded-lg focus:outline-none"
                >
                  <option value="Todos">Todas Pos.</option>
                  <option value="Portero">Portero</option>
                  <option value="Defensa">Defensa</option>
                  <option value="Medio">Medio</option>
                  <option value="Delantero">Delantero</option>
                </select>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pr-1">
              {filteredPlayers.slice(0, 18).map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setSelectedPlayer(p.name)}
                  className={`p-2 rounded-lg text-left border transition text-xs flex items-center justify-between cursor-pointer ${
                    selectedPlayer === p.name
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold">{p.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{p.realTeam} • {p.position}</span>
                  </div>
                  <span className="font-black text-amber-400 font-mono text-xs">{p.value}M</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={isLoading || !selectedPlayer}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Realizar Selección</span>
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

      {/* Historial del Draft */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
          <Users className="w-4 h-4 text-amber-400" />
          Historial del Draft
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Fecha/Hora</th>
                <th className="p-3">Equipo</th>
                <th className="p-3">Nombre_Jugador</th>
                <th className="p-3">Equipo_Liga</th>
                <th className="p-3">Posicion</th>
                <th className="p-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {draftHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    No hay selecciones de draft registradas.
                  </td>
                </tr>
              ) : (
                draftHistory.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{d.timestamp}</td>
                    <td className="p-3 font-bold text-white">{d.team}</td>
                    <td className="p-3 font-semibold text-amber-300">{d.playerName}</td>
                    <td className="p-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                        {d.realTeam}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{d.position}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-200">
                      {d.value ? `${d.value}M` : '-'}
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
