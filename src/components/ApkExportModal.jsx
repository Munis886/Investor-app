import React from 'react';
import { X, Smartphone, Download, CheckCircle, Terminal, HelpCircle, Share2, Layers } from 'lucide-react';

export default function ApkExportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-gray-700 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
            <Smartphone size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Android .APK va Mobil O'rnatish</h2>
            <p className="text-xs text-gray-400">InvestSignal ilovasini smartfoningizda qulay ishlatish</p>
          </div>
        </div>

        {/* 1-variant: To'g'ridan-to'g'ri Tayyor .APK Faylini Yuklab Olish */}
        <div className="bg-gradient-to-r from-emerald-950/50 to-teal-950/40 border border-emerald-500/40 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle size={17} />
              <span>Tayyor .APK Fayli</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Android v1.0
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed mb-3">
            <strong>InvestSignal.apk</strong> faylini smartfoningizga o'rnatishingiz mumkin. Fayl hajmi build turi va tarkibiga qarab o'zgaradi:
          </p>
          <a
            href="/InvestSignal.apk"
            download="InvestSignal.apk"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs transition shadow-lg shadow-emerald-500/30"
          >
            <Download size={16} />
            <span>InvestSignal.apk faylini yuklab olish</span>
          </a>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Fayl kompyuteringizdagi <code>InvestSignal.apk</code> yoki <code>android/app/build/outputs/apk/debug/app-debug.apk</code> manzilida ham saqlangan.
          </p>
        </div>

        {/* 2-variant: PWA orqali 1 soniyada APK kabi o'rnatish */}
        <div className="bg-[#1e293b]/60 border border-gray-800 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-sm">
            <Smartphone size={16} />
            <span>2-usul: Telefonda Brauzer Orqali O'rnatish (PWA)</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed mb-3">
            Smartfoningizda brauzer (Chrome / Safari) orqali ochilganda mustaqil ilova ko'rinishida o'rnatish:
          </p>
          <ol className="text-xs text-gray-300 space-y-1.5 list-decimal list-inside bg-black/30 p-3 rounded-xl border border-gray-800">
            <li>Brauzer menyusini (<strong>3 nuqta</strong> yoki Ulashish) bosing.</li>
            <li><strong>"Bosh ekranga qo'shish"</strong> (Add to Home screen) yoki <strong>"Ilovani o'rnatish"</strong> ni tanlang.</li>
            <li>Ilova smartfon menyusida paydo bo'ladi va 100% oflayn ishlayveradi.</li>
          </ol>
        </div>

        {/* 2-variant: Standalone APK fayl yaratish (Android Studio / Capacitor) */}
        <div className="bg-[#1e293b]/60 border border-gray-800 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-sm">
            <Terminal size={16} />
            <span>2-usul: APK faylni qayta yig'ish</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed mb-3">
            Windows'da loyiha papkasidan quyidagi skriptni ishga tushiring. U web resurslarni yig'adi, Android loyihasiga nusxalaydi va yangi debug APK yaratadi:
          </p>

          <div className="bg-[#0b0f19] p-3 rounded-xl border border-gray-800 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto mb-3">
            <div>build-apk.bat</div>
          </div>

          <p className="text-[11px] text-gray-400">
            Natija: <code>android/app/build/outputs/apk/debug/app-debug.apk</code>. Skript shu faylni loyiha papkasidagi <code>InvestSignal.apk</code> ustiga yangidan ko'chiradi.
          </p>
        </div>

        {/* Ilova imkoniyatlari xulosasi */}
        <div className="border border-gray-800 bg-[#0f172a] rounded-xl p-3 text-xs text-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-indigo-400" />
            <span>Ofline ishlash, tejamkor resurslar va tezkor sham tahlili.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  );
}
