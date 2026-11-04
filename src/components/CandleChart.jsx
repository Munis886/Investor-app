import React, { useRef, useEffect, useState, useMemo } from 'react';
import { calculateEMA, calculateBollingerBands } from '../utils/indicators';
import Mt5OneClickTrade from './mt5/Mt5OneClickTrade';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';

export default function CandleChart({
  candles,
  asset,
  signal,
  chartType = 'CANDLES', // 'CANDLES' | 'BARS' | 'LINE'
  isCrosshairActive = false,
  showOneClick = true,
  showIndicators = true,
  onTriggerSignal,
  isScanning,
  onQuickTrade
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Sozlamalar va holatlar
  const [visibleCount, setVisibleCount] = useState(50);
  const [offset, setOffset] = useState(0);
  const [hoverData, setHoverData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Indikatorlar hisobi
  const ema20 = useMemo(() => calculateEMA(candles, 20), [candles]);
  const ema50 = useMemo(() => calculateEMA(candles, 50), [candles]);
  const bb = useMemo(() => calculateBollingerBands(candles, 20, 2), [candles]);

  const lastCandle = candles[candles.length - 1] || { close: 100, open: 100, high: 100, low: 100, volume: 0 };
  const spreadDelta = lastCandle.close * (asset?.volatility || 0.002) * 0.4;
  const bidPrice = lastCandle.close;
  const askPrice = lastCandle.close + spreadDelta;

  // Chizish funksiyasi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Tozalash
    ctx.clearRect(0, 0, width, height);

    // MT5 Toza Qora Fon
    ctx.fillStyle = '#05070b';
    ctx.fillRect(0, 0, width, height);

    // Ko'rinadigan shamlar oralig'i
    const totalCandles = candles.length;
    const actualVisible = Math.min(visibleCount, totalCandles);
    const endIndex = Math.max(actualVisible, totalCandles - offset);
    const startIndex = Math.max(0, endIndex - actualVisible);

    const visibleCandles = candles.slice(startIndex, endIndex);
    if (visibleCandles.length === 0) return;

    // Narx oraliqlari (Min / Max)
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    visibleCandles.forEach((c, idx) => {
      const globalIdx = startIndex + idx;
      minPrice = Math.min(minPrice, c.low);
      maxPrice = Math.max(maxPrice, c.high);
      maxVol = Math.max(maxVol, c.volume);

      if (showIndicators) {
        if (bb.lower[globalIdx] && bb.lower[globalIdx] < minPrice) minPrice = bb.lower[globalIdx];
        if (bb.upper[globalIdx] && bb.upper[globalIdx] > maxPrice) maxPrice = bb.upper[globalIdx];
      }
    });

    const pricePadding = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    // Grafik hududi chegaralari (MT5 Layout)
    const chartBottom = height - 35;
    const chartTop = 32;
    const chartHeight = chartBottom - chartTop;
    const rightMargin = 72; // MT5 Narx shkalasi eni
    const chartWidth = width - rightMargin;

    const candleWidth = chartWidth / visibleCandles.length;
    const candleBodyWidth = Math.max(2, candleWidth * 0.68);

    const getX = (i) => i * candleWidth + candleWidth / 2;
    const getY = (price) => chartBottom - ((price - minPrice) / priceRange) * chartHeight;

    // 1. MT5 Nozik Grid (To'r chiziqlari)
    ctx.strokeStyle = '#141a24';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    const gridSteps = 6;
    ctx.fillStyle = '#788294';
    ctx.font = '10px "Roboto Mono", monospace';
    ctx.textAlign = 'left';

    for (let i = 0; i <= gridSteps; i++) {
      const priceVal = minPrice + (priceRange / gridSteps) * i;
      const y = getY(priceVal);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Narx yorlig'i o'ng tomonda
      const formatted = priceVal >= 1000 ? priceVal.toFixed(1) : priceVal.toFixed(3);
      ctx.fillText(formatted, chartWidth + 6, y + 3.5);
    }

    // Vertikal vaqt to'rlari
    for (let i = 0; i < visibleCandles.length; i += 8) {
      const x = getX(i);
      ctx.beginPath();
      ctx.moveTo(x, chartTop);
      ctx.lineTo(x, chartBottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 2. Bollinger Bands
    if (showIndicators && bb.upper.length > 0) {
      ctx.fillStyle = 'rgba(41, 121, 255, 0.04)';
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (bb.upper[gIdx] !== null) {
          const x = getX(i);
          const y = getY(bb.upper[gIdx]);
          if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); }
        }
      }
      for (let i = visibleCandles.length - 1; i >= 0; i--) {
        const gIdx = startIndex + i;
        if (bb.lower[gIdx] !== null) {
          const x = getX(i);
          const y = getY(bb.lower[gIdx]);
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Bollinger chiziqlari
      ctx.strokeStyle = 'rgba(41, 121, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (bb.upper[gIdx] !== null) {
          const x = getX(i);
          const y = getY(bb.upper[gIdx]);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (bb.lower[gIdx] !== null) {
          const x = getX(i);
          const y = getY(bb.lower[gIdx]);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // 3. Hajm gistogrammasi (MT5 pastki qismida)
    const volHeight = 35;
    visibleCandles.forEach((c, i) => {
      const x = getX(i);
      const isUp = c.close >= c.open;
      const h = maxVol > 0 ? (c.volume / maxVol) * volHeight : 0;
      const y = chartBottom - h;

      ctx.fillStyle = isUp ? 'rgba(0, 200, 83, 0.2)' : 'rgba(255, 59, 48, 0.2)';
      ctx.fillRect(x - candleBodyWidth / 2, y, candleBodyWidth, h);
    });

    // 4. MT5 Grafikasini Chizish (Candles / Bars / Line)
    if (chartType === 'LINE') {
      // Line Chart (MT5 Chiziqli rejim)
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 2;
      ctx.beginPath();
      visibleCandles.forEach((c, i) => {
        const x = getX(i);
        const y = getY(c.close);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    } else if (chartType === 'BARS') {
      // Bar Chart (MT5 Barlar rejimi: High, Low, Chapda Open, O'ngda Close)
      visibleCandles.forEach((c, i) => {
        const x = getX(i);
        const isUp = c.close >= c.open;
        const color = isUp ? '#00e676' : '#ff3b30';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;

        // Vertikal High-Low
        ctx.beginPath();
        ctx.moveTo(x, getY(c.high));
        ctx.lineTo(x, getY(c.low));
        ctx.stroke();

        // Chapda Open
        ctx.beginPath();
        ctx.moveTo(x - candleBodyWidth / 2, getY(c.open));
        ctx.lineTo(x, getY(c.open));
        ctx.stroke();

        // O'ngda Close
        ctx.beginPath();
        ctx.moveTo(x, getY(c.close));
        ctx.lineTo(x + candleBodyWidth / 2, getY(c.close));
        ctx.stroke();
      });
    } else {
      // Candlesticks (MT5 Shamlar: Yashil buqa, Qizil/Oq ayiq)
      visibleCandles.forEach((c, i) => {
        const x = getX(i);
        const isUp = c.close >= c.open;
        const color = isUp ? '#00e676' : '#ff3b30';

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.4;

        // Wick
        ctx.beginPath();
        ctx.moveTo(x, getY(c.high));
        ctx.lineTo(x, getY(c.low));
        ctx.stroke();

        // Body
        const openY = getY(c.open);
        const closeY = getY(c.close);
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(openY - closeY));

        ctx.fillRect(x - candleBodyWidth / 2, bodyTop, candleBodyWidth, bodyHeight);
      });
    }

    // 5. EMA 20 (Sariq) va EMA 50 (Moviy)
    if (showIndicators) {
      // EMA 20
      ctx.strokeStyle = '#ffd600';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (ema20[gIdx] !== null) {
          const x = getX(i);
          const y = getY(ema20[gIdx]);
          if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); }
        }
      }
      ctx.stroke();

      // EMA 50
      ctx.strokeStyle = '#2979ff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      started = false;
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (ema50[gIdx] !== null) {
          const x = getX(i);
          const y = getY(ema50[gIdx]);
          if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); }
        }
      }
      ctx.stroke();
    }

    // 6. MT5 ASK va BID Gorizontal Chiziqlari (Klassik MT5!)
    // Bid Line (Ko'k yoki Kulrang)
    const bidY = getY(bidPrice);
    ctx.strokeStyle = '#2979ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, bidY);
    ctx.lineTo(chartWidth, bidY);
    ctx.stroke();

    // Ask Line (Qizil)
    const askY = getY(askPrice);
    ctx.strokeStyle = '#ff3b30';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, askY);
    ctx.lineTo(chartWidth, askY);
    ctx.stroke();
    ctx.setLineDash([]);

    // MT5 Narx Yorliqlari (O'ng shkalada)
    // Bid badge
    ctx.fillStyle = '#2979ff';
    ctx.fillRect(chartWidth + 2, bidY - 8, rightMargin - 4, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "Roboto Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(bidPrice >= 1000 ? bidPrice.toFixed(1) : bidPrice.toFixed(3), chartWidth + (rightMargin / 2), bidY + 3.5);

    // Ask badge
    ctx.fillStyle = '#ff3b30';
    ctx.fillRect(chartWidth + 2, askY - 8, rightMargin - 4, 16);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(askPrice >= 1000 ? askPrice.toFixed(1) : askPrice.toFixed(3), chartWidth + (rightMargin / 2), askY + 3.5);

    // 7. Vaqt shkalasi (Pastda)
    ctx.fillStyle = '#788294';
    ctx.font = '9px "Roboto Mono", monospace';
    ctx.textAlign = 'center';
    visibleCandles.forEach((c, i) => {
      if (i % 8 === 0) {
        const x = getX(i);
        const shortTime = c.time.slice(5, 16);
        ctx.fillText(shortTime, x, height - 8);
      }
    });

    // 8. Crosshair (Kursor) rejimida aniq chiziqlar
    if (isCrosshairActive && hoverData) {
      const hx = hoverData.x;
      const hy = hoverData.y;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 4]);

      // Vertikal
      ctx.beginPath();
      ctx.moveTo(hx, chartTop);
      ctx.lineTo(hx, chartBottom);
      ctx.stroke();

      // Gorizontal
      ctx.beginPath();
      ctx.moveTo(0, hy);
      ctx.lineTo(chartWidth, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Crosshair narx ko'rsatkichi
      const hoverPrice = maxPrice - ((hy - chartTop) / chartHeight) * priceRange;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(chartWidth + 2, hy - 8, rightMargin - 4, 16);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px "Roboto Mono", monospace';
      ctx.fillText(hoverPrice >= 1000 ? hoverPrice.toFixed(1) : hoverPrice.toFixed(3), chartWidth + (rightMargin / 2), hy + 3.5);
    }

  }, [candles, visibleCount, offset, showIndicators, chartType, isCrosshairActive, hoverData, ema20, ema50, bb, bidPrice, askPrice]);

  // Avtomatik Canvas o'lchamini moslash
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = Math.max(380, rect.height);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag / Pan boshqaruvi
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
  };

  const handlePointerMove = (e) => {
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = currentX - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY) || 0) - rect.top;

    if (isDragging) {
      const diffX = currentX - dragStartX;
      if (Math.abs(diffX) > 8) {
        const step = Math.sign(diffX) * 2;
        setOffset((prev) => Math.max(0, Math.min(candles.length - 15, prev - step)));
        setDragStartX(currentX);
      }
    }

    // Hover shamini topish
    const totalCandles = candles.length;
    const actualVisible = Math.min(visibleCount, totalCandles);
    const endIndex = Math.max(actualVisible, totalCandles - offset);
    const startIndex = Math.max(0, endIndex - actualVisible);
    const visibleCandles = candles.slice(startIndex, endIndex);

    const chartWidth = canvas.width - 72;
    const candleWidth = chartWidth / visibleCandles.length;
    const index = Math.floor(x / candleWidth);

    if (index >= 0 && index < visibleCandles.length) {
      setHoverData({
        candle: visibleCandles[index],
        x,
        y
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const currentHoverCandle = hoverData?.candle || lastCandle;

  return (
    <div className="relative w-full bg-[#05070b] border border-gray-800/80 rounded-xl overflow-hidden shadow-2xl select-none">
      {/* 1. MT5 OHLCV Ko'rsatkichi (Grafikning eng yuqori qismida, MT5 dagi kabi) */}
      <div className="px-3 py-1 bg-[#090d14] border-b border-gray-800/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-400">
        <div className="flex items-center gap-3">
          <span className="text-gray-300 font-bold">{currentHoverCandle.time}</span>
          <span>O: <strong className="text-gray-200">{currentHoverCandle.open}</strong></span>
          <span>H: <strong className="text-[#00e676]">{currentHoverCandle.high}</strong></span>
          <span>L: <strong className="text-[#ff3b30]">{currentHoverCandle.low}</strong></span>
          <span>C: <strong className={currentHoverCandle.close >= currentHoverCandle.open ? 'text-[#00e676]' : 'text-[#ff3b30]'}>{currentHoverCandle.close}</strong></span>
        </div>

        {/* Indikatorlar yozuvi */}
        {showIndicators && (
          <div className="hidden sm:flex items-center gap-2 text-[10px]">
            <span className="text-[#ffd600]">EMA(20)</span>
            <span className="text-[#2979ff]">EMA(50)</span>
            <span className="text-purple-400">BB(20,2)</span>
          </div>
        )}
      </div>

      {/* 2. MT5 ONE-CLICK TRADE VIDJETI (Grafik ustida suzuvchi!) */}
      {showOneClick && (
        <Mt5OneClickTrade
          bidPrice={bidPrice}
          askPrice={askPrice}
          signal={signal}
          onTriggerSignal={onTriggerSignal}
          isScanning={isScanning}
          onQuickTrade={onQuickTrade}
        />
      )}

      {/* 3. MT5 Grafik Ostidagi Kichik Asboblar (Zoom +, Zoom -, Reset) */}
      <div className="absolute bottom-10 right-20 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-gray-800">
        <button
          onClick={() => setVisibleCount((prev) => Math.max(15, prev - 10))}
          className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300"
          title="Zoom In"
        >
          <ZoomIn size={13} />
        </button>
        <button
          onClick={() => setVisibleCount((prev) => Math.min(100, prev + 10))}
          className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300"
          title="Zoom Out"
        >
          <ZoomOut size={13} />
        </button>
        <button
          onClick={() => { setOffset(0); setVisibleCount(50); }}
          className="p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300"
          title="Reset"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* 4. Canvas Grafik Maydoni */}
      <div
        ref={containerRef}
        className={`w-full h-[400px] sm:h-[460px] relative touch-none ${isCrosshairActive ? 'cursor-crosshair' : 'cursor-grab'}`}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => { handlePointerUp(); setHoverData(null); }}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
}
