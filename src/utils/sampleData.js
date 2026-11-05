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

const makeAsset = (id, name, symbol, category, categoryLabel, basePrice, volatility, unit = '$', precision = 2, peRatio) => ({
  id,
  name,
  symbol,
  category,
  categoryLabel,
  basePrice,
  volatility,
  unit,
  precision,
  ...(peRatio === undefined ? {} : { peRatio })
});

const cryptoAssets = [
  ['BNB_USDT', 'BNB', 610, 0.025, 2],
  ['SOL_USDT', 'Solana', 185, 0.035, 3],
  ['XRP_USDT', 'XRP', 2.4, 0.04, 4],
  ['ADA_USDT', 'Cardano', 0.72, 0.04, 5],
  ['DOGE_USDT', 'Dogecoin', 0.19, 0.05, 5],
  ['TRX_USDT', 'TRON', 0.25, 0.025, 5],
  ['LINK_USDT', 'Chainlink', 15, 0.035, 3],
  ['LTC_USDT', 'Litecoin', 85, 0.03, 3],
  ['BCH_USDT', 'Bitcoin Cash', 350, 0.035, 2],
  ['DOT_USDT', 'Polkadot', 4.5, 0.04, 4],
  ['AVAX_USDT', 'Avalanche', 35, 0.04, 3],
  ['XLM_USDT', 'Stellar', 0.11, 0.035, 5],
  ['TON_USDT', 'Toncoin', 5.2, 0.04, 4],
  ['SHIB_USDT', 'Shiba Inu', 0.000018, 0.05, 8],
  ['UNI_USDT', 'Uniswap', 9, 0.04, 3],
  ['ETC_USDT', 'Ethereum Classic', 18, 0.035, 3],
  ['NEAR_USDT', 'NEAR Protocol', 5, 0.045, 4],
  ['APT_USDT', 'Aptos', 8, 0.045, 4],
  ['ARB_USDT', 'Arbitrum', 0.55, 0.05, 5],
  ['OP_USDT', 'Optimism', 1.6, 0.045, 4],
  ['SUI_USDT', 'Sui', 3.2, 0.05, 4],
  ['PEPE_USDT', 'Pepe', 0.000012, 0.06, 8],
  ['HBAR_USDT', 'Hedera', 0.2, 0.04, 5],
  ['FIL_USDT', 'Filecoin', 4.5, 0.045, 4],
  ['ATOM_USDT', 'Cosmos', 5.5, 0.04, 4],
  ['ICP_USDT', 'Internet Computer', 10, 0.045, 3],
  ['INJ_USDT', 'Injective', 25, 0.05, 3],
  ['RENDER_USDT', 'Render', 7, 0.05, 4],
  ['AAVE_USDT', 'Aave', 120, 0.04, 2],
  ['TAO_USDT', 'Bittensor', 400, 0.05, 2],
  ['CRO_USDT', 'Cronos', 0.1, 0.04, 5],
  ['VET_USDT', 'VeChain', 0.03, 0.04, 5],
  ['ALGO_USDT', 'Algorand', 0.2, 0.04, 5],
  ['SEI_USDT', 'Sei', 0.3, 0.05, 5],
  ['MNT_USDT', 'Mantle', 0.8, 0.045, 4],
  ['ONDO_USDT', 'Ondo', 1.1, 0.05, 4],
  ['FET_USDT', 'Artificial Superintelligence', 1.3, 0.05, 4],
  ['GRT_USDT', 'The Graph', 0.16, 0.045, 5],
  ['EOS_USDT', 'EOS', 0.6, 0.04, 4],
  ['XTZ_USDT', 'Tezos', 0.75, 0.04, 4],
  ['EGLD_USDT', 'MultiversX', 22, 0.045, 3],
  ['THETA_USDT', 'Theta Network', 1.4, 0.045, 4],
  ['KAS_USDT', 'Kaspa', 0.12, 0.05, 5],
  ['RUNE_USDT', 'THORChain', 3.5, 0.05, 4],
  ['JUP_USDT', 'Jupiter', 0.8, 0.05, 4],
  ['WLD_USDT', 'Worldcoin', 1.7, 0.05, 4],
  ['IMX_USDT', 'Immutable', 1.1, 0.045, 4],
  ['MKR_USDT', 'Maker', 1500, 0.035, 2],
  ['PENDLE_USDT', 'Pendle', 4, 0.05, 4],
  ['CRV_USDT', 'Curve DAO', 0.55, 0.05, 5],
  ['SAND_USDT', 'The Sandbox', 0.35, 0.05, 5],
  ['MANA_USDT', 'Decentraland', 0.4, 0.05, 4],
  ['AXS_USDT', 'Axie Infinity', 4.5, 0.05, 4],
  ['FLOW_USDT', 'Flow', 0.65, 0.05, 4],
  ['QNT_USDT', 'Quant', 100, 0.04, 3],
  ['ZEC_USDT', 'Zcash', 35, 0.045, 3],
  ['DASH_USDT', 'Dash', 25, 0.045, 3],
  ['KAVA_USDT', 'Kava', 0.55, 0.045, 5],
  ['IOTA_USDT', 'IOTA', 0.2, 0.045, 5],
  ['LDO_USDT', 'Lido DAO', 1.5, 0.05, 4],
  ['ENS_USDT', 'Ethereum Name Service', 20, 0.045, 3],
  ['COMP_USDT', 'Compound', 55, 0.045, 3],
  ['SNX_USDT', 'Synthetix', 1.5, 0.05, 4],
  ['BAT_USDT', 'Basic Attention Token', 0.2, 0.045, 5],
  ['ZIL_USDT', 'Zilliqa', 0.02, 0.05, 6],
  ['ENJ_USDT', 'Enjin Coin', 0.15, 0.05, 5],
  ['CHZ_USDT', 'Chiliz', 0.08, 0.05, 5],
  ['GALA_USDT', 'Gala', 0.03, 0.055, 5],
  ['1INCH_USDT', '1inch', 0.3, 0.05, 5],
  ['JASMY_USDT', 'JasmyCoin', 0.02, 0.055, 6],
  ['WIF_USDT', 'dogwifhat', 1.2, 0.06, 4],
  ['BONK_USDT', 'Bonk', 0.000025, 0.06, 8],
  ['FLOKI_USDT', 'FLOKI', 0.00015, 0.06, 7]
].map(([id, name, price, volatility, precision]) =>
  makeAsset(id, name, `${id.replace('_USDT', '')}/USDT`, 'CRYPTO', 'Kripto', price, volatility, '$', precision)
);

