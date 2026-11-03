import {
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateATR,
  detectCandlePatterns
} from './indicators';

/**
 * Bozor tahlili va bashoratli signallar dvigateli (Predictive Signal Engine)
 */
export function analyzeMarket(candles) {
  if (!candles || candles.length < 25) {
    return {
      status: 'INSUFFICIENT_DATA',
      action: 'NEUTRAL',
      confidence: 50,
      message: "Tahlil qilish uchun kamida 25 ta sham kerak."
    };
  }

  const ema20 = calculateEMA(candles, 20);
  const ema50 = calculateEMA(candles, 50);
  const ema200 = calculateEMA(candles, Math.min(200, Math.floor(candles.length / 2)));
  const rsi = calculateRSI(candles, 14);
  const macd = calculateMACD(candles);
  const bb = calculateBollingerBands(candles, 20, 2);
  const atr = calculateATR(candles, 14);

  const lastIndex = candles.length - 1;
  const current = candles[lastIndex];
  const prev = candles[lastIndex - 1];

  const currentRsi = rsi[lastIndex] || 50;
  const prevRsi = rsi[lastIndex - 1] || 50;
  const currentMacdHist = macd.histogram[lastIndex] || 0;
  const prevMacdHist = macd.histogram[lastIndex - 1] || 0;
  const currentEma20 = ema20[lastIndex] || current.close;
  const currentEma50 = ema50[lastIndex] || current.close;
  const currentAtr = atr[lastIndex] || (current.high - current.low || 1);
  const bbUpper = bb.upper[lastIndex] || current.high;
  const bbLower = bb.lower[lastIndex] || current.low;
  const bbMid = bb.middle[lastIndex] || current.close;

  const candlePattern = detectCandlePatterns(candles);

  // Ball tizimi (Scoring System: -100 dan +100 gacha)
  // Musbat ball -> Xarid (Buy), Manfiy ball -> Sotish (Sell)
  let score = 0;
  const reasons = [];

  // 1. Trend tahlili (EMA)
  if (current.close > currentEma20 && currentEma20 > currentEma50) {
    score += 25;
    reasons.push("Narx EMA(20) va EMA(50) dan yuqorida — Barqaror o'suvchi trend.");
  } else if (current.close < currentEma20 && currentEma20 < currentEma50) {
    score -= 25;
    reasons.push("Narx EMA(20) va EMA(50) dan pastda — Tushuvchi trend.");
  }

  // 2. RSI osilator tahlili
  if (currentRsi < 30) {
    score += 30;
    reasons.push(`RSI ko'rsatkichi ${currentRsi} (Haddan tashqari sotilgan hudud - kuchli qaytish ehtimoli).`);
  } else if (currentRsi > 70) {
    score -= 30;
    reasons.push(`RSI ko'rsatkichi ${currentRsi} (Haddan tashqari sotib olingan - tuzatish / pasayish xavfi).`);
  } else if (currentRsi > 50 && prevRsi <= 50) {
    score += 15;
    reasons.push("RSI 50 markaziy chizig'ini yuqoriga kesib o'tdi — Xaridorlar ustunligi.");
  } else if (currentRsi < 50 && prevRsi >= 50) {
    score -= 15;
    reasons.push("RSI 50 markaziy chizig'idan pastga tushdi — Sotuvchilar ustunligi.");
  }

  // 3. MACD signali
  if (currentMacdHist > 0 && prevMacdHist <= 0) {
    score += 25;
    reasons.push("MACD histogrammasi nol chizig'ini yuqoriga kesib o'tdi (Bullish Crossover).");
  } else if (currentMacdHist < 0 && prevMacdHist >= 0) {
    score -= 25;
    reasons.push("MACD histogrammasi nol chizig'idan pastga tushdi (Bearish Crossover).");
  } else if (currentMacdHist > 0 && currentMacdHist > prevMacdHist) {
    score += 10;
    reasons.push("MACD ko'rsatkichi o'sish impulsi kuchayayotganini tasdiqlamoqda.");
  } else if (currentMacdHist < 0 && currentMacdHist < prevMacdHist) {
    score -= 10;
    reasons.push("MACD ko'rsatkichida pasayish bosimi davom etmoqda.");
  }

  // 4. Bollinger Bands holati
  if (current.low <= bbLower) {
    score += 20;
    reasons.push("Narx Bollinger pastki chegarasiga tegdi — Statik qaytish nuqtasi.");
  } else if (current.high >= bbUpper) {
    score -= 20;
    reasons.push("Narx Bollinger yuqori qarshilik chegarasida turibdi.");
  }

  // 5. Sham naqshlari (Pattern confirmation)
  if (candlePattern) {
    if (candlePattern.sentiment === 'BULLISH') {
      score += 25;
      reasons.push(`Sham naqshi: ${candlePattern.name} shakllandi. ${candlePattern.description}`);
    } else if (candlePattern.sentiment === 'BEARISH') {
      score -= 25;
      reasons.push(`Sham naqshi: ${candlePattern.name} shakllandi. ${candlePattern.description}`);
    } else {
      reasons.push(`Sham naqshi: ${candlePattern.name}. Bozor noaniq holatda.`);
    }
  }

  // Signal va Ishonchlilik foizi (Confidence %)
  let action = 'NEUTRAL';
  let confidence = 50;

  if (score >= 50) {
    action = 'STRONG_BUY';
    confidence = Math.min(94, Math.round(65 + (score / 100) * 30));
  } else if (score >= 20) {
    action = 'BUY';
    confidence = Math.min(82, Math.round(55 + (score / 100) * 25));
  } else if (score <= -50) {
    action = 'STRONG_SELL';
    confidence = Math.min(94, Math.round(65 + (Math.abs(score) / 100) * 30));
  } else if (score <= -20) {
    action = 'SELL';
    confidence = Math.min(82, Math.round(55 + (Math.abs(score) / 100) * 25));
  } else {
    action = 'NEUTRAL';
    confidence = Math.round(50 + Math.abs(score));
    if (reasons.length === 0) {
      reasons.push("Bozorda yaqqol yo'nalish yo'q. Pozitsiyaga kirmasdan kuzatish tavsiya etiladi.");
    }
  }

  // Stop-Loss & Take-Profit darajalari
  const entryPrice = current.close;
  const slDistance = Math.max(currentAtr * 1.5, entryPrice * 0.008);

  let stopLoss = 0;
  let takeProfit1 = 0;
  let takeProfit2 = 0;
  let takeProfit3 = 0;
  let riskReward = '1:2';

  if (action === 'BUY' || action === 'STRONG_BUY') {
    stopLoss = Number((entryPrice - slDistance).toFixed(4));
    takeProfit1 = Number((entryPrice + slDistance * 1.5).toFixed(4));
    takeProfit2 = Number((entryPrice + slDistance * 2.5).toFixed(4));
    takeProfit3 = Number((entryPrice + slDistance * 4.0).toFixed(4));
    riskReward = '1:2.5';
  } else if (action === 'SELL' || action === 'STRONG_SELL') {
    stopLoss = Number((entryPrice + slDistance).toFixed(4));
    takeProfit1 = Number((entryPrice - slDistance * 1.5).toFixed(4));
    takeProfit2 = Number((entryPrice - slDistance * 2.5).toFixed(4));
    takeProfit3 = Number((entryPrice - slDistance * 4.0).toFixed(4));
    riskReward = '1:2.5';
  } else {
    stopLoss = Number((entryPrice - slDistance).toFixed(4));
    takeProfit1 = Number((entryPrice + slDistance * 1.5).toFixed(4));
    takeProfit2 = Number((entryPrice + slDistance * 2.5).toFixed(4));
    takeProfit3 = Number((entryPrice + slDistance * 4.0).toFixed(4));
  }

  return {
    status: 'SUCCESS',
    action,
    confidence,
    score,
    entryPrice,
    stopLoss,
    takeProfit1,
    takeProfit2,
    takeProfit3,
    riskReward,
    currentAtr: Number(currentAtr.toFixed(4)),
    currentRsi: Number(currentRsi.toFixed(1)),
    pattern: candlePattern,
    ema: {
      ema20: Number(currentEma20.toFixed(4)),
      ema50: Number(currentEma50.toFixed(4))
    },
    bb: {
      upper: Number(bbUpper.toFixed(4)),
      middle: Number(bbMid.toFixed(4)),
      lower: Number(bbLower.toFixed(4))
    },
    reasons,
    summary: getActionSummaryUz(action, confidence)
  };
}

