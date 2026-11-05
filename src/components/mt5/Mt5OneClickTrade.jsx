import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Zap } from 'lucide-react';

export default function Mt5OneClickTrade({
  bidPrice = 100,
  askPrice = 100.2,
  unit = '$',
  onTriggerSignal,
  isScanning,
  onQuickTrade
}) {
  const [lot, setLot] = useState('0.10');
  const spread = Number((Math.abs(askPrice - bidPrice) * 10).toFixed(1));
  const parsedLot = Number(lot);
  const isLotValid = Number.isFinite(parsedLot) && parsedLot >= 0.01 && parsedLot <= 10;

  const formatPrice = (price) => {
    if (price >= 1000) return price.toFixed(2);
    if (price >= 10) return price.toFixed(3);
    return price.toFixed(5);
  };

  const handleSell = (e) => {
    e.stopPropagation();
    if (onQuickTrade && isLotValid) onQuickTrade('SELL', parsedLot);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    if (onQuickTrade && isLotValid) onQuickTrade('BUY', parsedLot);
  };

  return (
    <div className="absolute top-2.5 left-2.5 z-30 flex items-stretch overflow-hidden border border-[#dfe2e6] bg-white/95 font-mono shadow-md select-none">
      {/* SELL bloki (MT5 Qizil tugma) */}
      <button
        disabled={!isLotValid}
        onClick={handleSell}
        className="flex flex-col items-center justify-center border-r border-[#e1e4e8] bg-[#fff3f4] px-3 py-1.5 text-[#c74752] transition active:opacity-80 disabled:opacity-50"
        title="Tezkor SELL ochish"
      >
        <span className="text-[10px] font-sans font-semibold flex items-center gap-0.5 text-[#c74752]">
          <ArrowDown size={11} />
          SELL
        </span>
        <span className="text-xs sm:text-sm font-semibold tracking-tight">
          {formatPrice(bidPrice)} <span className="text-[9px]">{unit}</span>
        </span>
      </button>

      {/* Markaz: Lot hajmi (aniq va tushunarli) */}
      <div className="flex min-w-[70px] flex-col items-center justify-center bg-white px-2 py-1">
        <div className="text-[9px] text-[#777b80] font-sans uppercase">
          Spred: <strong className="text-[#30343a]">{spread}</strong>
        </div>
        
        {/* Lot kiritish maydoni */}
        <input
          type="number"
          step="0.01"
          min="0.01"
          max="10.0"
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          className="my-0.5 w-12 border-b border-[#dfe2e6] bg-white text-center text-xs font-semibold text-[#30343a] focus:border-[#2878df] focus:outline-none"
          title="Savdo lot hajmi"
        />
        {!isLotValid && <span className="text-[8px] text-[#c74752]">0.01–10</span>}

        <button
          onClick={(e) => { e.stopPropagation(); onTriggerSignal(); }}
          disabled={isScanning}
          className="text-[9px] font-sans font-semibold text-[#2878df] hover:text-[#195fae] flex items-center gap-0.5"
          title="Bozordan signal olish"
        >
          <Zap size={9} className="text-yellow-400 fill-yellow-400" />
          <span>{isScanning ? "..." : "SIGNAL"}</span>
        </button>
      </div>

      {/* BUY bloki (MT5 Moviy/Ko'k tugma) */}
      <button
        disabled={!isLotValid}
        onClick={handleBuy}
        className="flex flex-col items-center justify-center border-l border-[#e1e4e8] bg-[#eaf2ff] px-3 py-1.5 text-[#2878df] transition active:opacity-80 disabled:opacity-50"
        title="Tezkor BUY ochish"
      >
        <span className="text-[10px] font-sans font-semibold flex items-center gap-0.5 text-[#2878df]">
          <ArrowUp size={11} />
          BUY
        </span>
        <span className="text-xs sm:text-sm font-semibold tracking-tight">
          {formatPrice(askPrice)} <span className="text-[9px]">{unit}</span>
        </span>
      </button>
    </div>
  );
}
