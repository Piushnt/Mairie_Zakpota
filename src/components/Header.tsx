import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, Moon, Sun, ChevronDown, ChevronRight, 
  Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const TopBar = ({ ADRESSE_MAIRIE, TEL_CONTACT, EMAIL_CONTACT }: any) => (
  <div className="bg-black text-white py-2 hidden lg:block">
    <div className="container mx-auto px-4 flex justify-center items-center text-[11px] font-medium tracking-wide">
      <span>Mairie de Za-Kpota - Portail Officiel</span>
    </div>
  </div>
);

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenSearch: () => void;
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  NOM_VILLE: string;
  ADRESSE_MAIRIE: string;
  TEL_CONTACT: string;
  EMAIL_CONTACT: string;
}

const Header = ({
  isDarkMode,
  toggleDarkMode,
  onOpenSearch,
  notifications,
  onMarkAsRead,
  NOM_VILLE,
  ADRESSE_MAIRIE,
  TEL_CONTACT,
  EMAIL_CONTACT
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const navItems = [
    {
      label: 'La Mairie', id: 'mairie', submenu: [
        { label: 'Le Maire', path: '/maire' },
        { label: 'Le Conseil Municipal', path: '/conseil' },
        { label: 'Les Arrondissements', path: '/arrondissements' },
        { label: 'Histoire et Culture', path: '/histoire' },
        { label: 'Transparence & Rapports', path: '/publications' },
      ]
    },
    {
      label: 'Services Publics', id: 'services', submenu: [
        { label: 'État Civil', path: '/services/etat-civil' },
        { label: 'Formulaires (Guichet)', path: '/formulaires' },
        { label: 'Urbanisme', path: '/services/urbanisme' },
        { label: 'Simulateur Fiscal', path: '/simulateur' },
        { label: 'Prise de RDV', path: '/rendezvous' },
      ]
    },
    {
      label: 'Économie', id: 'economie', submenu: [
        { label: 'Marchés', path: '/economie' },
        { label: 'Opportunités Locales', path: '/opportunites' },
      ]
    },
    {
      label: 'Agenda & Loisirs', id: 'agenda', submenu: [
        { label: 'Événements', path: '/agenda' },
        { label: 'Stade Municipal', path: '/stade' },
        { label: 'Guide Touristique', path: '/tourisme' },
      ]
    },
    { label: 'Actualités', path: '/actualites' },
    { label: 'Signalement', id: 'signalement', path: '/signalement' },
    { label: 'Contact', id: 'contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: any) => item.submenu?.some((sub: any) => isActive(sub.path));

  // Institution Naming
  const DISPLAY_NAME = "Mairie de Za-Kpota";

  return (
    <>
      <TopBar 
        ADRESSE_MAIRIE={ADRESSE_MAIRIE} 
        TEL_CONTACT={TEL_CONTACT} 
        EMAIL_CONTACT={EMAIL_CONTACT} 
      />
      
      <header className="sticky top-0 z-50 bg-[#006633] text-white py-3 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Armoirie Style */}
            <Link 
              to="/"
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}
            >
              <div className="flex items-center">
                <img
                  src="/img/armoirie.png"
                  alt="Armoirie"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`text-[13px] font-bold transition-all hover:text-accent ${
                        isActive(item.path) ? 'text-accent border-b-2 border-accent pb-1' : 'text-white'
                      }`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => toggleDropdown(item.id!)}
                      className={`text-[13px] font-bold transition-all flex items-center space-x-1 hover:text-accent ${
                        isParentActive(item) || activeDropdown === item.id ? 'text-accent' : 'text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.submenu && <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />}
                    </button>
                  )}

                  <AnimatePresence>
                    {item.submenu && activeDropdown === item.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white border border-border rounded-xl shadow-2xl z-50 p-2 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 gap-1">
                          {item.submenu.map((sub) => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              onClick={() => setActiveDropdown(null)}
                              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between group/sub ${
                                isActive(sub.path) ? 'bg-primary/5 text-primary' : 'text-ink-muted hover:bg-muted hover:text-primary'
                              }`}
                            >
                              {sub.label}
                              <ChevronRight className="w-3 h-3 opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-1 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Actions: Profile, Search, DarkMode */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 pr-2 md:pr-4 md:border-r border-white/20">
                <div className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-all rounded-full pl-1 pr-3 py-1 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-white overflow-hidden p-1 shadow-inner">
                    <img src="/img/logo-mairie.jpg" alt="Admin" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black leading-none uppercase tracking-tighter">Mairie de</span>
                    <span className="text-[9px] font-black leading-none uppercase tracking-tighter">Za-Kpota</span>
                  </div>
                </div>
                
                <button onClick={onOpenSearch} title="Rechercher" className="text-white hover:text-accent transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button onClick={toggleDarkMode} title={isDarkMode ? "Mode clair" : "Mode sombre"} className="text-white hover:text-accent transition-colors">
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar Drawer - Decoupled from Header Stacking Context */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            
            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-card shadow-2xl z-[110] lg:hidden flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-primary text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg p-1">
                    <img src="/img/logo-mairie.jpg" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black uppercase tracking-tighter text-sm">Menu ZA-KPOTA</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                  title="Fermer le menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.label} className="space-y-1">
                    {item.submenu ? (
                      <div className="space-y-1">
                        <div className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mt-4 border-b border-primary/5">
                          {item.label}
                        </div>
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center space-x-3 w-full min-h-[48px] px-4 py-3 rounded-xl font-bold transition-all ${
                              isActive(sub.path) ? 'bg-primary text-white' : 'text-ink-muted hover:bg-muted font-bold'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${isActive(sub.path) ? 'bg-white' : 'bg-primary/20'}`} />
                            <span className="text-sm">{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        to={item.path!}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 w-full min-h-[48px] px-4 py-3 rounded-xl font-bold transition-all ${
                          isActive(item.path!) ? 'bg-primary text-white' : 'text-ink-muted hover:bg-muted font-bold'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${isActive(item.path!) ? 'bg-white' : 'bg-primary/20'}`} />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-border bg-muted/30">
                <div className="flex justify-between items-center text-ink-muted">
                  <Facebook className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                  <Twitter className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                  <Instagram className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                  <Youtube className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
