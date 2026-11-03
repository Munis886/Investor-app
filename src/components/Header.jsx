import React from 'react';
import { ASSETS } from '../utils/sampleData';
import { 
  TrendingUp, 
  Menu, 
  Zap, 
  ChevronDown
} from 'lucide-react';

export default function Header({
  selectedAssetId,
  onSelectAsset,
  customAssetName,
  currentPrice,
  priceChangePercent = 1.45,
  unit = '$',
  onOpenMenu,
  onTriggerSignal,
  isScanning
}) {
  const isPositive = priceChangePercent >= 0;

  return (
    <header className="bg-[#0f172a]/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Chap qism: Logo & Aktiv Tanlash */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <TrendingUp size={20} />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white tracking-tight">InvestSignal</span>
                <span className="px-1 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-gray-400">Shamli Tahlil & Prognoz</p>
            </div>
          </div>

          {/* Aktivni tanlash (Custom Styled Select) */}
          <div className="relative">
            <select
              value={selectedAssetId}
              onChange={(e) => onSelectAsset(e.target.value)}
              className="bg-[#1e293b] hover:bg-gray-800 border border-gray-700 text-white text-xs font-bold rounded-xl pl-3 pr-8 py-2 appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 transition"
            >
              {ASSETS.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.symbol} — {asset.name}
                </option>
              ))}
              {customAssetName && (
                <option value="CUSTOM">📂 {customAssetName}</option>
              )}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* O'rta qism: Joriy Narx ko'rsatkichi (Ticker) */}
        {currentPrice && (
          <div className="hidden md:flex items-center gap-3 px-3 py-1 bg-black/30 rounded-xl border border-gray-800">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Joriy Narx</span>
              <span className="text-sm font-black font-mono text-emerald-400">
                {currentPrice} <span className="text-xs text-gray-400 font-sans">{unit}</span>
              </span>
            </div>
            <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-mono ${
              isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {isPositive ? `+${priceChangePercent}%` : `${priceChangePercent}%`}
            </div>
          </div>
        )}

        {/* O'ng qism: SIGNAL OLISH TUGMASI va MENYU TUGMASI */}
        <div className="flex items-center gap-2">
          {/* ASOSIY SIGNAL OLISH TUGMASI */}
          <button
            onClick={onTriggerSignal}
            disabled={isScanning}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shadow-lg ${
              isScanning
                ? 'bg-indigo-600/60 text-gray-300 cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-emerald-500/20 transform active:scale-95'
            }`}
            title="Bozorni tahlil qilib eng so'nggi signalni olish"
          >
            <Zap size={15} className={isScanning ? "animate-spin text-yellow-300" : "text-yellow-300 fill-yellow-300"} />
            <span>{isScanning ? "AI Tahlil..." : "Signal Olish"}</span>
          </button>

          {/* MENYU TUGMASI */}
          <button
            onClick={onOpenMenu}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#1e293b] hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold flex items-center gap-1.5 transition"
            title="Boshqaruv menyusi"
          >
            <Menu size={18} className="text-gray-300" />
            <span className="hidden sm:inline">Menyu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
