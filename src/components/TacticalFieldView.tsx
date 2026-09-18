import React, { useState, useEffect } from 'react';
import { gasEngine } from '../services/gasEngine';
import { TeamLineupResponse, LineupPlayerDetail } from '../types/league';
import { Shield, Sparkles, Trophy, RotateCw, Users } from 'lucide-react';

interface TacticalFieldViewProps {
  initialTeam?: string;
  initialJornada?: number;
}

export const TacticalFieldView: React.FC<TacticalFieldViewProps> = ({
  initialTeam,
  initialJornada
}) => {
  const [teams, setTeams] = useState<string[]>([]);
  const [maxJornada, setMaxJornada] = useState<number>(5);
  const [selectedTeam, setSelectedTeam] = useState<string>(initialTeam || '');
  const [selectedJornada, setSelectedJornada] = useState<number | ''>(initialJornada || '');
  const [lineupData, setLineupData] = useState<TeamLineupResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const refreshData = () => {
      const teamList = gasEngine.getTeamNames();
      const maxJ = gasEngine.getMaxJornada();
      setTeams(teamList);
      setMaxJornada(maxJ);

      const team = selectedTeam || initialTeam || '';
      const j = typeof selectedJornada === 'number' && selectedJornada > 0
        ? selectedJornada
        : (initialJornada || '');

      if (team && typeof j === 'number' && j > 0) {
        setLineupData(gasEngine.getTeamLineupData(team, j));
      } else {
        setLineupData(null);
      }
    };

    refreshData();
    const unsubscribe = gasEngine.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [initialTeam, initialJornada, selectedTeam, selectedJornada]);

  const handleTeamChange = (t: string) => {
    setSelectedTeam(t);
    if (t && typeof selectedJornada === 'number' && selectedJornada > 0) {
      setLineupData(gasEngine.getTeamLineupData(t, selectedJornada));
    } else {
      setLineupData(null);
    }
  };

  const handleJornadaChange = (val: string) => {
    const j = val ? parseInt(val, 10) : '';
    setSelectedJornada(j);
    if (selectedTeam && typeof j === 'number' && j > 0) {
      setLineupData(gasEngine.getTeamLineupData(selectedTeam, j));
    } else {
      setLineupData(null);
    }
  };

  const CLUB_GRADIENTS: Record<string, string> = {
    'RMA': 'from-purple-600 via-indigo-600 to-slate-900 border-amber-400',
    'BAR': 'from-blue-700 via-red-700 to-amber-500 border-amber-400',
    'ATM': 'from-red-600 via-white to-blue-700 border-red-500',
    'VIL': 'from-yellow-400 via-yellow-500 to-blue-900 border-yellow-400',
    'ATH': 'from-red-700 via-white to-black border-red-500',
    'RSO': 'from-blue-600 via-white to-blue-900 border-blue-400',
    'BET': 'from-emerald-600 via-white to-emerald-800 border-emerald-400',
    'SEV': 'from-red-600 via-white to-red-800 border-red-400',
    'VAL': 'from-neutral-200 via-orange-500 to-black border-orange-400',
    'ESP': 'from-blue-500 via-white to-blue-800 border-blue-400',
    'GET': 'from-blue-700 via-blue-800 to-blue-950 border-blue-400',
    'CEL': 'from-sky-400 via-white to-sky-700 border-sky-400',
    'ALV': 'from-blue-800 via-white to-blue-950 border-blue-400',
    'MLL': 'from-red-600 via-black to-red-900 border-red-500',
    'OSA': 'from-red-800 via-blue-900 to-red-950 border-red-500',
    'RAY': 'from-neutral-100 via-red-600 to-black border-red-500',
    'GIR': 'from-red-600 via-white to-red-800 border-red-400',
    'DEFAULT': 'from-amber-400 via-amber-500 to-amber-600 border-amber-400'
  };

  const getPositionGroup = (pos: string) => {
    const p = (pos || '').trim().toLowerCase();
    if (p === 'portero') return 'POR';
    if (p === 'defensa') return 'DEF';
    if (p === 'medio' || p === 'centrocampista') return 'MED';
    if (p === 'delantero') return 'DEL';
    return 'MED';
  };

  const delanteros = lineupData?.players?.filter(p => getPositionGroup(p.position) === 'DEL') || [];
  const medios = lineupData?.players?.filter(p => getPositionGroup(p.position) === 'MED') || [];
  const defensas = lineupData?.players?.filter(p => getPositionGroup(p.position) === 'DEF') || [];
  const porteros = lineupData?.players?.filter(p => getPositionGroup(p.position) === 'POR') || [];

  const renderPlayerCircle = (p: LineupPlayerDetail, idx: number) => {
    const realTeam = String(p.realTeam || 'DEFAULT').toUpperCase().trim();
    const pts = typeof p.points === 'number' ? p.points : 0;
    
    let glowBadge = 'bg-slate-800 text-slate-200 border-slate-700';
    if (pts >= 10) glowBadge = 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/50 border-emerald-300';
    else if (pts >= 6) glowBadge = 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/40 border-amber-200';
    else if (pts > 0) glowBadge = 'bg-blue-500 text-white font-bold border-blue-300';

    return (
      <div 
        key={`disc-${p.name}-${p.position}-${idx}`} 
        className="flex flex-col items-center justify-center relative group transition-transform duration-200 hover:scale-105 cursor-pointer z-30 shrink min-w-0"
      >
        {/* Glow halo */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-amber-400/20 to-emerald-400/20 blur-[2px] opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Player Badge Disc */}
        <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 sm:border-[3px] border-amber-400/90 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white flex flex-col items-center justify-center text-center shadow-xl overflow-hidden p-0.5 sm:p-1">
          <div className="text-[7px] xs:text-[7.5px] sm:text-[8.5px] md:text-[9px] font-black uppercase leading-none bg-amber-500 text-slate-950 px-1 sm:px-1.5 py-0.5 rounded-full border border-amber-400 mb-0.5 tracking-tight font-mono">
            {realTeam}
          </div>
          <span className="text-[8.5px] xs:text-[9.5px] sm:text-xs md:text-sm font-black truncate max-w-[40px] xs:max-w-[48px] sm:max-w-[62px] md:max-w-[76px] uppercase tracking-tight text-slate-100 leading-tight" title={p.name}>
            {p.name.split(' ').pop()}
          </span>
          <div className="flex justify-between sm:justify-around w-full px-0.5 sm:px-1 text-[7px] xs:text-[7.5px] sm:text-[8.5px] md:text-[9px] font-bold text-amber-400 border-t border-slate-800/80 pt-0.5 mt-0.5 font-mono">
            <span>{getPositionGroup(p.position)}</span>
            <span>{p.value}M</span>
          </div>
        </div>

        {/* Points Bubble Badge */}
        <div className={`absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs font-black border z-40 ${glowBadge}`}>
          {p.points !== '' ? p.points : '-'}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
              Equipo (Ver Alineación)
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => handleTeamChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white font-bold text-xs sm:text-sm py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 transition cursor-pointer"
            >
              <option value="">Seleccionar equipo</option>
              {teams.map((t, idx) => (
                <option key={`tac-team-${t}-${idx}`} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
              Jornada (Ver Alineación)
            </label>
            <select
              value={selectedJornada}
              onChange={(e) => handleJornadaChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white font-bold text-xs sm:text-sm py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 transition cursor-pointer font-mono"
            >
              <option value="">Seleccionar Jornada</option>
              {Array.from({ length: maxJornada }, (_, i) => i + 1).map(j => (
                <option key={`tac-jornada-${j}`} value={j}>Jornada {j}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-center shadow-inner">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Valor 11:</span>
            <span className="text-base font-black text-amber-400 font-mono">
              {selectedTeam && selectedJornada ? `${lineupData?.totalValue || '0'}M` : '-'}
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-center shadow-inner">
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              {selectedJornada ? `Puntos J${selectedJornada}:` : 'Puntos Jornada:'}
            </span>
            <span className="text-base font-black text-emerald-400 font-mono">
              {selectedTeam && selectedJornada ? `${lineupData?.totalPoints || '0'} pts` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Realistic Grass Tactical Pitch */}
      <div className="relative rounded-2xl sm:rounded-3xl p-2.5 sm:p-6 overflow-hidden shadow-2xl border-2 sm:border-4 border-slate-800 bg-[#16502d] min-h-[500px] sm:min-h-[640px] flex flex-col justify-between select-none w-full max-w-full box-border">
        {/* Grass Turf Stripes Background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #185a33 0px, #185a33 40px, #144929 40px, #144929 80px)`
          }}
        />

        {/* Tactical Pitch Markings */}
        <div className="absolute inset-2 sm:inset-4 border-2 border-white/25 rounded-xl sm:rounded-2xl pointer-events-none">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/25 -translate-y-1/2" />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-32 sm:h-32 rounded-full border-2 border-white/25" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
          
          {/* Top Penalty Area (Opponent Box) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 sm:w-64 h-20 sm:h-24 border-b-2 border-x-2 border-white/25 rounded-b-lg" />
          
          {/* Bottom Penalty Area (Own Box) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 sm:w-64 h-20 sm:h-24 border-t-2 border-x-2 border-white/25 rounded-t-lg" />
          <div className="absolute bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>

        {/* Tactical Formation Rows or Placeholder */}
        {!selectedTeam || !selectedJornada ? (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <Users className="w-12 h-12 text-white/30 mx-auto" />
            <p className="text-white/90 font-black text-sm sm:text-base">
              Selecciona un equipo y una jornada
            </p>
            <p className="text-white/50 text-xs max-w-xs">
              Elige en los desplegables para visualizar la alineación táctica sobre el campo de fútbol.
            </p>
          </div>
        ) : lineupData && (!lineupData.players || lineupData.players.length === 0) ? (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <p className="text-white/80 font-bold text-sm">
              No se encontró alineación para {selectedTeam} en la Jornada {selectedJornada}.
            </p>
          </div>
        ) : (
          <>
            {/* Delanteros */}
            <div className="relative z-10 w-full max-w-full flex items-center justify-evenly gap-1 pt-2 sm:pt-4 px-1 sm:px-3 box-border overflow-hidden">
              {delanteros.length === 0 ? (
                <span className="text-[11px] text-white/40 italic">Sin delanteros alineados</span>
              ) : (
                delanteros.map((p, idx) => renderPlayerCircle(p, idx))
              )}
            </div>

            {/* Centrocampistas */}
            <div className="relative z-10 w-full max-w-full flex items-center justify-evenly gap-1 py-3 sm:py-4 px-1 sm:px-3 box-border overflow-hidden">
              {medios.length === 0 ? (
                <span className="text-[11px] text-white/40 italic">Sin mediocentros alineados</span>
              ) : (
                medios.map((p, idx) => renderPlayerCircle(p, idx))
              )}
            </div>

            {/* Defensas */}
            <div className="relative z-10 w-full max-w-full flex items-center justify-evenly gap-1 py-3 sm:py-4 px-1 sm:px-3 box-border overflow-hidden">
              {defensas.length === 0 ? (
                <span className="text-[11px] text-white/40 italic">Sin defensas alineados</span>
              ) : (
                defensas.map((p, idx) => renderPlayerCircle(p, idx))
              )}
            </div>

            {/* Portero */}
            <div className="relative z-10 w-full max-w-full flex items-center justify-center pb-2 sm:pb-4 px-1 sm:px-3 box-border overflow-hidden">
              {porteros.length === 0 ? (
                <span className="text-[11px] text-white/40 italic">Sin portero alineado</span>
              ) : (
                porteros.map((p, idx) => renderPlayerCircle(p, idx))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
