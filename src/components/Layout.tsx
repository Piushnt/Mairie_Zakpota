import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import FlashNews from './FlashNews';
import SearchModal from './SearchModal';

interface LayoutProps {
  NOM_VILLE: string;
  ADRESSE_MAIRIE: string;
  TEL_CONTACT: string;
  EMAIL_CONTACT: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (v: boolean) => void;
  notifications: any[];
  onMarkAsRead: (id: string) => void;
}

const Layout = ({
  NOM_VILLE,
  ADRESSE_MAIRIE,
  TEL_CONTACT,
  EMAIL_CONTACT,
  isDarkMode,
  toggleDarkMode,
  isSearchOpen,
  setIsSearchOpen,
  notifications,
  onMarkAsRead
}: LayoutProps) => {
  const location = useLocation();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <FlashNews news="La plateforme de digitalisation des services de la mairie de Za-Kpota est désormais opérationnelle. Gagnez du temps en effectuant vos démarches en ligne !" />
      
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        notifications={notifications}
        onMarkAsRead={onMarkAsRead}
        NOM_VILLE={NOM_VILLE}
        ADRESSE_MAIRIE={ADRESSE_MAIRIE}
        TEL_CONTACT={TEL_CONTACT}
        EMAIL_CONTACT={EMAIL_CONTACT}
      />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer 
        ADRESSE_MAIRIE={ADRESSE_MAIRIE}
        TEL_CONTACT={TEL_CONTACT}
        EMAIL_CONTACT={EMAIL_CONTACT}
        NOM_VILLE={NOM_VILLE}
      />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};

export default Layout;
