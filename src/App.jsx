import React, { useState, useEffect, useMemo } from 'react';
import Mt5BottomNav from './components/mt5/Mt5BottomNav';
import QuotesView from './components/views/QuotesView';
import ChartView from './components/views/ChartView';
import SignalsView from './components/views/SignalsView';
import TradeView from './components/views/TradeView';
import HistorySettingsView from './components/views/HistorySettingsView';
import Mt5HistoryView from './components/mt5/Mt5HistoryView';
import MessagesView from './components/mt5/MessagesView';
import NavigationMenu from './components/NavigationMenu';
import CsvUploaderModal from './components/CsvUploaderModal';
import ManualCandleModal from './components/ManualCandleModal';
import ApkExportModal from './components/ApkExportModal';
import { ASSETS, getAssetById, getInitialAssetData, simulateNextCandle } from './utils/sampleData';
import { analyzeMarket } from './utils/signalEngine';
import { Menu } from 'lucide-react';

export default function App() {
  // 5 ta Asosiy Bo'lim: 'QUOTES' | 'CHART' | 'SIGNALS' | 'TRADE' | 'SETTINGS'
  const [activeTab, setActiveTab] = useState('CHART');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('EUR_USD');
  const [customAssetName, setCustomAssetName] = useState(null);
  const [timeframe, setTimeframe] = useState('M5');
  const [chartType, setChartType] = useState('CANDLES'); // 'CANDLES' | 'BARS' | 'LINE'
  
  // MT5 Grafik Asboblari
  const [isCrosshairActive, setIsCrosshairActive] = useState(false);
  const [showOneClick, setShowOneClick] = useState(false);
  const [showIndicators, setShowIndicators] = useState(true);
  
  // Bozor ma'lumotlari
  const [marketData, setMarketData] = useState(() =>
    Object.fromEntries(ASSETS.map(asset => [asset.id, getInitialAssetData(asset.id)]))
  );
  const [customCandles, setCustomCandles] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Savdo portfeli va hisob balansi
  const [balance, setBalance] = useState(100000.00);
  const [openOrders, setOpenOrders] = useState([]);
  const [closedOrders, setClosedOrders] = useState([]);

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
    return getAssetById(selectedAssetId) || ASSETS[0];
  }, [selectedAssetId, customAssetName]);

  const candles = selectedAssetId === 'CUSTOM'
    ? customCandles
    : marketData[selectedAssetId] || marketData[ASSETS[0].id];

  // Aktiv tanlanganda (Kotirovkalar bo'limidan)
  const handleSelectAsset = (assetId) => {
    setSelectedAssetId(assetId);
    if (assetId !== 'CUSTOM') {
      setMarketData(previous => previous[assetId]
        ? previous
        : { ...previous, [assetId]: getInitialAssetData(assetId) });
    }
    if (assetId === 'CUSTOM') setIsLive(false);
    setActiveTab('CHART'); // Avtomatik tarzda grafik ochiladi
  };

  // Jonli bozor tebranishi
  useEffect(() => {
    if (!isLive || selectedAssetId === 'CUSTOM') return;
    const asset = getAssetById(selectedAssetId);
    if (!asset) return;

    const interval = setInterval(() => {
      setMarketData(previous => ({
        ...previous,
        [selectedAssetId]: simulateNextCandle(previous[selectedAssetId], asset.volatility, asset.precision || 2)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive, selectedAssetId]);

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
    const closedOrder = openOrders.find(order => order.id === orderId);
    if (closedOrder) setClosedOrders(previous => [{ ...closedOrder, pnl, closedAt: new Date().toLocaleTimeString().slice(0, 5) }, ...previous]);
    setOpenOrders(prev => prev.filter(o => o.id !== orderId));
    setBalance(prev => Number((prev + pnl).toFixed(2)));
  };

  // CSV yuklanganda
  const handleCustomDataLoaded = (newCandles, assetName) => {
    setCustomAssetName(assetName);
    setSelectedAssetId('CUSTOM');
    setCustomCandles(newCandles);
    setIsLive(false);
    setActiveTab('CHART');
    handleTriggerSignal();
  };

  // Qo'lda yangi sham qo'shilganda
  const handleAddCandle = (newCandle) => {
    if (selectedAssetId === 'CUSTOM') {
      setCustomCandles(previous => [...previous.slice(-85), newCandle]);
    } else {
      setMarketData(previous => ({
        ...previous,
        [selectedAssetId]: [...(previous[selectedAssetId] || []).slice(-85), newCandle]
      }));
    }
    handleTriggerSignal();
  };

  // Qayta tiklash
  const handleRefresh = () => {
    if (selectedAssetId !== 'CUSTOM') {
      setMarketData(previous => ({
        ...previous,
        [selectedAssetId]: getInitialAssetData(selectedAssetId)
      }));
      handleTriggerSignal();
    }
  };

  const lastCandle = candles[candles.length - 1] || { close: 100, open: 100, high: 100, low: 100, volume: 0 };
  const screenTitles = {
    QUOTES: 'Kotirovkalar',
    TRADE: 'Savdo',
    HISTORY: 'Tarix',
    MESSAGES: 'Xabarlar',
    SIGNALS: 'Signallar',
    SETTINGS: 'Sozlamalar'
  };

  return (
    <div className="min-h-[100dvh] bg-white text-[#202124] flex flex-col font-sans pb-[calc(4.5rem+env(safe-area-inset-bottom))] select-none">
      {activeTab !== 'CHART' && (
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-[#e5e7eb] bg-white px-4 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menyuni ochish"
            className="grid size-10 shrink-0 place-items-center text-[#4c5158]"
          >
            <Menu size={24} />
          </button>
          <h1 className="min-w-0 flex-1 text-[17px] font-medium text-[#22252a]">{screenTitles[activeTab]}</h1>
        </header>
      )}

      {/* Asosiy Ishchi Maydon */}
      <main className={`flex-1 w-full mx-auto ${activeTab === 'CHART' ? 'max-w-7xl p-0' : 'max-w-7xl p-2 sm:p-3'}`}>
        {/* 1-BO'LIM: KOTIROVKALAR (Bozor Monitoringi & Toifali Saralash) */}
        {activeTab === 'QUOTES' && (
          <QuotesView
            selectedAssetId={selectedAssetId}
            onSelectAsset={handleSelectAsset}
            customAssetName={customAssetName}
            marketData={marketData}
            customCandles={customCandles}
            onOpenCsvModal={() => setIsCsvModalOpen(true)}
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
            onOpenMenu={() => setIsMenuOpen(true)}
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

        {activeTab === 'HISTORY' && (
          <Mt5HistoryView
            openOrders={openOrders}
            closedOrders={closedOrders}
            balance={balance}
            onNavigateToTrade={() => setActiveTab('TRADE')}
          />
        )}

        {activeTab === 'MESSAGES' && <MessagesView />}

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
        balance={balance}
      />

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
