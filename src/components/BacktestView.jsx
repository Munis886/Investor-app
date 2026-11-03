import React, { useMemo } from 'react';
import { runBacktest } from '../utils/signalEngine';
import { CheckCircle2, XCircle, BarChart3, TrendingUp, Award, Percent } from 'lucide-react';

export default function BacktestView({ candles, unit = '$' }) {
  const stats = useMemo(() => runBacktest(candles), [candles]);

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Strategiya Sinovi (Tarixiy Backtest Tahlili)
          </h3>
        </div>
        <span className="text-xs text-gray-400">Oxirgi {candles.length} ta sham bo'yicha</span>
      </div>

      {/* Ko'rsatkichlar kartalari */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl p-3">
          <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
            <Percent size={12} className="text-indigo-400" />
            Yutuq Foizi (Win Rate)
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {stats.winRate}%
          </div>
        </div>

        <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl p-3">
          <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-400" />
            Jami Daromadlik
          </div>
          <div className={`text-xl font-black font-mono ${stats.profitPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.profitPercent >= 0 ? `+${stats.profitPercent}%` : `${stats.profitPercent}%`}
          </div>
        </div>

        <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl p-3">
          <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-400" />
            Muvaffaqiyatli Bitimlar
          </div>
          <div className="text-xl font-black text-gray-200 font-mono">
            {stats.wins} <span className="text-xs text-gray-400 font-sans">/ {stats.totalTrades}</span>
          </div>
        </div>

        <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl p-3">
          <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
            <XCircle size={12} className="text-rose-400" />
            Zararli Bitimlar
          </div>
          <div className="text-xl font-black text-rose-400 font-mono">
            {stats.losses} <span className="text-xs text-gray-400 font-sans">ta</span>
          </div>
        </div>
      </div>

      {/* Bitimlar tarixi jadvali */}
      {stats.trades.length > 0 ? (
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
            <BarChart3 size={14} className="text-indigo-400" />
            Oxirgi bitimlar natijalari:
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-medium">
                  <th className="py-2 px-2">Vaqt</th>
                  <th className="py-2 px-2">Turi</th>
                  <th className="py-2 px-2">Kirish narxi</th>
                  <th className="py-2 px-2">Chiqish narxi</th>
                  <th className="py-2 px-2 text-right">Natija (PnL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {stats.trades.map((trade, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/30 transition">
                    <td className="py-2 px-2 text-gray-300 font-sans">{trade.date}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trade.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-gray-300">{trade.entryPrice} {unit}</td>
                    <td className="py-2 px-2 text-gray-300">{trade.exitPrice} {unit}</td>
                    <td className="py-2 px-2 text-right">
                      <span className={`font-bold ${trade.result === 'WIN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.pnlPercent >= 0 ? `+${trade.pnlPercent}%` : `${trade.pnlPercent}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-gray-500">
          Ushbu ma'lumotlar oralig'ida hali yakunlangan bitimlar yo'q.
        </div>
      )}
    </div>
  );
}

