import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryData } from '../data/config';
import { X } from 'lucide-react';

const PhotoGallery = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section className="container mx-auto px-4 mt-24">
      <div className="flex flex-col items-center text-center mb-16">
        <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Fenêtre sur Za-Kpota</h4>
        <h2 className="text-3xl md:text-5xl font-black text-ink tracking-tight">Galerie Photo</h2>
        <div className="h-1.5 w-16 bg-accent mt-6 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {galleryData.map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-sm aspect-square border border-border"
            onClick={() => setSelectedImg(img.url)}
          >
            <img 
              src={img.url} 
              alt={img.caption} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <p className="text-white text-xs font-bold uppercase tracking-widest">{img.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImg(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImg}
              className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border border-white/10"
            />
            <button title="Fermer la galerie" className="absolute top-8 right-8 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md">
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotoGallery;
