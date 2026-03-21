import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => (
  <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?auto=format&fit=crop&q=80&w=1920"
      alt="Za-Kpota Hero"
      className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
    />
    <div className="absolute inset-0 bg-black/80" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#006633]/20 to-transparent" />

    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
          Accédez en toute simplicité aux services de votre mairie.<br />
          Bâtissons ensemble une commune moderne et connectée.
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 bg-[#006633] text-white font-bold rounded-lg shadow-lg hover:bg-[#00552b] transition-all"
          >
            Découvrir nos services
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
          >
            Ma Ville
          </motion.button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
