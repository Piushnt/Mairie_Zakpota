import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-border"
        >
          <div className="p-6 flex items-center space-x-4 border-b border-border">
            <Search className="w-6 h-6 text-primary" />
            <input
              autoFocus
              type="text"
              placeholder="Rechercher un service, un acte ou une actualité..."
              className="flex-grow bg-transparent border-none outline-none text-lg font-medium text-ink placeholder-ink-muted/40"
            />
            <button onClick={onClose} title="Fermer la recherche" className="p-2 hover:bg-muted rounded-full transition-colors text-ink-muted">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 bg-muted">
            <h5 className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-4">Suggestions</h5>
            <div className="flex flex-wrap gap-2">
              {['Acte de naissance', 'Mariage', 'Permis de construire', 'Conseil municipal', 'Stade municipal'].map(s => (
                <button key={s} title={`Rechercher "${s}"`} className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-all text-ink-muted">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default SearchModal;
