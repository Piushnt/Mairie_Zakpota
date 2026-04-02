import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Briefcase, Star, Filter, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ArtisanDirectory = () => {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMetier, setActiveMetier] = useState('Tous');

  const metiers = ['Tous', 'Menuisier', 'Maçon', 'Couturier', 'Mécanicien', 'Électricien', 'Agriculture'];

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .order('nom', { ascending: true });
    
    if (!error && data) {
      setArtisans(data);
    }
    setLoading(false);
  };

  const filteredArtisans = artisans.filter(art => {
    const matchesSearch = art.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.metier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMetier = activeMetier === 'Tous' || art.metier === activeMetier;
    return matchesSearch && matchesMetier;
  });

  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <span className="px-4 py-1.5 bg-accent/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">Économie Locale</span>
          <h2 className="text-4xl md:text-5xl font-black text-ink tracking-tight uppercase mb-6">Annuaire des <span className="text-primary">Artisans</span></h2>
          <p className="text-ink-muted text-lg font-medium leading-relaxed">
            Soutenez l'économie de Za-Kpota en faisant appel à nos professionnels locaux. 
            Tous les artisans listés sont vérifiés par la Mairie.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20" />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou métier..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {metiers.map(m => (
              <button
                key={m}
                onClick={() => setActiveMetier(m)}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeMetier === m 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                    : 'bg-card text-ink-muted border-border hover:border-primary'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-card h-80 rounded-[2.5rem] border border-border animate-pulse" />
              ))
            ) : filteredArtisans.map((art, idx) => (
              <motion.div
                key={art.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card rounded-[2.5rem] border border-border overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-muted rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                      {art.photo_url ? (
                        <img src={art.photo_url} alt={art.nom} className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="w-8 h-8 text-ink/10" />
                      )}
                    </div>
                    {art.is_verified && (
                      <div className="flex items-center space-x-1 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Vérifié</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-ink mb-1 group-hover:text-primary transition-colors">{art.nom}</h3>
                  <div className="flex items-center space-x-2 text-primary font-black uppercase tracking-widest text-[9px] mb-4">
                    <Briefcase className="w-3 h-3" />
                    <span>{art.metier}</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-3 text-ink-muted">
                      <MapPin className="w-4 h-4 opacity-30" />
                      <span className="text-xs font-medium">{art.arrondissement}</span>
                    </div>
                    {art.telephone && (
                      <div className="flex items-center space-x-3 text-ink-muted">
                        <Phone className="w-4 h-4 opacity-30" />
                        <span className="text-xs font-bold">{art.telephone}</span>
                      </div>
                    )}
                  </div>

                  <a 
                    href={`tel:${art.telephone}`}
                    className="w-full py-4 bg-muted hover:bg-primary hover:text-white rounded-2xl flex items-center justify-center space-x-3 transition-all text-xs font-black uppercase tracking-widest group/btn"
                  >
                    <span>Appeler</span>
                    <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredArtisans.length === 0 && !loading && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-ink-muted italic">Aucun artisan trouvé dans cette catégorie.</h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtisanDirectory;
