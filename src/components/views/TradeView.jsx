import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Briefcase, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';

export default function TradeView({
  symbol,
  currentPrice,
  unit = '$',
  openOrders,
  onOpenOrder,
  onCloseOrder,
  balance = 10000.00
}) {
  const [lot, setLot] = useState('0.10');
  const parsedLot = Number(lot);
  const isLotValid = Number.isFinite(parsedLot) && parsedLot >= 0.01 && parsedLot <= 10;

  // Ochiq pozitsiyalar foydasi
  const totalPnL = openOrders.reduce((acc, order) => {
    const diff = order.type === 'BUY' 
      ? (currentPrice - order.entryPrice) 
      : (order.entryPrice - currentPrice);
    const pnl = (diff * order.lot * 100);
    return acc + pnl;
  }, 0);

  const equity = balance + totalPnL;
  const margin = openOrders.length * 250;
  const freeMargin = equity - margin;

  const handleAdjustLot = (delta) => {
    setLot(prev => Math.max(0.01, Number((Number(prev || 0) + delta).toFixed(2))).toFixed(2));
  };

  const handleCreateOrder = (type) => {
    if (!isLotValid) return;
    const newOrder = {
      id: Date.now(),
      symbol,
      type,
      lot: parsedLot,
      entryPrice: currentPrice,
      unit,
      time: new Date().toLocaleTimeString().slice(0, 5)
    };
    onOpenOrder(newOrder);
  };

  return (
    <div className="space-y-0 pb-8 select-none font-sans text-[#25282d]">
      {/* 1. Hisob Holati Bloklari */}
      <div className="border-b border-[#e5e7e9] bg-white px-2 py-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eceef0]">
          <div>
            <span className="text-[10px] text-[#777b80] font-semibold uppercase tracking-wider block">Jami Balans</span>
            <span className="text-xl font-bold text-[#25282d] font-mono">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#777b80] font-semibold uppercase tracking-wider block">Bugungi Natija (P&L)</span>
            <span className={`text-xl font-bold font-mono ${totalPnL >= 0 ? 'text-[#12856c]' : 'text-[#c74752]'}`}>
              {totalPnL >= 0 ? `+$${totalPnL.toFixed(2)}` : `-$${Math.abs(totalPnL).toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="bg-white p-2.5">
            <span className="text-[10px] text-[#777b80] font-sans block">Equity:</span>
            <span className="font-semibold text-[#30343a]">${equity.toFixed(2)}</span>
          </div>
          <div className="bg-white p-2.5">
            <span className="text-[10px] text-[#777b80] font-sans block">Erkin Marja:</span>
            <span className="font-semibold text-[#30343a]">${freeMargin.toFixed(2)}</span>
          </div>
          <div className="bg-white p-2.5">
            <span className="text-[10px] text-[#777b80] font-sans block">Garov (Margin):</span>
            <span className="font-semibold text-[#30343a]">${margin.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 2. Yangi Bitim Ochish Paneli */}
      <div className="border-b border-[#e5e7e9] bg-white px-2 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-[#2979ff]" />
            <h3 className="text-xs font-semibold text-[#30343a] uppercase tracking-wider">
              Yangi Bitim Ochish: <span className="text-[#2979ff]">{symbol}</span>
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-gray-300">
            {currentPrice} {unit}
          </span>
        </div>

        {/* Lot Hajmini Belgilash */}
        <div className="border border-[#e1e4e8] bg-[#f7f8f9] p-2 flex items-center justify-between">
          <span className="text-xs text-[#656a70] font-medium pl-2">Lot Hajmi:</span>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleAdjustLot(-0.01)}
              className="grid size-8 place-items-center border border-[#dfe2e6] bg-white text-[#4c5158]"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              min="0.01"
              max="10"
              step="0.01"
              value={lot}
              onChange={event => setLot(event.target.value)}
              aria-label="Lot hajmini qo'lda kiriting"
              className="w-16 border-b border-[#dfe2e6] bg-white text-center font-mono text-sm font-semibold text-[#3d444d] focus:border-[#2878df] focus:outline-none"
            />
            <button
              onClick={() => handleAdjustLot(0.01)}
              className="grid size-8 place-items-center border border-[#dfe2e6] bg-white text-[#4c5158]"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setLot('0.01')}
              className={`px-2 py-1 text-[10px] font-mono font-semibold ${parsedLot === 0.01 ? 'bg-[#2878df] text-white' : 'bg-white text-[#62676d]'}`}
            >
              0.01
            </button>
            <button
              onClick={() => setLot('0.10')}
              className={`px-2 py-1 text-[10px] font-mono font-semibold ${parsedLot === 0.10 ? 'bg-[#2878df] text-white' : 'bg-white text-[#62676d]'}`}
            >
              0.10
            </button>
            <button
              onClick={() => setLot('0.50')}
              className={`px-2 py-1 text-[10px] font-mono font-semibold ${parsedLot === 0.50 ? 'bg-[#2878df] text-white' : 'bg-white text-[#62676d]'}`}
            >
              0.50
            </button>
          </div>
        </div>

        {/* Katta BUY va SELL tugmalari */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleCreateOrder('SELL')}
            disabled={!isLotValid}
            className="flex items-center justify-center gap-2 bg-[#d64d58] px-4 py-3 text-xs font-semibold uppercase text-white transition active:opacity-80 disabled:opacity-50"
          >
            <ArrowDown size={16} />
            <span>SOTISH (SELL) · {unit}</span>
          </button>

          <button
            onClick={() => handleCreateOrder('BUY')}
            disabled={!isLotValid}
            className="flex items-center justify-center gap-2 bg-[#2878df] px-4 py-3 text-xs font-semibold uppercase text-white transition active:opacity-80 disabled:opacity-50"
          >
            <ArrowUp size={16} />
            <span>XARID (BUY) · {unit}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-[#777b80] pt-1 px-1">
          <span>Spred: ~0.8 pips</span>
          <span>Komissiya: $0.00</span>
          <span>Bajarilish: Instant Execution</span>
        </div>
      </div>

      {/* 3. Ochiq Pozitsiyalar Ro'yxati (Active Orders) */}
      <div className="bg-white px-2 py-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#eceef0] pb-2">
          <h3 className="text-xs font-semibold text-[#30343a] uppercase tracking-wider">
            Ochiq Pozitsiyalar ({openOrders.length})
          </h3>
          <span className="text-[10px] text-[#777b80]">Demo PnL</span>
        </div>

        {openOrders.length > 0 ? (
          <div className="space-y-2">
            {openOrders.map(order => {
              const diff = order.type === 'BUY'
                ? (currentPrice - order.entryPrice)
                : (order.entryPrice - currentPrice);
              const pnl = Number((diff * order.lot * 100).toFixed(2));
              const isProfit = pnl >= 0;

              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 border-b border-[#eceef0] bg-white p-3 text-xs font-mono"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#30343a]">{order.symbol}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.type === 'BUY' ? 'bg-[#eaf2ff] text-[#2878df]' : 'bg-[#fff0f1] text-[#c74752]'
                      }`}>
                        {order.type} {order.lot}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#777b80] font-sans mt-0.5">
                      Kirish: <strong>{order.entryPrice} {order.unit || unit}</strong> → Joriy: <strong>{currentPrice} {order.unit || unit}</strong> ({order.time})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-black text-sm ${isProfit ? 'text-[#00e676]' : 'text-[#ff3b30]'}`}>
                      {isProfit ? `+$${pnl}` : `-$${Math.abs(pnl)}`}
                    </span>

                    <button
                      onClick={() => onCloseOrder(order.id, pnl)}
                      className="border border-[#dfe2e6] px-2.5 py-1 text-[11px] font-sans font-medium text-[#555a60] hover:border-[#d64d58] hover:text-[#c74752] transition"
                      title="Pozitsiyani yopish"
                    >
                      Yopish
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#777b80] font-sans">
            Hozirda ochiq pozitsiyalar yo'q. Yuqoridagi BUY yoki SELL tugmasi orqali bitim ochishingiz mumkin.
          </div>
        )}
      </div>
    </div>
  );
}
