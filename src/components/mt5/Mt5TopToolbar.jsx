import React, { useState } from 'react';
import { 
  Activity,
  BarChart3,
  Crosshair, 
  LineChart,
  Menu,
  Clock, 
  ChevronDown,
  Layers,
  Zap,
  TrendingUp
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
  isScanning,
  onOpenMenu
}) {
  const [showTfDropdown, setShowTfDropdown] = useState(false);
  const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'];
  const chartTypes = ['CANDLES', 'BARS', 'LINE'];
  const nextChartType = chartTypes[(chartTypes.indexOf(chartType) + 1) % chartTypes.length];
  const ChartTypeIcon = chartType === 'LINE' ? LineChart : chartType === 'BARS' ? BarChart3 : Activity;

  return (
    <div className="sticky top-0 z-30 border-b border-[#e1e3e6] bg-white pt-[calc(0.65rem+env(safe-area-inset-top))] text-[#4c5158] select-none">
      <div className="mx-auto max-w-7xl px-2 pb-1 sm:px-4">
        <div className="flex h-9 items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <TrendingUp size={19} className="shrink-0 text-[#2878df]" />
            <h1 className="truncate text-sm font-bold text-[#30343a]">Aqilli investor</h1>
          </div>
          <button type="button" onClick={onOpenMenu} aria-label="Menyuni ochish" className="grid size-9 shrink-0 place-items-center text-[#383c42]">
            <Menu size={23} />
          </button>
        </div>

        <div className="flex h-11 items-center justify-between gap-0.5">
          <button type="button" onClick={onToggleCrosshair} aria-pressed={isCrosshairActive} title="Krosshair" className={`grid size-10 shrink-0 place-items-center ${isCrosshairActive ? 'text-[#2878df]' : 'text-[#4c5158]'}`}>
            <Crosshair size={24} />
          </button>
          <button type="button" onClick={onToggleIndicators} aria-pressed={showIndicators} title="Indikatorlar" className={`grid size-10 shrink-0 place-items-center ${showIndicators ? 'text-[#2878df]' : 'text-[#4c5158]'}`}>
            <span className="text-[19px] font-semibold italic leading-none">ƒx</span>
          </button>

          <div className="relative shrink-0">
            <button type="button" onClick={() => setShowTfDropdown(!showTfDropdown)} aria-expanded={showTfDropdown} title="Vaqt oralig‘i" className="flex h-10 min-w-12 items-center justify-center gap-0.5 px-1 text-[15px] font-semibold text-[#30343a]">
              {timeframe}<ChevronDown size={14} />
            </button>
            {showTfDropdown && (
              <div className="absolute right-0 top-full z-50 mt-1 grid min-w-24 overflow-hidden border border-[#e1e3e6] bg-white py-1 shadow-lg">
                {timeframes.map(tf => (
                  <button key={tf} type="button" onClick={() => { onSelectTimeframe(tf); setShowTfDropdown(false); }} className={`px-4 py-2 text-left text-sm ${timeframe === tf ? 'font-semibold text-[#2878df]' : 'text-[#3f4349]'}`}>
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="button" onClick={() => onChangeChartType(nextChartType)} title={`Grafik turi: ${chartType}`} aria-label={`Grafik turini ${nextChartType} ga almashtirish`} className="grid size-10 shrink-0 place-items-center text-[#4c5158]">
            <ChartTypeIcon size={24} />
          </button>
          <button type="button" onClick={onToggleOneClick} aria-pressed={showOneClick} title="Tezkor savdo paneli" className={`grid size-10 shrink-0 place-items-center ${showOneClick ? 'text-[#2878df]' : 'text-[#4c5158]'}`}>
            <Layers size={23} />
          </button>
          <button type="button" onClick={onTriggerSignal} disabled={isScanning} title="Signalni yangilash" className="grid size-10 shrink-0 place-items-center text-[#2878df] disabled:opacity-50">
            <Zap size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
