/**
 * Bozor turlari uchun realistik sham ma'lumotlari (Candle Data)
 */

function generateInitialCandles(basePrice, volatility, count = 70, trend = 0.001, precision = 2) {
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
      open: Number(open.toFixed(precision)),
      high: Number(high.toFixed(precision)),
      low: Number(low.toFixed(precision)),
      close: Number(close.toFixed(precision)),
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
  { id: 'FOREX', label: 'Forex' },
  { id: 'METALS', label: 'Metall' },
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
    category: 'METALS',
    categoryLabel: 'Metall',
    basePrice: 2740,
    volatility: 0.008,
    unit: '$'
  },
  {
    id: 'EUR_USD',
    name: 'Evro / AQSh Dollari',
    symbol: 'EUR/USD',
    category: 'FOREX',
    categoryLabel: 'Forex',
    basePrice: 1.0845,
    volatility: 0.004,
    unit: '$',
    precision: 5
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
    categoryLabel: 'UZSE (Mahalliy)',
    basePrice: 8450,
    volatility: 0.012,
    unit: "so'm"
  },
  {
    id: 'UZSE_HMKB',
    name: 'Hamkorbank ATB',
    symbol: 'HMKB (UZSE)',
    category: 'UZSE',
    categoryLabel: 'UZSE (Mahalliy)',
    basePrice: 42.00,
    volatility: 0.015,
    unit: "so'm"
  }
];

const ASSET_FOLDERS = [
  { id: 'CRYPTO', label: 'Kripto', category: 'CRYPTO', categoryLabel: 'Kripto', basePrice: 125, unit: '$', precision: 3, volatility: 0.025, assets: ['BTC_USDT', 'ETH_USDT'] },
  { id: 'FOREX', label: 'Forex', category: 'FOREX', categoryLabel: 'Forex', basePrice: 1.12, unit: '$', precision: 5, volatility: 0.004, assets: ['EUR_USD'] },
  { id: 'INDICES', label: 'Indekslar', category: 'STOCKS', categoryLabel: 'Aksiyalar', basePrice: 4200, unit: '$', precision: 2, volatility: 0.012, assets: [] },
  { id: 'METALS', label: 'Metall', category: 'METALS', categoryLabel: 'Metall', basePrice: 2750, unit: '$', precision: 2, volatility: 0.01, assets: ['XAU_USD'] },
  { id: 'NASDAQ', label: 'Nasdaq', category: 'STOCKS', categoryLabel: 'Aksiyalar', basePrice: 185, unit: '$', precision: 2, volatility: 0.018, assets: ['AAPL', 'TSLA'] },
  { id: 'STOCKS', label: 'Aksiyalar', category: 'STOCKS', categoryLabel: 'Aksiyalar', basePrice: 95, unit: '$', precision: 2, volatility: 0.02, assets: ['AAPL', 'TSLA'] },
  { id: 'UZSE', label: 'UZSE mahalliy', category: 'UZSE', categoryLabel: 'UZSE (Mahalliy)', basePrice: 5000, unit: "so'm", precision: 2, volatility: 0.015, assets: ['UZSE_OKMK', 'UZSE_HMKB'] }
];

const generatedAssetCatalogs = new Map();
const generatedAssetsById = new Map();

export const ASSET_FOLDERS_LIST = ASSET_FOLDERS.map(({ id, label }) => ({ id, label, total: 1000 }));

export function getAssetFolderAssets(folderId) {
  const cachedAssets = generatedAssetCatalogs.get(folderId);
  if (cachedAssets) return cachedAssets;

  const folder = ASSET_FOLDERS.find(item => item.id === folderId);
  if (!folder) return [];

  const assets = folder.assets
    .map(id => ASSETS.find(asset => asset.id === id))
    .filter(Boolean);

  for (let index = 1; assets.length < 1000; index += 1) {
    const serial = String(index).padStart(4, '0');
    const id = `DEMO_${folder.id}_${serial}`;
    const variation = ((index * 37) % 1000) / 1000;
    const asset = {
      id,
      name: `${folder.label} namuna bozori ${serial}`,
      symbol: `${folder.id}-${serial}`,
      category: folder.category,
      categoryLabel: folder.categoryLabel,
      basePrice: Number((folder.basePrice * (0.5 + variation)).toFixed(folder.precision)),
      volatility: folder.volatility,
      unit: folder.unit,
      precision: folder.precision,
      isDemo: true
    };
    assets.push(asset);
    generatedAssetsById.set(id, asset);
  }

  generatedAssetCatalogs.set(folderId, assets);
  return assets;
}

export function getAssetById(assetId) {
  const knownAsset = ASSETS.find(asset => asset.id === assetId);
  if (knownAsset) return knownAsset;
  if (generatedAssetsById.has(assetId)) return generatedAssetsById.get(assetId);

  const match = /^DEMO_([A-Z]+)_\d{4}$/.exec(assetId || '');
  if (!match) return undefined;
  getAssetFolderAssets(match[1]);
  return generatedAssetsById.get(assetId);
}

export function getInitialAssetData(assetId) {
  const asset = getAssetById(assetId) || ASSETS[0];
  return generateInitialCandles(asset.basePrice, asset.volatility, 65, 0.001, asset.precision || 2);
}

/**
 * Jonli simulyatsiya: yangi sham (tick)
 */
export function simulateNextCandle(prevCandles, volatility = 0.008, precision = 2) {
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
    open: Number(open.toFixed(precision)),
    high: Number(high.toFixed(precision)),
    low: Number(low.toFixed(precision)),
    close: Number(close.toFixed(precision)),
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
