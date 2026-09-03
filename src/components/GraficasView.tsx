import React, { useState, useEffect } from 'react';
import { gasEngine } from '../services/gasEngine';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { LineChart as LineChartIcon, BarChart2, TrendingUp } from 'lucide-react';

export const GraficasView: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  
  const [teamHistoryData, setTeamHistoryData] = useState<Array<{ jornada: string; score: number }>>([]);
  const [groupedJornadaData, setGroupedJornadaData] = useState<any[]>([]);
  const [evolutionData, setEvolutionData] = useState<any[]>([]);

  const TEAM_COLORS = [
    '#f59e0b', // Amber Gold
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#f43f5e', // Rose
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16'  // Lime
  ];

  useEffect(() => {
    const initData = gasEngine.getInitialChartData();
    setTeams(initData.teams);
    
    const defaultTeam = initData.teams[0] || '';
    setSelectedTeam(defaultTeam);

    if (defaultTeam) {
      loadTeamHistory(defaultTeam);
    }
    loadGroupedScores();
    loadEvolutionScores();
  }, []);

  const loadTeamHistory = (team: string) => {
    const data = gasEngine.getTeamWeeklyScoresChartData(team);
    const chartPoints = data.labels.map((lbl, idx) => ({
      jornada: lbl,
      score: data.scores[idx] || 0
    }));
    setTeamHistoryData(chartPoints);
  };

  const loadGroupedScores = () => {
    const res = gasEngine.getGroupedWeeklyScores();
    if (!res.labels.length) return;

    const formatted = res.labels.map((lbl, jIdx) => {
      const item: any = { jornada: lbl };
      res.datasets.forEach(ds => {
        item[ds.label] = ds.data[jIdx] || 0;
      });
      return item;
    });
    setGroupedJornadaData(formatted);
  };

  const loadEvolutionScores = () => {
    const res = gasEngine.getGeneralEvolutionChartData();
    if (!res.labels.length) return;

    const formatted = res.labels.map((lbl, jIdx) => {
      const item: any = { jornada: lbl };
      res.datasets.forEach(ds => {
        item[ds.label] = Number(ds.data[jIdx]) || 0;
      });
      return item;
    });
    setEvolutionData(formatted);
  };

  const handleTeamSelect = (t: string) => {
    setSelectedTeam(t);
    loadTeamHistory(t);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-xl text-xs font-mono">
          <p className="font-bold text-amber-400 mb-1 border-b border-slate-800 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="font-semibold flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-black text-white">{entry.value} pts</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <LineChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight m-0">
              Gráficas y Estadísticas
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Análisis visual de rendimiento individual, comparativa semanal y evolución acumulada
            </p>
          </div>
        </div>
      </div>

      {/* Chart 1: Puntuaciones por Equipo */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            Puntuaciones por Equipo
          </h2>

          <div className="flex items-center gap-2">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Equipo:
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => handleTeamSelect(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {teams.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="jornada" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name={selectedTeam} fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Puntuaciones por Jornada (Comparativa) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none border-b border-slate-800 pb-3">
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          Puntuaciones por Jornada (Comparativa de Equipos)
        </h2>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={groupedJornadaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="jornada" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {teams.map((t, idx) => (
                <Bar key={t} dataKey={t} fill={TEAM_COLORS[idx % TEAM_COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Evolución de Puntuaciones Acumulada */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none border-b border-slate-800 pb-3">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Evolución de Puntuaciones (General Acumulada)
        </h2>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="jornada" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {teams.map((t, idx) => (
                <Line 
                  key={t} 
                  type="monotone" 
                  dataKey={t} 
                  stroke={TEAM_COLORS[idx % TEAM_COLORS.length]} 
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
