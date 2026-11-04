/**
 * Bozor turlari uchun realistik sham ma'lumotlari (Candle Data)
 */

function generateInitialCandles(basePrice, volatility, count = 70, trend = 0.001) {
  const candles = [];
  let currentPrice = basePrice;
  const now = new Date();
  
  // 1 soatlik qadamlar bilan orqaga
  const stepMinutes = 60; 
  let timeCursor = new Date(now.getTime() - count * stepMinutes * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const timeStr = timeCursor.toISOString().replace('T', ' ').slice(0, 16);
    
    // Tasodifiy tebranish + trend
    const changePercent = (Math.random() - 0.48) * volatility + trend;
    const open = currentPrice;
    const close = Math.max(open * 0.5, open * (1 + changePercent));
    
    const highSurge = Math.random() * volatility * 0.6 * open;
    const lowSurge = Math.random() * volatility * 0.6 * open;
    const high = Math.max(open, close) + highSurge;
    const low = Math.min(open, close) - lowSurge;
    
    const volume = Math.floor(Math.random() * 5000 + 1000) * (open > close ? 1.2 : 1.5);

    candles.push({
      time: timeStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(volume)
    });

    currentPrice = close;
    timeCursor = new Date(timeCursor.getTime() + stepMinutes * 60 * 1000);
  }

  return candles;
}

export const ASSET_CATEGORIES = [
  { id: 'ALL', label: 'Barchasi' },
  { id: 'CRYPTO', label: 'Kripto' },
  { id: 'FOREX_METAL', label: 'Forex & Metall' },
  { id: 'STOCKS', label: 'Aksiyalar' },
  { id: 'UZSE', label: 'UZSE (Mahalliy)' }
];

export const ASSETS = [
  {
    id: 'BTC_USDT',
    name: 'Bitcoin',
    symbol: 'BTC/USDT',
    category: 'CRYPTO',
    categoryLabel: 'Kripto',
    basePrice: 87400,
    volatility: 0.022,
    unit: '$'
  },
  {
    id: 'ETH_USDT',
    name: 'Ethereum',
    symbol: 'ETH/USDT',
    category: 'CRYPTO',
    categoryLabel: 'Kripto',
    basePrice: 3150,
    volatility: 0.028,
    unit: '$'
  },
  {
    id: 'XAU_USD',
    name: 'Oltin (Gold)',
    symbol: 'XAU/USD',
    category: 'FOREX_METAL',
    categoryLabel: 'Forex & Metall',
    basePrice: 2740,
    volatility: 0.008,
    unit: '$'
  },
  {
    id: 'EUR_USD',
    name: 'Evro / AQSh Dollari',
    symbol: 'EUR/USD',
    category: 'FOREX_METAL',
    categoryLabel: 'Forex & Metall',
    basePrice: 1.0845,
    volatility: 0.004,
    unit: '$'
  },
  {
    id: 'AAPL',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    category: 'STOCKS',
    categoryLabel: 'Aksiyalar',
    basePrice: 232.50,
    volatility: 0.014,
    unit: '$'
  },
  {
    id: 'TSLA',
    name: 'Tesla Inc.',
    symbol: 'TSLA',
    category: 'STOCKS',
    categoryLabel: 'Aksiyalar',
    basePrice: 248.80,
    volatility: 0.032,
    unit: '$'
  },
  {
    id: 'UZSE_OKMK',
    name: "O'zmetkombinat",
    symbol: 'UZMK (UZSE)',
    category: 'UZSE',
    categoryLabel: 'UZSE',
    basePrice: 8450,
    volatility: 0.012,
    unit: "so'm"
  },
  {
    id: 'UZSE_HMKB',
    name: 'Hamkorbank ATB',
    symbol: 'HMKB (UZSE)',
    category: 'UZSE',
    categoryLabel: 'UZSE',
    basePrice: 42.00,
    volatility: 0.015,
    unit: "so'm"
  }
];

export function getInitialAssetData(assetId) {
  const asset = ASSETS.find(a => a.id === assetId) || ASSETS[0];
  return generateInitialCandles(asset.basePrice, asset.volatility, 65);
}

/**
 * Jonli simulyatsiya: yangi sham (tick)
 */
export function simulateNextCandle(prevCandles, volatility = 0.008) {
  if (!prevCandles || prevCandles.length === 0) return prevCandles;
  
  const last = prevCandles[prevCandles.length - 1];
  const now = new Date();
  const timeStr = now.toISOString().replace('T', ' ').slice(0, 16);

  const changePercent = (Math.random() - 0.49) * volatility;
  const open = last.close;
  const close = open * (1 + changePercent);
  const high = Math.max(open, close) + Math.random() * volatility * 0.5 * open;
  const low = Math.min(open, close) - Math.random() * volatility * 0.5 * open;
  const volume = Math.floor(Math.random() * 4000 + 800);

  const newCandle = {
    time: timeStr,
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
    volume
  };

  return [...prevCandles.slice(-85), newCandle];
}

/**
 * CSV matnini parser qilish
 */
export function parseCSVData(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) throw new Error("CSV fayl bo'sh yoki noto'g'ri formatda.");

  const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/['"]/g, ''));
  
  const dateIdx = header.findIndex(h => h.includes('date') || h.includes('time') || h.includes('sana') || h.includes('vaqt'));
  const openIdx = header.findIndex(h => h === 'open' || h === 'ochilish' || h === 'o');
  const highIdx = header.findIndex(h => h === 'high' || h === 'maks' || h === 'h');
  const lowIdx = header.findIndex(h => h === 'low' || h === 'min' || h === 'l');
  const closeIdx = header.findIndex(h => h === 'close' || h === 'yopilish' || h === 'c');
  const volIdx = header.findIndex(h => h === 'volume' || h === 'hajm' || h === 'vol' || h === 'v');

  if (openIdx === -1 || closeIdx === -1) {
    throw new Error("CSV faylda kamida 'open' va 'close' (ochilish/yopilish narxi) ustunlari bo'lishi kerak.");
  }

  const candles = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim().replace(/['"]/g, ''));
    if (row.length < 2 || !row[openIdx]) continue;

    const open = parseFloat(row[openIdx]);
    const close = parseFloat(row[closeIdx]);
    const high = highIdx !== -1 && row[highIdx] ? parseFloat(row[highIdx]) : Math.max(open, close);
    const low = lowIdx !== -1 && row[lowIdx] ? parseFloat(row[lowIdx]) : Math.min(open, close);
    const volume = volIdx !== -1 && row[volIdx] ? parseFloat(row[volIdx]) : 1000;
    const time = dateIdx !== -1 && row[dateIdx] ? row[dateIdx] : `Sham ${i}`;

    if (!isNaN(open) && !isNaN(close)) {
      candles.push({
        time,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: isNaN(volume) ? 1000 : Math.floor(volume)
      });
    }
  }

  if (candles.length < 5) {
    throw new Error("Yaroqli sham ma'lumotlari soni kamida 5 ta bo'lishi shart.");
  }

  return candles;
}
