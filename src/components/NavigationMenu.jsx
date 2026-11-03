import React from 'react';
import { 
  X, 
  Upload, 
  PlusCircle, 
  RefreshCw, 
  Play, 
  Pause, 
  Smartphone, 
  BarChart2, 
  History, 
  HelpCircle,
  FileSpreadsheet,
  Zap,
  Info,
  Layers
} from 'lucide-react';

export default function NavigationMenu({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  isLive,
  onToggleLive,
  onOpenCsvModal,
  onOpenManualModal,
  onOpenApkModal,
  onRefreshData,
  onTriggerSignal
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Tashqariga bosilganda yopish */}
      <div className="flex-1" onClick={onClose} />

      {/* Menyu oynasi (Slide-in Drawer) */}
      <div className="w-full max-w-xs sm:max-w-sm bg-[#0f172a] border-l border-gray-800 h-full p-5 flex flex-col justify-between overflow-y-auto shadow-2xl">
        <div>
          {/* Sarlavha va Yopish */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                IS
              </div>
              <div>
                <h2 className="text-sm font-black text-white">InvestSignal AI</h2>
                <p className="text-[10px] text-gray-400">Boshqaruv Menyusi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* ASOSIY HARAKAT: Signal Olish Tugmasi */}
          <div className="mb-5">
            <button
              onClick={() => {
                onTriggerSignal();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
            >
              <Zap size={16} className="text-yellow-300 fill-yellow-300" />
              <span>Yangi Signal Olish</span>
            </button>
          </div>

          {/* 1-Guruh: Bo'limlar */}
          <div className="mb-5">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Asosiy Bo'limlar
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { onSelectTab('CHART'); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'CHART'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                    : 'text-gray-300 hover:bg-gray-800/60'
                }`}
              >
                <BarChart2 size={16} className="text-indigo-400" />
                <span>Grafik va Signallar</span>
              </button>

              <button
                onClick={() => { onSelectTab('BACKTEST'); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'BACKTEST'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                    : 'text-gray-300 hover:bg-gray-800/60'
                }`}
              >
                <History size={16} className="text-amber-400" />
                <span>Strategiya Sinovi (Backtest)</span>
              </button>

              <button
                onClick={() => { onSelectTab('GUIDE'); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'GUIDE'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                    : 'text-gray-300 hover:bg-gray-800/60'
                }`}
              >
                <HelpCircle size={16} className="text-emerald-400" />
                <span>Qo'llanma va Tushunchalar</span>
              </button>
            </div>
          </div>

          {/* 2-Guruh: Ma'lumotlar Boshqaruvi */}
          <div className="mb-5">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Ma'lumotlar & Tahlil
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { onOpenCsvModal(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition"
              >
                <FileSpreadsheet size={16} className="text-blue-400" />
                <span>CSV Statistika Yuklash</span>
              </button>

              <button
                onClick={() => { onOpenManualModal(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition"
              >
                <PlusCircle size={16} className="text-emerald-400" />
                <span>Yangi Sham Qo'shish (+ Sham)</span>
              </button>

              <button
                onClick={() => { onRefreshData(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition"
              >
                <RefreshCw size={16} className="text-indigo-400" />
                <span>Ma'lumotlarni Yangilash</span>
              </button>
            </div>
          </div>

          {/* 3-Guruh: Rejimlar & O'rnatish */}
          <div className="mb-5">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Rejimlar & Ilova
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { onToggleLive(); onClose(); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isLive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isLive ? <Pause size={16} className="text-rose-400" /> : <Play size={16} className="text-emerald-400" />}
                  <span>Jonli Bozor (Simulyatsiya)</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLive ? 'bg-rose-500/30 text-rose-300' : 'bg-gray-800 text-gray-400'}`}>
                  {isLive ? 'Faol' : "O'chiq"}
                </span>
              </button>

              <button
                onClick={() => { onOpenApkModal(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition"
              >
                <Smartphone size={16} />
                <span>Android .APK O'rnatish (4.2 MB)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pastki Qism: Status & Versiya */}
        <div className="pt-4 border-t border-gray-800/80 text-[11px] text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tizim tayyor</span>
          </div>
          <span>Versiya 1.0 PRO</span>
        </div>
      </div>
    </div>
  );
}

