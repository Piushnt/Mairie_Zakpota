import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, ShoppingBag, MapPin, Info } from 'lucide-react';

interface MarketConfig {
  referenceDate: string; // ISO string
  cycleDays: number;
  reminderDays: number;
}

interface MarketLogicProps {
  config: MarketConfig;
}

const MarketLogic: React.FC<MarketLogicProps> = ({ config }) => {
  const [nextMarketDate, setNextMarketDate] = useState<Date | null>(null);
  const [isMarketDay, setIsMarketDay] = useState(false);
  const [daysUntil, setDaysUntil] = useState(0);

  useEffect(() => {
    const calculateMarket = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const refDate = new Date(config.referenceDate);
      refDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - refDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Market is every 5 days
      const cycle = config.cycleDays;
      const daysSinceLast = diffDays % cycle;
      
      let nextMarket: Date;
      if (daysSinceLast === 0 && diffDays >= 0) {
        setIsMarketDay(true);
        nextMarket = today;
        setDaysUntil(0);
      } else {
        setIsMarketDay(false);
        const daysToNext = cycle - (daysSinceLast < 0 ? Math.abs(daysSinceLast) : daysSinceLast);
        nextMarket = new Date(today);
        nextMarket.setDate(today.getDate() + daysToNext);
        setDaysUntil(daysToNext);
      }
      setNextMarketDate(nextMarket);
    };

    calculateMarket();
    const timer = setInterval(calculateMarket, 1000 * 60 * 60); // Recalculate every hour
    return () => clearInterval(timer);
  }, [config]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="py-12 bg-surface min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-ink mb-4">
              Économie & Marchés de Za-Kpota
            </h1>
            <p className="text-lg text-ink-muted">
              Le marché de Za-Kpota est le cœur battant de notre économie locale. Il s'anime tous les 5 jours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Market Status Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-8 rounded-3xl border-2 transition-all ${
                isMarketDay 
                  ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' 
                  : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl ${isMarketDay ? 'bg-primary text-white' : 'bg-muted text-ink/60'}`}>
                  <ShoppingBag className="w-8 h-8" />
                </div>
                {isMarketDay && (
                  <span className="px-4 py-1 bg-primary text-white text-sm font-bold rounded-full animate-pulse">
                    AUJOURD'HUI !
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-ink mb-2">
                {isMarketDay ? "C'est jour de marché !" : "Prochain Marché"}
              </h2>
              
              <div className="flex items-center space-x-2 text-ink-muted mb-6">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  {nextMarketDate ? formatDate(nextMarketDate) : 'Chargement...'}
                </span>
              </div>

              {!isMarketDay && (
                <div className="flex items-center space-x-2 text-primary font-bold">
                  <Clock className="w-5 h-5" />
                  <span>Dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}</span>
                </div>
              )}
            </motion.div>

            {/* Market Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 bg-card rounded-3xl border border-border shadow-sm"
            >
              <h3 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Informations Pratiques
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-bold text-ink">Emplacement</p>
                    <p className="text-sm text-ink-muted">Place du Marché Central, Za-Kpota Centre</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-bold text-ink">Horaires</p>
                    <p className="text-sm text-ink-muted">De l'aube jusqu'au crépuscule</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-bold text-ink">Produits Phares</p>
                    <p className="text-sm text-ink-muted">Produits vivriers, artisanat local, bétail, tissus.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Calendar Table */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold text-ink">Calendrier des 5 prochains marchés</h3>
            </div>
            <div className="divide-y divide-border">
              {[0, 1, 2, 3, 4].map((i) => {
                const date = new Date(nextMarketDate || new Date());
                if (!isMarketDay || i > 0) {
                  date.setDate(date.getDate() + (isMarketDay ? i * 5 : i * 5));
                }
                return (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                        {date.getDate()}
                      </div>
                      <div>
                        <p className="font-bold text-ink capitalize">
                          {date.toLocaleDateString('fr-FR', { weekday: 'long' })}
                        </p>
                        <p className="text-sm text-ink/40">
                          {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    {i === 0 && isMarketDay && (
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">AUJOURD'HUI</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketLogic;
