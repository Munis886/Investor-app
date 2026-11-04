import React, { useEffect, useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';

export default function ManualCandleModal({ isOpen, onClose, onAddCandle, lastCandle }) {
  const [open, setOpen] = useState(lastCandle?.close || 100);
  const [high, setHigh] = useState(lastCandle?.close ? lastCandle.close * 1.02 : 102);
  const [low, setLow] = useState(lastCandle?.close ? lastCandle.close * 0.98 : 98);
  const [close, setClose] = useState(lastCandle?.close ? lastCandle.close * 1.01 : 101);
  const [volume, setVolume] = useState(5000);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const price = lastCandle?.close || 100;
    setOpen(price);
    setHigh(price * 1.02);
    setLow(price * 0.98);
    setClose(price * 1.01);
    setVolume(5000);
    setValidationError('');
  }, [isOpen, lastCandle?.close]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = [open, high, low, close].map(Number);
    const [openPrice, highPrice, lowPrice, closePrice] = values;
    const volumeValue = Number(volume);

    if (!values.every(value => Number.isFinite(value) && value > 0)) {
      setValidationError("Narxlar musbat va to'g'ri son bo'lishi kerak.");
      return;
    }
    if (highPrice < Math.max(openPrice, closePrice) || lowPrice > Math.min(openPrice, closePrice)) {
      setValidationError("Eng yuqori narx Open va Close'dan kam, eng past narx esa ulardan yuqori bo'lishi mumkin emas.");
      return;
    }
    if (!Number.isInteger(volumeValue) || volumeValue < 0) {
      setValidationError("Savdo hajmi manfiy bo'lmagan butun son bo'lishi kerak.");
      return;
    }

    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').slice(0, 16);

    const candle = {
      time: timeStr,
      open: openPrice,
      high: highPrice,
      low: lowPrice,
      close: closePrice,
      volume: volumeValue
    };

    setValidationError('');
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
                min="0"
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
                min="0"
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
                min="0"
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
                min="0"
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
              min="0"
              step="1"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {validationError && (
            <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {validationError}
            </p>
          )}

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
