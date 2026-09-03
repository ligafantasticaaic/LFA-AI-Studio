import React, { useState, useEffect } from 'react';
import { gasEngine } from '../services/gasEngine';
import { TeamLineupResponse, LineupPlayerDetail } from '../types/league';
import { Shield, Sparkles, Trophy, RotateCw } from 'lucide-react';

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
  const [selectedJornada, setSelectedJornada] = useState<number>(initialJornada || 5);
  const [lineupData, setLineupData] = useState<TeamLineupResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const teamList = gasEngine.getTeamNames();
    const maxJ = gasEngine.getMaxJornada();
    setTeams(teamList);
    setMaxJornada(maxJ);

    const team = initialTeam || teamList[0] || '';
    const j = initialJornada || maxJ || 1;
    setSelectedTeam(team);
    setSelectedJornada(j);

    if (team && j) {
      setLineupData(gasEngine.getTeamLineupData(team, j));
    }
  }, [initialTeam, initialJornada]);

  const handleTeamChange = (t: string) => {
    setSelectedTeam(t);
    if (t && selectedJornada) {
      setLineupData(gasEngine.getTeamLineupData(t, selectedJornada));
    }
  };

  const handleJornadaChange = (j: number) => {
    setSelectedJornada(j);
    if (selectedTeam && j) {
      setLineupData(gasEngine.getTeamLineupData(selectedTeam, j));
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
    const clubStyle = CLUB_GRADIENTS[realTeam] || CLUB_GRADIENTS['DEFAULT'];
    const pts = typeof p.points === 'number' ? p.points : 0;
    
    let glowBadge = 'bg-slate-800 text-slate-200 border-slate-700';
    if (pts >= 10) glowBadge = 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/50 border-emerald-300';
    else if (pts >= 6) glowBadge = 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/40 border-amber-200';
    else if (pts > 0) glowBadge = 'bg-blue-500 text-white font-bold border-blue-300';

    return (
      <div 
        key={idx} 
        className="flex flex-col items-center justify-center relative group transition-transform duration-300 hover:scale-110 cursor-pointer z-30"
      >
        {/* Glow halo */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-400/20 to-emerald-400/20 blur-sm group-hover:blur-md opacity-40 group-hover:opacity-100 transition-opacity" />

        {/* Player Badge Disc */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-amber-400/90 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden p-1">
          <div className="text-[9px] font-black uppercase leading-none bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full border border-amber-400 mb-0.5 tracking-tight font-mono">
            {realTeam}
          </div>
          <span className="text-xs sm:text-sm font-black truncate max-w-[75px] sm:max-w-[85px] uppercase tracking-tight text-slate-100 mb-0.5 leading-tight" title={p.name}>
            {p.name.split(' ').pop()}
          </span>
          <div className="flex justify-around w-full text-[9px] sm:text-[10px] font-bold text-amber-400 border-t border-slate-800 pt-0.5 mt-0.5 font-mono">
            <span>{getPositionGroup(p.position)}</span>
            <span>{p.value}M</span>
          </div>
        </div>

        {/* Points Bubble Badge */}
        <div className={`absolute -top-1.5 -right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black border-2 z-40 ${glowBadge}`}>
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
              Equipo LFA
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => handleTeamChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white font-bold text-xs sm:text-sm py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 transition cursor-pointer"
            >
              {teams.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
              Jornada
            </label>
            <select
              value={selectedJornada}
              onChange={(e) => handleJornadaChange(parseInt(e.target.value, 10))}
              className="w-full bg-slate-950 border border-slate-700 text-white font-bold text-xs sm:text-sm py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 transition cursor-pointer font-mono"
            >
              {Array.from({ length: maxJornada }, (_, i) => i + 1).map(j => (
                <option key={j} value={j}>Jornada {j}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-center shadow-inner">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Valor 11:</span>
            <span className="text-base font-black text-amber-400 font-mono">{lineupData?.totalValue || '0'}M</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-center shadow-inner">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Puntos J{selectedJornada}:</span>
            <span className="text-base font-black text-emerald-400 font-mono">{lineupData?.totalPoints || '0'} pts</span>
          </div>
        </div>
      </div>

      {/* Realistic Grass Tactical Pitch */}
      <div className="relative rounded-3xl p-4 sm:p-8 overflow-hidden shadow-2xl border-4 border-slate-800 bg-[#16502d] min-h-[580px] sm:min-h-[640px] flex flex-col justify-between select-none">
        {/* Grass Turf Stripes Background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #185a33 0px, #185a33 40px, #144929 40px, #144929 80px)`
          }}
        />

        {/* Tactical Pitch Markings */}
        <div className="absolute inset-4 sm:inset-6 border-2 border-white/25 rounded-2xl pointer-events-none">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/25 -translate-y-1/2" />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-white/25" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/40" />
          
          {/* Top Penalty Area (Opponent Box) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 sm:w-72 h-24 sm:h-28 border-b-2 border-x-2 border-white/25 rounded-b-lg" />
          
          {/* Bottom Penalty Area (Own Box) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 sm:w-72 h-24 sm:h-28 border-t-2 border-x-2 border-white/25 rounded-t-lg" />
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/40" />
        </div>

        {/* Tactical Formation Rows (Top: DEL, Middle: MED, Lower: DEF, Bottom: POR) */}
        
        {/* Delanteros */}
        <div className="relative z-10 flex items-center justify-around gap-2 pt-2 sm:pt-4">
          {delanteros.length === 0 ? (
            <span className="text-xs text-white/40 italic">Sin delanteros alineados</span>
          ) : (
            delanteros.map((p, idx) => renderPlayerCircle(p, idx))
          )}
        </div>

        {/* Centrocampistas */}
        <div className="relative z-10 flex items-center justify-around gap-2 py-4">
          {medios.length === 0 ? (
            <span className="text-xs text-white/40 italic">Sin mediocentros alineados</span>
          ) : (
            medios.map((p, idx) => renderPlayerCircle(p, idx))
          )}
        </div>

        {/* Defensas */}
        <div className="relative z-10 flex items-center justify-around gap-2 py-4">
          {defensas.length === 0 ? (
            <span className="text-xs text-white/40 italic">Sin defensas alineados</span>
          ) : (
            defensas.map((p, idx) => renderPlayerCircle(p, idx))
          )}
        </div>

        {/* Portero */}
        <div className="relative z-10 flex items-center justify-center pb-2 sm:pb-4">
          {porteros.length === 0 ? (
            <span className="text-xs text-white/40 italic">Sin portero alineado</span>
          ) : (
            porteros.map((p, idx) => renderPlayerCircle(p, idx))
          )}
        </div>
      </div>
    </div>
  );
};
