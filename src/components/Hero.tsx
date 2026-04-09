import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOptimizedNetworkUrl } from '../utils/imageParser';

interface HeroProps {
  news?: any[];
}

const Hero: React.FC<HeroProps> = ({ news = [] }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const items = news.length > 0 ? news.slice(0, 5) : [
    {
      id: 'default',
      title: 'Bienvenue sur le portail officiel de la commune de Za-Kpota',
      desc: 'Accédez en toute simplicité aux services de votre mairie. Bâtissons ensemble une commune moderne et connectée.',
      img: 'https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?auto=format&fit=crop&q=80&w=1920',
      cat: 'Accueil'
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[380px] lg:h-[480px] w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={getOptimizedNetworkUrl(items[current].img || items[current].image_url, 1920)}
              alt={items[current].title}
              width={1920}
              height={1080}
              // @ts-ignore - fetchPriority is relatively new in React types
              fetchPriority={current === 0 ? "high" : "low"}
              loading={current === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover grayscale-[0.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10 pt-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-center justify-center space-x-3 mb-4 bg-primary/20 backdrop-blur-md border border-white/10 w-fit mx-auto px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">
                  {items[current].cat || items[current].category || 'Actualité'}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight uppercase italic underline-offset-4">
                {items[current].title}
              </h1>

              <p className="text-sm md:text-lg text-white/70 mb-8 max-w-2xl mx-auto font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
                {items[current].desc || items[current].description}
              </p>

              <div className="flex flex-row items-center justify-center gap-4">
                <button
                  onClick={() => items[current].id !== 'default' ? navigate(`/news/${items[current].id}`) : navigate('/actualites')}
                  className="group relative flex items-center space-x-2 px-6 py-4 bg-white text-slate-950 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20"
                >
                  <span>Détails</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                   onClick={() => navigate('/suivi-dossier')}
                  className="px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all"
                >
                  Suivre dossier
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-500 rounded-full ${
              current === idx 
                ? 'w-12 h-2 bg-primary' 
                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
             title={`Aller à la slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar (Visual Auto-play indicator) */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-primary/20 w-full z-20">
        <motion.div
           key={current}
           initial={{ width: 0 }}
           animate={{ width: "100%" }}
           transition={{ duration: 6, ease: "linear" }}
           className="h-full bg-primary"
        />
      </div>
    </section>
  );
};

export default Hero;
