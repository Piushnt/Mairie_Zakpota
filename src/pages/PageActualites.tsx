import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import NewsCard from '../components/NewsCard';

interface PageActualitesProps {
  news: any[];
}

export default function PageActualites({ news = [] }: PageActualitesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    'Toutes', 'Administration', 'Travaux', 'Sport', 'Santé', 'Annonces'
  ];

  // Trier par date la plus récente en haut
  const sortedNews = [...news].sort((a, b) => {
    const dateA = new Date(a.date || a.created_at).getTime();
    const dateB = new Date(b.date || b.created_at).getTime();
    return dateB - dateA;
  });

  const filteredNews = sortedNews.filter(n => {
    const matchesSearch = (n.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (n.desc?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (n.cat?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Toutes' || n.cat === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <main className="py-20 bg-surface transition-colors duration-300 min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h1 className="text-5xl font-black text-primary mb-4 leading-tight">Flux Citoyen & Actualités</h1>
            <p className="text-ink-muted text-lg font-medium opacity-80">Suivez les projets et la vie de la commune de Za-Kpota en temps réel.</p>
          </div>
          
          <div className="w-full lg:w-96">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
              <input 
                type="text"
                placeholder="Rechercher une actu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl outline-none focus:border-primary transition-all shadow-xl shadow-primary/5 text-ink font-bold"
              />
            </div>
          </div>
        </div>

        {/* Système de Filtrage Horizontal Scrollable */}
        <div className="relative mb-12 group">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            <div className="flex items-center space-x-2 mr-4 text-ink-muted opacity-50 shrink-0">
               <LayoutGrid className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Filtrer par :</span>
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-xl shadow-primary/30 border-transparent' 
                    : 'bg-card text-ink/40 border border-border hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Gradient indicators for scroll on mobile */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-surface to-transparent pointer-events-none md:hidden" />
        </div>

        {currentNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentNews.map((news) => (
                <div key={news.id}>
                  <NewsCard news={news} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  title="Page précédente"
                  className="p-4 rounded-xl border border-border text-ink-muted hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex items-center space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-12 h-12 rounded-xl font-bold transition-all ${
                        currentPage === i + 1 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'bg-card text-ink-muted hover:text-primary border border-border'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  title="Page suivante"
                  className="p-4 rounded-xl border border-border text-ink-muted hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-ink-muted" />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">Aucun résultat trouvé</h3>
            <p className="text-ink/50">Essayez d'ajuster vos termes de recherche.</p>
          </div>
        )}
      </div>
      </motion.div>
    </main>
  );
}
