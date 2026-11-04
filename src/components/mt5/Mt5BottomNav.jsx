import React from 'react';
import { 
  ArrowLeftRight, 
  CandlestickChart, 
  Activity,
  History,
  MessageSquare
} from 'lucide-react';

export default function Mt5BottomNav({ activeTab, onSelectTab, balance = 100000 }) {
  const tabs = [
    { id: 'QUOTES', label: 'Kotirovkalar', icon: ArrowLeftRight },
    { id: 'CHART', label: 'Grafik', icon: CandlestickChart },
    { id: 'TRADE', label: 'Savdo', icon: Activity },
    { id: 'HISTORY', label: 'Tarix', icon: History },
    { id: 'MESSAGES', label: 'Xabarlar', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e1e3e6] bg-white px-1 pb-[env(safe-area-inset-bottom)] select-none">
      <div className="mx-auto grid h-[68px] max-w-xl grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === 'CHART'
            ? activeTab === 'CHART' || activeTab === 'SIGNALS'
            : activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              aria-label={tab.id === 'TRADE' ? 'Savdo' : tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex h-full min-w-0 flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-[#2878df]' : 'text-[#55585d]'}`}
            >
              <Icon size={23} strokeWidth={isActive ? 2.5 : 2} />
              {tab.id === 'TRADE' ? (
                <span className="rounded-full bg-[#f0f1f3] px-3 py-0.5 text-[11px] font-semibold leading-none text-[#60636a]">
                  {Math.round(balance / 1000)}K
                </span>
              ) : (
                <span className={`max-w-full truncate text-[10px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
