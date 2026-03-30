import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <section className="relative h-[650px] lg:h-[750px] w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={items[current].img || items[current].image_url}
              alt={items[current].title}
              className="w-full h-full object-cover grayscale-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center justify-center space-x-3 mb-6 bg-primary/20 backdrop-blur-md border border-white/10 w-fit mx-auto px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                  {items[current].cat || items[current].category || 'Actualité'}
                </span>
                {items[current].date && (
                   <>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span className="text-[10px] font-medium text-white/60">
                      {items[current].date}
                    </span>
                   </>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight uppercase italic decoration-primary underline-offset-8">
                {items[current].title}
              </h1>

              <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium leading-relaxed line-clamp-2 md:line-clamp-none">
                {items[current].desc || items[current].description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={() => items[current].id !== 'default' ? navigate(`/news/${items[current].id}`) : navigate('/actualites')}
                  className="group relative flex items-center space-x-3 px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-2xl shadow-black/20"
                >
                  <span>Accéder au détail</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <button
                   onClick={() => navigate('/services/etat-civil')}
                  className="px-8 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
                >
                  Services en ligne
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3">
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
