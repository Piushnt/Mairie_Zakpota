import React from 'react';
import { histoireData } from '../data/config';
import { MapPin, Info } from 'lucide-react';
import { getOptimizedNetworkUrl } from '../utils/imageParser';

const PageHistoire = () => (
  <main className="pt-12 pb-24 bg-surface">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto mb-24">
        <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Patrimoine & Identité</h4>
        <h2 className="text-5xl font-black text-ink tracking-tight mb-8">Histoire de Za-Kpota</h2>
        <div className="h-1.5 w-16 bg-accent mb-12 rounded-full" />
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-primary/5 border-l-4 border-accent p-8 mb-12 rounded-r-3xl">
            <p className="text-xl font-medium text-ink/90 leading-relaxed italic">
              "{histoireData.origine}"
            </p>
          </div>
          <div className="bg-muted dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] border border-border">
            <h3 className="text-2xl font-black text-primary dark:text-[#00c561] mb-6 uppercase tracking-tight">Culture et Traditions</h3>
            <p className="text-ink-muted dark:text-white/70 text-lg font-medium leading-relaxed">
              {histoireData.culture}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {histoireData.sites.map((site, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-8 border border-border shadow-xl">
              <img 
                src={getOptimizedNetworkUrl(site.img, 800)} 
                alt={site.name} 
                width={800}
                height={450}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="px-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-5 h-5 text-accent" />
                <h3 className="text-2xl font-black text-ink uppercase tracking-tight">{site.name}</h3>
              </div>
              <p className="text-ink-muted leading-relaxed font-medium">
                {site.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-32 p-12 lg:p-20 bg-primary rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
               <h3 className="text-3xl font-black mb-6 tracking-tight">Préserver notre héritage</h3>
               <p className="text-white/70 text-lg font-medium">
                  Le patrimoine de Za-Kpota est notre bien commun. La mairie s'engage dans la valorisation de nos sites historiques et de nos savoir-faire artisanaux.
               </p>
            </div>
            <button className="px-10 py-5 bg-white text-primary font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-accent transition-all shadow-xl">
               Participer à l'inventaire
            </button>
         </div>
      </div>
    </div>
  </main>
);

export default PageHistoire;
