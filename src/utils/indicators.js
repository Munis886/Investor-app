// Texnik tahlil indikatorlari va sham naqshlari (Candlestick Patterns) hisoblagichlari

/**
 * SMA - Simple Moving Average
 */
export function calculateSMA(data, period = 20) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push(Number((sum / period).toFixed(2)));
  }
  return result;
}

/**
 * EMA - Exponential Moving Average
 */
export function calculateEMA(data, period = 20) {
  const result = [];
  const multiplier = 2 / (period + 1);

  let initialSMA = 0;
  for (let i = 0; i < Math.min(period, data.length); i++) {
    initialSMA += data[i].close;
  }
  initialSMA = initialSMA / Math.min(period, data.length);

  let prevEMA = initialSMA;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      result.push(Number(initialSMA.toFixed(2)));
      prevEMA = initialSMA;
    } else {
      const currentEMA = (data[i].close - prevEMA) * multiplier + prevEMA;
      result.push(Number(currentEMA.toFixed(2)));
      prevEMA = currentEMA;
    }
  }
  return result;
}

/**
 * RSI - Relative Strength Index (14 davr)
 */
export function calculateRSI(data, period = 14) {
  const result = [];
  if (data.length < period + 1) return data.map(() => 50);

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(null);
    } else if (i === period) {
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      result.push(Number(rsi.toFixed(2)));
    } else {
      const diff = data[i].close - data[i - 1].close;
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      result.push(Number(rsi.toFixed(2)));
    }
  }
  return result;
}

/**
 * MACD - Moving Average Convergence Divergence (12, 26, 9)
 */
export function calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  const macdLine = [];
  for (let i = 0; i < data.length; i++) {
    if (fastEMA[i] === null || slowEMA[i] === null) {
      macdLine.push(null);
    } else {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }
  }

  // Signal Line (9 EMA of MACD Line)
  const validMacd = macdLine.map(v => ({ close: v || 0 }));
  const signalLine = calculateEMA(validMacd, signalPeriod);

  const histogram = [];
  for (let i = 0; i < data.length; i++) {
    if (macdLine[i] === null || signalLine[i] === null) {
      histogram.push(null);
    } else {
      histogram.push(Number((macdLine[i] - signalLine[i]).toFixed(3)));
    }
  }

  return { macdLine, signalLine, histogram };
}

/**
 * Bollinger Bands (20 davr, 2 std dev)
 */
export function calculateBollingerBands(data, period = 20, multiplier = 2) {
  const sma = calculateSMA(data, period);
  const upper = [];
  const lower = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1 || sma[i] === null) {
      upper.push(null);
      lower.push(null);
      continue;
    }

    let varianceSum = 0;
    for (let j = 0; j < period; j++) {
      varianceSum += Math.pow(data[i - j].close - sma[i], 2);
    }
    const stdDev = Math.sqrt(varianceSum / period);

    upper.push(Number((sma[i] + stdDev * multiplier).toFixed(2)));
    lower.push(Number((sma[i] - stdDev * multiplier).toFixed(2)));
  }

  return { middle: sma, upper, lower };
}

/**
 * ATR - Average True Range
 */
export function calculateATR(data, period = 14) {
  if (data.length < 2) return [1];
  const tr = [data[0].high - data[0].low];

  for (let i = 1; i < data.length; i++) {
    const hl = data[i].high - data[i].low;
    const hc = Math.abs(data[i].high - data[i - 1].close);
    const lc = Math.abs(data[i].low - data[i - 1].close);
    tr.push(Math.max(hl, hc, lc));
  }

  const atr = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += tr[i];
    if (i < period) {
      atr.push(sum / (i + 1));
    } else {
      sum -= tr[i - period];
      atr.push(sum / period);
    }
  }
  return atr;
}

/**
 * Sham naqshlari (Candlestick Pattern Recognition)
 */
