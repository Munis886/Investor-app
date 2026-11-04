import React from 'react';
import { ASSETS } from '../../utils/sampleData';
import { Plus, ArrowUpDown, ChevronRight } from 'lucide-react';

export default function Mt5QuotesView({
  selectedAssetId,
  onSelectAsset,
  candles,
  customAssetName,
  onOpenCsvModal
}) {
  return (
    <div className="bg-[#0b0e14] min-h-[calc(100vh-120px)] text-gray-200 p-3 select-none">
      {/* Sarlavha paneli */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-[#2979ff]" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Quotes (Kotirovkalar)
          </h2>
        </div>
        <button
          onClick={onOpenCsvModal}
          className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs flex items-center gap-1 font-sans px-2"
          title="Yangi aktiv yoki CSV qo'shish"
        >
          <Plus size={14} className="text-emerald-400" />
          <span>Statistika</span>
        </button>
      </div>

      {/* Kotirovkalar ro'yxati (MT5 uslubida) */}
      <div className="divide-y divide-gray-800/80 font-mono">
        {ASSETS.map((asset) => {
          const isSelected = selectedAssetId === asset.id;
          const basePrice = asset.basePrice;
          const spreadPips = (asset.volatility * 100).toFixed(1);
          const bid = basePrice;
          const ask = basePrice * (1 + asset.volatility * 0.05);

          const high = (basePrice * (1 + asset.volatility * 1.5)).toFixed(2);
          const low = (basePrice * (1 - asset.volatility * 1.5)).toFixed(2);

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset.id)}
              className={`py-3 px-2 flex items-center justify-between cursor-pointer transition rounded-lg ${
                isSelected ? 'bg-[#161d2b]' : 'hover:bg-gray-900/60'
              }`}
            >
              {/* Chap qism: Symbol va Spread */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white">{asset.symbol}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2979ff]"></span>
                  )}
                </div>
                <div className="text-[10px] text-gray-400 font-sans mt-0.5">
                  {asset.name}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Spred: <span className="text-gray-300">{spreadPips}</span>
                </div>
              </div>

              {/* O'ng qism: Bid & Ask narxlari (MT5 ko'rinishi) */}
              <div className="flex items-center gap-4">
                {/* Bid narxi (Qizilroq) */}
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-black text-rose-400">
                    {bid >= 1000 ? bid.toFixed(1) : bid.toFixed(3)}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    L: {low}
                  </div>
                </div>

                {/* Ask narxi (Moviy) */}
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-black text-[#2979ff]">
                    {ask >= 1000 ? ask.toFixed(1) : ask.toFixed(3)}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    H: {high}
                  </div>
                </div>

                <ChevronRight size={14} className="text-gray-600 hidden sm:block" />
              </div>
            </div>
          );
        })}

        {/* Yuklangan CSV Ma'lumotlari mavjud bo'lsa */}
        {customAssetName && (
          <div
            onClick={() => onSelectAsset('CUSTOM')}
            className={`py-3 px-2 flex items-center justify-between cursor-pointer transition rounded-lg ${
              selectedAssetId === 'CUSTOM' ? 'bg-[#161d2b]' : 'hover:bg-gray-900/60'
            }`}
          >
            <div>
              <div className="text-sm font-black text-emerald-400">CUSTOM</div>
              <div className="text-[10px] text-gray-400 font-sans">{customAssetName}</div>
            </div>
            <div className="text-xs text-gray-400 font-sans">
              Yuklangan shamlar
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

