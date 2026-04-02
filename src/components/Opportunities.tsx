import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, Calendar, MapPin, Search, Filter, ArrowRight, ExternalLink, Info } from 'lucide-react';

interface Opportunity {
  id: string;
  type: 'appel_offre' | 'recrutement' | 'foire';
  titre: string;
  description: string;
  dateLimite: string;
  statut: 'ouvert' | 'ferme' | 'urgent';
  contact?: string;
}

interface OpportunitiesProps {
  data: Opportunity[];
}

const Opportunities: React.FC<OpportunitiesProps> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'appel_offre' | 'recrutement' | 'foire'>('all');
  const [search, setSearch] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const filteredData = data.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.titre.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBadgeColor = (statut: string) => {
    switch (statut) {
      case 'urgent': return 'bg-red/10 text-red';
      case 'ouvert': return 'bg-primary/10 text-primary';
      case 'ferme': return 'bg-muted text-ink/60';
      default: return 'bg-accent/10 text-accent';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appel_offre': return <FileText className="w-5 h-5" />;
      case 'recrutement': return <Briefcase className="w-5 h-5" />;
      case 'foire': return <Calendar className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="py-12 bg-surface min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-ink mb-4">
              Opportunités Locales
            </h1>
            <p className="text-lg text-ink-muted">
              Découvrez les appels d'offres, les offres d'emploi et les événements économiques de la commune.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 w-5 h-5" />
              <input 
                type="text"
                placeholder="Rechercher une opportunité..."
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-ink"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'appel_offre', label: 'Appels d\'offres' },
                { id: 'recrutement', label: 'Recrutements' },
                { id: 'foire', label: 'Foires & Événements' }
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id as any)}
                  className={`px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all ${
                    filter === btn.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-card text-ink-muted border border-border hover:border-primary'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${
                        item.type === 'appel_offre' ? 'bg-accent/10 text-accent' :
                        item.type === 'recrutement' ? 'bg-primary/10 text-primary' :
                        'bg-accent/10 text-accent'
                      }`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getBadgeColor(item.statut)}`}>
                        {item.statut}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-primary transition-colors">
                      {item.titre}
                    </h3>
                    <p className="text-ink-muted text-sm mb-6 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-ink/40">
                        <Calendar className="w-4 h-4" />
                        <span>Date limite : {item.dateLimite && !isNaN(new Date(item.dateLimite).getTime()) ? new Date(item.dateLimite).toLocaleDateString('fr-FR') : 'Non définie'}</span>
                      </div>
                      {item.contact && (
                        <div className="flex items-center gap-2 text-sm text-ink/40">
                          <MapPin className="w-4 h-4" />
                          <span>Contact : {item.contact}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => setSelectedOpportunity(item)}
                      className="w-full py-3 bg-muted text-ink font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group/btn"
                    >
                      Voir les détails
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-ink/20" />
              </div>
              <h3 className="text-xl font-bold text-ink">Aucun résultat trouvé</h3>
              <p className="text-ink/40">Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOpportunity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOpportunity(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${
                    selectedOpportunity.type === 'appel_offre' ? 'bg-accent/10 text-accent' :
                    selectedOpportunity.type === 'recrutement' ? 'bg-primary/10 text-primary' :
                    'bg-accent/10 text-accent'
                  }`}>
                    {getTypeIcon(selectedOpportunity.type)}
                  </div>
                  <button 
                    onClick={() => setSelectedOpportunity(null)}
                    className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center text-ink transition-colors"
                    title="Fermer"
                    aria-label="Fermer"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${getBadgeColor(selectedOpportunity.statut)}`}>
                      {selectedOpportunity.statut}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/30">
                      ID: #{selectedOpportunity.id.slice(0, 8)}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-ink uppercase tracking-tight mb-6">
                    {selectedOpportunity.titre}
                  </h2>
                  <div className="flex flex-wrap gap-6 py-6 border-y border-border">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-ink/30">Échéance</p>
                        <p className="font-bold text-ink">
                          {selectedOpportunity.dateLimite && !isNaN(new Date(selectedOpportunity.dateLimite).getTime()) ? new Date(selectedOpportunity.dateLimite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non définie'}
                        </p>
                      </div>
                    </div>
                    {selectedOpportunity.contact && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-ink/30">Lieu / Contact</p>
                          <p className="font-bold text-ink">{selectedOpportunity.contact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose prose-slate max-w-none mb-10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Description de l'offre</h4>
                  <p className="text-ink-muted leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedOpportunity.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20">
                    Postuler / Répondre
                  </button>
                  <button 
                    onClick={() => setSelectedOpportunity(null)}
                    className="flex-1 py-4 bg-muted text-ink rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-border transition-all"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Opportunities;
