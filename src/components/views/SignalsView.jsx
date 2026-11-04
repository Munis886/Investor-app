import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  MinusCircle, 
  ShieldAlert, 
  Target, 
  Sparkles, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Activity, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export default function SignalsView({
  symbol,
  currentPrice,
  signal,
  unit = '$',
  onTriggerSignal,
  isScanning,
  onNavigateToTrade
}) {
  if (isScanning) {
    return (
      <div className="bg-[#10141d] border border-[#2979ff]/40 rounded-2xl p-8 text-center shadow-2xl space-y-4 my-6">
        <div className="w-14 h-14 rounded-2xl bg-[#2979ff]/20 text-[#2979ff] flex items-center justify-center mx-auto animate-bounce">
          <Zap size={28} className="text-yellow-400 fill-yellow-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white mb-1">Sun'iy Intellekt Bozor Shamlarini Skanerlamoqda...</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            EMA(20/50), RSI(14), MACD, Bollinger diapazoni va sham modellari tahlil qilinmoqda.
          </p>
        </div>
        <div className="w-48 h-1.5 bg-gray-800 rounded-full mx-auto overflow-hidden">
          <div className="w-full h-full bg-[#2979ff] animate-[pulse_1s_infinite]"></div>
        </div>
      </div>
    );
  }

  if (!signal || signal.status === 'INSUFFICIENT_DATA') {
    return (
      <div className="bg-[#10141d] border border-gray-800 rounded-2xl p-8 text-center my-6 space-y-3">
        <p className="text-gray-400 text-sm">
          {signal?.message || "Tahlil qilish uchun shamlar yetarli emas."}
        </p>
        <button
          onClick={onTriggerSignal}
          className="px-5 py-2.5 rounded-xl bg-[#2979ff] text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
        >
          <Zap size={15} className="text-yellow-300" />
          <span>Bozorni Tahlil Qilish</span>
        </button>
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
    ? 'bg-emerald-500/20 text-[#00e676] border-emerald-500/40 shadow-emerald-500/10' 
    : isSell 
    ? 'bg-rose-500/20 text-[#ff3b30] border-rose-500/40 shadow-rose-500/10' 
    : 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/10';

  const actionTextUz = () => {
    switch (action) {
      case 'STRONG_BUY': return "KUCHLI XARID (STRONG BUY)";
      case 'BUY': return "XARID QILISH (BUY)";
      case 'STRONG_SELL': return "KUCHLI SOTISH (STRONG SELL)";
      case 'SELL': return "SOTISH (SELL)";
      default: return "KUTISH (HOLD / NEUTRAL)";
    }
  };

  const slLossPercent = Number((((entryPrice - stopLoss) / entryPrice) * 100).toFixed(2));
  const tpGainPercent = Number((((takeProfit1 - entryPrice) / entryPrice) * 100).toFixed(2));

  return (
    <div className="space-y-3.5 pb-8 select-none font-sans">
      {/* 1. Hero Card: Asosiy Yo'nalish va Ishonchlilik Indeksi */}
      <div className="bg-gradient-to-b from-[#131c2e] to-[#0f1523] border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <Sparkles size={14} className="text-[#2979ff]" />
              <span className="font-bold uppercase tracking-wider">{symbol} • AI Signal Tahlili</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3.5 py-1.5 rounded-xl border text-sm sm:text-base font-black tracking-wide shadow-lg flex items-center gap-1.5 ${badgeColor}`}>
                {isBuy && <TrendingUp size={18} />}
                {isSell && <TrendingDown size={18} />}
                {isNeutral && <MinusCircle size={18} />}
                <span>{actionTextUz()}</span>
              </span>
              {pattern && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold flex items-center gap-1">
                  <Flame size={13} className="text-amber-400" />
                  <span>{pattern.name}</span>
                </span>
              )}
            </div>
          </div>

          {/* O'ng tomon: Ishonchlilik va Yangilash */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-[#1e293b]/70 border border-gray-700 rounded-xl px-3.5 py-2">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Aniqlik darajasi</div>
              <div className="text-lg font-black text-white font-mono flex items-center gap-1">
                <span>{confidence}%</span>
                <Activity size={14} className={confidence > 75 ? 'text-[#00e676]' : 'text-amber-400'} />
              </div>
            </div>

            <button
              onClick={onTriggerSignal}
              className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
              title="Qayta signal olish"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Lisoniy Tahliliy Xulosa */}
        <div className="bg-black/40 border border-gray-800/80 rounded-xl p-3 text-xs sm:text-sm text-gray-200 leading-relaxed">
          {summary}
        </div>
      </div>

      {/* 2. Rejalashtirilgan Buyurtma Parametrlari (Order Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#10141d] border border-gray-800 rounded-2xl p-3.5">
          <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1 font-semibold uppercase">
            <Target size={12} className="text-[#2979ff]" />
            Kirish Narxi (Entry)
          </div>
          <div className="text-base font-black text-white font-mono">
            {entryPrice} <span className="text-xs text-gray-400 font-sans">{unit}</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">Joriy bozor narxi</div>
        </div>

        <div className="bg-[#10141d] border border-rose-900/30 rounded-2xl p-3.5">
          <div className="text-[10px] text-rose-400 mb-1 flex items-center gap-1 font-semibold uppercase">
            <ShieldAlert size={12} />
            Stop Loss (SL)
          </div>
          <div className="text-base font-black text-rose-400 font-mono">
            {stopLoss} <span className="text-xs text-rose-400/80 font-sans">{unit}</span>
          </div>
          <div className="text-[10px] text-rose-400/80 mt-1 font-mono">
            Maks. xatar: -{Math.abs(slLossPercent)}%
          </div>
        </div>

        <div className="bg-[#10141d] border border-emerald-900/30 rounded-2xl p-3.5">
          <div className="text-[10px] text-emerald-400 mb-1 flex items-center gap-1 font-semibold uppercase">
            <TrendingUp size={12} />
            Take Profit (TP 1)
          </div>
          <div className="text-base font-black text-[#00e676] font-mono">
            {takeProfit1} <span className="text-xs text-emerald-400/80 font-sans">{unit}</span>
          </div>
          <div className="text-[10px] text-[#00e676]/80 mt-1 font-mono">
            Maqsad: +{Math.abs(tpGainPercent)}%
          </div>
        </div>

        <div className="bg-[#10141d] border border-indigo-900/30 rounded-2xl p-3.5">
          <div className="text-[10px] text-indigo-400 mb-1 flex items-center gap-1 font-semibold uppercase">
            <Activity size={12} />
            Xatar / Mukofot (R:R)
          </div>
          <div className="text-base font-black text-indigo-300 font-mono">
            {riskReward}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">Optimal nisbat</div>
        </div>
      </div>

      {/* Kengaytirilgan TP2 va TP3 */}
      <div className="bg-[#10141d] border border-gray-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-gray-400">
          Uzoq muddatli maqsad (TP 2): <strong className="text-emerald-400 font-mono">{takeProfit2} {unit}</strong>
        </span>
        <span className="text-gray-400">
          Maksimal maqsad (TP 3): <strong className="text-emerald-400 font-mono">{takeProfit3} {unit}</strong>
        </span>
        <span className="text-gray-400">
          RSI Darajasi: <strong className="text-yellow-400 font-mono">{currentRsi}</strong>
        </span>
      </div>

      {/* 3. Tasdiqlovchi Texnik Faktorlar Ro'yxati (Checklist) */}
      <div className="bg-[#10141d] border border-gray-800 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <CheckCircle2 size={15} className="text-[#00e676]" />
          <span>Tasdiqlovchi Texnik Omillar ({reasons.length} ta tekshiruv):</span>
        </h4>
        <div className="space-y-2">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 bg-[#161c28] p-2.5 rounded-xl border border-gray-800/80">
              <span className="text-[#00e676] font-bold mt-0.5">✓</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. "Ushbu Buyurtmani Ochish" Tugmasi */}
      <div className="pt-2">
        <button
          onClick={onNavigateToTrade}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#2979ff] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition active:scale-[0.99]"
        >
          <span>Ushbu Signal Asosida Bitim Ochish</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

