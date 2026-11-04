import React from 'react';
import BacktestView from '../BacktestView';
import { History, Award, Calendar } from 'lucide-react';

export default function Mt5HistoryView({ candles, unit = '$' }) {
  return (
    <div className="bg-[#0b0e14] min-h-[calc(100vh-120px)] text-gray-200 p-3 select-none">
      {/* MT5 Tarix sarlavhasi */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <History size={16} className="text-[#2979ff]" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
            Trade History (Savdolar Tarixi)
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-sans">
          <Calendar size={13} />
          <span>Oxirgi davr</span>
        </div>
      </div>

      {/* Backtest va Savdo Tarixi Jadvali */}
      <BacktestView candles={candles} unit={unit} />
    </div>
  );
}