const stockAssets = [
  ['AAPL', 'Apple Inc.', 232.50, 0.014, 37],
  ['TSLA', 'Tesla Inc.', 248.80, 0.032, 70],
  ['MSFT', 'Microsoft Corp.', 425, 0.018, 35],
  ['NVDA', 'NVIDIA Corp.', 140, 0.03, 55],
  ['AMZN', 'Amazon.com Inc.', 215, 0.022, 38],
  ['GOOGL', 'Alphabet Inc.', 190, 0.02, 22],
  ['META', 'Meta Platforms Inc.', 680, 0.025, 28],
  ['BRK_B', 'Berkshire Hathaway B', 500, 0.012, 10],
  ['LLY', 'Eli Lilly and Co.', 780, 0.022, 45],
  ['JPM', 'JPMorgan Chase & Co.', 300, 0.018, 12],
  ['AVGO', 'Broadcom Inc.', 230, 0.025, 36],
  ['COST', 'Costco Wholesale Corp.', 980, 0.018, 55],
  ['WMT', 'Walmart Inc.', 95, 0.016, 38],
  ['V', 'Visa Inc.', 350, 0.016, 32],
  ['MA', 'Mastercard Inc.', 560, 0.018, 38],
  ['ORCL', 'Oracle Corp.', 180, 0.022, 40],
  ['NFLX', 'Netflix Inc.', 950, 0.028, 50],
  ['AMD', 'Advanced Micro Devices', 165, 0.03, 110],
  ['CRM', 'Salesforce Inc.', 290, 0.022, 45],
  ['ADBE', 'Adobe Inc.', 450, 0.022, 35],
  ['KO', 'Coca-Cola Co.', 70, 0.012, 28],
  ['PEP', 'PepsiCo Inc.', 145, 0.014, 24],
  ['DIS', 'Walt Disney Co.', 110, 0.02, 40],
  ['NKE', 'Nike Inc.', 75, 0.022, 25],
  ['INTC', 'Intel Corp.', 25, 0.03, 0],
  ['CSCO', 'Cisco Systems Inc.', 60, 0.016, 25],
  ['IBM', 'International Business Machines', 260, 0.018, 36],
  ['QCOM', 'Qualcomm Inc.', 165, 0.022, 18],
  ['TXN', 'Texas Instruments Inc.', 200, 0.018, 35],
  ['UBER', 'Uber Technologies Inc.', 80, 0.025, 18],
  ['PYPL', 'PayPal Holdings Inc.', 75, 0.025, 18],
  ['SHOP', 'Shopify Inc.', 110, 0.03, 75],
  ['PLTR', 'Palantir Technologies Inc.', 100, 0.04, 190],
  ['SNOW', 'Snowflake Inc.', 170, 0.035, 0],
  ['ABNB', 'Airbnb Inc.', 135, 0.025, 35],
  ['BABA', 'Alibaba Group', 120, 0.025, 18],
  ['PFE', 'Pfizer Inc.', 26, 0.018, 14],
  ['T', 'AT&T Inc.', 24, 0.014, 12],
  ['F', 'Ford Motor Co.', 11, 0.025, 12],
  ['GM', 'General Motors Co.', 50, 0.025, 6],
  ['SONY', 'Sony Group Corp.', 25, 0.02, 18],
  ['SPOT', 'Spotify Technology', 600, 0.03, 100],
  ['MCD', "McDonald's Corp.", 300, 0.016, 26],
  ['HD', 'Home Depot Inc.', 400, 0.018, 26],
  ['CAT', 'Caterpillar Inc.', 350, 0.02, 18],
  ['BA', 'Boeing Co.', 180, 0.03, 0],
  ['GS', 'Goldman Sachs Group', 600, 0.022, 15],
  ['XOM', 'Exxon Mobil Corp.', 115, 0.016, 14],
  ['CVX', 'Chevron Corp.', 155, 0.016, 16],
  ['TMO', 'Thermo Fisher Scientific', 550, 0.018, 30],
  ['UNH', 'UnitedHealth Group', 500, 0.022, 20]
].map(([id, name, price, volatility, peRatio]) =>
  makeAsset(id, name, id.replace('_', '.'), 'STOCKS', 'Aksiyalar', price, volatility, '$', 2, peRatio || undefined)
);

