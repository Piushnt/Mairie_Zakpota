import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, Scale, ChevronRight } from 'lucide-react';
import MarketCycle from './MarketCycle';

const MunicipalServices = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="container mx-auto px-4 mt-24 mb-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center mb-16"
      >
        <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Administration Communale</h4>
        <h2 className="text-3xl md:text-5xl font-black text-ink tracking-tight uppercase">Services au Citoyen</h2>
        <div className="h-1.5 w-16 bg-accent mt-6 rounded-full" />
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-6 gap-6"
      >
        {/* Market Cycle - Major Tile */}
        <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-2">
          <MarketCycle />
        </motion.div>

        {/* État Civil - Large Bento Card */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-3 lg:col-span-4 bg-card p-10 rounded-[24px] shadow-sm border border-border/50 hover:shadow-2xl hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight text-ink uppercase">État Civil</h3>
            <p className="text-ink-muted leading-relaxed mb-8 text-sm font-medium max-w-sm">
              Simplifiez vos démarches administratives. Obtenez vos actes de naissance, mariage et décès en un temps record.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="w-fit min-h-[44px] px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center group/btn"
          >
            Démarrer une procédure <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Urbanisme - Small Card */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-3 lg:col-span-3 bg-white p-10 rounded-[24px] shadow-sm border border-border/50 hover:shadow-2xl hover:border-primary/30 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
              <Building2 className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-black mb-3 tracking-tight text-ink uppercase">Urbanisme & Foncier</h3>
            <p className="text-ink-muted leading-relaxed text-sm font-medium">
              Consultez le plan de lotissement et demandez vos permis de construire.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center mt-6 hover:text-accent transition-colors underline decoration-accent underline-offset-4"
          >
            Voir les procédures <ChevronRight className="w-3 h-3 ml-1" />
          </motion.button>
        </motion.div>

        {/* Citoyenneté - Small Card (Primary) */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-3 lg:col-span-3 bg-primary text-white p-10 rounded-[24px] shadow-2xl border border-white/10 hover:shadow-primary/30 transition-all group flex flex-col justify-between overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-white/20 transition-colors" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
              <Scale className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-black mb-3 tracking-tight uppercase">Citoyenneté</h3>
            <p className="text-white/60 leading-relaxed text-sm font-medium">
              Participez aux élections locales et donnez votre avis sur les projets communaux.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="w-fit min-h-[44px] text-[10px] font-black uppercase tracking-widest text-accent flex items-center mt-6 hover:text-white transition-colors relative z-10"
          >
            S'enregistrer <ChevronRight className="w-3 h-3 ml-1" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MunicipalServices;
