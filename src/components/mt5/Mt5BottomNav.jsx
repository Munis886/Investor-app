import React from 'react';
import { 
  ArrowLeftRight, 
  CandlestickChart, 
  Zap, 
  Briefcase, 
  Settings2 
} from 'lucide-react';

export default function Mt5BottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'QUOTES', label: 'Kotirovkalar', icon: ArrowLeftRight },
    { id: 'CHART', label: 'Grafik', icon: CandlestickChart },
    { id: 'SIGNALS', label: 'Signallar', icon: Zap },
    { id: 'TRADE', label: 'Savdo', icon: Briefcase },
    { id: 'SETTINGS', label: 'Sozlamalar', icon: Settings2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1117]/95 border-t border-gray-800/80 px-2 py-1 shadow-2xl backdrop-blur-md select-none">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-[#2979ff] font-bold scale-105' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight font-semibold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
