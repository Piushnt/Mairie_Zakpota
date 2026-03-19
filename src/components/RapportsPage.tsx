
import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  ChevronRight,
  ArrowRight,
  Info,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
  id: number;
  title: string;
  date: string;
  type: string;
  category: string;
  fileUrl: string;
  year: string;
}

interface RapportsPageProps {
  store: any;
}

const RapportsPage: React.FC<RapportsPageProps> = ({ store }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('Tous');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [visibleCount, setVisibleCount] = useState(6);

  const reports: Report[] = useMemo(() => store.reports || [], [store.reports]);

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(reports.map(r => r.year)));
    return ['Tous', ...uniqueYears.sort((a, b) => b.localeCompare(a))];
  }, [reports]);

  const categories = ['Toutes', 'Sessions', 'Finances', 'Urbanisme'];

  const filteredReports = useMemo(() => {
    return reports
      .filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = selectedYear === 'Tous' || report.year === selectedYear;
        const matchesCategory = selectedCategory === 'Toutes' || report.category === selectedCategory;
        return matchesSearch && matchesYear && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reports, searchQuery, selectedYear, selectedCategory]);

  const displayedReports = filteredReports.slice(0, visibleCount);
  const quickAccessReports = reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="min-h-screen bg-muted pt-32 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-primary font-black uppercase tracking-widest text-xs mb-4"
          >
            <div className="w-8 h-[2px] bg-primary" />
            <span>Transparence & Gouvernance</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-ink mb-6"
          >
            Rapports & Documents <span className="text-primary">Officiels</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-ink/60 max-w-2xl text-lg leading-relaxed"
          >
            Accédez en toute transparence aux comptes-rendus de sessions, arrêtés municipaux 
            et rapports d'activités de la commune de Za-Kpota.
          </motion.p>
        </div>

        {/* Accès Rapide Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-ink mb-8 flex items-center">
            <ArrowRight className="w-6 h-6 mr-3 text-primary" />
            Accès Rapide <span className="ml-3 text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">Dernières publications</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickAccessReports.map((report, index) => (
              <motion.div
                key={`quick-${report.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-2xl border-l-4 border-primary shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{report.type}</p>
                  <h3 className="text-sm font-bold text-ink truncate group-hover:text-primary transition-colors">{report.title}</h3>
                </div>
                <motion.a 
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Télécharger ${report.title}`}
                  className="ml-4 p-2 bg-muted rounded-lg text-ink/40 group-hover:bg-primary group-hover:text-white transition-all"
                >
                  <Download className="w-4 h-4" />
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-card rounded-3xl shadow-sm border border-border p-6 mb-12 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <input 
                type="text" 
                placeholder="Rechercher un document..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-muted border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-ink"
              />
            </div>

            {/* Year Filter */}
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                title="Filtrer par année"
                className="w-full pl-12 pr-10 py-4 bg-muted border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none text-ink"
              >
                {years.map(year => (
                  <option key={year} value={year} className="bg-card text-ink">{year === 'Tous' ? 'Toutes les années' : year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                title="Filtrer par catégorie"
                className="w-full pl-12 pr-10 py-4 bg-muted border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none text-ink"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-card text-ink">{cat === 'Toutes' ? 'Toutes les catégories' : cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedReports.map((report, index) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-white/40 backdrop-blur-md rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all border border-white/30 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <FileText className="w-7 h-7" />
                  </div>
                  <span className="px-4 py-1.5 bg-white/50 backdrop-blur-sm text-ink/50 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                    {report.year}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-primary font-black uppercase tracking-widest text-[10px] mb-3">
                    <span>{report.type}</span>
                  </div>
                  <h3 className="text-xl font-black text-ink mb-4 leading-tight group-hover:text-primary transition-colors">
                    {report.title}
                  </h3>
                  <div className="flex items-center text-ink/40 text-sm font-medium mb-8">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Séance du {new Date(report.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                <motion.a 
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center space-x-3 w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger</span>
                </motion.a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-20 bg-card rounded-[3rem] border border-dashed border-border">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-ink/20" />
            </div>
            <h3 className="text-xl font-black text-ink mb-2">Aucun document trouvé</h3>
            <p className="text-ink/40">Essayez de modifier vos filtres ou votre recherche.</p>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredReports.length && (
          <div className="mt-16 text-center">
            <button 
              onClick={handleLoadMore}
              className="px-10 py-5 bg-card border-2 border-border text-ink rounded-2xl font-black uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-all shadow-sm"
            >
              Charger plus de documents
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-20 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0">
            <Info className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-black text-ink mb-2 uppercase tracking-tight">Besoin d'un document spécifique ?</h4>
            <p className="text-ink/60 font-medium">
              Si vous ne trouvez pas un document officiel particulier, vous pouvez faire une demande directe 
              au secrétariat de la mairie ou nous contacter via le formulaire de contact.
            </p>
          </div>
          <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 whitespace-nowrap">
            Nous Contacter
          </button>
        </div>
      </div>
    </div>
  );
};

export default RapportsPage;
