import React from 'react';
import { motion } from 'framer-motion';
import { maireData } from '../data/config';
import { Check } from 'lucide-react';

const PageMaire = () => (
  <main className="pt-12 pb-24 bg-surface">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src={maireData.photo} 
              alt={maireData.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute -bottom-10 -right-10 bg-accent p-8 rounded-3xl shadow-xl max-w-xs hidden md:block">
            <p className="text-primary font-black italic text-lg leading-tight">
              "{maireData.mot.substring(0, 100)}..."
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div>
            <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Votre Maire</h4>
            <h2 className="text-5xl font-black text-ink tracking-tighter mb-6">{maireData.name}</h2>
            <div className="h-2 w-24 bg-accent rounded-full mb-10" />
            <p className="text-ink-muted text-lg leading-relaxed font-medium">
              {maireData.biography}
            </p>
          </div>

          <div className="bg-card p-10 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xl font-black mb-8 uppercase tracking-tight text-primary">Vision pour Za-Kpota</h3>
            <div className="grid grid-cols-1 gap-6">
              {maireData.vision.map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-ink font-bold text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="mt-32 max-w-4xl mx-auto text-center">
        <h3 className="text-3xl font-black mb-12 uppercase tracking-tight text-primary">Le Mot du Maire</h3>
        <div className="relative">
          <span className="absolute -top-10 -left-10 text-9xl text-accent/20 font-serif leading-none opacity-50">"</span>
          <p className="text-2xl font-black italic text-ink/80 leading-relaxed relative z-10 px-12">
            {maireData.mot}
          </p>
          <span className="absolute -bottom-20 -right-10 text-9xl text-accent/20 font-serif leading-none opacity-50">"</span>
        </div>
      </div>
    </div>
  </main>
);

export default PageMaire;