function getActionSummaryUz(action, confidence) {
  switch (action) {
    case 'STRONG_BUY':
      return `Kuchli xarid signali (${confidence}% ehtimollik). Bir nechta texnik indikatorlar va sham modellari o'sishni tasdiqlamoqda.`;
    case 'BUY':
      return `Xarid signali (${confidence}% ehtimollik). Narx yuqorilash uchun qulay hududda joylashgan.`;
    case 'SELL':
      return `Sotish signali (${confidence}% ehtimollik). Qisqa muddatli pasayish yoki korreksiya kutilmoqda.`;
    case 'STRONG_SELL':
      return `Kuchli sotish signali (${confidence}% ehtimollik). Bozor haddan tashqari qizigan yoki jiddiy tushish ehtimoli yuqori.`;
    default:
      return "Kutish tavsiya etiladi (Kuzatuv rejimi). Aniq yo'nalish signallari paydo bo'lguncha pozitsiyaga kirmang.";
  }
}

/**
 * Backtest strategiya simulyatsiyasi
 */
export function runBacktest(candles) {
  if (candles.length < 35) {
    return { winRate: 0, totalTrades: 0, profitPercent: 0, trades: [] };
  }

  const trades = [];
  let inPosition = null;

  for (let i = 30; i < candles.length - 1; i++) {
    const slice = candles.slice(0, i + 1);
    const analysis = analyzeMarket(slice);
    const nextCandle = candles[i + 1];

    if (!inPosition) {
      if (analysis.action === 'STRONG_BUY' || analysis.action === 'BUY') {
        inPosition = {
          type: 'BUY',
          entryIndex: i,
          entryPrice: slice[slice.length - 1].close,
          stopLoss: analysis.stopLoss,
          takeProfit: analysis.takeProfit2,
          date: slice[slice.length - 1].time
        };
      } else if (analysis.action === 'STRONG_SELL' || analysis.action === 'SELL') {
        inPosition = {
          type: 'SELL',
          entryIndex: i,
          entryPrice: slice[slice.length - 1].close,
          stopLoss: analysis.stopLoss,
          takeProfit: analysis.takeProfit2,
          date: slice[slice.length - 1].time
        };
      }
    } else {
      // Pozitsiyani tekshirish
      if (inPosition.type === 'BUY') {
        if (nextCandle.high >= inPosition.takeProfit) {
          trades.push({
            ...inPosition,
            exitPrice: inPosition.takeProfit,
            result: 'WIN',
            pnlPercent: Number((((inPosition.takeProfit - inPosition.entryPrice) / inPosition.entryPrice) * 100).toFixed(2)),
            exitDate: nextCandle.time
          });
          inPosition = null;
        } else if (nextCandle.low <= inPosition.stopLoss) {
          trades.push({
            ...inPosition,
            exitPrice: inPosition.stopLoss,
            result: 'LOSS',
            pnlPercent: Number((((inPosition.stopLoss - inPosition.entryPrice) / inPosition.entryPrice) * 100).toFixed(2)),
            exitDate: nextCandle.time
          });
          inPosition = null;
        }
      } else if (inPosition.type === 'SELL') {
        if (nextCandle.low <= inPosition.takeProfit) {
          trades.push({
            ...inPosition,
            exitPrice: inPosition.takeProfit,
            result: 'WIN',
            pnlPercent: Number((((inPosition.entryPrice - inPosition.takeProfit) / inPosition.entryPrice) * 100).toFixed(2)),
            exitDate: nextCandle.time
          });
          inPosition = null;
        } else if (nextCandle.high >= inPosition.stopLoss) {
          trades.push({
            ...inPosition,
            exitPrice: inPosition.stopLoss,
            result: 'LOSS',
            pnlPercent: Number((((inPosition.entryPrice - inPosition.stopLoss) / inPosition.entryPrice) * 100).toFixed(2)),
            exitDate: nextCandle.time
          });
          inPosition = null;
        }
      }
    }
  }

  const wins = trades.filter(t => t.result === 'WIN').length;
  const total = trades.length;
  const winRate = total > 0 ? Number(((wins / total) * 100).toFixed(1)) : 0;
  const profitPercent = Number(trades.reduce((acc, t) => acc + t.pnlPercent, 0).toFixed(2));

  return {
    winRate,
    totalTrades: total,
    wins,
    losses: total - wins,
    profitPercent,
    trades: trades.slice(-10) // Oxirgi 10 ta bitim
  };
}

