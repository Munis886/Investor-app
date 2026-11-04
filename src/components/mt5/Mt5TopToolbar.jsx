import React, { useState } from 'react';
import { 
  Crosshair, 
  FunctionSquare, 
  Shapes, 
  Maximize2, 
  Clock, 
  BarChart, 
  TrendingUp, 
  ChevronDown,
  Layers,
  Zap
} from 'lucide-react';

export default function Mt5TopToolbar({
  symbol,
  timeframe,
  onSelectTimeframe,
  chartType,
  onChangeChartType,
  isCrosshairActive,
  onToggleCrosshair,
  showOneClick,
  onToggleOneClick,
  showIndicators,
  onToggleIndicators,
  onTriggerSignal,
  isScanning
}) {
  const [showTfDropdown, setShowTfDropdown] = useState(false);
  const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'];

  return (
    <div className="bg-[#12161f] border-b border-gray-800 text-gray-200 select-none">
      {/* 1-Qator: MT5 Standart Asboblar Paneli */}
      <div className="px-3 py-1.5 flex items-center justify-between gap-2 text-xs">
        {/* Chap: Aktiv Nomi & Timeframe selektori */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-mono font-bold text-white tracking-wide">
            <span className="text-sm text-[#2979ff]">{symbol}</span>
            <span className="text-xs text-gray-400">, {timeframe}</span>
          </div>

          {/* Timeframe menyusi tugmasi */}
          <div className="relative">
            <button
              onClick={() => setShowTfDropdown(!showTfDropdown)}
              className="px-2 py-0.5 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 font-mono text-[11px] font-bold flex items-center gap-1 border border-gray-700"
            >
              <Clock size={11} className="text-gray-400" />
              <span>{timeframe}</span>
              <ChevronDown size={10} />
            </button>

            {showTfDropdown && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-[#161c28] border border-gray-700 rounded-lg shadow-2xl py-1 flex flex-col min-w-[70px]">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      onSelectTimeframe(tf);
                      setShowTfDropdown(false);
                    }}
                    className={`px-3 py-1 text-left text-xs font-mono font-bold transition ${
                      timeframe === tf ? 'bg-[#2979ff] text-white' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* O'ng: MT5 Grafik Boshqaruv Tugmalari */}
        <div className="flex items-center gap-1">
          {/* Crosshair (+) tugmasi */}
          <button
            onClick={onToggleCrosshair}
            className={`p-1.5 rounded transition ${
              isCrosshairActive 
                ? 'bg-[#2979ff] text-white' 
                : 'bg-gray-800/70 hover:bg-gray-700 text-gray-300'
            }`}
            title="Crosshair (Kursor o'lchagich)"
          >
            <Crosshair size={15} />
          </button>

          {/* ƒx Indikatorlar tugmasi */}
          <button
            onClick={onToggleIndicators}
            className={`px-2 py-1 rounded font-serif italic font-bold text-xs transition border ${
              showIndicators
                ? 'bg-[#2979ff]/20 text-[#2979ff] border-[#2979ff]/50'
                : 'bg-gray-800/70 text-gray-400 border-transparent hover:text-gray-200'
            }`}
            title="Indikatorlar (EMA, Bollinger, RSI)"
          >
            ƒ
          </button>

          {/* Grafik turi: Candles, Bars, Line */}
          <div className="flex items-center bg-gray-800/70 rounded p-0.5 border border-gray-700/60">
            <button
              onClick={() => onChangeChartType('CANDLES')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                chartType === 'CANDLES' ? 'bg-[#2979ff] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Shamlar (Candles)"
            >
              🕯️
            </button>
            <button
              onClick={() => onChangeChartType('BARS')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                chartType === 'BARS' ? 'bg-[#2979ff] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Barlar (Bars)"
            >
              📊
            </button>
            <button
              onClick={() => onChangeChartType('LINE')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                chartType === 'LINE' ? 'bg-[#2979ff] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Chiziqli (Line)"
            >
              📉
            </button>
          </div>

          {/* One-Click Trading / Signal Paneli kaliti (MT5 dagi mashhur tugma) */}
          <button
            onClick={onToggleOneClick}
            className={`p-1.5 rounded transition ${
              showOneClick 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800/70 hover:bg-gray-700 text-gray-300'
            }`}
            title="Tezkor Savdo & Signal Paneli (One-Click)"
          >
            <Layers size={15} />
          </button>

          {/* Yangi Signal Olish Tezkor Tugmasi */}
          <button
            onClick={onTriggerSignal}
            disabled={isScanning}
            className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider flex items-center gap-1 transition ${
              isScanning
                ? 'bg-indigo-600/60 text-gray-300 cursor-wait'
                : 'bg-gradient-to-r from-emerald-500 to-[#2979ff] hover:opacity-95 text-white shadow-md'
            }`}
            title="Bozordan yangi signal olish"
          >
            <Zap size={13} className={isScanning ? "animate-spin text-yellow-300" : "text-yellow-300 fill-yellow-300"} />
            <span className="hidden sm:inline">Signal</span>
          </button>
        </div>
      </div>

      {/* 2-Qator: Tezkor Timeframe Tugmalari qatori (MT5 Desktop & Tablet uslubi) */}
      <div className="px-3 py-1 bg-[#0b0e14] border-t border-gray-800/60 flex items-center gap-1 overflow-x-auto text-[11px] font-mono scrollbar-none">
        <span className="text-gray-500 text-[10px] uppercase font-sans mr-1">Period:</span>
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onSelectTimeframe(tf)}
            className={`px-2 py-0.5 rounded font-bold transition ${
              timeframe === tf
                ? 'bg-[#2979ff] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
}

