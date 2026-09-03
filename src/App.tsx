import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IndexView } from './components/IndexView';
import { TacticalFieldView } from './components/TacticalFieldView';
import { DraftView } from './components/DraftView';
import { FichajesView } from './components/FichajesView';
import { MercadoView } from './components/MercadoView';
import { PremiosView } from './components/PremiosView';
import { GraficasView } from './components/GraficasView';
import { AdminView } from './components/AdminView';
import { ExportModal } from './components/ExportModal';
import { ConnectionModal } from './components/ConnectionModal';
import { Trophy } from 'lucide-react';
import { gasEngine } from './services/gasEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('index');
  const [fieldParams, setFieldParams] = useState<{ team?: string; jornada?: number }>({});
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);
  const [, setTick] = useState<number>(0);

  // Subscribe to engine state changes so live syncing automatically re-renders all tabs
  useEffect(() => {
    const unsubscribe = gasEngine.subscribe(() => {
      setTick(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  const handleGoToField = (team: string, jornada: number) => {
    setFieldParams({ team, jornada });
    setActiveTab('campo');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Main Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTabChange={setActiveTab}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {activeTab === 'index' && <IndexView onGoToField={handleGoToField} />}
        {activeTab === 'campo' && (
          <TacticalFieldView
            initialTeam={fieldParams.team}
            initialJornada={fieldParams.jornada}
          />
        )}
        {activeTab === 'draft' && <DraftView />}
        {activeTab === 'fichajes' && <FichajesView />}
        {activeTab === 'mercado' && <MercadoView />}
        {activeTab === 'premios' && <PremiosView />}
        {activeTab === 'graficas' && <GraficasView />}
        {activeTab === 'admin' && (
          <AdminView 
            onOpenConnectionModal={() => setIsConnectionOpen(true)}
            onOpenExportModal={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* Modern Compact Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-400">Liga Fantástica de Fútbol (LFA)</span>
            <span className="text-slate-600 font-mono">• Temporada 2026/27</span>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-4 text-[11px] text-slate-500">
            <span>Competición oficial de fútbol fantasy</span>
            <span className="text-slate-700">•</span>
            <span>Sistema seguro y centralizado</span>
          </div>
        </div>
      </footer>

      {/* Connection and Deployment Setup Modal */}
      <ConnectionModal
        isOpen={isConnectionOpen}
        onClose={() => setIsConnectionOpen(false)}
        onSyncComplete={() => setTick(prev => prev + 1)}
      />

      {/* Export Source Code Modal for GAS & Google Sites */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
