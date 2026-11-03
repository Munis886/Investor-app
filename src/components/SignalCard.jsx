import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  MinusCircle, 
  ShieldAlert, 
  Target, 
  HelpCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Activity,
  Flame
} from 'lucide-react';

export default function SignalCard({ signal, currentPrice, unit = '$' }) {
  const [showDetails, setShowDetails] = useState(true);

  if (!signal || signal.status === 'INSUFFICIENT_DATA') {
    return (
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 text-center">
        <p className="text-gray-400 text-sm">{signal?.message || "Signal hisoblash uchun shamlar yetarli emas."}</p>
      </div>
    );
  }

  const {
    action,
    confidence,
    entryPrice,
    stopLoss,
    takeProfit1,
    takeProfit2,
    takeProfit3,
    riskReward,
    reasons,
    summary,
    pattern,
    currentRsi
  } = signal;

  const isBuy = action === 'BUY' || action === 'STRONG_BUY';
  const isSell = action === 'SELL' || action === 'STRONG_SELL';
  const isNeutral = action === 'NEUTRAL';

  const badgeColor = isBuy 
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20' 
    : isSell 
    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-500/20' 
    : 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/20';

  const getActionNameUz = () => {
    switch (action) {
      case 'STRONG_BUY': return "KUCHLI XARID (STRONG BUY)";
      case 'BUY': return "XARID QILISH (BUY)";
      case 'STRONG_SELL': return "KUCHLI SOTISH (STRONG SELL)";
      case 'SELL': return "SOTISH (SELL)";
      default: return "KUTISH (HOLD / NEUTRAL)";
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#131c2e] to-[#0f172a] rounded-2xl border border-gray-800 p-5 shadow-2xl relative overflow-hidden">
      {/* Orqa fon nur effekti */}
      <div 
        className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isBuy ? 'bg-emerald-500' : isSell ? 'bg-rose-500' : 'bg-amber-500'
        }`} 
      />

      {/* Sarlavha qatori: Signal va Ishonchlilik */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Avtomatik AI Tahlil & Signal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-xl border text-sm sm:text-base font-black tracking-wide shadow-lg flex items-center gap-1.5 ${badgeColor}`}>
              {isBuy && <TrendingUp size={18} />}
              {isSell && <TrendingDown size={18} />}
              {isNeutral && <MinusCircle size={18} />}
              {getActionNameUz()}
            </span>
            {pattern && (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-medium flex items-center gap-1">
                <Flame size={12} className="text-amber-400" />
                {pattern.name}
              </span>
            )}
          </div>
        </div>

        {/* Ishonchlilik darajasi (Confidence Gauge) */}
        <div className="bg-[#1e293b]/70 border border-gray-700/60 rounded-xl px-4 py-2 min-w-[130px] flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Aniqlik ehtimoli</div>
            <div className="text-lg font-bold text-white flex items-center gap-1">
              <span>{confidence}%</span>
              <Activity size={14} className={confidence > 75 ? 'text-emerald-400' : 'text-amber-400'} />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 border-indigo-500 bg-indigo-500/10">
            {confidence}%
          </div>
        </div>
      </div>

      {/* Qisqacha Xulosa */}
      <div className="bg-[#0b0f19]/70 rounded-xl p-3 border border-gray-800/80 mb-4 text-xs sm:text-sm text-gray-200 leading-relaxed">
        {summary}
      </div>

      {/* Trade Parametrlari (Entry, SL, TP, R:R) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl p-3">
          <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
            <Target size={12} className="text-blue-400" />
            Kirish Narxi (Entry)
          </div>
          <div className="text-sm sm:text-base font-bold text-gray-100 font-mono">
            {entryPrice} <span className="text-xs text-gray-400 font-sans">{unit}</span>
          </div>
        </div>

        <div className="bg-[#1e293b]/50 border border-rose-900/30 rounded-xl p-3">
          <div className="text-[10px] text-rose-400 mb-1 flex items-center gap-1">
            <ShieldAlert size={12} />
            Stop Loss (SL)
          </div>
          <div className="text-sm sm:text-base font-bold text-rose-300 font-mono">
            {stopLoss} <span className="text-xs text-rose-400/80 font-sans">{unit}</span>
          </div>
        </div>

        <div className="bg-[#1e293b]/50 border border-emerald-900/30 rounded-xl p-3">
          <div className="text-[10px] text-emerald-400 mb-1 flex items-center gap-1">
            <TrendingUp size={12} />
            Take Profit (TP 1)
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-300 font-mono">
            {takeProfit1} <span className="text-xs text-emerald-400/80 font-sans">{unit}</span>
          </div>
        </div>

        <div className="bg-[#1e293b]/50 border border-indigo-900/30 rounded-xl p-3">
          <div className="text-[10px] text-indigo-400 mb-1 flex items-center gap-1">
            <Activity size={12} />
            Risk / Mukofot (R:R)
          </div>
          <div className="text-sm sm:text-base font-bold text-indigo-300 font-mono">
            {riskReward}
          </div>
        </div>
      </div>

      {/* Kengaytirilgan TP2 va TP3 darajalari */}
      <div className="flex flex-wrap items-center gap-3 py-2 px-3 rounded-lg bg-gray-900/40 border border-gray-800 text-[11px] text-gray-400 mb-4">
        <span>Maqsad 2 (TP2): <strong className="text-emerald-400 font-mono">{takeProfit2} {unit}</strong></span>
        <span>•</span>
        <span>Maqsad 3 (TP3): <strong className="text-emerald-400 font-mono">{takeProfit3} {unit}</strong></span>
        <span>•</span>
        <span>RSI ko'rsatkichi: <strong className="text-yellow-400 font-mono">{currentRsi}</strong></span>
      </div>

      {/* Sabablar Ro'yxati (Nega bu signal?) */}
      <div className="border-t border-gray-800/80 pt-3">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full text-xs font-semibold text-gray-400 hover:text-gray-200 transition py-1"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle size={14} className="text-indigo-400" />
            Signal asoslari va texnik omillar ({reasons.length} ta omil)
          </span>
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showDetails && (
          <ul className="mt-2.5 space-y-1.5 text-xs text-gray-300 pl-1">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

