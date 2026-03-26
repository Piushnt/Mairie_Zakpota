import React, { useState } from 'react';
import { Download, FileText, ChevronRight, Search, FileSignature } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const PageFormulaires = ({ formulaires = [] }: { formulaires?: any[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(formulaires.map(f => f.category))).filter(Boolean);

  const filteredForms = formulaires.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? f.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="py-20 bg-surface min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Guichet Numérique - Formulaires Mairie de Za-Kpota</title>
        <meta name="description" content="Téléchargez tous vos formulaires administratifs (État-civil, Urbanisme, Commerce) directement depuis le Guichet Numérique de la Mairie." />
      </Helmet>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileSignature className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-ink mb-6 uppercase tracking-tight">
            Guichet <span className="text-primary">Numérique</span>
          </h1>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto font-medium">
            Accédez instantanément à tous les formulaires administratifs de la Mairie de Za-Kpota. Téléchargez, remplissez et gagnez du temps.
          </p>
        </div>

        {/* Filtres et Recherche */}
        <div className="bg-card rounded-3xl p-6 shadow-xl shadow-primary/5 border border-border mb-12 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
            <input 
              type="text"
              placeholder="Rechercher un formulaire (ex: Permis de construire...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted border-none rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/50 text-ink font-medium transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === null 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-muted text-ink hover:bg-ink/5'
              }`}
            >
              Tous
            </button>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat as string)}
                className={`px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-muted text-ink hover:bg-ink/5'
                }`}
              >
                {cat as string}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des formulaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredForms.length > 0 ? (
              filteredForms.map((form, idx) => (
                <motion.div
                  key={form.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card rounded-3xl p-6 shadow-lg border border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileText className="w-6 h-6 text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-primary mb-1 block">
                        {form.category}
                      </span>
                      <h3 className="font-bold text-ink text-lg leading-tight line-clamp-2">
                        {form.title}
                      </h3>
                    </div>
                  </div>
                  
                  {form.description && (
                    <p className="text-sm text-ink-muted mb-6 line-clamp-2 flex-1">
                      {form.description}
                    </p>
                  )}

                  <a
                    href={form.drive_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full px-4 py-4 bg-muted hover:bg-primary text-ink hover:text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all group-hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger (PDF)
                  </a>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <FileText className="w-16 h-16 text-ink/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ink mb-2">Aucun formulaire trouvé</h3>
                <p className="text-ink-muted">Modifiez vos filtres ou effectuez une autre recherche.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default PageFormulaires;
