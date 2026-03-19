import React from 'react';
import { histoireData } from '../data/config';
import { MapPin, Info } from 'lucide-react';

const PageHistoire = () => (
  <main className="pt-12 pb-24 bg-surface">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto mb-24">
        <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Patrimoine & Identité</h4>
        <h2 className="text-5xl font-black text-ink tracking-tight mb-8">Histoire de Za-Kpota</h2>
        <div className="h-1.5 w-16 bg-accent mb-12 rounded-full" />
        
        <div className="prose prose-xl prose-primary">
          <p className="text-2xl font-black italic text-ink/80 leading-relaxed mb-12">
            {histoireData.origine}
          </p>
          <div className="bg-muted p-12 rounded-[3rem] border border-border">
            <h3 className="text-2xl font-black text-primary mb-6 uppercase tracking-tight">Culture et Traditions</h3>
            <p className="text-ink-muted text-lg font-medium leading-relaxed">
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
                src={site.img} 
                alt={site.name} 
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
