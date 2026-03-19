/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Clock,
  MapPin, 
  ChevronDown, 
  ArrowRight, 
  FileText, 
  Users, 
  Home, 
  Building2, 
  Calendar, 
  Info,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Bell,
  Scale,
  Gavel,
  Landmark,
  FileCheck,
  Map as MapIcon,
  MessageSquare,
  Globe,
  Award,
  Briefcase,
  Target,
  Check,
  Moon,
  Sun,
  ChevronRight,
  ExternalLink,
  Heart,
  Share2,
  User,
  Send,
  MessageCircle,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- DATA ---
import { 
  servicesData, 
  tourismData, 
  galleryData,
  maireData,
  conseilMunicipal,
  arrondissementsData,
  histoireData,
  partnersData,
  newsData
} from './data/config';

import { initialStoreData } from './data/store';
import AdminDashboard from './components/AdminDashboard';
import NotificationBell from './components/NotificationBell';
import RapportsPage from './components/RapportsPage';
import Arrondissements from './components/Arrondissements';
import MarketLogic from './components/MarketLogic';
import Opportunities from './components/Opportunities';
import RendezVous from './components/RendezVous';
import NewsCard from './components/NewsCard';

// --- TYPES ---
type Page = 'home' | 'etat-civil' | 'urbanisme' | 'economie' | 'conseil' | 'actualites' | 'contact' | 'maire' | 'decouvrir' | 'eservices' | 'histoire' | 'arrondissements' | 'publications' | 'agenda' | 'tourisme' | 'stade' | 'signalement' | 'simulateur' | 'admin-portal' | 'opportunites' | 'rendezvous';

// --- CONSTANTS ---
const NOM_VILLE = "Za-Kpota";
const SLOGAN_VILLE = "Commune de Za-Kpota";
const EMAIL_CONTACT = "contact@mairie-zakpota.bj";
const TEL_CONTACT = "+229 97 00 00 00";
const ADRESSE_MAIRIE = "Hôtel de Ville de Za-Kpota, Centre Ville";

// --- COMPONENTS ---

const TopBar = () => (
  <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-2 hidden lg:block">
    <div className="container mx-auto px-4 flex justify-end space-x-6">
      <a href="#" className="top-bar-link">Préfecture d'Abomey</a>
      <a href="#" className="top-bar-link">Bénin Révélé</a>
      <a href="#" className="top-bar-link">Service Public</a>
      <a href="#" className="top-bar-link">Portail des Communes</a>
      <a href="#" className="top-bar-link">Lois et Décrets</a>
      <a href="#" className="top-bar-link">E-Services Mairie</a>
    </div>
  </div>
);

const SearchModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
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
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-6 h-6 text-ink-muted" />
            </button>
          </div>
          <div className="p-6 bg-muted">
            <h5 className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-4">Suggestions</h5>
            <div className="flex flex-wrap gap-2">
              {['Acte de naissance', 'Mariage', 'Permis de construire', 'Conseil municipal', 'Stade municipal'].map(s => (
                <button key={s} className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-all">
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

const FlashNews = ({ news }: { news: string }) => (
  <div className="bg-red text-white py-2 overflow-hidden relative z-30 shadow-lg">
    <div className="container mx-auto px-4 flex items-center">
      <div className="flex-shrink-0 bg-white text-red font-black text-[10px] px-3 py-1 rounded uppercase tracking-widest mr-6 z-10 shadow-sm">
        Flash Info
      </div>
      <div className="flex-grow overflow-hidden relative h-6">
        <div className="absolute whitespace-nowrap animate-marquee flex items-center space-x-12">
          <span className="font-bold flex items-center"><Bell className="w-4 h-4 mr-2" /> {news}</span>
          <span className="font-bold flex items-center"><Info className="w-4 h-4 mr-2" /> Inscriptions ouvertes pour le tournoi inter-villages au Stade Municipal.</span>
          <span className="font-bold flex items-center"><Check className="w-4 h-4 mr-2" /> Digitalisation des actes de naissance : demandez votre acte sécurisé sur eservices.anip.bj.</span>
        </div>
      </div>
    </div>
  </div>
);

const Header = ({ 
  activePage, 
  setActivePage, 
  isDarkMode, 
  toggleDarkMode,
  onOpenSearch,
  notifications,
  onMarkAsRead
}: { 
  activePage: Page, 
  setActivePage: (p: Page) => void, 
  isDarkMode: boolean,
  toggleDarkMode: () => void,
  onOpenSearch: () => void,
  notifications: any[],
  onMarkAsRead: (id: string) => void
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'La Mairie', id: 'mairie', submenu: [
      { label: 'Le Maire', id: 'maire' },
      { label: 'Le Conseil Municipal', id: 'conseil' },
      { label: 'Les Arrondissements', id: 'arrondissements' },
      { label: 'Histoire et Culture', id: 'histoire' },
      { label: 'Transparence & Rapports', id: 'publications' },
    ]},
    { label: 'Services Publics', id: 'eservices', submenu: [
      { label: 'État Civil', id: 'etat-civil' },
      { label: 'Urbanisme', id: 'urbanisme' },
      { label: 'Simulateur Fiscal', id: 'simulateur' },
      { label: 'Prise de RDV', id: 'rendezvous' },
    ]},
    { label: 'Économie', id: 'economie', submenu: [
      { label: 'Marchés', id: 'economie' },
      { label: 'Opportunités Locales', id: 'opportunites' },
    ]},
    { label: 'Agenda & Loisirs', id: 'agenda', submenu: [
      { label: 'Événements', id: 'agenda' },
      { label: 'Stade Municipal', id: 'stade' },
      { label: 'Guide Touristique', id: 'tourisme' },
    ]},
    { label: 'Actualités', id: 'actualites' },
    { label: 'Signalement', id: 'signalement' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left: Armoirie du Pays */}
          <div className="flex items-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coat_of_arms_of_Benin.svg/1200px-Coat_of_arms_of_Benin.svg.png" 
              alt="Armoirie du Bénin"
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <button 
                  onClick={() => !item.submenu && setActivePage(item.id as Page)}
                  className={`nav-link flex items-center space-x-1 ${activePage === item.id || item.submenu?.some(s => s.id === activePage) ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                  {item.submenu && <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />}
                </button>
                {item.submenu && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-card shadow-2xl border border-border w-64 py-2 rounded-b-lg">
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setActivePage(sub.id as Page)}
                          className="w-full text-left px-6 py-3 text-sm font-medium text-ink-muted hover:bg-primary hover:text-white transition-colors"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            {/* Logo et Nom de la Mairie (Right) */}
            <div 
              className="hidden md:flex items-center space-x-3 cursor-pointer border-l border-white/20 pl-6"
              onClick={() => setActivePage('home')}
            >
              <div className="w-10 h-10 bg-white rounded-full p-1 flex items-center justify-center overflow-hidden shadow-inner">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coat_of_arms_of_Benin.svg/1200px-Coat_of_arms_of_Benin.svg.png" 
                  alt="Logo Za-Kpota"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-white text-right">
                <h1 className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                  Mairie de <br />
                  Za-Kpota
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationBell 
                notifications={notifications} 
                onMarkAsRead={onMarkAsRead} 
                onViewAll={() => setActivePage('actualites')} 
              />
              <button onClick={onOpenSearch} className="text-white/80 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={toggleDarkMode} className="text-white/80 hover:text-white transition-colors">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-surface lg:hidden overflow-y-auto"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center p-2">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coat_of_arms_of_Benin.svg/1200px-Coat_of_arms_of_Benin.svg.png" 
                      alt="Logo"
                      className="w-full h-full object-contain brightness-0 invert"
                    />
                  </div>
                  <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Za-Kpota</h2>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-ink"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-8 flex-grow">
                {navItems.map((item, i) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-accent font-black uppercase tracking-[0.3em] text-[10px] mb-4">{item.label}</div>
                    <div className="grid grid-cols-1 gap-4">
                      {item.submenu ? (
                        item.submenu.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setActivePage(sub.id as Page);
                              setIsMenuOpen(false);
                            }}
                            className={`text-left py-2 text-2xl font-black transition-all hover:text-primary ${activePage === sub.id ? 'text-primary' : 'text-ink'}`}
                          >
                            {sub.label}
                          </button>
                        ))
                      ) : (
                        <button
                          onClick={() => {
                            setActivePage(item.id as Page);
                            setIsMenuOpen(false);
                          }}
                          className={`text-left py-2 text-2xl font-black transition-all hover:text-primary ${activePage === item.id ? 'text-primary' : 'text-ink'}`}
                        >
                          {item.label}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-12 pt-12 border-t border-border space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Contact d'urgence</p>
                    <p className="font-black text-ink">{TEL_CONTACT}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-ink hover:bg-primary hover:text-white transition-all"><Facebook className="w-5 h-5" /></a>
                  <a href="#" className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-ink hover:bg-primary hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
                  <a href="#" className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-ink hover:bg-primary hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => (
  <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
    <img 
      src="https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?auto=format&fit=crop&q=80&w=1920" 
      alt="Za-Kpota Hero"
      className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
    />
    <div className="absolute inset-0 hero-overlay" />
    
    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h4 className="text-accent font-bold uppercase tracking-[0.4em] text-sm mb-6">Commune de Za-Kpota</h4>
        <h2 className="text-5xl md:text-8xl font-bold text-white mb-8 inline-block pb-4 tricolor-border">
          Services et Démarches
        </h2>
        <p className="text-white/80 text-xl max-w-3xl mx-auto font-light leading-relaxed">
          Accédez en toute simplicité aux services de votre mairie. <br />
          Bâtissons ensemble une commune moderne et connectée.
        </p>
      </motion.div>
    </div>
  </section>
);

const ServiceCard = ({ title, desc, url, logo }: { title: string, desc: string, url: string, logo: string }) => (
  <div className="service-card">
    <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-muted rounded-lg p-4">
      <img src={logo} alt={title} className="max-w-full max-h-full object-contain" />
    </div>
    <div className="flex-grow">
      <h3 className="text-2xl font-bold text-primary mb-4">{title}</h3>
      <p className="text-ink/60 mb-6 leading-relaxed">
        {desc}
      </p>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary font-bold hover:underline flex items-center"
      >
        {url} <ExternalLink className="w-4 h-4 ml-2" />
      </a>
    </div>
  </div>
);

const MunicipalServicesSection = () => (
  <section className="container mx-auto px-4 mt-24">
    <div className="flex flex-col items-center text-center mb-16">
      <h4 className="text-primary font-bold uppercase tracking-[0.4em] text-sm mb-4">Administration</h4>
      <h2 className="text-4xl md:text-5xl font-bold text-ink">Services Municipaux</h2>
      <div className="h-1 w-24 bg-accent mt-6" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-card p-10 rounded-2xl shadow-sm border border-border hover:border-primary transition-colors group">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
          <FileCheck className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-2xl font-bold mb-4">État Civil</h3>
        <p className="text-ink/60 leading-relaxed mb-8">
          Gestion des actes de naissance, de mariage et de décès. Le service de l'état civil assure l'enregistrement et la conservation des faits marquants de la vie des citoyens.
        </p>
        <button className="text-primary font-bold flex items-center hover:underline">
          En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="bg-card p-10 rounded-2xl shadow-sm border border-border hover:border-primary transition-colors group">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
          <Building2 className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Urbanisme</h3>
        <p className="text-ink/60 leading-relaxed mb-8">
          Planification urbaine, délivrance des permis de construire et gestion du foncier. Nous veillons au développement harmonieux et durable de notre territoire communal.
        </p>
        <button className="text-primary font-bold flex items-center hover:underline">
          En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="bg-card p-10 rounded-2xl shadow-sm border border-border hover:border-primary transition-colors group">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
          <Scale className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Élections</h3>
        <p className="text-ink/60 leading-relaxed mb-8">
          Organisation des scrutins et gestion des listes électorales. Ce service garantit l'exercice du droit de vote et la transparence des processus démocratiques locaux.
        </p>
        <button className="text-primary font-bold flex items-center hover:underline">
          En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  </section>
);

const PhotoGallery = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section className="container mx-auto px-4 mt-24">
      <div className="flex flex-col items-center text-center mb-16">
        <h4 className="text-primary font-bold uppercase tracking-[0.4em] text-sm mb-4">Patrimoine</h4>
        <h2 className="text-4xl md:text-5xl font-bold text-ink">Galerie Photos</h2>
        <div className="h-1 w-24 bg-accent mt-6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {galleryData.map((img, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-sm aspect-square"
            onClick={() => setSelectedImg(img.url)}
          >
            <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <p className="text-white text-sm font-medium">{img.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImg && (
          <div 
            className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImg(null)}
          >
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={selectedImg} 
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
            <button className="absolute top-8 right-8 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const SignalementForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [location, setLocation] = useState<string>('');

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section className="container mx-auto px-4 mt-24">
      <div className="bg-card rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="p-12 lg:p-20 bg-primary text-white">
          <h4 className="font-bold uppercase tracking-[0.4em] text-xs mb-6 opacity-60">Citoyenneté</h4>
          <h2 className="text-4xl font-bold mb-8 leading-tight">Signaler une anomalie</h2>
          <p className="text-white/70 text-lg mb-12 leading-relaxed">
            Aidez-nous à améliorer votre cadre de vie. Signalez tout problème de voirie, d'éclairage ou de propreté directement via ce formulaire.
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-bold text-white">Géolocalisation</p>
                <p className="text-sm text-white/50">Précision accrue pour nos équipes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-bold text-white">Traitement rapide</p>
                <p className="text-sm text-white/50">Sous 48h ouvrées</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-12 lg:p-20">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-ink">Signalement envoyé !</h3>
              <p className="text-ink-muted">Merci pour votre contribution. Nos équipes interviendront dans les plus brefs délais.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 text-primary font-bold hover:underline">Faire un autre signalement</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Nom</label>
                  <input required type="text" className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-ink" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Email</label>
                  <input required type="email" className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-ink" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Objet du signalement</label>
                <select required className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-ink">
                  <option>Éclairage public défectueux</option>
                  <option>Nid de poule / Voirie</option>
                  <option>Problème de propreté / Déchets</option>
                  <option>Autre anomalie</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Localisation</label>
                <div className="flex space-x-2">
                  <input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Adresse ou coordonnées"
                    className="flex-grow bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-ink" 
                  />
                  <button 
                    type="button"
                    onClick={handleGetLocation}
                    className="bg-accent text-primary p-3 rounded-xl hover:bg-accent/80 transition-colors"
                    title="Ma position actuelle"
                  >
                    <MapIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Message / Détails</label>
                <textarea required rows={4} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none text-ink"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le signalement'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const PartnersSection = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-24 bg-surface overflow-hidden relative">
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col items-center text-center">
          <h4 className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-4">Coopération</h4>
          <h2 className="text-4xl font-bold text-ink">Nos Partenaires</h2>
          <div className="h-1 w-24 bg-accent mt-6" />
        </div>
      </div>

      <div 
        className="relative flex overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div 
          className="flex space-x-16 items-center whitespace-nowrap"
          animate={isPaused ? {} : { x: [0, -1920] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear"
            }
          }}
        >
          {[...partnersData, ...partnersData, ...partnersData].map((partner, i) => (
            <div key={i} className="flex-shrink-0 w-48 h-24 flex items-center justify-center group">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-w-full max-h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                title={partner.name}
              />
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 flex justify-center space-x-4">
        <button className="p-2 rounded-full border border-border text-ink/40 hover:text-primary hover:border-primary transition-all">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <button className="p-2 rounded-full border border-border text-ink/40 hover:text-primary hover:border-primary transition-all">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};


const PageHome = ({ setActivePage }: { setActivePage: (p: Page) => void }) => (
    <main className="pb-20 bg-surface transition-colors duration-300">
    <Hero />
    
    <section className="container mx-auto px-4 -mt-20 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ServiceCard 
          title="État Civil"
          desc="Demandez vos actes de naissance, mariage ou décès en ligne. Suivez l'évolution de votre demande en temps réel."
          url="https://service-public.bj/etat-civil"
          logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coat_of_arms_of_Benin.svg/1200px-Coat_of_arms_of_Benin.svg.png"
        />
        <ServiceCard 
          title="Urbanisme & Foncier"
          desc="Permis de construire, certificat d'urbanisme et démarches foncières. Consultez le Plan Directeur d'Urbanisme."
          url="https://zakpota.bj/urbanisme"
          logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coat_of_arms_of_Benin.svg/1200px-Coat_of_arms_of_Benin.svg.png"
        />
        <ServiceCard 
          title="Marchés Publics"
          desc="Consultez les appels d'offres en cours et les résultats des attributions pour la commune de Za-Kpota."
          url="https://marches-publics.bj"
          logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coat_of_arms_of_Benin.svg/1200px-Coat_of_arms_of_Benin.svg.png"
        />
        <ServiceCard 
          title="Taxe de Développement"
          desc="Payez vos taxes locales et contribuez au développement des infrastructures de notre commune."
          url="https://zakpota.bj/taxes"
          logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coat_of_arms_of_Benin.svg/1200px-Coat_of_arms_of_Benin.svg.png"
        />
      </div>
    </section>

    <section className="container mx-auto px-4 mt-24">
      <div className="flex items-center justify-between mb-12 border-b-2 border-border pb-6">
        <div>
          <h2 className="text-4xl font-bold text-primary">Actualités Municipales</h2>
          <p className="text-ink-muted mt-2">Toute l'actualité de votre commune en temps réel</p>
        </div>
        <button className="text-primary font-bold hover:underline flex items-center group">
          Toutes les actualités <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {newsData.slice(0, 3).map((news) => (
          <div key={news.id}>
            <NewsCard news={news} />
          </div>
        ))}
      </div>
    </section>

    <PartnersSection />

    <MunicipalServicesSection />

    <PhotoGallery />

    <SignalementForm />

    <section className="bg-muted py-24 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card p-8 rounded-2xl shadow-sm border-b-4 border-accent text-center">
            <h6 className="text-4xl font-bold text-primary mb-2">13</h6>
            <p className="text-ink-muted font-medium text-sm uppercase tracking-widest">Arrondissements</p>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-sm border-b-4 border-primary text-center">
            <h6 className="text-4xl font-bold text-primary mb-2">150K+</h6>
            <p className="text-ink-muted font-medium text-sm uppercase tracking-widest">Habitants</p>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-sm border-b-4 border-red text-center">
            <h6 className="text-4xl font-bold text-primary mb-2">45+</h6>
            <p className="text-ink-muted font-medium text-sm uppercase tracking-widest">Projets en cours</p>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-sm border-b-4 border-primary text-center">
            <h6 className="text-4xl font-bold text-primary mb-2">24/7</h6>
            <p className="text-ink-muted font-medium text-sm uppercase tracking-widest">E-Services</p>
          </div>
        </div>
      </div>
    </section>
  </main>
);

const PageMaire = () => (
  <main className="py-20 bg-surface">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-32"
        >
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-3xl" />
            <img 
              src={maireData.photo} 
              alt={maireData.name} 
              className="w-full rounded-3xl shadow-2xl border-4 border-border"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-card/90 backdrop-blur-md p-6 rounded-2xl border border-border">
              <h1 className="text-2xl font-bold text-ink">{maireData.name}</h1>
              <p className="text-primary font-bold text-sm uppercase tracking-widest">Maire de Za-Kpota</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          <section>
            <h2 className="text-accent font-bold uppercase tracking-[0.4em] text-xs mb-4">Le Mot du Maire</h2>
            <h3 className="text-4xl font-bold text-ink mb-6 leading-tight">
              "Bâtir ensemble le <span className="text-primary">Za-Kpota de demain</span>"
            </h3>
            <p className="text-ink-muted text-xl italic leading-relaxed">
              {maireData.mot}
            </p>
          </section>

          <section className="bg-card p-10 rounded-3xl shadow-sm border border-border">
            <h4 className="text-xl font-bold mb-6 flex items-center text-ink">
              <Info className="w-6 h-6 mr-3 text-primary" /> Biographie
            </h4>
            <p className="text-ink-muted leading-relaxed text-lg">
              {maireData.biography}
            </p>
          </section>

          <section>
            <h4 className="text-xl font-bold mb-8 flex items-center text-ink">
              <Target className="w-6 h-6 mr-3 text-primary" /> Vision et Priorités
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {maireData.vision.map((v, i) => (
                <div key={i} className="flex items-center p-4 bg-muted rounded-xl border border-border">
                  <Check className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                  <span className="text-ink/80 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  </main>
);

const PageConseil = () => (
  <main className="py-20 bg-surface transition-colors duration-300 min-h-screen">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-accent font-bold uppercase tracking-[0.4em] text-xs mb-4">Gouvernance</h2>
        <h3 className="text-4xl font-bold text-ink">Le Conseil Municipal</h3>
        <p className="text-ink-muted mt-4 max-w-2xl mx-auto">
          Découvrez les élus qui travaillent quotidiennement pour le développement de notre commune.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {conseilMunicipal.map((membre, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border group"
          >
            <div className="h-64 overflow-hidden">
              <img src={membre.photo} alt={membre.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6 text-center">
              <h4 className="font-bold text-lg text-ink mb-1">{membre.name}</h4>
              <p className="text-primary text-sm font-medium">{membre.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </motion.div>
  </main>
);

const PageHistoire = () => (
  <main className="py-20 bg-surface transition-colors duration-300 min-h-screen">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-accent font-bold uppercase tracking-[0.4em] text-xs mb-4">Patrimoine</h2>
        <h3 className="text-5xl font-bold text-ink mb-12">Histoire et Culture</h3>
        
        <div className="space-y-16">
          <section className="bg-card p-12 rounded-3xl shadow-sm border border-border">
            <h4 className="text-2xl font-bold mb-6 text-primary">Origines</h4>
            <p className="text-ink-muted text-lg leading-relaxed">
              {histoireData.origine}
            </p>
          </section>

          <section>
            <h4 className="text-3xl font-black mb-12 text-ink">Sites Touristiques Incontournables</h4>
            <div className="grid grid-cols-1 gap-12">
              {histoireData.sites.map((site, i) => (
                <div key={i} className="bg-card rounded-[2.5rem] overflow-hidden shadow-xl border border-border flex flex-col md:flex-row">
                  <div className="w-full md:w-2/5 h-72 md:h-auto overflow-hidden">
                    <img src={site.img} alt={site.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-10 md:p-12 flex-1 flex flex-col justify-center">
                    <h5 className="font-black text-3xl mb-6 text-primary">{site.name}</h5>
                    <p className="text-ink-muted text-lg leading-relaxed">{site.description}</p>
                    <button className="mt-8 flex items-center text-accent font-bold hover:translate-x-2 transition-transform">
                      En savoir plus <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-primary text-white p-12 rounded-3xl shadow-xl">
            <h4 className="text-2xl font-bold mb-6">Identité Culturelle</h4>
            <p className="text-white/80 text-lg leading-relaxed">
              {histoireData.culture}
            </p>
          </section>
        </div>
      </div>
    </div>
  </motion.div>
  </main>
);

const PageAgenda = React.lazy(() => import('./pages/PageAgenda'));

const PageStade = ({ stade }: { stade: any }) => (
  <main className="bg-surface transition-colors duration-300 min-h-screen">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-20">
    <div className="container mx-auto px-4">
      <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border">
        <div className="relative h-[500px]">
          <img 
            src={stade.image} 
            alt="Stade Municipal" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-12 h-1 bg-accent rounded-full"></div>
                <span className="text-accent font-bold uppercase tracking-widest text-sm">Infrastructure Sportive</span>
              </div>
              <h1 className="text-6xl font-black text-white mb-4">Stade Municipal de Za-Kpota</h1>
              <p className="text-white/80 text-xl max-w-2xl">Un complexe moderne dédié à l'excellence sportive et au rassemblement de la jeunesse.</p>
            </div>
          </div>
        </div>
        
        <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-2 space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">Présentation</h2>
              <p className="text-ink-muted leading-relaxed text-lg">
                Le Stade Municipal de Za-Kpota est le cœur battant du sport dans notre commune. Récemment rénové, il offre des installations de qualité pour le football, l'athlétisme et diverses activités physiques. C'est le lieu de rencontre privilégié pour les compétitions locales et inter-communales.
              </p>
            </section>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                <div className="text-primary font-black text-4xl mb-2">5 000</div>
                <div className="text-ink/50 uppercase tracking-widest text-xs font-bold">Places assises</div>
              </div>
              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                <div className="text-primary font-black text-4xl mb-2">FIFA</div>
                <div className="text-ink/50 uppercase tracking-widest text-xs font-bold">Normes Pelouse</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-ink p-8 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-6 text-accent">Équipements</h3>
              <ul className="space-y-4">
                {stade.equipements?.map((eq: string, i: number) => (
                  <li key={i} className="flex items-center text-sm text-white/70">
                    <Check className="w-4 h-4 mr-3 text-accent" /> {eq}
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="w-full py-5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center">
              Réserver le terrain <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  </main>
);

const PageTourisme = () => (
  <main className="py-20 bg-surface transition-colors duration-300 min-h-screen">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold mb-16 text-center text-ink">Découvrir Za-Kpota</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h3 className="text-2xl font-bold mb-8 flex items-center text-ink">
            <Home className="w-6 h-6 mr-3 text-primary" /> Où Dormir
          </h3>
          <div className="grid gap-6">
            {tourismData.sleep.map((item, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                <h4 className="font-bold text-xl mb-2 text-ink">{item.name}</h4>
                <p className="text-primary font-bold mb-4">{item.price}</p>
                <p className="text-ink-muted text-sm flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> {item.contact}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-8 flex items-center text-ink">
            <Building2 className="w-6 h-6 mr-3 text-primary" /> Où Manger
          </h3>
          <div className="grid gap-6">
            {tourismData.eat.map((item, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                <h4 className="font-bold text-xl mb-2 text-ink">{item.name}</h4>
                <p className="text-accent font-bold mb-4">{item.specialty}</p>
                <p className="text-ink-muted text-sm flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> {item.location}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </motion.div>
  </main>
);

const PageActualites = React.lazy(() => import('./pages/PageActualites'));

const PageService = ({ type, services }: { type: 'etat-civil' | 'urbanisme', services: any }) => {
  const data = services[type];
  const [selectedAct, setSelectedAct] = useState(data[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedAct(data[0]);
  }, [type, data]);

  return (
    <main className="bg-surface transition-colors duration-300 min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="bg-primary p-10 rounded-[2rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Services Municipaux</h2>
                  <h3 className="text-4xl font-black mb-6 leading-tight">
                    {type === 'etat-civil' ? 'État Civil' : 'Urbanisme & Foncier'}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {type === 'etat-civil' 
                      ? 'Gérez vos documents officiels en toute simplicité. Actes de naissance, mariage et décès.' 
                      : 'Démarches liées à la construction, au foncier et à l\'aménagement du territoire.'}
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              <div className="bg-card p-4 rounded-[2rem] shadow-sm border border-border space-y-2">
                <div className="px-6 py-2 border-b border-border mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Liste des démarches</span>
                </div>
                {currentItems.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setSelectedAct(act)}
                    className={`w-full text-left px-6 py-5 rounded-2xl font-bold transition-all flex items-center justify-between group ${
                      selectedAct.id === act.id 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                        : 'text-ink-muted hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    <span className="text-sm">{act.name}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedAct.id === act.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-border px-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-border text-ink-muted hover:text-primary disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-ink-muted">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-border text-ink-muted hover:text-primary disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <div className="bg-card rounded-[3rem] shadow-xl p-10 md:p-16 border border-border relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-1 bg-accent rounded-full"></div>
                    <span className="text-accent font-bold uppercase tracking-widest text-[10px]">Détails de la procédure</span>
                  </div>
                  <h3 className="text-4xl font-black text-ink leading-tight">{selectedAct.name}</h3>
                </div>
                <div className="bg-primary/5 border border-primary/10 px-8 py-4 rounded-2xl text-center">
                  <div className="text-ink/40 text-[10px] font-bold uppercase tracking-widest mb-1">Frais de dossier</div>
                  <div className="text-primary font-black text-2xl">
                    {selectedAct.cost === 0 ? 'Gratuit' : `${selectedAct.cost.toLocaleString()} FCFA`}
                  </div>
                </div>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
                <p className="text-ink/70 leading-relaxed text-xl italic font-medium border-l-4 border-accent pl-8">
                  {selectedAct.description}
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold text-ink">Pièces à fournir</h4>
                  </div>
                  <ul className="space-y-4">
                    {selectedAct.pieces?.map((req, i) => (
                      <li key={i} className="flex items-start bg-primary/5 p-5 rounded-2xl group hover:bg-primary/10 transition-colors">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold mr-4 mt-0.5 shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-ink/80 text-sm font-medium leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-10">
                  <div className="bg-ink p-10 rounded-[2.5rem] text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h4 className="flex items-center text-xl font-bold mb-8 text-accent">
                        <Clock className="w-6 h-6 mr-4" />
                        Délai de traitement
                      </h4>
                      <div className="space-y-8">
                        <div>
                          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Délai d'obtention</p>
                          <p className="text-2xl font-bold">{selectedAct.delay}</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
                  </div>

                  <button className="w-full py-6 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center group uppercase tracking-widest text-sm">
                    Démarrer la procédure <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    </main>
  );
};

const SimulateurFiscal = () => {
  const [valeur, setValeur] = useState<number>(0);
  const [type, setType] = useState<'habitation' | 'foncier'>('habitation');
  const result = type === 'habitation' ? valeur * 0.01 : valeur * 0.02;

  return (
    <main className="py-20 bg-paper">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card rounded-3xl shadow-xl p-12 border border-border">
          <h2 className="text-4xl font-bold mb-4 text-ink">Simulateur Fiscal</h2>
          <p className="text-ink-muted mb-12">Estimez vos taxes municipales en quelques clics.</p>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setType('habitation')}
                className={`p-6 rounded-2xl border-2 transition-all text-center ${type === 'habitation' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-ink-muted'}`}
              >
                <Home className="w-8 h-8 mx-auto mb-3" />
                <span className="font-bold">Taxe d'Habitation</span>
              </button>
              <button 
                onClick={() => setType('foncier')}
                className={`p-6 rounded-2xl border-2 transition-all text-center ${type === 'foncier' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-ink-muted'}`}
              >
                <Landmark className="w-8 h-8 mx-auto mb-3" />
                <span className="font-bold">Foncier Bâti</span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-ink-muted">Valeur locative estimée (FCFA)</label>
              <input 
                type="number" 
                value={valeur}
                onChange={(e) => setValeur(Number(e.target.value))}
                className="w-full bg-muted border border-border rounded-2xl px-8 py-6 text-3xl font-bold outline-none focus:border-primary transition-colors text-ink"
                placeholder="0"
              />
            </div>

            <div className="p-8 bg-primary text-white rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-white/60 font-medium mb-1">Estimation annuelle</p>
                <p className="text-4xl font-black">{result.toLocaleString()} FCFA</p>
              </div>
              <Info className="w-12 h-12 opacity-20" />
            </div>

            <p className="text-xs text-ink-muted italic">
              * Cette simulation est donnée à titre indicatif et ne remplace pas l'avis d'imposition officiel émis par les services fiscaux.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

const PageContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.subject.trim()) newErrors.subject = "Le sujet est requis";
    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.length < 10) {
      newErrors.message = "Le message doit faire au moins 10 caractères";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <main className="py-20 bg-surface transition-colors duration-300 min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-card p-12 rounded-3xl shadow-xl border border-border">
            <h2 className="text-4xl font-bold mb-8 text-ink">Contactez-nous</h2>
            
            {submitted ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="bg-primary/5 p-8 rounded-2xl border border-primary/10 text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Message Envoyé !</h3>
                <p className="text-ink-muted mb-6">Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Nom complet</label>
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text" 
                      className={`w-full bg-muted border ${errors.name ? 'border-red' : 'border-border'} rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-ink`} 
                    />
                    {errors.name && <p className="text-red text-xs font-bold">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Email</label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      className={`w-full bg-muted border ${errors.email ? 'border-red' : 'border-border'} rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-ink`} 
                    />
                    {errors.email && <p className="text-red text-xs font-bold">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Sujet</label>
                  <input 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text" 
                    className={`w-full bg-muted border ${errors.subject ? 'border-red' : 'border-border'} rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-ink`} 
                  />
                  {errors.subject && <p className="text-red text-xs font-bold">{errors.subject}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6} 
                    className={`w-full bg-muted border ${errors.message ? 'border-red' : 'border-border'} rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none text-ink`}
                  ></textarea>
                  {errors.message && <p className="text-red text-xs font-bold">{errors.message}</p>}
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>

        <div className="space-y-8">
          <div className="bg-primary text-white p-12 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-8">Coordonnées</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-accent mt-1" />
                <div>
                  <p className="font-bold">Adresse</p>
                  <p className="text-white/70">{ADRESSE_MAIRIE}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-accent mt-1" />
                <div>
                  <p className="font-bold">Téléphone</p>
                  <p className="text-white/70">{TEL_CONTACT}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-accent mt-1" />
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-white/70">{EMAIL_CONTACT}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-xl border border-border">
            <h3 className="text-xl font-bold mb-6 text-ink">Horaires d'ouverture</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-ink-muted">
                <span>Lundi - Vendredi</span>
                <span className="font-bold">08:00 - 12:30 | 14:00 - 17:30</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Samedi - Dimanche</span>
                <span className="font-bold text-red">Fermé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
    </main>
  );
};

const Footer = ({ setActivePage }: { setActivePage: (p: Page) => void }) => (
  <footer className="bg-[#0F172A] text-white pt-20 pb-10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-white rounded-full p-1">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Coat_of_arms_of_Benin.svg/1200px-Coat_of_arms_of_Benin.svg.png" 
                alt="Armoiries"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest">
              Mairie de <br /> Za-Kpota
            </h2>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Portail officiel de la mairie de Za-Kpota. <br />
            Bâtir ensemble une commune prospère.
          </p>
        </div>

        <div>
          <h3 className="text-accent font-bold uppercase tracking-widest text-xs mb-8">La Mairie</h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li><button onClick={() => setActivePage('maire')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Le Maire</button></li>
            <li><button onClick={() => setActivePage('conseil')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Le Conseil Municipal</button></li>
            <li><button onClick={() => setActivePage('arrondissements')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Les Arrondissements</button></li>
            <li><button onClick={() => setActivePage('histoire')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Histoire et Culture</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-accent font-bold uppercase tracking-widest text-xs mb-8">Services</h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li><button onClick={() => setActivePage('etat-civil')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> État Civil</button></li>
            <li><button onClick={() => setActivePage('urbanisme')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Urbanisme</button></li>
            <li><button onClick={() => setActivePage('simulateur')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Simulateur Fiscal</button></li>
            <li><button onClick={() => setActivePage('rendezvous')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Prise de RDV</button></li>
            <li><button onClick={() => setActivePage('signalement')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Signalement</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-accent font-bold uppercase tracking-widest text-xs mb-8">Économie</h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li><button onClick={() => setActivePage('economie')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Marchés</button></li>
            <li><button onClick={() => setActivePage('opportunites')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Opportunités</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-accent font-bold uppercase tracking-widest text-xs mb-8">Agenda & Loisirs</h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li><button onClick={() => setActivePage('agenda')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Événements</button></li>
            <li><button onClick={() => setActivePage('stade')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Stade Municipal</button></li>
            <li><button onClick={() => setActivePage('tourisme')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Guide Touristique</button></li>
            <li><button onClick={() => setActivePage('actualites')} className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Actualités</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-accent font-bold uppercase tracking-widest text-xs mb-8">Suivez-nous</h3>
          <div className="flex space-x-4 mb-8">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
          <h3 className="text-accent font-bold uppercase tracking-widest text-xs mb-8">Contact</h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-accent" /> {ADRESSE_MAIRIE}</li>
            <li className="flex items-center"><Phone className="w-4 h-4 mr-3 text-accent" /> {TEL_CONTACT}</li>
            <li className="flex items-center"><Mail className="w-4 h-4 mr-3 text-accent" /> {EMAIL_CONTACT}</li>
          </ul>
        </div>
      </div>

      <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 gap-6">
        <p>© 2026 Mairie de Za-Kpota. Tous droits réservés.</p>
        <div className="flex space-x-8">
          <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
          <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-white transition-colors">Plan du site</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [store, setStore] = useState(initialStoreData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleUpdateStore = (newData: any) => {
    setStore(newData);
    // In a real app, you'd persist this to a database
  };

  const handleSendPush = (title: string, message: string) => {
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      date: new Date().toISOString(),
      read: false
    };
    
    setStore(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications]
    }));
    
    // Simulate FCM Push
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  const handleMarkAsRead = (id: string) => {
    setStore(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  };

  const handleRendezVousSubmit = async (data: any) => {
    // Simulate API call
    console.log('Rendez-vous submitted:', data);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setStore(prev => ({
          ...prev,
          rendezvous: [
            ...prev.rendezvous,
            {
              id: Date.now().toString(),
              ...data,
              statut: 'en_attente',
              dateDemande: new Date().toISOString()
            }
          ]
        }));
        resolve();
      }, 1000);
    });
  };

  if (activePage === 'admin-portal') {
    return (
      <AdminDashboard 
        store={store} 
        onUpdateStore={handleUpdateStore} 
        onSendPush={handleSendPush}
        onExit={() => setActivePage('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface text-ink font-sans transition-colors duration-300">
      <FlashNews news={store.flashNews} />
      <TopBar />
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        notifications={store.notifications}
        onMarkAsRead={handleMarkAsRead}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <React.Suspense fallback={<div className="flex justify-center items-center py-40 min-h-[60vh]"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            {activePage === 'home' && <PageHome setActivePage={setActivePage} />}
            {activePage === 'maire' && <PageMaire />}
            {activePage === 'conseil' && <PageConseil />}
            {activePage === 'arrondissements' && <Arrondissements data={store.arrondissements} />}
            {activePage === 'economie' && <MarketLogic config={store.configMarche} />}
            {activePage === 'opportunites' && <Opportunities data={store.opportunites} />}
            {activePage === 'rendezvous' && <RendezVous onSubmit={handleRendezVousSubmit} />}
            {activePage === 'histoire' && <PageHistoire />}
            {activePage === 'agenda' && <PageAgenda agenda={store.agenda} />}
            {activePage === 'tourisme' && <PageTourisme />}
            {activePage === 'stade' && <PageStade stade={store.stade} />}
            {activePage === 'actualites' && <PageActualites />}
            {activePage === 'publications' && <RapportsPage store={store} />}
            {activePage === 'etat-civil' && <PageService type="etat-civil" services={store.services} />}
            {activePage === 'urbanisme' && <PageService type="urbanisme" services={store.services} />}
            {activePage === 'simulateur' && <SimulateurFiscal />}
            {activePage === 'signalement' && <main className="py-20"><SignalementForm /></main>}
            {activePage === 'contact' && <PageContact />}
            {activePage !== 'home' && !['etat-civil', 'urbanisme', 'simulateur', 'signalement', 'contact', 'maire', 'conseil', 'arrondissements', 'histoire', 'agenda', 'tourisme', 'stade', 'actualites', 'economie', 'opportunites', 'rendezvous', 'publications'].includes(activePage) && (
              <div className="py-20 container mx-auto px-4 min-h-[60vh]">
                <h1 className="text-4xl font-bold text-primary mb-8 uppercase border-b-2 border-primary/10 pb-4">
                  {activePage.replace('-', ' ')}
                </h1>
                <p className="text-ink-muted italic">
                  Cette section est en cours de mise à jour pour correspondre à la nouvelle interface officielle de la mairie.
                </p>
                <button 
                  onClick={() => setActivePage('home')}
                  className="mt-8 bg-primary text-white px-6 py-3 rounded font-bold hover:bg-primary/90 transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            )}
          </React.Suspense>
        </motion.div>
      </AnimatePresence>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}
