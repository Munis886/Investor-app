import React from 'react';
import CandleChart from '../CandleChart';
import Mt5TopToolbar from '../mt5/Mt5TopToolbar';
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, MinusCircle } from 'lucide-react';

export default function ChartView({
  candles,
  asset,
  signal,
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
  isScanning,
  onNavigateToSignals
}) {
  const lastCandle = candles[candles.length - 1] || { close: 100, open: 100, high: 100, low: 100, volume: 0 };
  const isBuy = signal?.action?.includes('BUY');
  const isSell = signal?.action?.includes('SELL');

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] select-none">
      {/* 1. MT5 Standart Asboblar Paneli */}
      <Mt5TopToolbar
        symbol={asset.symbol}
        timeframe={timeframe}
        onSelectTimeframe={onSelectTimeframe}
        chartType={chartType}
        onChangeChartType={onChangeChartType}
        isCrosshairActive={isCrosshairActive}
        onToggleCrosshair={onToggleCrosshair}
        showOneClick={showOneClick}
        onToggleOneClick={onToggleOneClick}
        showIndicators={showIndicators}
        onToggleIndicators={onToggleIndicators}
        onTriggerSignal={onTriggerSignal}
        isScanning={isScanning}
      />

      {/* 2. Asosiy Katta Canvas Grafik (Ekran maydonini to'liq egallaydi) */}
      <div className="flex-1 w-full min-h-[380px] my-1">
        <CandleChart
          candles={candles}
          asset={asset}
          signal={signal}
          chartType={chartType}
          isCrosshairActive={isCrosshairActive}
          showOneClick={showOneClick}
          showIndicators={showIndicators}
          onTriggerSignal={onTriggerSignal}
          isScanning={isScanning}
        />
      </div>

      {/* 3. Grafik Ostidagi Ixcham "Signal Tizer"i (Mini-banner) */}
      {signal && signal.status !== 'INSUFFICIENT_DATA' ? (
        <div
          onClick={onNavigateToSignals}
          className={`px-3 py-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition shadow-lg active:scale-[0.99] ${
            isBuy 
              ? 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-950/60' 
              : isSell 
              ? 'bg-rose-950/40 border-rose-500/40 hover:bg-rose-950/60' 
              : 'bg-amber-950/30 border-amber-500/30 hover:bg-amber-950/50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs truncate">
            {isBuy && <TrendingUp size={16} className="text-[#00e676] shrink-0" />}
            {isSell && <TrendingDown size={16} className="text-[#ff3b30] shrink-0" />}
            {!isBuy && !isSell && <MinusCircle size={16} className="text-amber-400 shrink-0" />}

            <span className="font-bold text-white">
              {signal.action === 'STRONG_BUY' ? 'Kuchli Xarid' :
               signal.action === 'BUY' ? 'Xarid Signali' :
               signal.action === 'STRONG_SELL' ? 'Kuchli Sotish' :
               signal.action === 'SELL' ? 'Sotish Signali' : 'Kutish Signali'} ({signal.confidence}%)
            </span>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="text-gray-300 font-mono hidden sm:inline">
              SL: <strong className="text-rose-400">{signal.stopLoss}</strong> | TP: <strong className="text-emerald-400">{signal.takeProfit1}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#2979ff] shrink-0">
            <span>Tahlilni ko'rish</span>
            <ArrowRight size={13} />
          </div>
        </div>
      ) : (
        <div
          onClick={onTriggerSignal}
          className="px-3 py-2 rounded-xl bg-[#121620] border border-gray-800 flex items-center justify-between cursor-pointer hover:border-gray-700 text-xs"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <Sparkles size={14} className="text-yellow-400" />
            <span>AI Tahlil va signal olish uchun bosing</span>
          </div>
          <span className="text-[#2979ff] font-bold">Signal Olish ➔</span>
        </div>
      )}
    </div>
  );
}

