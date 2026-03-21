import React from 'react';

const FlashNews = ({ news }: { news: string }) => (
  <div className="bg-[#C8102E] text-white py-2 overflow-hidden border-b border-white/10 uppercase font-black tracking-tighter shadow-lg">
    <div className="flex animate-marquee whitespace-nowrap">
      <span className="mx-4 font-bold uppercase tracking-widest text-[10px] flex items-center">
        <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
        Flash Info : {news}
      </span>
      <span className="mx-4 font-bold uppercase tracking-widest text-[10px] flex items-center">
        <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
        Flash Info : {news}
      </span>
    </div>
  </div>
);

export default FlashNews;
