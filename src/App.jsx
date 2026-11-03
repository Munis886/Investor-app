import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import NavigationMenu from './components/NavigationMenu';
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
  TrendingDown,
  Cpu,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function App() {
  const [selectedAssetId, setSelectedAssetId] = useState('BTC_USDT');
  const [customAssetName, setCustomAssetName] = useState(null);
  const [candles, setCandles] = useState(() => getInitialAssetData('BTC_USDT'));
  const [isLive, setIsLive] = useState(false);
  const [activeTab, setActiveTab] = useState('CHART'); // 'CHART' | 'BACKTEST' | 'GUIDE'
  const [isScanning, setIsScanning] = useState(false);

  // Modallar va Menyu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Tanlangan aktiv
  const currentAsset = useMemo(() => {
    if (selectedAssetId === 'CUSTOM') {
      return {
        id: 'CUSTOM',
        name: customAssetName || "Yuklangan Statistika",
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

  // Jonli bozor simulyatsiyasi
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCandles(prev => simulateNextCandle(prev, 0.007));
    }, 2500);
    return () => clearInterval(interval);
  }, [isLive]);

  // Bozor tahlili va signallar hisobi
  const signal = useMemo(() => {
    return analyzeMarket(candles);
  }, [candles]);

  // Signal Olish harakati (Scanning animatsiyasi bilan)
  const handleTriggerSignal = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Agar boshqa tabda bo'lsa, avtomatik ravishda grafik/signal bo'limiga qaytarish
      setActiveTab('CHART');
    }, 700);
  };

  // CSV yuklanganda
  const handleCustomDataLoaded = (newCandles, assetName) => {
    setCustomAssetName(assetName);
    setSelectedAssetId('CUSTOM');
    setCandles(newCandles);
    setIsLive(false);
    handleTriggerSignal();
  };

  // Qo'lda sham qo'shilganda
  const handleAddCandle = (newCandle) => {
    setCandles(prev => [...prev.slice(-90), newCandle]);
    handleTriggerSignal();
  };

  // Qayta tiklash
  const handleRefresh = () => {
    if (selectedAssetId !== 'CUSTOM') {
      setCandles(getInitialAssetData(selectedAssetId));
      handleTriggerSignal();
    }
  };

  // Statistik hisoblar (Ticker)
  const lastCandle = candles[candles.length - 1] || { close: 100, open: 100, high: 100, low: 100, volume: 0 };
  const firstCandle = candles[0] || lastCandle;
  const priceChange = lastCandle.close - firstCandle.close;
  const priceChangePercent = Number(((priceChange / firstCandle.close) * 100).toFixed(2));
  const isPositive = priceChangePercent >= 0;

  // 24s min / max
  const high24h = Math.max(...candles.map(c => c.high));
  const low24h = Math.min(...candles.map(c => c.low));
  const totalVolume = candles.reduce((acc, c) => acc + c.volume, 0);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans pb-10">
      {/* 1. Tartibli Yuqori Panel (Header) */}
      <Header
        selectedAssetId={selectedAssetId}
        onSelectAsset={handleSelectAsset}
        customAssetName={customAssetName}
        currentPrice={lastCandle.close}
        priceChangePercent={priceChangePercent}
        unit={currentAsset.unit}
        onOpenMenu={() => setIsMenuOpen(true)}
        onTriggerSignal={handleTriggerSignal}
        isScanning={isScanning}
      />

      {/* Ochiluvchi Boshqaruv Menyusi (Menu Drawer) */}
      <NavigationMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isLive={isLive}
        onToggleLive={() => setIsLive(!isLive)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onRefreshData={handleRefresh}
        onTriggerSignal={handleTriggerSignal}
      />

      {/* Asosiy Tana */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* 2. Ticker Paneli: Aktiv statistikasi va narx diapazoni */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
          {/* Chap: Aktiv nomi va joriy narx */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center font-black text-sm text-indigo-300">
              {currentAsset.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">{currentAsset.name}</h1>
                <span className="text-xs text-gray-400 font-mono">({currentAsset.symbol})</span>
                {isLive && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                    JONLI
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-black font-mono text-emerald-400">
                  {lastCandle.close} <span className="text-xs font-sans text-gray-400">{currentAsset.unit}</span>
                </span>
                <span className={`flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                  isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                }`}>
                  {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {isPositive ? `+${priceChangePercent}%` : `${priceChangePercent}%`}
                </span>
              </div>
            </div>
          </div>

          {/* O'ng: Statistik ko'rsatkichlar (Max, Min, Hajm, RSI) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-xs w-full lg:w-auto">
            <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl px-3 py-2">
              <span className="text-[10px] text-gray-400 block uppercase">24s Maksimal</span>
              <span className="font-mono font-bold text-gray-200">{high24h} {currentAsset.unit}</span>
            </div>
            <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl px-3 py-2">
              <span className="text-[10px] text-gray-400 block uppercase">24s Minimal</span>
              <span className="font-mono font-bold text-gray-200">{low24h} {currentAsset.unit}</span>
            </div>
            <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl px-3 py-2">
              <span className="text-[10px] text-gray-400 block uppercase">Jami Hajm</span>
              <span className="font-mono font-bold text-gray-200">{totalVolume.toLocaleString()}</span>
            </div>
            <div className="bg-[#1e293b]/50 border border-gray-800 rounded-xl px-3 py-2">
              <span className="text-[10px] text-gray-400 block uppercase">RSI Ko'rsatkichi</span>
              <span className="font-mono font-bold text-yellow-400">{signal?.currentRsi || 50}</span>
            </div>
          </div>
        </div>

        {/* 3. Asosiy Bo'limlar Navigatsiyasi (Tablar) va Katta "Signal Olish" paneli */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
          {/* Tablar */}
          <div className="flex items-center gap-1.5 bg-[#111827] p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveTab('CHART')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'CHART'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart2 size={14} />
              <span>Grafik va Signal</span>
            </button>

            <button
              onClick={() => setActiveTab('BACKTEST')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'BACKTEST'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <History size={14} />
              <span>Backtest Sinovi</span>
            </button>

            <button
              onClick={() => setActiveTab('GUIDE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === 'GUIDE'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <HelpCircle size={14} />
              <span>Qo'llanma</span>
            </button>
          </div>

          {/* SIGNAL OLISH MAXSUS TUGMASI */}
          <button
            onClick={handleTriggerSignal}
            disabled={isScanning}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition transform active:scale-95"
          >
            <Zap size={16} className={isScanning ? "animate-spin text-yellow-300" : "text-yellow-300 fill-yellow-300"} />
            <span>{isScanning ? "AI Shamlar tahlil qilinmoqda..." : "⚡ Yangi Signal Olish"}</span>
          </button>
        </div>

        {/* 4. TAB 1: Shamli Grafik & Signal Kartasi */}
        {activeTab === 'CHART' && (
          <div className="space-y-4">
            {/* Shamli Grafik */}
            <CandleChart
              candles={candles}
              asset={currentAsset}
              signal={signal}
            />

            {/* AI Signal Kartasi */}
            <SignalCard
              signal={signal}
              currentPrice={lastCandle.close}
              unit={currentAsset.unit}
              onTriggerSignal={handleTriggerSignal}
              isScanning={isScanning}
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
