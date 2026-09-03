import React, { useState, useEffect } from 'react';
import { gasEngine } from '../services/gasEngine';
import { TeamLineupResponse, StandingScore } from '../types/league';
import { 
  Trophy, 
  RotateCw, 
  Shield, 
  Flame, 
  ShieldAlert, 
  Users,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface IndexViewProps {
  onGoToField?: (team: string, jornada: number) => void;
}

export const IndexView: React.FC<IndexViewProps> = ({ onGoToField }) => {
  const [teams, setTeams] = useState<string[]>([]);
  const [maxJornada, setMaxJornada] = useState<number>(5);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedJornada, setSelectedJornada] = useState<number>(5);
  
  const [lineupData, setLineupData] = useState<TeamLineupResponse | null>(null);
  const [weeklyScores, setWeeklyScores] = useState<StandingScore[]>([]);
  const [generalScores, setGeneralScores] = useState<StandingScore[]>([]);
  const [mostGoalsTeams, setMostGoalsTeams] = useState<StandingScore[]>([]);
  const [leastConcededTeams, setLeastConcededTeams] = useState<StandingScore[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamError, setTeamError] = useState<string>('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setIsLoading(true);
    const teamList = gasEngine.getTeamNames();
    const maxJ = gasEngine.getMaxJornada();

    setTeams(teamList);
    setMaxJornada(maxJ);
    
    const defaultTeam = teamList[0] || '';
    const defaultJ = maxJ || 1;
    
    setSelectedTeam(defaultTeam);
    setSelectedJornada(defaultJ);

    // Load standings
    setGeneralScores(gasEngine.calculateGeneralScores(maxJ));
    setMostGoalsTeams(gasEngine.calculateMostGoalsTeams(maxJ));
    setLeastConcededTeams(gasEngine.calculateLeastConcededTeams(maxJ));
    setWeeklyScores(gasEngine.calculateWeeklyScores(defaultJ));

    if (defaultTeam && defaultJ) {
      const data = gasEngine.getTeamLineupData(defaultTeam, defaultJ);
      setLineupData(data);
    }
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadInitialData();
      setIsLoading(false);
    }, 250);
  };

  const handleTeamChange = (teamName: string) => {
    setSelectedTeam(teamName);
    if (teamName && selectedJornada) {
      const data = gasEngine.getTeamLineupData(teamName, selectedJornada);
      setLineupData(data);
      if (data.error) setTeamError(data.error); else setTeamError('');
    }
  };

  const handleJornadaChange = (jNum: number) => {
    setSelectedJornada(jNum);
    setWeeklyScores(gasEngine.calculateWeeklyScores(jNum));
    if (selectedTeam && jNum) {
      const data = gasEngine.getTeamLineupData(selectedTeam, jNum);
      setLineupData(data);
      if (data.error) setTeamError(data.error); else setTeamError('');
    }
  };

  const getPosBadgeClass = (pos: string) => {
    switch (pos?.toLowerCase()) {
      case 'portero':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'defensa':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'medio':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'delantero':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const renderRankMedal = (index: number) => {
    if (index === 0) return <span className="text-amber-400 font-extrabold text-sm">🥇 1º</span>;
    if (index === 1) return <span className="text-slate-300 font-extrabold text-sm">🥈 2º</span>;
    if (index === 2) return <span className="text-amber-600 font-extrabold text-sm">🥉 3º</span>;
    return <span className="text-slate-500 font-bold text-xs">{index + 1}º</span>;
  };

  return (
    <div className="space-y-6">
      {/* Controls & Selector Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
              Equipo (Ver Alineación)
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => handleTeamChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 text-white font-bold text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition cursor-pointer"
            >
              <option value="">-- Selecciona Equipo --</option>
              {teams.map((t, idx) => (
                <option key={`idx-team-${t}-${idx}`} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
              Jornada (Ver Alineación)
            </label>
            <select
              value={selectedJornada}
              onChange={(e) => handleJornadaChange(parseInt(e.target.value, 10))}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 text-white font-bold text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition cursor-pointer font-mono"
            >
              <option value="">-- Selecciona Jornada --</option>
              {Array.from({ length: maxJornada }, (_, i) => i + 1).map(j => (
                <option key={`idx-jornada-${j}`} value={j}>Jornada {j}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar Clasificaciones</span>
          </button>
        </div>
      </div>

      {/* Main Content: Lineup & Summary */}
      <div className="grid grid-cols-1 gap-6">
        {/* Section: Alineación y Puntos del Equipo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2 m-0 p-0 border-none">
                <Users className="w-5 h-5 text-amber-400" />
                Alineación y Puntos del Equipo
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Desglose oficial de futbolistas alineados para <strong className="text-white">{selectedTeam || '---'}</strong> en <strong className="text-amber-400">Jornada {selectedJornada}</strong>
              </p>
            </div>

            {onGoToField && selectedTeam && (
              <button
                onClick={() => onGoToField(selectedTeam, selectedJornada)}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer self-start sm:self-auto"
              >
                <span>Ver en Campo Táctico</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {teamError && (
            <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs font-bold">
              {teamError}
            </div>
          )}

          {/* Lineup Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Posición</th>
                  <th className="p-3">Jugador</th>
                  <th className="p-3">Equipo Liga</th>
                  <th className="p-3 text-center">Valor</th>
                  <th className="p-3 text-center">Puntos (Jor.)</th>
                  <th className="p-3 text-center">Goles (Jor.)</th>
                  <th className="p-3 text-center">Pts.Def (Jor.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {!lineupData?.players?.length ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 font-medium">
                      No se encontró alineación para este equipo y jornada.
                    </td>
                  </tr>
                ) : (
                  lineupData.players.map((p, idx) => (
                    <tr key={`lineup-player-${p.name}-${p.realTeam}-${idx}`} className="hover:bg-slate-800/40 transition">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${getPosBadgeClass(p.position)}`}>
                          {p.position}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">
                        {p.name}
                      </td>
                      <td className="p-3 font-semibold text-slate-400">
                        <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] font-bold border border-slate-700 font-mono">
                          {p.realTeam}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-300">
                        {p.value ? `${p.value}M` : '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-extrabold text-amber-400">
                        {p.points !== '' ? p.points : '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-rose-400">
                        {p.goals !== '' ? p.goals : '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-cyan-400">
                        {p.pDef !== '' ? p.pDef : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-slate-900 border-t-2 border-slate-800 font-bold text-xs sm:text-sm">
                <tr>
                  <td colSpan={4} className="p-2.5 sm:p-3 text-right text-slate-400">Puntuación Total Jornada:</td>
                  <td className="p-2.5 sm:p-3 text-center text-amber-400 font-black font-mono text-sm sm:text-base">
                    {lineupData?.totalPoints || '0'}
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-2.5 sm:p-3 text-right text-slate-400">Valor Total Equipo:</td>
                  <td className="p-2.5 sm:p-3 text-center text-white font-black font-mono">
                    {lineupData?.totalValue ? `${lineupData.totalValue}M` : '0M'}
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-2.5 sm:p-3 text-right text-slate-400">Goles Totales Equipo (Jor.):</td>
                  <td className="p-2.5 sm:p-3 text-center text-rose-400 font-black font-mono">
                    {lineupData?.totalGoals ?? 0}
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-2.5 sm:p-3 text-right text-slate-400">Total Pts.Def. Equipo (Jor.):</td>
                  <td className="p-2.5 sm:p-3 text-center text-cyan-400 font-black font-mono">
                    {lineupData?.totalDefensivePoints ?? 0}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* 4 Standings Tables in Luxury Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Table 1: Clasificación Jornada X */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Clasificación Jornada <span className="text-amber-400">{selectedJornada}</span>
            </h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 w-14">#</th>
                  <th className="p-2.5">Equipo</th>
                  <th className="p-2.5 text-right">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {weeklyScores.map((s, idx) => (
                  <tr key={`weekly-${s.teamName}-${idx}`} className={`hover:bg-slate-800/40 transition ${s.teamName === selectedTeam ? 'bg-amber-500/10' : ''}`}>
                    <td className="p-2.5">{renderRankMedal(idx)}</td>
                    <td className="p-2.5 font-bold text-white">{s.teamName}</td>
                    <td className="p-2.5 text-right font-mono font-black text-amber-400">{s.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Clasificación General */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
              <Trophy className="w-4 h-4 text-amber-400" />
              Clasificación General (Hasta J{maxJornada})
            </h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 w-14">#</th>
                  <th className="p-2.5">Equipo</th>
                  <th className="p-2.5 text-right">Puntos Totales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {generalScores.map((s, idx) => (
                  <tr key={`general-${s.teamName}-${idx}`} className={`hover:bg-slate-800/40 transition ${s.teamName === selectedTeam ? 'bg-amber-500/10' : ''}`}>
                    <td className="p-2.5">{renderRankMedal(idx)}</td>
                    <td className="p-2.5 font-bold text-white">{s.teamName}</td>
                    <td className="p-2.5 text-right font-mono font-black text-amber-400 text-sm">{s.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: Equipo Más Goleador */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
              <Flame className="w-4 h-4 text-rose-500" />
              Equipo Más Goleador (Hasta J{maxJornada})
            </h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-rose-400 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 w-14">#</th>
                  <th className="p-2.5">Equipo</th>
                  <th className="p-2.5 text-right">Goles Totales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {mostGoalsTeams.map((s, idx) => (
                  <tr key={`goals-${s.teamName}-${idx}`} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5">{renderRankMedal(idx)}</td>
                    <td className="p-2.5 font-bold text-white">{s.teamName}</td>
                    <td className="p-2.5 text-right font-mono font-black text-rose-400">{s.score} ⚽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 4: Equipo Menos Goleado */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
              <Shield className="w-4 h-4 text-cyan-400" />
              Equipo Menos Goleado (Pts.Def Acum.)
            </h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-cyan-400 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 w-14">#</th>
                  <th className="p-2.5">Equipo</th>
                  <th className="p-2.5 text-right">Total Pts.Defensivos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {leastConcededTeams.map((s, idx) => (
                  <tr key={`conceded-${s.teamName}-${idx}`} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5">{renderRankMedal(idx)}</td>
                    <td className="p-2.5 font-bold text-white">{s.teamName}</td>
                    <td className="p-2.5 text-right font-mono font-black text-cyan-400">{s.score} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
