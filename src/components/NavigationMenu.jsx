import React from 'react';
import {
  Activity,
  CandlestickChart,
  History,
  MessageSquare,
  Pause,
  Play,
  RefreshCw,
  Settings2,
  Smartphone,
  TrendingUp,
  Upload,
  X
} from 'lucide-react';

export default function NavigationMenu({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  isLive,
  onToggleLive,
  onOpenCsvModal,
  onOpenManualModal,
  onOpenApkModal,
  onRefreshData,
  onTriggerSignal
}) {
  if (!isOpen) return null;

  const destinations = [
    { id: 'QUOTES', label: 'Kotirovkalar', icon: Activity },
    { id: 'CHART', label: 'Grafik', icon: CandlestickChart },
    { id: 'TRADE', label: 'Savdo', icon: TrendingUp },
    { id: 'HISTORY', label: 'Tarix', icon: History },
    { id: 'MESSAGES', label: 'Xabarlar', icon: MessageSquare },
    { id: 'SIGNALS', label: 'AI signallari', icon: TrendingUp },
    { id: 'SETTINGS', label: 'Ma’lumotlar va sozlamalar', icon: Settings2 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40 animate-fadeIn" role="presentation">
      <button type="button" className="flex-1" onClick={onClose} aria-label="Menyuni yopish" />
      <aside className="flex h-full w-[min(340px,88vw)] flex-col overflow-y-auto bg-white px-4 pb-[env(safe-area-inset-bottom)] shadow-xl" aria-label="Asosiy menyu">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb]">
          <div>
            <h2 className="text-base font-semibold text-[#202124]">InvestSignal</h2>
            <p className="text-xs text-[#73777e]">Demo hisob · oflayn</p>
          </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Yopish"
              className="grid size-10 place-items-center text-[#55585d]"
            >
              <X size={22} />
            </button>
        </div>

        <nav className="py-3" aria-label="Bo'limlar">
          {destinations.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { onSelectTab(id); onClose(); }}
              aria-current={activeTab === id ? 'page' : undefined}
              className={`flex min-h-12 w-full items-center gap-4 px-3 text-left text-sm ${activeTab === id ? 'bg-[#eaf2ff] font-semibold text-[#2168c4]' : 'text-[#33373d] hover:bg-[#f4f5f6]'}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#e5e7eb] py-3">
          <button type="button" onClick={() => { onOpenCsvModal(); onClose(); }} className="flex min-h-11 w-full items-center gap-4 px-3 text-left text-sm text-[#33373d]">
            <Upload size={19} /> CSV ma’lumot yuklash
          </button>
          <button type="button" onClick={() => { onOpenManualModal(); onClose(); }} className="flex min-h-11 w-full items-center gap-4 px-3 text-left text-sm text-[#33373d]">
            <Activity size={19} /> Shamni qo‘lda kiritish
          </button>
          <button type="button" onClick={() => { onToggleLive(); onClose(); }} className="flex min-h-11 w-full items-center justify-between gap-4 px-3 text-left text-sm text-[#33373d]">
            <span className="flex items-center gap-4">{isLive ? <Pause size={19} /> : <Play size={19} />} Bozor simulyatsiyasi</span>
            <span className="text-xs text-[#73777e]">{isLive ? 'Faol' : 'O‘chiq'}</span>
          </button>
          <button type="button" onClick={() => { onRefreshData(); onClose(); }} className="flex min-h-11 w-full items-center gap-4 px-3 text-left text-sm text-[#33373d]">
            <RefreshCw size={19} /> Ma’lumotni tiklash
          </button>
          <button type="button" onClick={() => { onOpenApkModal(); onClose(); }} className="flex min-h-11 w-full items-center gap-4 px-3 text-left text-sm text-[#33373d]">
            <Smartphone size={19} /> APK haqida
          </button>
          <button type="button" onClick={() => { onTriggerSignal(); onClose(); }} className="mt-2 flex min-h-11 w-full items-center gap-4 border-t border-[#e5e7eb] px-3 pt-2 text-left text-sm font-semibold text-[#2168c4]">
            <TrendingUp size={19} /> Signalni qayta hisoblash
          </button>
        </div>
      </aside>
    </div>
  );
}

