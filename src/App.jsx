import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CandleChart from './components/CandleChart';
import SignalCard from './components/SignalCard';
import BacktestView from './components/BacktestView';
import CsvUploaderModal from './components/CsvUploaderModal';
import ManualCandleModal from './components/ManualCandleModal';
import ApkExportModal from './components/ApkExportModal';
import { ASSETS, getInitialAssetData, simulateNextCandle } from './utils/sampleData';
import { analyzeMarket } from './utils/signalEngine';
import { 
  BarChart2, 
  History, 
  HelpCircle, 
  Info, 
  ShieldCheck, 
  TrendingUp,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [selectedAssetId, setSelectedAssetId] = useState('BTC_USDT');
  const [customAssetName, setCustomAssetName] = useState(null);
  const [candles, setCandles] = useState(() => getInitialAssetData('BTC_USDT'));
  const [isLive, setIsLive] = useState(false);
  const [activeTab, setActiveTab] = useState('CHART'); // 'CHART' | 'BACKTEST' | 'GUIDE'

  // Modallar
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Tanlangan aktiv obyekti
  const currentAsset = useMemo(() => {
    if (selectedAssetId === 'CUSTOM') {
      return {
        id: 'CUSTOM',
        name: customAssetName || "Foydalanuvchi ma'lumotlari",
        symbol: 'CUSTOM',
        unit: '$'
      };
    }
    return ASSETS.find(a => a.id === selectedAssetId) || ASSETS[0];
  }, [selectedAssetId, customAssetName]);

  // Aktiv o'zgarganda
  const handleSelectAsset = (assetId) => {
    setSelectedAssetId(assetId);
    if (assetId !== 'CUSTOM') {
      setCandles(getInitialAssetData(assetId));
    }
  };

  // Jonli bozor simulyatsiyasi (Live Mode)
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCandles(prev => simulateNextCandle(prev, 0.007));
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  // Bozor tahlili va bashoratli signallar hisobi
  const signal = useMemo(() => {
    return analyzeMarket(candles);
  }, [candles]);

  // CSV ma'lumotlari yuklanganda
  const handleCustomDataLoaded = (newCandles, assetName) => {
    setCustomAssetName(assetName);
    setSelectedAssetId('CUSTOM');
    setCandles(newCandles);
    setIsLive(false);
  };

  // Yangi qo'lda kiritilgan sham
  const handleAddCandle = (newCandle) => {
    setCandles(prev => [...prev.slice(-90), newCandle]);
  };

  // Qayta tiklash / yangilash
  const handleRefresh = () => {
    if (selectedAssetId !== 'CUSTOM') {
      setCandles(getInitialAssetData(selectedAssetId));
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans pb-10">
      {/* Yuqori Panel */}
      <Header
        selectedAssetId={selectedAssetId}
        onSelectAsset={handleSelectAsset}
        isLive={isLive}
        onToggleLive={() => setIsLive(!isLive)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        customAssetName={customAssetName}
        onRefreshData={handleRefresh}
      />

      {/* Asosiy Tana */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Aktiv va Narx info paneli */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center font-bold text-sm text-indigo-400 border border-gray-700">
              {currentAsset.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white">{currentAsset.name}</h1>
                <span className="text-xs text-gray-400 font-mono">({currentAsset.symbol})</span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <span>Jami: <strong>{candles.length} ta sham</strong></span>
                <span>•</span>
                <span>Tahlil turi: <strong>Texnik & AI Sham Ko'rinishi</strong></span>
              </div>
            </div>
          </div>

          {/* Oxirgi narx ko'rsatkichi */}
          {candles.length > 0 && (
            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Joriy Narx</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 flex items-center gap-1.5 justify-end">
                <span>{candles[candles.length - 1].close}</span>
                <span className="text-sm font-sans text-gray-400">{currentAsset.unit}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tablar (Ko'rinishlar) */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <button
            onClick={() => setActiveTab('CHART')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'CHART'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-gray-800/60 text-gray-400 hover:text-white'
            }`}
          >
            <BarChart2 size={15} />
            <span>Grafik va Signallar</span>
          </button>

          <button
            onClick={() => setActiveTab('BACKTEST')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'BACKTEST'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-gray-800/60 text-gray-400 hover:text-white'
            }`}
          >
            <History size={15} />
            <span>Strategiya Tahlili (Backtest)</span>
          </button>

          <button
            onClick={() => setActiveTab('GUIDE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'GUIDE'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-gray-800/60 text-gray-400 hover:text-white'
            }`}
          >
            <HelpCircle size={15} />
            <span>Qo'llanma & Indikatorlar</span>
          </button>
        </div>

        {/* TAB 1: Sham Grafik va Signal Karti */}
        {activeTab === 'CHART' && (
          <div className="space-y-4">
            {/* Shamli Grafik */}
            <CandleChart
              candles={candles}
              asset={currentAsset}
              signal={signal}
            />

            {/* AI Signal Karti */}
            <SignalCard
              signal={signal}
              currentPrice={candles[candles.length - 1]?.close}
              unit={currentAsset.unit}
            />
          </div>
        )}

        {/* TAB 2: Backtest & Tarixiy Tahlil */}
        {activeTab === 'BACKTEST' && (
          <BacktestView
            candles={candles}
            unit={currentAsset.unit}
          />
        )}

        {/* TAB 3: Qo'llanma */}
        {activeTab === 'GUIDE' && (
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Info size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">InvestSignal Ilovasidan Foydalanish Qo'llanmasi</h2>
                <p className="text-xs text-gray-400">Algoritmlar qanday ishlaydi va signallarni qanday o'qish kerak?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
              <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl p-4 space-y-2">
                <div className="font-bold text-indigo-400 flex items-center gap-1.5 text-sm">
                  <TrendingUp size={16} />
                  1. Shamlar Tahlili (Candles)
                </div>
                <p className="leading-relaxed">
                  Har bir sham ma'lum vaqt oralig'idagi 4 ta asosiy narxni ko'rsatadi: <strong>Open</strong> (ochilish), <strong>High</strong> (maksimal), <strong>Low</strong> (minimal) va <strong>Close</strong> (yopilish). Yashil sham — o'sish, qizil sham — tushish.
                </p>
              </div>

              <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl p-4 space-y-2">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                  <Cpu size={16} />
                  2. AI Signal Algoritmi
                </div>
                <p className="leading-relaxed">
                  Tizim 5 ta mustaqil ko'rsatkichni tahlil qiladi: <strong>EMA(20/50)</strong> trend yo'nalishi, <strong>RSI(14)</strong> qizish darajasi, <strong>MACD</strong> impulsi, <strong>Bollinger Bands</strong> chegaralari va sham modellari (Hammer, Engulfing).
                </p>
              </div>

              <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl p-4 space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                  <ShieldCheck size={16} />
                  3. Risk Menejment (SL / TP)
                </div>
                <p className="leading-relaxed">
                  Hech qachon <strong>Stop-Loss (SL)</strong> siz savdo qilmang. Ilova ATR (bozor tebranishi) ga asoslanib optimal Stop-Loss va kamida 1:2.5 Risk/Mukofot nisbatidagi Take-Profit (TP) darajalarini hisoblab beradi.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
              💡 <strong>Eslatma:</strong> Har qanday statistik tahlil va bashoratli signallar ehtimollik nazariyasiga tayanadi va moliyaviy maslahat emas. Har doim o'z shaxsiy risk menejmentingizga amal qiling.
            </div>
          </div>
        )}
      </main>

      {/* Modallar */}
      <CsvUploaderModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onDataLoaded={handleCustomDataLoaded}
      />

      <ManualCandleModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onAddCandle={handleAddCandle}
        lastCandle={candles[candles.length - 1]}
      />

      <ApkExportModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}

