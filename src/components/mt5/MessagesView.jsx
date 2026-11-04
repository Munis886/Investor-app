import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function MessagesView() {
  return (
    <section className="flex min-h-[calc(100dvh-9.5rem)] flex-col items-center justify-center px-6 pb-10 text-center">
      <div className="mb-4 grid size-24 place-items-center rounded-full bg-[#f0f1f3] text-[#c5c7ca]">
        <MessageSquare size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-medium text-[#55585d]">Xabarlar yo‘q</h2>
      <p className="mt-2 max-w-xs text-sm leading-5 text-[#8a8d91]">
        Bu demo versiyada broker xabarlari va hisobga kirish xizmati ulanmagan.
      </p>
    </section>
  );
}
