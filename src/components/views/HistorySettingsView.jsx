import React, { useState } from 'react';
import BacktestView from '../BacktestView';
import { 
  History, 
  Settings, 
  Upload, 
  PlusCircle, 
  Play, 
  Pause, 
  RefreshCw, 
  Smartphone, 
  ShieldCheck, 
  Server,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function HistorySettingsView({
  candles,
  unit = '$',
  isLive,
  onToggleLive,
  onOpenCsvModal,
  onOpenManualModal,
  onOpenApkModal,
  onRefreshData
}) {
  const [subTab, setSubTab] = useState('HISTORY'); // 'HISTORY' | 'SETTINGS'

  return (
    <div className="space-y-3.5 pb-8 select-none font-sans">
      {/* Ichki 2 ta Tab (Tarix & Backtest | Sozlamalar) */}
      <div className="flex items-center gap-1.5 bg-[#121620] p-1 rounded-2xl border border-gray-800">
        <button
          onClick={() => setSubTab('HISTORY')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            subTab === 'HISTORY'
              ? 'bg-[#2979ff] text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <History size={15} />
          <span>Tarix & Backtest Testi</span>
        </button>

        <button
          onClick={() => setSubTab('SETTINGS')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            subTab === 'SETTINGS'
              ? 'bg-[#2979ff] text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Settings size={15} />
          <span>Ma'lumotlar & Sozlamalar</span>
        </button>
      </div>

      {/* TAB A: Tarix va Backtest Testi */}
      {subTab === 'HISTORY' && (
        <div className="space-y-3">
          <BacktestView candles={candles} unit={unit} />
        </div>
      )}

      {/* TAB B: Ma'lumotlar Boshqaruvi va Sozlamalar */}
      {subTab === 'SETTINGS' && (
        <div className="space-y-3.5">
          {/* Server va Profil */}
          <div className="bg-[#10141d] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2979ff] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                IS
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">InvestSignal Engine Pro</h3>
                <p className="text-xs text-gray-400">Oflayn demo · algoritmik tahlil</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-300"></span>
              <span>Demo</span>
            </div>
          </div>

          {/* Ma'lumotlar Boshqaruvi Guruhi */}
          <div className="bg-[#10141d] border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800/80">
            <button
              onClick={onOpenCsvModal}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-[#161c28] transition"
            >
              <div className="flex items-center gap-3">
                <Upload size={17} className="text-[#2979ff]" />
                <div className="text-left">
                  <span className="font-bold text-gray-200 block">CSV Fayldan Statistik Ma'lumot Yuklash</span>
                  <span className="text-[10px] text-gray-500">Istalgan aksiyalar, birja yoki kripto tarixi</span>
                </div>
              </div>
              <span className="text-[11px] text-[#2979ff] font-bold font-mono">Yuklash ➔</span>
            </button>

            <button
              onClick={onOpenManualModal}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-[#161c28] transition"
            >
              <div className="flex items-center gap-3">
                <PlusCircle size={17} className="text-emerald-400" />
                <div className="text-left">
                  <span className="font-bold text-gray-200 block">Qo'lda Yangi Sham Kiritish (What-If Tahlil)</span>
                  <span className="text-[10px] text-gray-500">O, H, L, C narxlarini kiritib bashoratni sinash</span>
                </div>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold font-mono">+ Sham</span>
            </button>

            <button
              onClick={onToggleLive}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-[#161c28] transition"
            >
              <div className="flex items-center gap-3">
                {isLive ? <Pause size={17} className="text-rose-400" /> : <Play size={17} className="text-emerald-400" />}
                <div className="text-left">
                  <span className="font-bold text-gray-200 block">Bozor harakati simulyatsiyasi</span>
                  <span className="text-[10px] text-gray-500">Namunaviy shamlarni avtomatik o'zgartirish</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                isLive ? 'bg-rose-500/20 text-rose-300' : 'bg-gray-800 text-gray-400'
              }`}>
                {isLive ? 'Faol (Live)' : "O'chiq"}
              </span>
            </button>

            <button
              onClick={onRefreshData}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-[#161c28] transition"
            >
              <div className="flex items-center gap-3">
                <RefreshCw size={17} className="text-amber-400" />
                <div className="text-left">
                  <span className="font-bold text-gray-200 block">Standart Ma'lumotlarni Qayta Tiklash</span>
                  <span className="text-[10px] text-gray-500">Boshlang'ich bozor kotirovkalarini yuklash</span>
                </div>
              </div>
              <span className="text-[11px] text-gray-500 font-bold">Reset</span>
            </button>
          </div>

          {/* Android .APK Faylini Yuklab Olish / O'rnatish */}
          <div className="bg-gradient-to-r from-emerald-950/30 to-teal-950/20 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Smartphone size={16} />
                <span>Android .APK O'rnatish</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Tayyor
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              <strong>InvestSignal.apk</strong> faylining hajmi vaqti-vaqti bilan o'zgaradi. Builddan keyin yangilangan nusxa loyiha papkasiga ko'chiriladi.
            </p>
            <button
              onClick={onOpenApkModal}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
            >
              O'rnatish Yo'riqnomasini Ko'rish
            </button>
          </div>

          {/* Versiya */}
          <div className="text-center pt-2 text-[10px] text-gray-600 font-mono">
            InvestSignal AI • Yangilangan Axborot Arxitekturasi v2.0
          </div>
        </div>
      )}
    </div>
  );
}
