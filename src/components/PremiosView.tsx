import React, { useState, useEffect } from 'react';
import { gasEngine } from '../services/gasEngine';
import { AccountingData } from '../types/league';
import { Trophy, Coins, PiggyBank, Award, CheckCircle2, Info } from 'lucide-react';

export const PremiosView: React.FC = () => {
  const [accountingData, setAccountingData] = useState<AccountingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    refreshAccounting();
    const unsub = gasEngine.subscribe(refreshAccounting);
    return () => unsub();
  }, []);

  const refreshAccounting = () => {
    setIsLoading(true);
    const data = gasEngine.getAccountingData();
    setAccountingData(data);
    setIsLoading(false);
  };

  if (!accountingData) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 font-bold">
        Cargando contabilidad y premios de la liga...
      </div>
    );
  }

  const isSeasonFinished = Boolean(accountingData.isFinalJornada || (accountingData.maxJornada >= 38));
  const is6Teams = accountingData.numTeams === 6;
  const totalCajaNum = parseFloat(accountingData.finalCajaBeforeFinalPrizes) || 0;

  // Si vienen premios finales calculados con ganador, usarlos; si no, mostrar desglose porcentual
  const finalPrizesList = accountingData.finalPrizes && accountingData.finalPrizes.length > 0
    ? accountingData.finalPrizes
    : [
        { type: '1ª Posición General', percentage: is6Teams ? '33.5%' : '30.0%', team: '1er Clasificado', prize: (totalCajaNum * (is6Teams ? 0.335 : 0.30)).toFixed(2) },
        { type: '2ª Posición General', percentage: is6Teams ? '25.5%' : '23.0%', team: '2º Clasificado', prize: (totalCajaNum * (is6Teams ? 0.255 : 0.23)).toFixed(2) },
        { type: '3ª Posición General', percentage: is6Teams ? '19.0%' : '17.0%', team: '3er Clasificado', prize: (totalCajaNum * (is6Teams ? 0.190 : 0.17)).toFixed(2) },
        ...(!is6Teams ? [{ type: 'Penúltima Posición General', percentage: '10.0%', team: 'Penúltimo Clasificado', prize: (totalCajaNum * 0.10).toFixed(2) }] : []),
        { type: 'Equipo Más Goleador', percentage: is6Teams ? '11.0%' : '10.0%', team: 'Máx. Goleador', prize: (totalCajaNum * (is6Teams ? 0.110 : 0.10)).toFixed(2) },
        { type: 'Equipo Menos Goleado', percentage: is6Teams ? '11.0%' : '10.0%', team: 'Mín. Goleado', prize: (totalCajaNum * (is6Teams ? 0.110 : 0.10)).toFixed(2) }
      ];

  const totalFinalPrizesDistributed = finalPrizesList.reduce((acc, p) => acc + (parseFloat(p.prize || '0') || 0), 0).toFixed(2);

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
                {isSeasonFinished
                  ? 'Seguimiento económico, aportes semanales, balance final y liquidación de premios'
                  : 'Seguimiento económico y balance regular de jornadas por equipo'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-right shadow-inner">
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                {isSeasonFinished ? 'Bote a Repartir:' : 'Bote Acumulado:'}
              </span>
              <span className="text-lg font-black text-amber-400 font-mono">{accountingData.finalCajaBeforeFinalPrizes} €</span>
            </div>
            {isSeasonFinished ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-4 py-2 text-right shadow-inner">
                <span className="block text-[10px] uppercase font-bold text-emerald-400">Caja Acumulada Final:</span>
                <span className="text-xl font-black text-emerald-300 font-mono">{accountingData.finalCajaAfterFinalPrizes || '0.00'} €</span>
              </div>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 text-right shadow-inner">
                <span className="block text-[10px] uppercase font-bold text-amber-400">Estado Temporada:</span>
                <span className="text-sm font-black text-amber-300 font-mono">Jornada {accountingData.maxJornada} / 38</span>
              </div>
            )}
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
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
            <div className="text-xl font-black text-amber-400 font-mono">{accountingData.totalTransferFees} €</div>
            <span className="text-[11px] text-slate-500">2.00€ tras fichajes gratis</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Premios Semanales</span>
            <div className="text-xl font-black text-emerald-400 font-mono">{accountingData.totalPrizeMoneyAwarded} €</div>
            <span className="text-[11px] text-emerald-500/80">Jornadas Semanales</span>
          </div>

          {isSeasonFinished ? (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Caja Acumulada</span>
              <div className="text-xl font-black text-emerald-300 font-mono">{accountingData.finalCajaAfterFinalPrizes || '0.00'} €</div>
              <span className="text-[11px] text-emerald-400/80">Liquidada al 100%</span>
            </div>
          ) : (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">Bote en Caja</span>
              <div className="text-xl font-black text-amber-300 font-mono">{accountingData.finalCajaBeforeFinalPrizes} €</div>
              <span className="text-[11px] text-amber-400/80">Fondo acumulado</span>
            </div>
          )}
        </div>

        {/* Banner informativo de estado de temporada */}
        {isSeasonFinished ? (
          <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white m-0">
                  Reparto Final de Premios - Jornada 38
                </h4>
                <p className="text-xs text-slate-400 m-0 mt-0.5">
                  Una vez realizado el reparto final del bote entre las categorías de la liga, la caja acumulada es exactamente <strong className="text-amber-400">0.00 €</strong>.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-xs">
              Caja Resultante: 0.00 €
            </span>
          </div>
        ) : (
          <div className="bg-slate-950/90 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white m-0 flex items-center gap-2">
                  <span>Temporada Regular en curso</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                    Hasta Jornada {accountingData.maxJornada} de 38
                  </span>
                </h4>
                <p className="text-xs text-slate-400 m-0 mt-0.5">
                  Durante la competición regular se muestra únicamente el <strong className="text-slate-200">Balance regular de Jornadas por equipo</strong>. El <strong className="text-amber-400">Reparto de Premios finales por categoría</strong> y el <strong className="text-amber-400">Balance final definitivo</strong> solo aparecerán en esta pantalla una vez terminada la Jornada 38.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Balance Regular de Jornadas (Aportes, Fichajes y Premios Semanales) - SIEMPRE VISIBLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
            <PiggyBank className="w-4 h-4 text-amber-400" />
            Balance Regular de Jornadas por Equipo
          </h2>
          <span className="text-xs text-slate-400">
            Aportes acumulados, coste de fichajes y premios por jornada ganada
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Equipo</th>
                <th className="p-3 text-center">Aportes Totales (€)</th>
                <th className="p-3 text-center">Coste Fichajes (€)</th>
                <th className="p-3 text-center">Premios Semanales (€)</th>
                <th className="p-3 text-right">Balance Regular (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {accountingData.teamBalanceDetails.map((b, idx) => {
                const balNum = parseFloat(b.balance);
                const isPositive = balNum >= 0;
                return (
                  <tr key={`premio-team-${b.team}-${idx}`} className="hover:bg-slate-800/40 transition">
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
            <tfoot className="bg-slate-950/90 border-t-2 border-slate-800 font-bold text-xs">
              <tr>
                <td className="p-3 text-white uppercase font-black">Totales Acumulados</td>
                <td className="p-3 text-center font-mono text-rose-400 font-black">-{accountingData.totalContributions} €</td>
                <td className="p-3 text-center font-mono text-rose-400 font-black">-{accountingData.totalTransferFees} €</td>
                <td className="p-3 text-center font-mono text-emerald-400 font-black">+{accountingData.totalPrizeMoneyAwarded} €</td>
                <td className="p-3 text-right font-mono text-amber-400 font-black text-sm">
                  {accountingData.finalCajaBeforeFinalPrizes} €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Secciones de PREMIOS FINALES y BALANCE DEFINITIVO: SOLO VISIBLES TRAS JORNADA 38 */}
      {isSeasonFinished && (
        <>
          {/* 1. Balance Final Definitivo de la Liga (Liquidación tras Jornada 38) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
                <Trophy className="w-4 h-4 text-amber-400" />
                Balance Final Definitivo tras Jornada 38 (Liquidación Completa)
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Balance Jornadas + Premios Finales
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Equipo</th>
                    <th className="p-3 text-center">Balance Regular (€)</th>
                    <th className="p-3 text-center">Premios Finales (€)</th>
                    <th className="p-3 text-right">Balance Final Neto (€)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {accountingData.teamBalanceDetails.map((b, idx) => {
                    const finalNet = parseFloat(b.finalBalance || b.balance);
                    const isPositive = finalNet >= 0;
                    const finalP = b.finalPrizeWon || '0.00';
                    return (
                      <tr key={`final-team-${b.team}-${idx}`} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <span>{b.team}</span>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-300">
                          {b.balance} €
                        </td>
                        <td className="p-3 text-center font-mono text-emerald-400 font-bold">
                          +{finalP} €
                        </td>
                        <td className={`p-3 text-right font-mono font-black text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? `+${finalNet.toFixed(2)}` : finalNet.toFixed(2)} €
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Reparto de Premios Finales por Categoría */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-white flex items-center gap-2 m-0 p-0 border-none">
                <Award className="w-4 h-4 text-amber-400" />
                Reparto de Premios Finales por Categoría
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Porcentajes del Bote Acumulado ({accountingData.numTeams} Equipos)
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950 text-amber-400 font-extrabold uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Categoría de Premio</th>
                    <th className="p-3">Equipo Ganador</th>
                    <th className="p-3 text-center">% Bote</th>
                    <th className="p-3 text-right">Premio Otorgado (€)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {finalPrizesList.map((cat, idx) => (
                    <tr key={`final-prize-row-${idx}`} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>{cat.type}</span>
                      </td>
                      <td className="p-3 text-slate-200 font-semibold">
                        {cat.team || '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-300">{cat.percentage}</td>
                      <td className="p-3 text-right font-mono font-black text-amber-400 text-sm">
                        {cat.prize} €
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-950/90 border-t-2 border-slate-800 font-bold text-xs">
                  <tr>
                    <td colSpan={2} className="p-3 text-white uppercase font-black">
                      Total Bote Repartido al Finalizar Jornada 38
                    </td>
                    <td className="p-3 text-center text-amber-400 font-mono font-black">100.0%</td>
                    <td className="p-3 text-right text-emerald-400 font-mono font-black text-sm">
                      {totalFinalPrizesDistributed} €
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