export function detectCandlePatterns(candles) {
  if (candles.length < 3) return null;

  const current = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const prev2 = candles[candles.length - 3];

  const body = Math.abs(current.close - current.open);
  const candleRange = current.high - current.low || 0.0001;
  const upperShadow = current.high - Math.max(current.close, current.open);
  const lowerShadow = Math.min(current.close, current.open) - current.low;

  const isGreen = current.close > current.open;
  const isRed = current.close < current.open;
  const prevIsRed = prev.close < prev.open;
  const prevIsGreen = prev.close > prev.open;

  // 1. Hammer (Bolg'a) - Bullish qaytish
  if (lowerShadow > body * 2 && upperShadow < body * 0.5 && body / candleRange > 0.1) {
    return {
      type: 'HAMMER',
      name: "Bolg'a (Hammer)",
      sentiment: 'BULLISH',
      strength: 75,
      description: "Pastki soyasi juda uzun sham. Sotuvchilar narxni pastlatdi, ammo xaridorlar narxni qaytarib ko'tarishdi. Kuchli o'sish belgisi."
    };
  }

  // 2. Inverted Hammer - Bullish
  if (upperShadow > body * 2 && lowerShadow < body * 0.4 && body / candleRange > 0.1) {
    return {
      type: 'INVERTED_HAMMER',
      name: "Teskari Bolg'a (Inverted Hammer)",
      sentiment: 'BULLISH',
      strength: 65,
      description: "Yuqori soyasi uzun sham. Xaridorlar faollashganidan dalolat beradi."
    };
  }

  // 3. Shooting Star (Otilgan yulduz) - Bearish
  if (upperShadow > body * 2 && lowerShadow < body * 0.4 && prevIsGreen) {
    return {
      type: 'SHOOTING_STAR',
      name: "Otilgan Yulduz (Shooting Star)",
      sentiment: 'BEARISH',
      strength: 80,
      description: "O'sishdan so'ng tepada uzun soyali sham hosil bo'ldi. Narx tepada ushlanib qololmadi, pasayish kutiladi."
    };
  }

  // 4. Bullish Engulfing (Yutib oluvchi o'sish shami)
  if (prevIsRed && isGreen && current.open <= prev.close && current.close > prev.open) {
    return {
      type: 'BULLISH_ENGULFING',
      name: "Qamrab Oluvchi O'sish (Bullish Engulfing)",
      sentiment: 'BULLISH',
      strength: 85,
      description: "Yashil sham avvalgi qizil shamni to'liq qamrab oldi (yutib yubordi). O'sish kuchli ehtimolda davom etadi."
    };
  }

  // 5. Bearish Engulfing (Yutib oluvchi pasayish shami)
  if (prevIsGreen && isRed && current.open >= prev.close && current.close < prev.open) {
    return {
      type: 'BEARISH_ENGULFING',
      name: "Qamrab Oluvchi Pasayish (Bearish Engulfing)",
      sentiment: 'BEARISH',
      strength: 85,
      description: "Qizil sham avvalgi yashil shamni to'liq qamrab oldi. Pasayish boshlanish ehtimoli yuqori."
    };
  }

  // 6. Morning Star (Tong yulduzi) - 3 shamli kuchli o'sish
  if (prev2.close < prev2.open && Math.abs(prev.close - prev.open) < body * 0.5 && isGreen && current.close > (prev2.open + prev2.close) / 2) {
    return {
      type: 'MORNING_STAR',
      name: "Tong Yulduzi (Morning Star)",
      sentiment: 'BULLISH',
      strength: 90,
      description: "Uch shamli klassik qaytish namunasi: qizil sham -> kichik ikkilanish shami -> kuchli yashil sham."
    };
  }

  // 7. Evening Star (Shom yulduzi) - 3 shamli kuchli pasayish
  if (prev2.close > prev2.open && Math.abs(prev.close - prev.open) < body * 0.5 && isRed && current.close < (prev2.open + prev2.close) / 2) {
    return {
      type: 'EVENING_STAR',
      name: "Shom Yulduzi (Evening Star)",
      sentiment: 'BEARISH',
      strength: 90,
      description: "Uch shamli pasayish namunasi: o'sish shami -> tepada kichik sham -> keskin qizil sham."
    };
  }

  // 8. Doji (Ikkilanish)
  if (body <= candleRange * 0.1) {
    return {
      type: 'DOJI',
      name: "Doji (Bozor ikkilanishi)",
      sentiment: 'NEUTRAL',
      strength: 50,
      description: "Ochilish va yopilish narxi deyarli bir xil. Xaridorlar va sotuvchilar o'rtasida muvozanat, trend o'zgarishi mumkin."
    };
  }

  return null;
}

