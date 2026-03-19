import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { partnersData } from '../data/config';
import { ChevronRight } from 'lucide-react';

const PartnersSection = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-24 bg-[#F8FAFC] overflow-hidden relative border-y border-border">
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col items-center text-center">
          <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Partenaires Stratégiques</h4>
          <h2 className="text-3xl md:text-4xl font-black text-ink tracking-tight">Ils nous accompagnent</h2>
          <div className="h-1.5 w-16 bg-accent mt-6 rounded-full" />
        </div>
      </div>

      <div
        className="relative flex overflow-hidden py-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex space-x-24 items-center whitespace-nowrap px-12"
          animate={{ x: isPaused ? undefined : ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear"
            }
          }}
          style={{ width: "fit-content" }}
        >
          {[...partnersData, ...partnersData].map((partner, i) => (
            <div key={i} className="flex-shrink-0 w-48 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-700 opacity-40 hover:opacity-100 transform hover:scale-110">
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
                title={partner.name}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
