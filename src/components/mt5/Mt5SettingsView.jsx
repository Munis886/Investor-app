import React from 'react';
import { 
  Smartphone, 
  Upload, 
  PlusCircle, 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  ShieldCheck, 
  Info,
  Sliders,
  Database
} from 'lucide-react';

export default function Mt5SettingsView({
  isLive,
  onToggleLive,
  onOpenCsvModal,
  onOpenManualModal,
  onOpenApkModal,
  onRefreshData
}) {
  return (
    <div className="bg-[#0b0e14] min-h-[calc(100vh-120px)] text-gray-200 p-3 select-none">
      {/* Profil / Account Paneli */}
      <div className="bg-[#121620] border border-gray-800 rounded-xl p-3.5 mb-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2979ff] to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg">
          MT5
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">MetaTrader 5 AI Investor</h2>
          <p className="text-xs text-gray-400 font-mono">Hisob: #8892104 • Demo (Pro)</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] text-emerald-400 font-bold">Server ulangan (Connected)</span>
          </div>
        </div>
      </div>

      {/* 1. Ma'lumotlar va Tahlil Sozlamalari */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
          Ma'lumotlar Boshqaruvi
        </div>
        <div className="bg-[#121620] border border-gray-800 rounded-xl divide-y divide-gray-800/80">
          <button
            onClick={onOpenCsvModal}
            className="w-full py-2.5 px-3 flex items-center justify-between text-xs hover:bg-gray-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Upload size={16} className="text-[#2979ff]" />
              <span className="font-medium text-gray-200">CSV Statistik Fayl Yuklash</span>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">.csv, .txt</span>
          </button>

          <button
            onClick={onOpenManualModal}
            className="w-full py-2.5 px-3 flex items-center justify-between text-xs hover:bg-gray-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              <PlusCircle size={16} className="text-emerald-400" />
              <span className="font-medium text-gray-200">Yangi Sham Qo'shish (What-If)</span>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">+ 1 candle</span>
          </button>

          <button
            onClick={onRefreshData}
            className="w-full py-2.5 px-3 flex items-center justify-between text-xs hover:bg-gray-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw size={16} className="text-amber-400" />
              <span className="font-medium text-gray-200">Standart Ma'lumotlarni Qaytarish</span>
            </div>
            <span className="text-[11px] text-gray-500">Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Savdo Rejimi & O'rnatish */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
          Ilova & Rejimlar
        </div>
        <div className="bg-[#121620] border border-gray-800 rounded-xl divide-y divide-gray-800/80">
          <button
            onClick={onToggleLive}
            className="w-full py-2.5 px-3 flex items-center justify-between text-xs hover:bg-gray-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              {isLive ? <Pause size={16} className="text-rose-400" /> : <Play size={16} className="text-emerald-400" />}
              <span className="font-medium text-gray-200">Jonli Bozor Tebranishi</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isLive ? 'bg-rose-500/20 text-rose-300' : 'bg-gray-800 text-gray-400'
            }`}>
              {isLive ? 'Faol (Live)' : "To'xtatilgan"}
            </span>
          </button>

          <button
            onClick={onOpenApkModal}
            className="w-full py-2.5 px-3 flex items-center justify-between text-xs bg-emerald-500/10 hover:bg-emerald-500/20 transition text-emerald-400 font-bold"
          >
            <div className="flex items-center gap-2.5">
              <Smartphone size={16} />
              <span>Android .APK Faylini Yuklab Olish</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              Buildga qarab
            </span>
          </button>
        </div>
      </div>

      {/* Versiya ma'lumotlari */}
      <div className="text-center pt-3 text-[10px] text-gray-600 font-mono">
        MetaTrader 5 Mobile UI Edition v1.5 • InvestSignal Engine
      </div>
    </div>
  );
}

