import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  ArrowLeftRight, 
  Store, 
  Coins, 
  LineChart, 
  ShieldCheck, 
  LayoutDashboard,
  Sparkles,
  Code2,
  Lock,
  Link2,
  RefreshCw,
  CheckCircle2
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
  onOpenExportModal,
  onOpenExport,
  onOpenConnectionModal
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const isConnected = gasEngine.isRemoteConnected();
  const lastSyncTime = gasEngine.getLastSyncTime();

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

  const handleOpenExport = () => {
    if (typeof onOpenExportModal === 'function') {
      onOpenExportModal();
    } else if (typeof onOpenExport === 'function') {
      onOpenExport();
    }
  };

  const handleQuickSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isConnected) {
      if (onOpenConnectionModal) onOpenConnectionModal();
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await gasEngine.syncFromRemote();
    setIsSyncing(false);
    if (res.success) {
      setSyncFeedback('¡Sincronizado!');
      setTimeout(() => setSyncFeedback(null), 3000);
    }
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

  return (
    <header className="mb-6 space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-2xl">
            ⚽
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase font-display">
                Liga Fantástica <span className="text-amber-400">de Amigos</span>
              </h1>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Temporada 2026/27
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Panel oficial de competición, mercado y estadísticas
            </p>
          </div>
        </div>

        {/* Global Stats Badges */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 flex items-center gap-2 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Jornada Activa:</span>
            <span className="text-xs font-bold text-white font-mono">J{displayJornada}</span>
          </div>

          <div className="bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-1.5 flex items-center gap-2 shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Bote Caja:</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{displayCaja} €</span>
          </div>

          {/* Google Sheets Connection Pill */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenConnectionModal}
              className={`border text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm ${
                isConnected
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
              }`}
              title={isConnected ? 'Enlazado con Google Sheets - Clic para opciones' : 'Clic para conectar con tu Google Sheets'}
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <Link2 className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold">
                {isConnected ? 'Sheets Enlazado' : 'Conectar Sheets'}
              </span>
              {isConnected && lastSyncTime && (
                <span className="text-[10px] text-emerald-400/80 font-mono hidden md:inline">
                  ({lastSyncTime})
                </span>
              )}
            </button>

            {isConnected && (
              <button
                onClick={handleQuickSync}
                disabled={isSyncing}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 p-2 rounded-xl text-xs transition cursor-pointer"
                title="Sincronizar datos ahora con Google Sheets"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : 'text-slate-300'}`} />
              </button>
            )}

            {syncFeedback && (
              <span className="text-[11px] font-bold text-emerald-400 animate-in fade-in">
                {syncFeedback}
              </span>
            )}
          </div>

          <button
            onClick={handleOpenExport}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            title="Ver / Exportar archivos para Google Apps Script"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Código Apps Script</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-1.5 shadow-lg flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1">
        {navItems.map(item => {
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
