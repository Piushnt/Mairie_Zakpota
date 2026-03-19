import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { newsData } from '../data/config';
import NewsCard from '../components/NewsCard';

interface PageActualitesProps {
  news: any[];
}

export default function PageActualites({ news }: PageActualitesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    'Toutes', 'Gouvernance', 'Infrastructure', 'Santé', 'Économie', 
    'Jeunesse', 'Éducation', 'Social', 'Environnement'
  ];

  const filteredNews = news.filter(n => {
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
            <h1 className="text-5xl font-black text-primary mb-4">Actualités Municipales</h1>
            <p className="text-ink-muted text-lg">Restez informé de la vie citoyenne à Za-Kpota.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
              <input 
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl outline-none focus:border-primary transition-all shadow-sm text-ink"
              />
            </div>
            
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                title="Filtrer par catégorie"
                className="px-6 py-4 bg-card border border-border rounded-2xl outline-none focus:border-primary transition-all shadow-sm font-bold text-sm text-ink/70 cursor-pointer min-w-[160px]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills for quick access */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-card text-ink/50 border border-border hover:border-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
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
