import React from 'react';
import { ASSETS } from '../utils/sampleData';
import { 
  TrendingUp, 
  Upload, 
  Plus, 
  Smartphone, 
  Play, 
  Pause, 
  RefreshCw,
  Coins
} from 'lucide-react';

export default function Header({
  selectedAssetId,
  onSelectAsset,
  isLive,
  onToggleLive,
  onOpenCsvModal,
  onOpenManualModal,
  onOpenApkModal,
  customAssetName,
  onRefreshData
}) {
  return (
    <header className="bg-[#0f172a]/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40 px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Chap qism: Logo & Aktiv tanlash */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base text-white tracking-tight">InvestSignal</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase">
                  AI PRO
                </span>
              </div>
              <p className="text-[10px] text-gray-400">Shamli Tahlil & Bashorat</p>
            </div>
          </div>

          {/* Aktivni tanlash menyusi (Select) */}
          <div className="flex items-center gap-1.5">
            <Coins size={14} className="text-gray-400" />
            <select
              value={selectedAssetId}
              onChange={(e) => onSelectAsset(e.target.value)}
              className="bg-[#1e293b] border border-gray-700 text-white text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {ASSETS.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.symbol})
                </option>
              ))}
              {customAssetName && (
                <option value="CUSTOM">📂 {customAssetName}</option>
              )}
            </select>
          </div>
        </div>

        {/* O'ng qism: Boshqaruv tugmalari */}
        <div className="flex flex-wrap items-center justify-end w-full md:w-auto gap-2">
          {/* Jonli simulyatsiya tugmasi */}
          <button
            onClick={onToggleLive}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isLive
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
            title="Haqiqiy vaqtli shamlar simulyatsiyasi"
          >
            {isLive ? <Pause size={13} /> : <Play size={13} />}
            <span>{isLive ? "Jonli Bozor (Faol)" : "Jonli Bozor (Boshlash)"}</span>
          </button>

          {/* Qayta yangilash */}
          <button
            onClick={onRefreshData}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
            title="Ma'lumotlarni yangilash"
          >
            <RefreshCw size={14} />
          </button>

          {/* CSV Yuklash */}
          <button
            onClick={onOpenCsvModal}
            className="px-3 py-1.5 rounded-xl bg-[#1e293b] hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition"
            title="O'z CSV statistika faylingizni yuklang"
          >
            <Upload size={13} className="text-indigo-400" />
            <span className="hidden sm:inline">CSV Tahlil</span>
          </button>

          {/* Qo'lda sham kiritish */}
          <button
            onClick={onOpenManualModal}
            className="px-3 py-1.5 rounded-xl bg-[#1e293b] hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Yangi sham qo'shib tekshirish"
          >
            <Plus size={14} className="text-emerald-400" />
            <span className="hidden sm:inline">+ Sham</span>
          </button>

          {/* Mobil APK o'rnatish */}
          <button
            onClick={onOpenApkModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/30"
          >
            <Smartphone size={14} />
            <span>.APK O'rnatish</span>
          </button>
        </div>
      </div>
    </header>
  );
}

