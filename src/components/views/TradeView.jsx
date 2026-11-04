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
  const [lot, setLot] = useState(0.10);

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
    setLot(prev => Math.max(0.01, Number((prev + delta).toFixed(2))));
  };

  const handleCreateOrder = (type) => {
    const newOrder = {
      id: Date.now(),
      symbol,
      type,
      lot,
      entryPrice: currentPrice,
      time: new Date().toLocaleTimeString().slice(0, 5)
    };
    onOpenOrder(newOrder);
  };

  return (
    <div className="space-y-3.5 pb-8 select-none font-sans">
      {/* 1. Hisob Holati Bloklari */}
      <div className="bg-[#10141d] border border-gray-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Jami Balans</span>
            <span className="text-xl font-black text-white font-mono">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Bugungi Natija (P&L)</span>
            <span className={`text-xl font-black font-mono ${totalPnL >= 0 ? 'text-[#00e676]' : 'text-[#ff3b30]'}`}>
              {totalPnL >= 0 ? `+$${totalPnL.toFixed(2)}` : `-$${Math.abs(totalPnL).toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="bg-[#161c28] p-2.5 rounded-xl border border-gray-800/80">
            <span className="text-[10px] text-gray-400 font-sans block">Equity:</span>
            <span className="font-bold text-gray-200">${equity.toFixed(2)}</span>
          </div>
          <div className="bg-[#161c28] p-2.5 rounded-xl border border-gray-800/80">
            <span className="text-[10px] text-gray-400 font-sans block">Erkin Marja:</span>
            <span className="font-bold text-gray-200">${freeMargin.toFixed(2)}</span>
          </div>
          <div className="bg-[#161c28] p-2.5 rounded-xl border border-gray-800/80">
            <span className="text-[10px] text-gray-400 font-sans block">Garov (Margin):</span>
            <span className="font-bold text-gray-200">${margin.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 2. Yangi Bitim Ochish Paneli */}
      <div className="bg-[#10141d] border border-gray-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-[#2979ff]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Yangi Bitim Ochish: <span className="text-[#2979ff]">{symbol}</span>
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-gray-300">
            {currentPrice} {unit}
          </span>
        </div>

        {/* Lot Hajmini Belgilash */}
        <div className="bg-[#161c28] border border-gray-800 p-2 rounded-xl flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium pl-2">Lot Hajmi:</span>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleAdjustLot(-0.01)}
              className="p-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
            >
              <Minus size={14} />
            </button>
            <span className="w-16 text-center font-mono font-bold text-sm text-yellow-400">
              {lot.toFixed(2)}
            </span>
            <button
              onClick={() => handleAdjustLot(0.01)}
              className="p-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setLot(0.01)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${lot === 0.01 ? 'bg-[#2979ff] text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              0.01
            </button>
            <button
              onClick={() => setLot(0.10)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${lot === 0.10 ? 'bg-[#2979ff] text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              0.10
            </button>
            <button
              onClick={() => setLot(0.50)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${lot === 0.50 ? 'bg-[#2979ff] text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              0.50
            </button>
          </div>
        </div>

        {/* Katta BUY va SELL tugmalari */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleCreateOrder('SELL')}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition active:scale-95"
          >
            <ArrowDown size={16} />
            <span>SOTISH (SELL)</span>
          </button>

          <button
            onClick={() => handleCreateOrder('BUY')}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#2979ff] to-blue-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#2979ff]/20 transition active:scale-95"
          >
            <ArrowUp size={16} />
            <span>XARID (BUY)</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 px-1">
          <span>Spred: ~0.8 pips</span>
          <span>Komissiya: $0.00</span>
          <span>Bajarilish: Instant Execution</span>
        </div>
      </div>

      {/* 3. Ochiq Pozitsiyalar Ro'yxati (Active Orders) */}
      <div className="bg-[#10141d] border border-gray-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Ochiq Pozitsiyalar ({openOrders.length})
          </h3>
          <span className="text-[10px] text-gray-400">Jonli PnL hisobi</span>
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
                  className="p-3 bg-[#161c28] rounded-xl border border-gray-800 flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{order.symbol}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.type === 'BUY' ? 'bg-[#2979ff]/20 text-[#2979ff]' : 'bg-rose-500/20 text-[#ff3b30]'
                      }`}>
                        {order.type} {order.lot}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-sans mt-0.5">
                      Kirish: <strong>{order.entryPrice}</strong> → Joriy: <strong>{currentPrice}</strong> ({order.time})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-black text-sm ${isProfit ? 'text-[#00e676]' : 'text-[#ff3b30]'}`}>
                      {isProfit ? `+$${pnl}` : `-$${Math.abs(pnl)}`}
                    </span>

                    <button
                      onClick={() => onCloseOrder(order.id, pnl)}
                      className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-rose-600/40 text-gray-300 hover:text-rose-300 transition text-[11px] font-sans font-semibold"
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
          <div className="text-center py-6 text-xs text-gray-500 font-sans">
            Hozirda ochiq pozitsiyalar yo'q. Yuqoridagi BUY yoki SELL tugmasi orqali bitim ochishingiz mumkin.
          </div>
        )}
      </div>
    </div>
  );
}

