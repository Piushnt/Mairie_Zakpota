import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => (
  <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?auto=format&fit=crop&q=80&w=1920"
      alt="Za-Kpota Hero"
      className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/50 to-surface" />

    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6">Commune de Za-Kpota</span>
        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
          Bâtir l'Avenir <br />
          <span className="text-accent underline decoration-white/20 underline-offset-8">Ensemble</span>
        </h1>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-10">
          Accédez aux services de votre mairie, suivez les actualités et participez au développement de notre commune.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button 
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-accent text-primary font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-accent/20 transition-all hover:bg-white"
          >
            Découvrir nos services
          </motion.button>
          <motion.button 
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
          >
            Ma Ville
          </motion.button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
