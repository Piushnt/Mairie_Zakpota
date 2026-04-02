import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Map as MapIcon, 
  Filter, 
  Navigation, 
  ChevronRight, 
  Info,
  Maximize2,
  Minimize2,
  MapPin
} from 'lucide-react';
import LazyMap, { getIconConfig } from '../components/LazyMap';

interface PageCarteProps {
  locations: any[];
}

const PageCarte: React.FC<PageCarteProps> = ({ locations = [] }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const dynamicCategories = useMemo(() => {
    return Array.from(new Set(locations.map(loc => loc.category))).filter(Boolean);
  }, [locations]);

  const allCategories = [
    'Administration',
    'Éducation',
    'Santé',
    'Lieux de Culte',
    'Marchés & Commerce',
    'Loisirs & Stade',
    'Autre'
  ];

  // Garder seulement les catégories qui ont des lieux, plus celles existantes par défaut
  const categories = useMemo(() => {
    const combined = new Set([...allCategories, ...dynamicCategories]);
    return Array.from(combined);
  }, [dynamicCategories]);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchesCategory = activeCategory ? loc.category === activeCategory : true;
      const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [locations, activeCategory, searchTerm]);

  // Centre de Za-Kpota (approximatif)
  const MAP_CENTER: [number, number] = [7.1915, 2.2635];
  const DEFAULT_ZOOM = 13;

  // Fix Leaflet resize issues on mount/mobile
  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  return (
    <main className={`bg-surface transition-all duration-500 flex flex-col ${isFullscreen ? 'fixed inset-0 z-[60]' : 'min-h-screen pt-12'}`}>
      <Helmet>
        <title>Carte de la Commune - Mairie de Za-Kpota</title>
        <meta name="description" content="Découvrez les infrastructures et points d'intérêt de la commune de Za-Kpota sur notre carte interactive." />
      </Helmet>

      {!isFullscreen && (
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Géo-Localisation</h4>
              <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight mb-4 uppercase">
                Carte de la <span className="text-primary">Commune</span>
              </h1>
              <p className="text-ink-muted text-lg font-medium leading-relaxed">
                Explorez les services municipaux, centres de santé, écoles et infrastructures culturelles de Za-Kpota.
              </p>
            </div>
            
            <div className="flex bg-card p-1 items-center rounded-2xl border border-border shadow-sm">
               <button 
                 onClick={() => setIsFullscreen(true)}
                 className="flex items-center space-x-2 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] text-primary hover:bg-primary/5 transition-all"
               >
                 <Maximize2 className="w-4 h-4" />
                 <span>Plein Écran</span>
               </button>
            </div>
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col lg:flex-row relative bg-card ${isFullscreen ? 'h-full' : 'container mx-auto px-4 mb-20 min-h-[700px] border border-border rounded-[3.5rem] overflow-hidden shadow-2xl'}`}>
        
        {/* Sidebar Controls */}
        <aside className={`w-full lg:w-96 bg-card border-r border-border p-6 lg:p-10 flex flex-col z-20 ${isFullscreen ? 'lg:h-full lg:pt-24' : ''}`}>
          
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20" />
            <input 
              type="text" 
              placeholder="Rechercher un lieu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted border-none rounded-2xl pl-12 pr-4 py-5 outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold transition-all"
            />
          </div>

          <div className="mb-10">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-ink/30 mb-6 flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Filtrer par Catégorie
            </h5>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <button 
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-left transition-all flex items-center justify-between group ${
                  activeCategory === null ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-muted text-ink/60 hover:text-ink'
                }`}
              >
                <span>Tout afficher</span>
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeCategory === null ? 'opacity-100' : 'opacity-20'}`} />
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-left transition-all flex items-center justify-between group ${
                    activeCategory === cat ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-muted text-ink/60 hover:text-ink'
                  }`}
                >
                  <span>{cat}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeCategory === cat ? 'opacity-100' : 'opacity-20'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto hidden lg:block">
            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
              <div className="flex items-center space-x-3 mb-4 text-primary">
                <Navigation className="w-5 h-5" />
                <h6 className="font-black uppercase tracking-[0.2em] text-[10px]">Infos za-kpota</h6>
              </div>
              <p className="text-xs text-ink/60 leading-relaxed font-medium">
                Cliquez sur un marqueur pour obtenir les détails du lieu choisi.
              </p>
            </div>
          </div>
        </aside>

        {/* Map Area */}
        <div className={`flex-1 relative bg-muted transition-all duration-300 ${isFullscreen ? 'h-full' : 'h-[60vh] lg:h-auto min-h-[400px] lg:min-h-0'}`}>
          <LazyMap 
            center={MAP_CENTER} 
            zoom={DEFAULT_ZOOM} 
            markers={filteredLocations}
            height="100%"
            className="w-full absolute inset-0 z-10"
          />
          
          {isFullscreen && (
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 z-[30] w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-ink hover:text-primary transition-all scale-100 hover:scale-110"
              title="Quitter le plein écran"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
          )}

          <div className="absolute bottom-6 right-6 z-[30] pointer-events-none flex flex-col items-end gap-4">
            {/* Légende interactive */}
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl pointer-events-auto border border-border/50 hidden md:block w-48 transition-all hover:scale-105">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-ink/40 mb-3 flex items-center justify-between">
                Légende <MapPin className="w-3 h-3" />
              </h4>
              <div className="space-y-3">
                {['Administration', 'Éducation', 'Santé', 'Lieux de Culte', 'Marchés & Commerce', 'Loisirs & Stade'].map(cat => {
                  const config = getIconConfig(cat);
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: config.color, color: 'white' }}
                      >
                        {React.cloneElement(config.icon as React.ReactElement, { size: 10 })}
                      </div>
                      <span className="text-[10px] font-bold text-ink truncate flex-1">{cat}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl flex items-center space-x-3 pointer-events-auto">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ink">Données Temps Réel</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageCarte;
