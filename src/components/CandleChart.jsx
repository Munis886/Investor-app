import React, { useRef, useEffect, useState, useMemo } from 'react';
import { calculateEMA, calculateBollingerBands } from '../utils/indicators';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react';

export default function CandleChart({ candles, asset, signal }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Sozlamalar va holatlar
  const [visibleCount, setVisibleCount] = useState(45);
  const [offset, setOffset] = useState(0); // oxiridan necha sham orqaga surilgan
  const [hoverData, setHoverData] = useState(null);
  const [showIndicators, setShowIndicators] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Indikatorlar hisobi
  const ema20 = useMemo(() => calculateEMA(candles, 20), [candles]);
  const ema50 = useMemo(() => calculateEMA(candles, 50), [candles]);
  const bb = useMemo(() => calculateBollingerBands(candles, 20, 2), [candles]);

  // Chizish funksiyasi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Tozalash
    ctx.clearRect(0, 0, width, height);

    // Fon to'ri (Grid)
    ctx.fillStyle = '#0b0f19';
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

    const pricePadding = (maxPrice - minPrice) * 0.1 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    // Grafik hududi chegaralari
    const chartBottom = height - 60; // Pastdagi hajm va vaqt uchun
    const chartTop = 30;
    const chartHeight = chartBottom - chartTop;
    const rightMargin = 65; // O'ngdagi narx shkalasi
    const chartWidth = width - rightMargin;

    const candleWidth = chartWidth / visibleCandles.length;
    const candleBodyWidth = Math.max(2, candleWidth * 0.7);

    // Koordinata konvertatsiya yordamchilari
    const getX = (i) => i * candleWidth + candleWidth / 2;
    const getY = (price) => chartBottom - ((price - minPrice) / priceRange) * chartHeight;

    // Gorizontal narx to'ri (Grid lines)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    const gridSteps = 5;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';

    for (let i = 0; i <= gridSteps; i++) {
      const priceVal = minPrice + (priceRange / gridSteps) * i;
      const y = getY(priceVal);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Narx yorlig'i
      ctx.fillText(priceVal >= 1000 ? priceVal.toFixed(1) : priceVal.toFixed(3), chartWidth + 8, y + 3);
    }
    ctx.setLineDash([]); // Dashed chiziqni bekor qilish

    // Bollinger Bands to'ldirish (Fill)
    if (showIndicators && bb.upper.length > 0) {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.07)';
      ctx.beginPath();
      
      let started = false;
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (bb.upper[gIdx] !== null) {
          const x = getX(i);
          const y = getY(bb.upper[gIdx]);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
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

      // Bollinger chegaralari
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (bb.upper[gIdx] !== null) {
          const x = getX(i);
          const y = getY(bb.upper[gIdx]);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (bb.lower[gIdx] !== null) {
          const x = getX(i);
          const y = getY(bb.lower[gIdx]);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Hajm ustunlari (Volume Bars)
    const volAreaHeight = 45;
    visibleCandles.forEach((c, i) => {
      const x = getX(i);
      const isUp = c.close >= c.open;
      const volHeight = maxVol > 0 ? (c.volume / maxVol) * volAreaHeight : 0;
      const y = height - 20 - volHeight;

      ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(x - candleBodyWidth / 2, y, candleBodyWidth, volHeight);
    });

    // Shamlar (Candlesticks: Wicks & Bodies)
    visibleCandles.forEach((c, i) => {
      const x = getX(i);
      const isUp = c.close >= c.open;
      const color = isUp ? '#10b981' : '#ef4444';

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.5;

      // Soya (Wick)
      ctx.beginPath();
      ctx.moveTo(x, getY(c.high));
      ctx.lineTo(x, getY(c.low));
      ctx.stroke();

      // Sham tanasi (Body)
      const openY = getY(c.open);
      const closeY = getY(c.close);
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(2, Math.abs(openY - closeY));

      ctx.fillRect(x - candleBodyWidth / 2, bodyTop, candleBodyWidth, bodyHeight);

      // Vaqt yorliqlari (faqat har 6 ta shamda bitta)
      if (i % 7 === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        const shortTime = c.time.length > 10 ? c.time.slice(5, 16) : c.time;
        ctx.fillText(shortTime, x, height - 6);
      }
    });

    // EMA 20 (Sariq)
    if (showIndicators) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (ema20[gIdx] !== null) {
          const x = getX(i);
          const y = getY(ema20[gIdx]);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();

      // EMA 50 (Moviy)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      started = false;
      for (let i = 0; i < visibleCandles.length; i++) {
        const gIdx = startIndex + i;
        if (ema50[gIdx] !== null) {
          const x = getX(i);
          const y = getY(ema50[gIdx]);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    // Oxirgi narx darajasidagi gorizontal chiziq va marker
    const lastCandle = candles[candles.length - 1];
    const lastPriceY = getY(lastCandle.close);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(0, lastPriceY);
    ctx.lineTo(chartWidth, lastPriceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Oxirgi narx yorlig'i (badge)
    ctx.fillStyle = '#10b981';
    ctx.fillRect(chartWidth + 2, lastPriceY - 9, rightMargin - 4, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(lastCandle.close >= 1000 ? lastCandle.close.toFixed(1) : lastCandle.close.toFixed(3), chartWidth + (rightMargin / 2), lastPriceY + 3.5);

    // Hover / Touch Crosshair
    if (hoverData) {
      const hx = hoverData.x;
      const hy = hoverData.y;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Vertikal chiziq
      ctx.beginPath();
      ctx.moveTo(hx, chartTop);
      ctx.lineTo(hx, chartBottom);
      ctx.stroke();

      // Gorizontal chiziq
      ctx.beginPath();
      ctx.moveTo(0, hy);
      ctx.lineTo(chartWidth, hy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [candles, visibleCount, offset, showIndicators, hoverData, ema20, ema50, bb]);

  // Avtomatik Canvas o'lchamini moslash
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = Math.max(340, rect.height);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sichqoncha / Touch orqali surish (Drag/Pan)
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
      if (Math.abs(diffX) > 10) {
        const step = Math.sign(diffX) * 2;
        setOffset((prev) => Math.max(0, Math.min(candles.length - 20, prev - step)));
        setDragStartX(currentX);
      }
    } else {
      // Hover shamini topish
      const totalCandles = candles.length;
      const actualVisible = Math.min(visibleCount, totalCandles);
      const endIndex = Math.max(actualVisible, totalCandles - offset);
      const startIndex = Math.max(0, endIndex - actualVisible);
      const visibleCandles = candles.slice(startIndex, endIndex);

      const chartWidth = canvas.width - 65;
      const candleWidth = chartWidth / visibleCandles.length;
      const index = Math.floor(x / candleWidth);

      if (index >= 0 && index < visibleCandles.length) {
        setHoverData({
          candle: visibleCandles[index],
          x,
          y
        });
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const currentHoverCandle = hoverData?.candle || (candles.length > 0 ? candles[candles.length - 1] : null);

  return (
    <div className="flex flex-col bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
      {/* Yuqori Panel: Sham haqida ma'lumot (OHLCV) & Asboblar */}
      <div className="px-4 py-2.5 bg-[#0f172a] border-b border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        {currentHoverCandle && (
          <div className="flex flex-wrap items-center gap-2.5 font-mono">
            <span className="text-gray-400 font-sans">{currentHoverCandle.time}</span>
            <span className="text-gray-400">O: <strong className="text-gray-200">{currentHoverCandle.open}</strong></span>
            <span className="text-gray-400">H: <strong className="text-emerald-400">{currentHoverCandle.high}</strong></span>
            <span className="text-gray-400">L: <strong className="text-rose-400">{currentHoverCandle.low}</strong></span>
            <span className="text-gray-400">C: <strong className={currentHoverCandle.close >= currentHoverCandle.open ? 'text-emerald-400' : 'text-rose-400'}>{currentHoverCandle.close}</strong></span>
            <span className="text-gray-400 hidden sm:inline">V: <strong className="text-indigo-300">{currentHoverCandle.volume.toLocaleString()}</strong></span>
          </div>
        )}

        {/* Indikatorlar va Boshqaruv tugmalari */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-medium transition ${
              showIndicators ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'bg-gray-800 text-gray-400'
            }`}
            title="EMA va Bollinger indikatorlarini yoqish/o'chirish"
          >
            {showIndicators ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>EMA / BB</span>
          </button>

          <button
            onClick={() => setVisibleCount((prev) => Math.max(20, prev - 10))}
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
            title="Kattalashtirish (Zoom In)"
          >
            <ZoomIn size={14} />
          </button>

          <button
            onClick={() => setVisibleCount((prev) => Math.min(100, prev + 10))}
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
            title="Kichraytirish (Zoom Out)"
          >
            <ZoomOut size={14} />
          </button>

          <button
            onClick={() => { setOffset(0); setVisibleCount(45); }}
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
            title="Asl holatga qaytarish"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Indikatorlar afsonasi (Legend) */}
      {showIndicators && (
        <div className="px-4 py-1 bg-[#0b0f19]/80 border-b border-gray-800/60 flex items-center gap-4 text-[10px] text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#eab308] rounded"></span>
            <span>EMA 20</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#38bdf8] rounded"></span>
            <span>EMA 50</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-1.5 bg-purple-500/40 border border-purple-400 rounded"></span>
            <span>Bollinger Bands</span>
          </span>
        </div>
      )}

      {/* Asosiy Canvas Grafik */}
      <div
        ref={containerRef}
        className="w-full h-[360px] sm:h-[420px] relative cursor-crosshair touch-none select-none"
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

