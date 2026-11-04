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
  onNavigateToSignals,
  onOpenMenu
}) {
  const lastCandle = candles[candles.length - 1] || { close: 100, open: 100, high: 100, low: 100, volume: 0 };
  const isBuy = signal?.action?.includes('BUY');
  const isSell = signal?.action?.includes('SELL');

  return (
    <div className="flex h-[calc(100dvh-8.5rem)] min-h-[560px] flex-col select-none">
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
        onOpenMenu={onOpenMenu}
      />

      {/* 2. Asosiy Katta Canvas Grafik (Ekran maydonini to'liq egallaydi) */}
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between bg-white px-2 py-1.5">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#2878df]">{asset.symbol} <span className="font-medium text-[#30343a]">· {timeframe}</span></div>
            <div className="truncate text-xs text-[#555a60]">{asset.name}</div>
          </div>
          <div className="ml-3 shrink-0 text-right font-mono text-sm font-medium text-[#41464d]">{lastCandle.close}</div>
        </div>
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
              ? 'bg-[#f0f8f5] border-[#b8dccc] hover:bg-[#eaf5f0]' 
              : isSell 
              ? 'bg-[#fff3f4] border-[#edc4c8] hover:bg-[#ffedef]' 
              : 'bg-[#fff9ed] border-[#efe0bd] hover:bg-[#fff6e3]'
          }`}
        >
          <div className="flex items-center gap-2 text-xs truncate">
            {isBuy && <TrendingUp size={16} className="text-[#00e676] shrink-0" />}
            {isSell && <TrendingDown size={16} className="text-[#ff3b30] shrink-0" />}
            {!isBuy && !isSell && <MinusCircle size={16} className="text-amber-400 shrink-0" />}

              <span className="font-semibold text-[#30343a]">
              {signal.action === 'STRONG_BUY' ? 'Kuchli Xarid' :
               signal.action === 'BUY' ? 'Xarid Signali' :
               signal.action === 'STRONG_SELL' ? 'Kuchli Sotish' :
               signal.action === 'SELL' ? 'Sotish Signali' : 'Kutish Signali'} ({signal.confidence}%)
            </span>
            <span className="text-[#85898e] hidden sm:inline">•</span>
            <span className="text-[#555a60] font-mono hidden sm:inline">
              SL: <strong className="text-[#c74752]">{signal.stopLoss}</strong> | TP: <strong className="text-[#12856c]">{signal.takeProfit1}</strong>
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
          className="px-3 py-2 border border-[#e1e4e8] bg-white flex items-center justify-between cursor-pointer hover:bg-[#f8f9fa] text-xs"
        >
          <div className="flex items-center gap-2 text-[#666a70]">
            <Sparkles size={14} className="text-yellow-400" />
            <span>AI Tahlil va signal olish uchun bosing</span>
          </div>
          <span className="text-[#2878df] font-semibold">Signal Olish →</span>
        </div>
      )}
    </div>
  );
}

