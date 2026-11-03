import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';

export default function ManualCandleModal({ isOpen, onClose, onAddCandle, lastCandle }) {
  const [open, setOpen] = useState(lastCandle?.close || 100);
  const [high, setHigh] = useState(lastCandle?.close ? lastCandle.close * 1.02 : 102);
  const [low, setLow] = useState(lastCandle?.close ? lastCandle.close * 0.98 : 98);
  const [close, setClose] = useState(lastCandle?.close ? lastCandle.close * 1.01 : 101);
  const [volume, setVolume] = useState(5000);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').slice(0, 16);

    const candle = {
      time: timeStr,
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume: parseInt(volume, 10) || 1000
    };

    onAddCandle(candle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-gray-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <PlusCircle size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Yangi Sham Qo'shish (What-If Tahlil)</h2>
            <p className="text-xs text-gray-400">Yangi narxni kiritib, bashorat qanday o'zgarishini ko'ring</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Ochilish Narxi (Open)</label>
              <input
                type="number"
                step="any"
                value={open}
                onChange={(e) => setOpen(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Yopilish Narxi (Close)</label>
              <input
                type="number"
                step="any"
                value={close}
                onChange={(e) => setClose(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Eng Yuqori (High)</label>
              <input
                type="number"
                step="any"
                value={high}
                onChange={(e) => setHigh(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Eng Past (Low)</label>
              <input
                type="number"
                step="any"
                value={low}
                onChange={(e) => setLow(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Savdo Hajmi (Volume)</label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              Qo'shish va Tahlilni Yangilash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