const uzseAssets = [
  ['UZSE_OKMK', "O'zmetkombinat", 'UZMK', 8450, 0.012, 8],
  ['UZSE_HMKB', 'Hamkorbank ATB', 'HMKB', 42, 0.015, 5],
  ['UZSE_QZSM', 'Qizilqumsement AJ', 'QZSM', 1450, 0.018, 7],
  ['UZSE_UZMK', "O'zbekiston metallurgiya kombinati", 'UZMT', 12500, 0.016, 9],
  ['UZSE_NVPZ', 'Navoiyazot AJ', 'NVPZ', 7200, 0.018, 10],
  ['UZSE_UZTL', 'O‘zbektelekom AK', 'UZTL', 68000, 0.014, 6],
  ['UZSE_KKSM', 'Qo‘qon mexanika zavodi AJ', 'KKSM', 3200, 0.02, 8],
  ['UZSE_KZSM', 'Bekobodsement AJ', 'KZSM', 2150, 0.018, 7],
  ['UZSE_IPTB', 'Ipoteka-bank ATIB', 'IPTB', 1600, 0.015, 6],
  ['UZSE_KDB', 'O‘zsanoatqurilishbank ATB', 'SQBN', 520, 0.016, 5]
].map(([id, name, symbol, price, volatility, peRatio]) =>
  makeAsset(id, name, `${symbol} (UZSE)`, 'UZSE', 'UZSE (Mahalliy)', price, volatility, "so'm", 2, peRatio)
);

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
  ...cryptoAssets,
  ...stockAssets,
  ...uzseAssets
];

const ASSET_FOLDERS = [
  { id: 'CRYPTO', label: 'Kripto', assetIds: cryptoAssets.map(asset => asset.id) },
  { id: 'FOREX', label: 'Forex', assetIds: ['EUR_USD'] },
  { id: 'INDICES', label: 'Indekslar', assetIds: [] },
  { id: 'METALS', label: 'Metall', assetIds: ['XAU_USD'] },
  { id: 'NASDAQ', label: 'Nasdaq', assetIds: stockAssets.filter(asset => ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'AVGO', 'COST', 'NFLX', 'AMD'].includes(asset.id)).map(asset => asset.id) },
  { id: 'STOCKS', label: 'Aksiyalar', assetIds: stockAssets.map(asset => asset.id) },
  { id: 'UZSE', label: 'UZSE mahalliy', assetIds: uzseAssets.map(asset => asset.id) }
];

export const ASSET_FOLDERS_LIST = ASSET_FOLDERS.map(({ id, label, assetIds }) => ({
  id,
  label,
  total: assetIds.length
}));

export function getAssetFolderAssets(folderId) {
  const folder = ASSET_FOLDERS.find(item => item.id === folderId);
  if (!folder) return [];
  return folder.assetIds.map(id => ASSETS.find(asset => asset.id === id)).filter(Boolean);
}

export function getAssetById(assetId) {
  return ASSETS.find(asset => asset.id === assetId);
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
