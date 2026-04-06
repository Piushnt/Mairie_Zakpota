import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, Calendar, MapPin, Search, Filter, ArrowRight, X, Info } from 'lucide-react';

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

  // Body scroll lock
  useEffect(() => {
    if (selectedOpportunity) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOpportunity]);

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
            <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Mairie Connect</h4>
            <h1 className="text-4xl md:text-5xl font-black text-ink mb-4 uppercase tracking-tight">
              Opportunités <span className="text-primary">Locales</span>
            </h1>
            <p className="text-lg text-ink-muted font-medium max-w-2xl mx-auto">
              Retrouvez ici tous les appels d'offres publics, les offres de recrutement de la mairie et les événements économiques.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 w-5 h-5" />
              <input 
                type="text"
                placeholder="Rechercher une opportunité..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-ink font-bold shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'appel_offre', label: 'Appels d\'offres' },
                { id: 'recrutement', label: 'Recrutements' },
                { id: 'foire', label: 'Foires' }
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id as any)}
                  className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border ${
                    filter === btn.id 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                      : 'bg-white text-ink-muted border-border hover:border-primary'
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
                  className="bg-card rounded-[2.5rem] border border-border overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full"
                >
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl ${
                        item.type === 'appel_offre' ? 'bg-accent/10 text-accent' :
                        item.type === 'recrutement' ? 'bg-primary/10 text-primary' :
                        'bg-accent/10 text-accent'
                      }`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getBadgeColor(item.statut)}`}>
                        {item.statut}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-ink mb-4 group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">
                      {item.titre}
                    </h3>
                    <p className="text-ink-muted text-sm mb-8 line-clamp-3 font-medium leading-relaxed">
                      {item.description}
                    </p>

                    <div className="space-y-4 mb-8 mt-auto pt-6 border-t border-border">
                      <div className="flex items-center gap-3 text-xs font-bold text-ink/40">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>Date limite : {item.dateLimite && !isNaN(new Date(item.dateLimite).getTime()) ? new Date(item.dateLimite).toLocaleDateString('fr-FR') : 'Non définie'}</span>
                      </div>
                      {item.contact && (
                        <div className="flex items-center gap-3 text-xs font-bold text-ink/40">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="line-clamp-1">{item.contact}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => setSelectedOpportunity(item)}
                      className="w-full py-4 bg-muted text-ink font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group/btn"
                    >
                      Détails de l'offre
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-32 bg-card rounded-[3rem] border border-dashed border-border mt-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-ink/20" />
              </div>
              <h3 className="text-2xl font-black text-ink uppercase tracking-tight">Aucun résultat</h3>
              <p className="text-ink-muted font-medium">Réessayez avec d'autres mots-clés ou filtres.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOpportunity && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOpportunity(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-card rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 pb-0 flex items-center justify-between z-10">
                <div className={`p-4 rounded-2xl ${
                  selectedOpportunity.type === 'appel_offre' ? 'bg-accent/10 text-accent' :
                  selectedOpportunity.type === 'recrutement' ? 'bg-primary/10 text-primary' :
                  'bg-accent/10 text-accent'
                }`}>
                  {getTypeIcon(selectedOpportunity.type)}
                </div>
                <button 
                  onClick={() => setSelectedOpportunity(null)}
                  className="w-12 h-12 bg-muted hover:bg-red hover:text-white rounded-2xl flex items-center justify-center text-ink transition-all shadow-sm"
                  title="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content - Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 pt-6 custom-scrollbar">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getBadgeColor(selectedOpportunity.statut)}`}>
                      {selectedOpportunity.statut}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-ink/30">
                      ID: #{selectedOpportunity.id.slice(0, 8)}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight leading-tight mb-8">
                    {selectedOpportunity.titre}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-muted rounded-3xl mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-accent shadow-sm">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-ink/30">Échéance</p>
                        <p className="font-bold text-ink text-sm">
                          {selectedOpportunity.dateLimite && !isNaN(new Date(selectedOpportunity.dateLimite).getTime()) ? new Date(selectedOpportunity.dateLimite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non définie'}
                        </p>
                      </div>
                    </div>
                    {selectedOpportunity.contact && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-ink/30">Destination</p>
                          <p className="font-bold text-ink text-sm">{selectedOpportunity.contact}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Description complète</h4>
                    <p className="text-ink-muted leading-relaxed whitespace-pre-wrap font-medium text-lg">
                      {selectedOpportunity.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-muted/50 border-t border-border flex flex-col sm:flex-row gap-4">
                <button className="flex-1 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20">
                  Déposer un dossier
                </button>
                <button 
                  onClick={() => setSelectedOpportunity(null)}
                  className="flex-1 py-5 bg-card text-ink border border-border rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-muted transition-all"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Opportunities;
