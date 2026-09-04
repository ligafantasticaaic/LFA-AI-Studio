import React, { useState, useEffect } from 'react';
import { gasEngine } from '../services/gasEngine';
import { Player, ClubStyle } from '../types/league';
import { Store, Search, Filter, Plus, Palette, X, Check } from 'lucide-react';

export const MercadoView: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('Todos');
  const [selectedClub, setSelectedClub] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [clubStyles, setClubStyles] = useState<ClubStyle[]>(gasEngine.getClubStyles());

  // Modal para añadir/editar equipo y color
  const [showAddTeamModal, setShowAddTeamModal] = useState<boolean>(false);
  const [newClubCode, setNewClubCode] = useState<string>('');
  const [newClubName, setNewClubName] = useState<string>('');
  const [newClubBg, setNewClubBg] = useState<string>('#FFFF00');
  const [newClubText, setNewClubText] = useState<string>('#000000');
  const [newClubBorder, setNewClubBorder] = useState<string>('#005187');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const loadData = () => {
    const data = gasEngine.getPlayersForMercado();
    setPlayers(data);
    setClubStyles(gasEngine.getClubStyles());
  };

  useEffect(() => {
    loadData();
    const unsub = gasEngine.subscribe(() => {
      loadData();
    });
    return unsub;
  }, []);

  const getPosBadgeClass = (pos: string) => {
    switch (pos?.toLowerCase()) {
      case 'portero':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'defensa':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'medio':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'delantero':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const allClubs = Array.from(
    new Set([
      ...players.map(p => p.realTeam),
      ...clubStyles.map(c => c.code)
    ])
  ).filter(Boolean).sort();

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.realTeam.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPos = selectedPosition === 'Todos' || p.position === selectedPosition;
    const matchesClub = selectedClub === 'Todos' || p.realTeam === selectedClub;
    const matchesStatus = selectedStatus === 'Todos' ||
                          (selectedStatus === 'Fichado' && p.status === 'Fichado') ||
                          (selectedStatus === 'Disponible' && p.status === 'Disponible');
    return matchesSearch && matchesPos && matchesClub && matchesStatus;
  });

  const totalMarketValue = players.reduce((acc, p) => acc + (typeof p.value === 'number' ? p.value : 0), 0);
  const totalSigned = players.filter(p => p.status === 'Fichado').length;
  const totalAvailable = players.filter(p => p.status === 'Disponible').length;

  const handleSaveNewClub = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newClubCode.trim().toUpperCase();
    if (!code) return;

    gasEngine.saveClubStyle({
      code,
      name: newClubName.trim() || code,
      bgColor: newClubBg,
      textColor: newClubText,
      borderColor: newClubBorder || newClubBg
    });

    setSaveSuccessMsg(`¡Equipo ${code} guardado con sus colores!`);
    setTimeout(() => {
      setSaveSuccessMsg(null);
      setShowAddTeamModal(false);
      setNewClubCode('');
      setNewClubName('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Title & Market Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight m-0">
                Mercado de Jugadores
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Listado oficial de cotizaciones, estadísticas y disponibilidad
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-950 border border-slate-800 text-xs px-3 py-1.5 rounded-xl font-bold text-slate-300">
              Total Jugadores: <strong className="text-white">{players.length}</strong>
            </span>
            <span className="bg-slate-950 border border-amber-500/30 text-xs px-3 py-1.5 rounded-xl font-bold text-amber-400">
              Fichados: <strong className="text-amber-400">{totalSigned}</strong>
            </span>
            <span className="bg-slate-950 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-bold text-emerald-400">
              Libres: <strong className="text-emerald-400">{totalAvailable}</strong>
            </span>
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Añadir o personalizar un equipo y sus colores (.team-color-COD)"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>+ Equipo / Color</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar jugador o club..."
              className="w-full bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Position Selector */}
          <div>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="Todos">Todas las Posiciones</option>
              <option value="Portero">Porteros</option>
              <option value="Defensa">Defensas</option>
              <option value="Medio">Centrocampistas</option>
              <option value="Delantero">Delanteros</option>
            </select>
          </div>

          {/* Club Selector */}
          <div>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 cursor-pointer font-mono"
            >
              <option value="Todos">Todos los Clubes ({allClubs.length})</option>
              {allClubs.map((c, idx) => (
                <option key={`mercado-club-${c}-${idx}`} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Disponible">Solo Disponibles (Libres)</option>
              <option value="Fichado">Solo Fichados</option>
            </select>
          </div>
        </div>

        {/* Mercado Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 shadow-inner">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3 w-28">Equipo Liga</th>
                <th className="p-3 w-32">Posición</th>
                <th className="p-3">Nombre Jugador</th>
                <th className="p-3 text-center w-28">Valor</th>
                <th className="p-3 text-center w-32">Puntos Totales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    No se encontraron jugadores con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player, idx) => {
                  const clubStyle = gasEngine.getClubBadgeStyle(player.realTeam);
                  const isFichado = player.status?.toLowerCase() === 'fichado';

                  return (
                    <tr key={`mercado-player-${player.name}-${player.realTeam}-${idx}`} className="hover:bg-slate-800/40 transition">
                      {/* Equipo Liga con Colores Personalizados Dinámicos */}
                      <td className="p-3">
                        <span
                          className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-black shadow-sm border"
                          style={{
                            backgroundColor: clubStyle.bgColor,
                            color: clubStyle.textColor,
                            borderColor: clubStyle.borderColor || clubStyle.bgColor
                          }}
                          title={`${clubStyle.name || player.realTeam} (${clubStyle.code})`}
                        >
                          {player.realTeam}
                        </span>
                      </td>

                      {/* Posición */}
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${getPosBadgeClass(player.position)}`}>
                          {player.position}
                        </span>
                      </td>

                      {/* Nombre Jugador */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${
                            isFichado 
                              ? 'bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-extrabold shadow-sm'
                              : 'text-white'
                          }`}>
                            {player.name}
                          </span>
                          {isFichado && (
                            <span className="text-[9px] font-extrabold uppercase bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded tracking-wider">
                              FICHADO
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Valor */}
                      <td className="p-3 text-center font-mono font-black text-slate-200">
                        {player.value ? `${player.value}M` : '-'}
                      </td>

                      {/* Puntos Totales */}
                      <td className="p-3 text-center font-mono font-black text-amber-400 text-sm">
                        {player.totalPoints !== undefined ? player.totalPoints : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Añadir / Editar Equipo y Color */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight m-0">
                    Añadir / Personalizar Equipo
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Establece el código y colores para el Mercado (.team-color-COD)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewClub} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Código del Club (3-4 letras)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={newClubCode}
                    onChange={(e) => setNewClubCode(e.target.value.toUpperCase())}
                    placeholder="Ej: VIL, ESP, OVI"
                    className="w-full bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    placeholder="Ej: Villarreal CF"
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Selectores de color */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Color de Fondo
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 p-1.5 rounded-xl">
                    <input
                      type="color"
                      value={newClubBg}
                      onChange={(e) => setNewClubBg(e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newClubBg}
                      onChange={(e) => setNewClubBg(e.target.value)}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Color del Texto
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 p-1.5 rounded-xl">
                    <input
                      type="color"
                      value={newClubText}
                      onChange={(e) => setNewClubText(e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newClubText}
                      onChange={(e) => setNewClubText(e.target.value)}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">
                    Color del Borde
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 p-1.5 rounded-xl">
                    <input
                      type="color"
                      value={newClubBorder}
                      onChange={(e) => setNewClubBorder(e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newClubBorder}
                      onChange={(e) => setNewClubBorder(e.target.value)}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Vista previa en vivo */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Vista Previa de la Insignia en Mercado:
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block px-3 py-1.5 rounded-md text-xs font-mono font-black shadow-md border"
                    style={{
                      backgroundColor: newClubBg,
                      color: newClubText,
                      borderColor: newClubBorder
                    }}
                  >
                    {newClubCode || 'VIL'}
                  </span>
                  <span className="text-xs text-slate-300 font-bold">
                    {newClubName || 'Villarreal CF'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-amber-400/90 bg-slate-900 p-2 rounded-lg border border-slate-800 overflow-x-auto">
                  .team-color-{newClubCode || 'VIL'} {'{'} background-color: {newClubBg}; color: {newClubText}; {'}'}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Equipo y Colores</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
