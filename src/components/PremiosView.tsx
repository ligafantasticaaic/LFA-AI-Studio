import React, { useState, useEffect } from 'react';
import { gasEngine } from '../services/gasEngine';
import { AccountingData } from '../types/league';
import { Trophy, Coins, PiggyBank, Award, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

export const PremiosView: React.FC = () => {
  const [accountingData, setAccountingData] = useState<AccountingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const data = gasEngine.getAccountingData();
    setAccountingData(data);
    setIsLoading(false);
  }, []);

  if (!accountingData) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 font-bold">
        Cargando contabilidad y premios de la liga...
      </div>
    );
  }

  const is6Teams = accountingData.numTeams === 6;
  const prizeCategories = [
    { type: '1ª Posición General', percentage: is6Teams ? '33.5%' : '30.0%' },
    { type: '2ª Posición General', percentage: is6Teams ? '25.5%' : '23.0%' },
    { type: '3ª Posición General', percentage: is6Teams ? '19.0%' : '17.0%' },
    { type: 'Penúltima Posición General', percentage: is6Teams ? '0.0%' : '10.0%' },
    { type: 'Equipo Más Goleador', percentage: is6Teams ? '11.0%' : '10.0%' },
    { type: 'Equipo Menos Goleado', percentage: is6Teams ? '11.0%' : '10.0%' }
  ];

  const totalCajaNum = parseFloat(accountingData.finalCajaBeforeFinalPrizes) || 0;

  return (
    <div className="space-y-6">
      {/* Title & Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight m-0">
                Contabilidad y Premios de la Liga
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Seguimiento económico, aportes semanales y cálculo de premios finales
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-amber-500/40 rounded-xl px-4 py-2 text-right shadow-inner">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Caja Acumulada:</span>
            <span className="text-xl font-black text-amber-400 font-mono">{accountingData.finalCajaBeforeFinalPrizes} €</span>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Equipos Participantes</span>
            <div className="text-xl font-black text-white font-mono">{accountingData.numTeams}</div>
            <span className="text-[11px] text-slate-500">Hasta Jornada {accountingData.maxJornada}</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Aportes de Jornada</span>
            <div className="text-xl font-black text-slate-200 font-mono">{accountingData.totalContributions} €</div>
            <span className="text-[11px] text-slate-500">1.50€ por equipo/jornada</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Costes de Fichajes</span>
            <div className="text-xl font-black text-slate-200 font-mono">{accountingData.totalTransferFees} €</div>
            <span className="text-[11px] text-slate-500">2.00€ tras fichajes gratis</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Premios Repartidos</span>
            <div className="text-xl font-black text-emerald-400 font-mono">{accountingData.totalPrizeMoneyAwarded} €</div>
            <span className="text-[11px] text-emerald-500/80">Jornadas Semanales</span>
          </div>
        </div>
      </div>

      {/* Balance Actual por Equipo */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
          <PiggyBank className="w-4 h-4 text-amber-400" />
          Balance Actual por Equipo
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Equipo</th>
                <th className="p-3 text-center">Aportes Totales (€)</th>
                <th className="p-3 text-center">Coste Fichajes (€)</th>
                <th className="p-3 text-center">Premios Ganados (€)</th>
                <th className="p-3 text-right">Balance Regular (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {accountingData.teamBalanceDetails.map((b, idx) => {
                const balNum = parseFloat(b.balance);
                const isPositive = balNum >= 0;
                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-white">{b.team}</td>
                    <td className="p-3 text-center font-mono text-rose-400 font-bold">-{b.contributions} €</td>
                    <td className="p-3 text-center font-mono text-rose-400 font-bold">-{b.transferFees} €</td>
                    <td className="p-3 text-center font-mono text-emerald-400 font-bold">+{b.prizes} €</td>
                    <td className={`p-3 text-right font-mono font-black text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? `+${b.balance}` : b.balance} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Montos de Premios Finales por Categoría */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
            <Trophy className="w-4 h-4 text-amber-400" />
            Montos de Premios Finales por Categoría
          </h2>
          <span className="text-xs text-slate-400 font-mono">Bote Proyectado: <strong className="text-amber-400">{accountingData.finalCajaBeforeFinalPrizes} €</strong></span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Categoría de Premio</th>
                <th className="p-3 text-center">Porcentaje</th>
                <th className="p-3 text-right">Monto Estimado (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {prizeCategories.map((cat, idx) => {
                const pct = parseFloat(cat.percentage) / 100;
                const estimatedAmount = (totalCajaNum * pct).toFixed(2);
                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>{cat.type}</span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-300">{cat.percentage}</td>
                    <td className="p-3 text-right font-mono font-black text-amber-400 text-sm">
                      {estimatedAmount} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
