import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketCycle = () => {
  const navigate = useNavigate();
  // Le cycle du marché de Za-Kpota est de 5 jours.
  // Pour la démo, on utilise une date de référence.
  const [currentDay, setCurrentDay] = useState(1);
  const totalDays = 5;

  useEffect(() => {
    // Calcul factice du jour du cycle (1 à 5)
    // Dans une vraie app, on utiliserait une date de référence fixe :
    // const refDate = new Date('2024-01-01');
    // const diff = Math.floor((new Date().getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    // setCurrentDay((diff % 5) + 1);
    
    // Pour la démo, on simule le jour 2
    setCurrentDay(2);
  }, []);

  const days = [
    { id: 1, name: 'Préparation' },
    { id: 2, name: 'Grand Marché', highlight: true },
    { id: 3, name: 'Après-Marché' },
    { id: 4, name: 'Transition' },
    { id: 5, name: 'Veille' },
  ];

  return (
    <div className="bg-card p-8 rounded-[24px] shadow-sm border border-border/50 overflow-hidden relative group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Cycle Traditionnel</h4>
            <h3 className="text-xl font-black text-ink uppercase tracking-tight">Marché de Za-Kpota</h3>
          </div>
        </div>
        <div className="px-4 py-2 bg-accent/20 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
          Cycle de {totalDays} jours
        </div>
      </div>

      <div className="relative mb-8">
        <div className="flex justify-between relative z-10">
          {days.map((day) => (
            <div key={day.id} className="flex flex-col items-center space-y-3 w-1/5 text-center">
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-500 scale-90 ${
                  currentDay === day.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' 
                    : 'bg-muted text-ink/30'
                }`}
              >
                {day.id}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-tighter ${
                currentDay === day.id ? 'text-primary' : 'text-ink/30'
              }`}>
                {day.name}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-0 w-full h-1 bg-muted -z-0 rounded-full" />
        <motion.div 
          className="absolute top-5 left-0 h-1 bg-primary/20 -z-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentDay / totalDays) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 flex items-center justify-between border border-primary/10">
        <div className="flex items-center space-x-4">
          <Clock className="w-5 h-5 text-primary opacity-50" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-primary/40">Statut Actuel</p>
            <p className="text-sm font-black text-primary uppercase">C'est le jour du Grand Marché !</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/economie')}
          className="px-6 py-3 bg-white text-primary text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-border hover:bg-primary hover:text-white transition-all active:scale-95"
        >
          Voir le calendrier
        </button>
      </div>
    </div>
  );
};

export default MarketCycle;
