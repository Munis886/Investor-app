import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Target, 
  Zap, 
  HelpCircle,
  Activity,
  Layers
} from 'lucide-react';

export default function Mt5TradeView({
  symbol,
  currentPrice,
  signal,
  unit = '$',
  onTriggerSignal,
  isScanning
}) {
  const balance = 10000.00;
  const profit = signal?.action.includes('BUY') ? 342.50 : signal?.action.includes('SELL') ? 185.00 : 0.00;
  const equity = balance + profit;
  const margin = 250.00;
  const freeMargin = equity - margin;

  return (
    <div className="bg-[#0b0e14] min-h-[calc(100vh-120px)] text-gray-200 p-3 select-none font-mono">
      {/* 1. MT5 Hisob Balansi va Ko'rsatkichlari (Header) */}
      <div className="bg-[#121620] border border-gray-800 rounded-xl p-3.5 mb-3 shadow-lg">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800/80">
          <span className="text-xs text-gray-400 font-sans uppercase">Balans (Balance)</span>
          <span className="text-base font-bold text-white">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-gray-400 font-sans block">Equity (Mablag'):</span>
            <span className="font-bold text-gray-200">${equity.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-sans block">Erkin Marja (Free Margin):</span>
            <span className="font-bold text-gray-200">${freeMargin.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-sans block">Garov (Margin):</span>
            <span className="font-bold text-gray-200">${margin.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-sans block">Foyda (Profit):</span>
            <span className={`font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {profit >= 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Tezkor Signal Olish Tugmasi */}
      <div className="mb-3">
        <button
          onClick={onTriggerSignal}
          disabled={isScanning}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#2979ff] hover:opacity-95 text-white font-sans font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
        >
          <Zap size={15} className={isScanning ? "animate-spin text-yellow-300" : "text-yellow-300 fill-yellow-300"} />
          <span>{isScanning ? "AI Tahlil Qilinmoqda..." : "⚡ Yangi MT5 Signali Olish"}</span>
        </button>
      </div>

      {/* 3. Joriy AI Signali (MT5 Pozitsiya Karti) */}
      {signal && signal.status !== 'INSUFFICIENT_DATA' ? (
        <div className="bg-[#121620] border border-gray-800 rounded-xl p-3.5 shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{symbol}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  signal.action.includes('BUY') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {signal.action}
                </span>
                <span className="text-xs text-gray-400">0.10 lot</span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                Ochilish: <strong className="text-gray-300">{signal.entryPrice}</strong> → Joriy: <strong className="text-emerald-400">{currentPrice}</strong>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-400 font-sans">Ehtimollik</div>
              <div className="text-base font-black text-yellow-400">
                {signal.confidence}%
              </div>
            </div>
          </div>

          {/* SL / TP Darajalari */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3 font-sans">
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-2">
              <span className="text-[10px] text-rose-400 block font-semibold">S / L (Stop Loss):</span>
              <span className="font-mono font-bold text-rose-300">{signal.stopLoss} {unit}</span>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-2">
              <span className="text-[10px] text-emerald-400 block font-semibold">T / P (Take Profit 1):</span>
              <span className="font-mono font-bold text-emerald-300">{signal.takeProfit1} {unit}</span>
            </div>
          </div>

          {/* Izoh va Sabablar */}
          <div className="bg-black/30 rounded-lg p-2.5 text-xs text-gray-300 font-sans leading-relaxed border border-gray-800">
            <div className="font-bold text-[#2979ff] mb-1 flex items-center gap-1">
              <Activity size={12} />
              <span>Algoritm Sabablari:</span>
            </div>
            <ul className="space-y-1 text-[11px] text-gray-400">
              {signal.reasons.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-gray-500 font-sans">
          Hozirda ochiq pozitsiya yoki signal yo'q. "Signal Olish" tugmasini bosing.
        </div>
      )}
    </div>
  );
}

