import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Zap } from 'lucide-react';

export default function Mt5OneClickTrade({
  bidPrice = 100,
  askPrice = 100.2,
  onTriggerSignal,
  isScanning,
  onQuickTrade
}) {
  const [lot, setLot] = useState('0.10');
  const spread = Number((Math.abs(askPrice - bidPrice) * 10).toFixed(1));

  const formatPrice = (price) => {
    if (price >= 1000) return price.toFixed(2);
    if (price >= 10) return price.toFixed(3);
    return price.toFixed(5);
  };

  const handleSell = (e) => {
    e.stopPropagation();
    if (onQuickTrade) onQuickTrade('SELL', parseFloat(lot) || 0.1);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    if (onQuickTrade) onQuickTrade('BUY', parseFloat(lot) || 0.1);
  };

  return (
    <div className="absolute top-2.5 left-2.5 z-30 flex items-stretch bg-[#10141d]/95 backdrop-blur-md border border-gray-700/80 rounded-xl shadow-2xl overflow-hidden font-mono select-none">
      {/* SELL bloki (MT5 Qizil tugma) */}
      <button
        onClick={handleSell}
        className="px-3 py-1.5 flex flex-col items-center justify-center bg-rose-700/60 hover:bg-rose-600 text-white border-r border-gray-700/80 transition active:scale-95"
        title="Tezkor SELL ochish"
      >
        <span className="text-[10px] font-sans font-bold flex items-center gap-0.5 text-rose-300">
          <ArrowDown size={11} />
          SELL
        </span>
        <span className="text-xs sm:text-sm font-black tracking-tight">
          {formatPrice(bidPrice)}
        </span>
      </button>

      {/* Markaz: Lot hajmi (aniq va tushunarli) */}
      <div className="px-2 py-1 flex flex-col items-center justify-center bg-[#171c26] min-w-[70px]">
        <div className="text-[9px] text-gray-400 font-sans uppercase">
          Spred: <strong className="text-gray-200">{spread}</strong>
        </div>
        
        {/* Lot kiritish maydoni */}
        <input
          type="number"
          step="0.01"
          min="0.01"
          max="10.0"
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          className="w-12 text-center bg-black/50 border border-gray-700 rounded text-xs font-bold text-yellow-400 focus:outline-none focus:border-[#2979ff] my-0.5"
          title="Savdo lot hajmi"
        />

        <button
          onClick={(e) => { e.stopPropagation(); onTriggerSignal(); }}
          disabled={isScanning}
          className="text-[9px] font-sans font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
          title="Bozordan signal olish"
        >
          <Zap size={9} className="text-yellow-400 fill-yellow-400" />
          <span>{isScanning ? "..." : "SIGNAL"}</span>
        </button>
      </div>

      {/* BUY bloki (MT5 Moviy/Ko'k tugma) */}
      <button
        onClick={handleBuy}
        className="px-3 py-1.5 flex flex-col items-center justify-center bg-[#2979ff]/70 hover:bg-[#2979ff] text-white border-l border-gray-700/80 transition active:scale-95"
        title="Tezkor BUY ochish"
      >
        <span className="text-[10px] font-sans font-bold flex items-center gap-0.5 text-blue-200">
          <ArrowUp size={11} />
          BUY
        </span>
        <span className="text-xs sm:text-sm font-black tracking-tight">
          {formatPrice(askPrice)}
        </span>
      </button>
    </div>
  );
}
