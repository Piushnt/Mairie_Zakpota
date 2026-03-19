import React from 'react';
import { tourismData } from '../data/config';
import { MapPin, Phone, Star, Bed, Utensils, Info, Globe } from 'lucide-react';

const PageTourisme = () => (
  <main className="pt-12 pb-24 bg-surface">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Découvrir</h4>
        <h2 className="text-5xl font-black text-ink tracking-tight mb-8">Guide Touristique</h2>
        <p className="text-ink-muted text-lg font-medium leading-relaxed">
          Za-Kpota vous accueille avec sa diversité culturelle, ses paysages magnifiques et son hospitalité légendaire.
        </p>
        <div className="h-1.5 w-16 bg-accent mx-auto mt-10 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Où Manger */}
        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-ink tracking-tight uppercase">Où Manger ?</h3>
          </div>
          <div className="space-y-6">
            {tourismData.eat.map((item, i) => (
              <div key={i} className="p-6 bg-muted rounded-2xl border border-transparent hover:border-primary/20 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-black text-ink tracking-tight">{item.name}</h4>
                  <div className="flex text-accent"><Star className="w-3 h-3 fill-accent" /><Star className="w-3 h-3 fill-accent" /><Star className="w-3 h-3 fill-accent" /></div>
                </div>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">{item.specialty}</p>
                <div className="flex items-center text-ink-muted text-[10px] font-black uppercase tracking-widest">
                  <MapPin className="w-3 h-3 mr-2" /> {item.location}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Où Dormir */}
        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
              <Bed className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-ink tracking-tight uppercase">Où Dormir ?</h3>
          </div>
          <div className="space-y-6">
            {tourismData.sleep.map((item, i) => (
              <div key={i} className="p-6 bg-muted rounded-2xl border border-transparent hover:border-primary/20 transition-all group">
                <h4 className="text-lg font-black text-ink tracking-tight mb-2">{item.name}</h4>
                <p className="text-primary font-bold text-sm mb-4">{item.price}</p>
                <div className="flex items-center text-ink-muted text-[10px] font-black uppercase tracking-widest">
                  <Phone className="w-3 h-3 mr-2" /> {item.contact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary text-white p-12 lg:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
               <h3 className="text-4xl font-black mb-8 tracking-tight">Histoire & Territoire</h3>
               <p className="text-white/70 text-lg leading-relaxed font-medium mb-12">
                  {tourismData.patrimoine.history}
               </p>
               <div className="flex flex-wrap gap-3">
                  {tourismData.patrimoine.districts.map(d => (
                    <span key={d} className="px-5 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 hover:bg-accent hover:text-primary transition-all cursor-default">
                      {d}
                    </span>
                  ))}
               </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
               <Globe className="w-16 h-16 text-accent mb-6" />
               <h4 className="text-xl font-black mb-4">Bureau du Tourisme</h4>
               <p className="text-xs text-white/50 mb-8 font-medium">Ouvert du Lundi au Vendredi <br /> 8h00 - 12h30 / 15h00 - 18h30</p>
               <button className="w-full py-4 bg-accent text-primary font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white transition-all">Télécharger le guide</button>
            </div>
         </div>
      </div>
    </div>
  </main>
);

export default PageTourisme;
