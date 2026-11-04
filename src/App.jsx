import React, { useState, useEffect, useMemo } from 'react';
import Mt5BottomNav from './components/mt5/Mt5BottomNav';
import QuotesView from './components/views/QuotesView';
import ChartView from './components/views/ChartView';
import SignalsView from './components/views/SignalsView';
import TradeView from './components/views/TradeView';
import HistorySettingsView from './components/views/HistorySettingsView';
import CsvUploaderModal from './components/CsvUploaderModal';
import ManualCandleModal from './components/ManualCandleModal';
import ApkExportModal from './components/ApkExportModal';
import { ASSETS, getInitialAssetData, simulateNextCandle } from './utils/sampleData';
import { analyzeMarket } from './utils/signalEngine';

export default function App() {
  // 5 ta Asosiy Bo'lim: 'QUOTES' | 'CHART' | 'SIGNALS' | 'TRADE' | 'SETTINGS'
  const [activeTab, setActiveTab] = useState('CHART');
  const [selectedAssetId, setSelectedAssetId] = useState('BTC_USDT');
  const [customAssetName, setCustomAssetName] = useState(null);
  const [timeframe, setTimeframe] = useState('H1');
  const [chartType, setChartType] = useState('CANDLES'); // 'CANDLES' | 'BARS' | 'LINE'
  
  // MT5 Grafik Asboblari
  const [isCrosshairActive, setIsCrosshairActive] = useState(false);
  const [showOneClick, setShowOneClick] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  
  // Bozor ma'lumotlari
  const [candles, setCandles] = useState(() => getInitialAssetData('BTC_USDT'));
  const [isLive, setIsLive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Savdo portfeli va hisob balansi
  const [balance, setBalance] = useState(10000.00);
  const [openOrders, setOpenOrders] = useState([
    {
      id: 101,
      symbol: 'BTC/USDT',
      type: 'BUY',
      lot: 0.10,
      entryPrice: 87100.00,
      time: '14:20'
    }
  ]);

  // Modallar
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
        unit: '$',
        volatility: 0.015
      };
    }
    return ASSETS.find(a => a.id === selectedAssetId) || ASSETS[0];
  }, [selectedAssetId, customAssetName]);

  // Aktiv tanlanganda (Kotirovkalar bo'limidan)
  const handleSelectAsset = (assetId) => {
    setSelectedAssetId(assetId);
    if (assetId !== 'CUSTOM') {
      setCandles(getInitialAssetData(assetId));
    }
    setActiveTab('CHART'); // Avtomatik tarzda grafik ochiladi
  };

  // Jonli bozor tebranishi
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCandles(prev => simulateNextCandle(prev, 0.006));
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Bozor tahlili va signallar
  const signal = useMemo(() => {
    return analyzeMarket(candles);
  }, [candles]);

  // Signal Olish harakati
  const handleTriggerSignal = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  // Yangi order ochish (One-Click yoki Savdo bo'limidan)
  const handleOpenOrder = (newOrder) => {
    setOpenOrders(prev => [newOrder, ...prev]);
  };

  const handleQuickTrade = (type, lot = 0.1) => {
    const last = candles[candles.length - 1];
    const newOrder = {
      id: Date.now(),
      symbol: currentAsset.symbol,
      type,
      lot,
      entryPrice: last ? last.close : 100,
      time: new Date().toLocaleTimeString().slice(0, 5)
    };
    handleOpenOrder(newOrder);
  };

  // Pozitsiyani yopish
  const handleCloseOrder = (orderId, pnl) => {
    setOpenOrders(prev => prev.filter(o => o.id !== orderId));
    setBalance(prev => Number((prev + pnl).toFixed(2)));
  };

  // CSV yuklanganda
  const handleCustomDataLoaded = (newCandles, assetName) => {
    setCustomAssetName(assetName);
    setSelectedAssetId('CUSTOM');
    setCandles(newCandles);
    setIsLive(false);
    setActiveTab('CHART');
    handleTriggerSignal();
  };

  // Qo'lda yangi sham qo'shilganda
  const handleAddCandle = (newCandle) => {
    setCandles(prev => [...prev.slice(-85), newCandle]);
    handleTriggerSignal();
  };

  // Qayta tiklash
  const handleRefresh = () => {
    if (selectedAssetId !== 'CUSTOM') {
      setCandles(getInitialAssetData(selectedAssetId));
      handleTriggerSignal();
    }
  };

  const lastCandle = candles[candles.length - 1] || { close: 100, open: 100, high: 100, low: 100, volume: 0 };

  return (
    <div className="min-h-screen bg-[#06080d] text-gray-100 flex flex-col font-sans pb-14 select-none">
      {/* Asosiy Ishchi Maydon */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-3">
        {/* 1-BO'LIM: KOTIROVKALAR (Bozor Monitoringi & Toifali Saralash) */}
        {activeTab === 'QUOTES' && (
          <QuotesView
            selectedAssetId={selectedAssetId}
            onSelectAsset={handleSelectAsset}
            customAssetName={customAssetName}
          />
        )}

        {/* 2-BO'LIM: INTERAKTIV GRAFIK (Toza Visual Maydon & Mini Signal Tizeri) */}
        {activeTab === 'CHART' && (
          <ChartView
            candles={candles}
            asset={currentAsset}
            signal={signal}
            timeframe={timeframe}
            onSelectTimeframe={setTimeframe}
            chartType={chartType}
            onChangeChartType={setChartType}
            isCrosshairActive={isCrosshairActive}
            onToggleCrosshair={() => setIsCrosshairActive(!isCrosshairActive)}
            showOneClick={showOneClick}
            onToggleOneClick={() => setShowOneClick(!showOneClick)}
            showIndicators={showIndicators}
            onToggleIndicators={() => setShowIndicators(!showIndicators)}
            onTriggerSignal={handleTriggerSignal}
            isScanning={isScanning}
            onNavigateToSignals={() => setActiveTab('SIGNALS')}
            onQuickTrade={handleQuickTrade}
          />
        )}

        {/* 3-BO'LIM: AI TAHLIL VA SAVDO SIGNALLARI */}
        {activeTab === 'SIGNALS' && (
          <SignalsView
            symbol={currentAsset.symbol}
            currentPrice={lastCandle.close}
            signal={signal}
            unit={currentAsset.unit}
            onTriggerSignal={handleTriggerSignal}
            isScanning={isScanning}
            onNavigateToTrade={() => setActiveTab('TRADE')}
          />
        )}

        {/* 4-BO'LIM: SAVDO VA PORTFEL BOSHQARUVI */}
        {activeTab === 'TRADE' && (
          <TradeView
            symbol={currentAsset.symbol}
            currentPrice={lastCandle.close}
            unit={currentAsset.unit}
            openOrders={openOrders}
            onOpenOrder={handleOpenOrder}
            onCloseOrder={handleCloseOrder}
            balance={balance}
          />
        )}

        {/* 5-BO'LIM: STATISTIKA, TARIX VA SOZLAMALAR */}
        {activeTab === 'SETTINGS' && (
          <HistorySettingsView
            candles={candles}
            unit={currentAsset.unit}
            isLive={isLive}
            onToggleLive={() => setIsLive(!isLive)}
            onOpenCsvModal={() => setIsCsvModalOpen(true)}
            onOpenManualModal={() => setIsManualModalOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onRefreshData={handleRefresh}
          />
        )}
      </main>

      {/* MetaTrader 5 Pastki 5 ta Bo'lim Navigatsiya Paneli */}
      <Mt5BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

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
        lastCandle={lastCandle}
      />

      <ApkExportModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
