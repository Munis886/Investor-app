import React, { useState } from 'react';
import { ASSETS, ASSET_CATEGORIES } from '../../utils/sampleData';
import { Search, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Layers, ChevronRight } from 'lucide-react';

export default function QuotesView({
  selectedAssetId,
  onSelectAsset,
  customAssetName
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrlash
  const filteredAssets = ASSETS.filter(asset => {
    const matchesCategory = selectedCategory === 'ALL' || asset.category === selectedCategory;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-3 pb-6 select-none font-sans">
      {/* 1. Qidiruv Qatori */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Aktiv yoki belgini qidiring (masalan: BTC, Oltin, AAPL)..."
          className="w-full bg-[#121620] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2979ff] transition"
        />
      </div>

      {/* 2. Toifali Filtrlar (Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {ASSET_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-[#2979ff] text-white shadow-md shadow-[#2979ff]/25'
                : 'bg-[#121620] text-gray-400 hover:text-gray-200 border border-gray-800/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Aktivlar Ro'yxati (Strukturaviy Tartib) */}
      <div className="space-y-2">
        {filteredAssets.map(asset => {
          const isSelected = selectedAssetId === asset.id;
          const basePrice = asset.basePrice;
          const changePercent = ((Math.sin(asset.basePrice) * 1.5) + (asset.volatility * 40)).toFixed(2);
          const isPositive = parseFloat(changePercent) >= 0;
          const high = (basePrice * (1 + asset.volatility * 1.2)).toFixed(2);
          const low = (basePrice * (1 - asset.volatility * 1.2)).toFixed(2);

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-[#161d2b] border-[#2979ff]/50 shadow-lg shadow-[#2979ff]/10'
                  : 'bg-[#10141d] border-gray-800 hover:border-gray-700 hover:bg-[#131824]'
              }`}
            >
              {/* Chap qism: Belgisi, Nomi va Toifa nishoni */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#161d2b] to-[#1c2436] border border-gray-700/80 flex items-center justify-center font-mono font-bold text-xs text-[#2979ff] shrink-0">
                  {asset.symbol.slice(0, 3)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{asset.symbol}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 font-medium">
                      {asset.categoryLabel}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[130px] sm:max-w-none">
                    {asset.name}
                  </div>
                </div>
              </div>

              {/* Markaz: Mini Sparkline indikatori */}
              <div className="hidden sm:flex items-center justify-center w-20 h-6">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 80 24">
                  <path
                    d={isPositive ? "M0,18 Q20,12 40,15 T80,4" : "M0,6 Q20,10 40,8 T80,20"}
                    fill="none"
                    stroke={isPositive ? "#00e676" : "#ff3b30"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* O'ng qism: Narx va 24s o'zgarish */}
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-white font-mono">
                  {basePrice >= 1000 ? basePrice.toLocaleString('en-US') : basePrice} <span className="text-xs font-sans text-gray-400">{asset.unit}</span>
                </div>
                <div className="flex items-center justify-end gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500 font-mono hidden md:inline">
                    L: {low} • H: {high}
                  </span>
                  <span className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                    isPositive ? 'bg-emerald-500/15 text-[#00e676]' : 'bg-rose-500/15 text-[#ff3b30]'
                  }`}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {isPositive ? `+${changePercent}%` : `${changePercent}%`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Yuklangan CSV Ma'lumotlari */}
        {customAssetName && (
          <div
            onClick={() => onSelectAsset('CUSTOM')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedAssetId === 'CUSTOM'
                ? 'bg-[#161d2b] border-emerald-500/50'
                : 'bg-[#10141d] border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400">
                CSV
              </div>
              <div>
                <span className="font-bold text-sm text-emerald-400">CUSTOM</span>
                <div className="text-xs text-gray-400">{customAssetName}</div>
              </div>
            </div>
            <div className="text-xs text-indigo-400 font-bold flex items-center gap-1">
              <span>Grafikni ochish</span>
              <ChevronRight size={14} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

