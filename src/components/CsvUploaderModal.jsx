import React, { useState } from 'react';
import { parseCSVData } from '../utils/sampleData';
import { X, Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';

export default function CsvUploaderModal({ isOpen, onClose, onDataLoaded }) {
  const [csvText, setCsvText] = useState('');
  const [error, setError] = useState(null);
  const [successCount, setSuccessCount] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setCsvText(text);
      processData(text);
    };
    reader.onerror = () => {
      setError("Faylni o'qishda xatolik yuz berdi.");
    };
    reader.readAsText(file);
  };

  const processData = (text) => {
    setError(null);
    try {
      const candles = parseCSVData(text);
      setSuccessCount(candles.length);
      setTimeout(() => {
        onDataLoaded(candles, "Foydalanuvchi statistikasi");
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || "CSV formatida xatolik aniqlandi.");
      setSuccessCount(null);
    }
  };

  const handleManualProcess = () => {
    if (!csvText.trim()) {
      setError("Iltimos, avval CSV ma'lumotlarini kiriting yoki fayl tanlang.");
      return;
    }
    processData(csvText);
  };

  const downloadSampleCsv = () => {
    const sample = `Date,Open,High,Low,Close,Volume
2026-11-01 10:00,100.5,103.2,99.8,102.4,15200
2026-11-01 14:00,102.4,104.1,101.5,103.8,18400
2026-11-01 18:00,103.8,105.0,102.9,104.6,12100
2026-11-02 10:00,104.6,106.3,103.8,105.9,21000
2026-11-02 14:00,105.9,105.9,101.2,101.8,32000
2026-11-02 18:00,101.8,102.5,99.5,100.2,28000
2026-11-03 10:00,100.2,103.5,100.0,103.1,19500
2026-11-03 14:00,103.1,104.8,102.6,104.2,17600`;

    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "namuna_sham_statistikasi.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-gray-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        {/* Yopish tugmasi */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <X size={18} />
        </button>

        {/* Sarlavha */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Upload size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Statistik Ma'lumotlarni Yuklash (CSV)</h2>
            <p className="text-xs text-gray-400">Aksiyalar, kripto, tovarlar yoki shaxsiy sham ma'lumotlari</p>
          </div>
        </div>

        {/* Fayl yuklash maydoni */}
        <div className="mb-4">
          <label className="border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition bg-gray-900/40 hover:bg-gray-900/80">
            <FileText size={28} className="text-indigo-400 mb-2" />
            <span className="text-xs font-semibold text-gray-200">CSV yoki TXT faylni tanlang</span>
            <span className="text-[11px] text-gray-500 mt-1">Excel yoki birjalardan olingan CSV fayllar</span>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Matn ko'rinishida qo'yish (Paste text) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-300">Yoki CSV matnini to'g'ridan-to'g'ri joylang:</label>
            <button
              onClick={downloadSampleCsv}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Download size={12} />
              Namunani ko'rish (.csv)
            </button>
          </div>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={5}
            placeholder="Date,Open,High,Low,Close,Volume&#10;2026-11-01,100,105,98,103,15000&#10;2026-11-02,103,107,101,106,18000"
            className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-indigo-500 transition resize-none"
          />
        </div>

        {/* Xatolik yoki Muvaffaqiyat xabari */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successCount && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle size={16} className="shrink-0" />
            <span>{successCount} ta sham ma'lumotlari muvaffaqiyatli yuklandi! Tahlil tayyorlanmoqda...</span>
          </div>
        )}

        {/* Tugmalar */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleManualProcess}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            Tahlil Qilish & Grafikni Ko'rish
          </button>
        </div>
      </div>
    </div>
  );
}

