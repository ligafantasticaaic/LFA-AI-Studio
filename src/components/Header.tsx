import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  ArrowLeftRight, 
  Store, 
  Coins, 
  LineChart, 
  LayoutDashboard,
  Sparkles,
  Lock,
  Share2,
  Check,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { gasEngine } from '../services/gasEngine';

export interface HeaderProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  maxJornada?: number;
  totalCaja?: string;
  onOpenExportModal?: () => void;
  onOpenExport?: () => void;
  onOpenConnectionModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
  maxJornada,
  totalCaja,
  onOpenConnectionModal
}) => {
  const [copiedLink, setCopiedLink] = useState<'player' | 'admin' | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = gasEngine.subscribe(() => setTick(t => t + 1));
    return unsub;
  }, []);

  // Retrieve dynamic league texts and state
  const leagueTexts = gasEngine.getLeagueTexts();
  const isPlayerMode = gasEngine.isPlayerMode();
  const isDraftHidden = gasEngine.isDraftHidden();

  // Determine stats if not passed
  const displayJornada = maxJornada ?? gasEngine.getMaxJornada();
  const displayCaja = totalCaja ?? (gasEngine.getAccountingData()?.finalCajaBeforeFinalPrizes || '0.00');

  const handleTabSelect = (tabId: string) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(tabId);
    } else if (typeof onTabChange === 'function') {
      onTabChange(tabId);
    }
  };

  const copyShareLink = (type: 'player' | 'admin') => {
    const url = type === 'player' ? gasEngine.getPlayerShareUrl() : gasEngine.getAdminShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(type);
      setTimeout(() => setCopiedLink(null), 2500);
    });
  };

  const navItems = [
    { id: 'index', label: 'Clasificaciones', icon: LayoutDashboard },
    { id: 'campo', label: 'Campo Táctico', icon: Users },
    { id: 'draft', label: 'Draft', icon: Sparkles },
    { id: 'fichajes', label: 'Fichajes', icon: ArrowLeftRight },
    { id: 'mercado', label: 'Mercado', icon: Store },
    { id: 'premios', label: 'Premios', icon: Coins },
    { id: 'graficas', label: 'Gráficas', icon: LineChart },
    { id: 'admin', label: 'Admin', icon: Lock },
  ];

  // Si estamos en modo jugador, OCULTAR completamente la pestaña y acceso de Admin
  // Si la pestaña Draft está configurada como oculta (tras las 11 rondas), ocultarla de los tabs
  const visibleNavItems = navItems.filter(item => {
    if (isPlayerMode && item.id === 'admin') return false;
    if (isDraftHidden && item.id === 'draft') return false;
    return true;
  });

  return (
    <header className="mb-6 space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Logo Oficial respetado al 100% sobre fondo transparente sin recortes */}
          <div className="h-12 sm:h-14 w-auto flex items-center justify-center shrink-0">
            <img 
              src="/logo.png" 
              alt="Logo Liga Fantástica" 
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase font-display">
                {leagueTexts.leagueName || 'Liga Fantástica de Amigos'}
              </h1>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {leagueTexts.season || 'Temporada 2026/27'}
              </span>

              {isPlayerMode && (
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Modo Jugador</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {leagueTexts.subtitle || 'Panel oficial de competición, mercado y estadísticas'}
            </p>
          </div>
        </div>

        {/* Global Stats Badges & Admin Share Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Botones de Compartir Enlace Diferenciado para Admin */}
          {!isPlayerMode && (
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 border border-slate-800 rounded-xl">
              <button
                onClick={() => copyShareLink('player')}
                title="Copiar enlace general para los jugadores participantes (la URL limpia abre directamente en Modo Jugador sin acceso a Admin)"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 text-[11px] font-bold py-1 px-2.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {copiedLink === 'player' ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                <span>{copiedLink === 'player' ? '¡Enlace Jugadores Copiado!' : 'Copiar Enlace Jugadores'}</span>
              </button>

              <button
                onClick={() => gasEngine.setPlayerMode(true)}
                title="Ver la app exactamente como la ven los jugadores (oculta Admin y limpia la URL)"
                className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {gasEngine.isRemoteConnected() ? (
            <button
              onClick={onOpenConnectionModal}
              title="Google Sheets conectado centralizadamente"
              className="bg-slate-950 hover:bg-slate-900 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-inner transition cursor-pointer text-[11px] text-emerald-400 font-semibold"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sheets En Línea</span>
            </button>
          ) : (
            <button
              onClick={onOpenConnectionModal}
              title="Modo local (el administrador conectará Google Sheets)"
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-inner transition cursor-pointer text-[11px] text-slate-400 hover:text-amber-400 font-semibold"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Modo Local</span>
            </button>
          )}

          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Jornada:</span>
            <span className="text-xs font-bold text-white font-mono">J{displayJornada}</span>
          </div>

          <div className="bg-slate-950 border border-amber-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Caja:</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{displayCaja} €</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-1.5 shadow-lg flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1">
        {visibleNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
