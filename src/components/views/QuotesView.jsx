import React, { useEffect, useState } from 'react';
import { ASSETS, ASSET_CATEGORIES, getAssetById } from '../../utils/sampleData';
import { Search, ArrowUpRight, ArrowDownRight, ChevronRight, Pencil, Plus, Upload } from 'lucide-react';
import QuoteSymbolsManager from './QuoteSymbolsManager';

function formatPrice(price, precision = 2) {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  });
}

function getSparklinePath(candles) {
  const values = candles.slice(-12).map(candle => candle.close);
  if (values.length < 2) return '';

  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * 80;
    const y = 22 - ((value - min) / range) * 20;
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

export default function QuotesView({
  selectedAssetId,
  onSelectAsset,
  customAssetName,
  marketData,
  customCandles,
  onOpenCsvModal
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [managerMode, setManagerMode] = useState(null);
  const [removalSelection, setRemovalSelection] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(() => {
    const defaultIds = ASSETS.map(asset => asset.id);
    try {
      const saved = window.localStorage.getItem('investor-quotes-watchlist');
      if (!saved) return defaultIds;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.every(id => typeof id === 'string')) {
        return [...new Set(parsed)];
      }
      console.warn('Kotirovkalar ro‘yxati noto‘g‘ri formatda, boshlang‘ich ro‘yxat ishlatildi.');
    } catch (error) {
      console.error('Kotirovkalar ro‘yxatini o‘qib bo‘lmadi.', error);
    }
    return defaultIds;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('investor-quotes-watchlist', JSON.stringify(watchlistIds));
    } catch (error) {
      console.error('Kotirovkalar ro‘yxatini saqlab bo‘lmadi.', error);
    }
  }, [watchlistIds]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const selectedAssets = watchlistIds.map(getAssetById).filter(Boolean);
  const filteredAssets = selectedAssets.filter(asset => {
    const matchesCategory = selectedCategory === 'ALL' || asset.category === selectedCategory;
    const matchesSearch = asset.name.toLowerCase().includes(normalizedQuery) ||
      asset.symbol.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });
  const managerAssets = selectedAssets.filter(asset =>
    selectedCategory === 'ALL' || asset.category === selectedCategory
  );
  const showCustomAsset = Boolean(customAssetName) &&
    (selectedCategory === 'ALL' || selectedCategory === 'CUSTOM') &&
    `${customAssetName} CUSTOM`.toLowerCase().includes(normalizedQuery);

  const addAsset = (assetId) => {
    if (!getAssetById(assetId)) {
      console.error(`Katalogda aktiv topilmadi: ${assetId}`);
      return;
    }
    setWatchlistIds(previous => previous.includes(assetId) ? previous : [...previous, assetId]);
  };

  const toggleRemovalSelection = (assetId) => {
    setRemovalSelection(previous =>
      previous.includes(assetId) ? previous.filter(id => id !== assetId) : [...previous, assetId]
    );
  };

  const removeSelectedAssets = () => {
    setWatchlistIds(previous => previous.filter(id => !removalSelection.includes(id)));
    setRemovalSelection([]);
  };

  if (managerMode) {
    return (
      <div className="pb-6">
        <QuoteSymbolsManager
          mode={managerMode}
          selectedIds={watchlistIds}
          visibleSelectedAssets={managerAssets}
          removalSelection={removalSelection}
          onToggleRemoval={toggleRemovalSelection}
          onRemoveSelected={removeSelectedAssets}
          onAddAsset={addAsset}
          onOpenCatalog={() => setManagerMode('add')}
          onBack={() => {
            setManagerMode(null);
            setRemovalSelection([]);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-6 select-none font-sans text-[#25282d]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-semibold text-[#25282d]">Bozor kotirovkalari</h1>
          <p className="text-[11px] text-[#777b80]">Aktivni tanlang — uning grafigi va tahlili ochiladi</p>
        </div>
        <span className="rounded-sm bg-[#f2f5f8] px-2.5 py-1 text-[10px] font-medium text-[#68717b]">
          Namuna ma'lumotlari · real vaqt emas
        </span>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setManagerMode('add')}
            aria-label="Aktiv qo'shish"
            title="Aktiv qo‘shish"
            className="grid size-10 place-items-center text-[#42464d]"
          >
            <Plus size={27} />
          </button>
          <button
            type="button"
            onClick={() => setManagerMode('manage')}
            aria-label="Aktivlarni tahrirlash"
            title="Aktivlarni tahrirlash"
            className="grid size-10 place-items-center text-[#42464d]"
          >
            <Pencil size={22} />
          </button>
          <button
            type="button"
            onClick={onOpenCsvModal}
            aria-label="CSV fayldan shamlar yuklash"
            title="CSV fayldan shamlar yuklash"
            className="grid size-10 place-items-center text-[#42464d]"
          >
            <Upload size={19} />
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Aktiv yoki belgini qidiring (masalan: BTC, Oltin, AAPL)..."
          aria-label="Aktivlarni qidirish"
          className="w-full border-b border-[#d9dce0] bg-white py-3 pl-10 pr-4 text-sm text-[#25282d] placeholder-[#8c9095] focus:border-[#2878df] focus:outline-none transition"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {ASSET_CATEGORIES.map(category => (
          <button
            type="button"
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            aria-pressed={selectedCategory === category.id}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              selectedCategory === category.id
                ? 'bg-[#2979ff] text-white shadow-md shadow-[#2979ff]/25'
                : 'bg-white text-[#666a70] hover:text-[#2878df] border border-[#dfe2e6]'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredAssets.map(asset => {
          const isSelected = selectedAssetId === asset.id;
          const assetCandles = marketData[asset.id] || [];
          const lastCandle = assetCandles[assetCandles.length - 1];
          const firstCandle = assetCandles[0];
          const price = lastCandle?.close ?? asset.basePrice;
          const changePercent = firstCandle?.close
            ? ((price - firstCandle.close) / firstCandle.close) * 100
            : 0;
          const isPositive = changePercent >= 0;
          const sparklinePath = getSparklinePath(assetCandles);

          return (
            <button
              type="button"
              key={asset.id}
              onClick={() => onSelectAsset(asset.id)}
              aria-pressed={isSelected}
              className={`w-full text-left p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                isSelected
                    ? 'bg-[#f4f8ff] border-[#83b1ed]'
                    : 'bg-white border-[#e5e7e9] hover:bg-[#fafbfc]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid size-10 shrink-0 place-items-center border border-[#e1e4e8] bg-[#f7f8f9] font-mono text-xs font-semibold text-[#4c5158]">
                  {asset.symbol.slice(0, 3)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[#282b30]">{asset.symbol}</span>
                    <span className="bg-[#f0f1f3] px-1.5 py-0.2 text-[10px] font-medium text-[#71757a]">
                      {asset.categoryLabel}
                    </span>
                  </div>
                  <div className="text-xs text-[#777b80] mt-0.5 truncate max-w-[130px] sm:max-w-none">
                    {asset.name}
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center justify-center w-20 h-6 shrink-0">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 80 24" aria-hidden="true">
                  <path
                    d={sparklinePath}
                    fill="none"
                    stroke={isPositive ? '#00e676' : '#ff3b30'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-[#25282d] font-mono">
                  {formatPrice(price, asset.precision)} <span className="text-xs font-sans text-[#777b80]">{asset.unit}</span>
                </div>
                <div className="flex items-center justify-end gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500 font-mono hidden md:inline">
                    L: {lastCandle ? formatPrice(lastCandle.low, asset.precision) : '—'} · H: {lastCandle ? formatPrice(lastCandle.high, asset.precision) : '—'}
                  </span>
                  <span
                    title={`Namuna tarixidagi o'zgarish: ${changePercent.toFixed(2)}%`}
                    className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                      isPositive ? 'text-[#12856c]' : 'text-[#c74752]'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {showCustomAsset && (
          <button
            type="button"
            onClick={() => onSelectAsset('CUSTOM')}
            aria-pressed={selectedAssetId === 'CUSTOM'}
            className={`w-full text-left p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
              selectedAssetId === 'CUSTOM'
                ? 'bg-[#f2f8f4] border-[#9bcdb5]'
                : 'bg-white border-[#e5e7e9] hover:bg-[#fafbfc]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="grid size-10 place-items-center border border-[#d7e8df] bg-[#f2f8f4] text-xs font-semibold text-[#388363]">
                CSV
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-sm text-[#388363]">CUSTOM</span>
                <div className="text-xs text-[#777b80] truncate">{customAssetName} · {customCandles.length} ta sham</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-semibold font-mono text-[#25282d]">
                {customCandles.length ? formatPrice(customCandles[customCandles.length - 1].close) : '—'}
                <span className="text-xs font-sans text-[#777b80]"> $</span>
              </div>
              <div className="text-xs text-indigo-400 font-bold flex items-center justify-end gap-1">
                <span>Grafikni ochish</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </button>
        )}

        {filteredAssets.length === 0 && !showCustomAsset && (
          <div className="border border-[#e5e7e9] bg-white p-6 text-center">
            <p className="text-sm font-semibold text-[#45494f]">Mos aktiv topilmadi</p>
            <p className="mt-1 text-xs text-[#85898e]">Qidiruv so'zini yoki tanlangan toifani o'zgartiring.</p>
          </div>
        )}
      </div>
    </div>
  );
}
