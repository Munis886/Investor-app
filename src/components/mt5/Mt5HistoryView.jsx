import React, { useState } from 'react';
import { ArrowDownUp, CalendarDays, Clock3 } from 'lucide-react';

export default function Mt5HistoryView({ openOrders = [], closedOrders = [], balance, onNavigateToTrade }) {
  const [activeSection, setActiveSection] = useState('POSITIONS');
  const sections = [
    { id: 'POSITIONS', label: 'Pozitsiyalar', count: openOrders.length },
    { id: 'ORDERS', label: 'Buyurtmalar', count: 0 },
    { id: 'DEALS', label: 'Bitimlar', count: closedOrders.length }
  ];
  const rows = activeSection === 'POSITIONS' ? openOrders : activeSection === 'DEALS' ? closedOrders : [];

  return (
    <section className="min-h-[calc(100dvh-9.5rem)] bg-white text-[#202124]">
      <div className="flex h-11 items-center justify-between px-3 text-xs text-[#70747a]">
        <span>Hisob balansi</span>
        <strong className="text-sm font-semibold text-[#25282d]">
          {Number(balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </strong>
      </div>

      <div className="grid grid-cols-3 border-b border-[#e2e4e7]" role="tablist" aria-label="Savdo tarixi">
        {sections.map(section => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex h-12 items-center justify-center gap-1.5 border-b-2 px-1 text-xs font-medium sm:text-sm ${activeSection === section.id ? 'border-[#2b80e5] text-[#202124]' : 'border-transparent text-[#74777b]'}`}
          >
            <span>{section.label}</span>
            <span className="text-[11px] text-[#92959a]">{section.count}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-[#eceef0] px-4 py-3 text-xs text-[#777b80]">
        <span className="flex items-center gap-1.5"><CalendarDays size={15} /> Barcha aktivlar</span>
        <button type="button" title="Vaqt bo‘yicha tartiblash" className="grid size-8 place-items-center text-[#555a60]">
          <ArrowDownUp size={18} />
        </button>
      </div>

      {rows.length ? (
        <div className="divide-y divide-[#eceef0]">
          {rows.map(order => (
            <article key={order.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <strong className="truncate text-sm font-semibold text-[#272a2f]">{order.symbol}</strong>
                  <span className={order.type === 'BUY' ? 'text-xs font-semibold text-[#2878df]' : 'text-xs font-semibold text-[#d44d57]'}>{order.type}</span>
                  <span className="text-xs text-[#777b80]">{order.lot}</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-[#85898e]">
                  <Clock3 size={12} /> {order.time}{order.closedAt ? ` · ${order.closedAt}` : ''}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-sm text-[#35393f]">{order.entryPrice} <span className="text-xs text-[#777b80]">{order.unit || '$'}</span></div>
                {order.pnl !== undefined && <div className={`text-xs font-medium ${order.pnl >= 0 ? 'text-[#12856c]' : 'text-[#d44d57]'}`}>{order.pnl >= 0 ? '+' : ''}{order.pnl.toFixed(2)}</div>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[42vh] flex-col items-center justify-center px-6 pb-12 text-center">
          <div className="mb-4 grid size-24 place-items-center rounded-[28px] bg-[#f0f1f3] text-[#c5c7ca]">
            <div className="h-12 w-14 rounded-t-2xl border-[7px] border-b-0 border-[#c5c7ca]" />
          </div>
          <h2 className="text-base font-medium text-[#55585d]">{activeSection === 'POSITIONS' ? 'Ochiq pozitsiyalar yo‘q' : activeSection === 'ORDERS' ? 'Faol buyurtmalar yo‘q' : 'Bitimlar tarixi bo‘sh'}</h2>
          <button type="button" onClick={onNavigateToTrade} className="mt-4 text-sm font-semibold text-[#2878df]">Savdo oynasiga o‘tish</button>
        </div>
      )}
    </section>
  );
}
