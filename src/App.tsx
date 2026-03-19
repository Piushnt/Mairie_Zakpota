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
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import NotificationBell from './components/NotificationBell';
import RapportsPage from './components/RapportsPage';
import Arrondissements from './components/Arrondissements';
import MarketLogic from './components/MarketLogic';
import Opportunities from './components/Opportunities';
import RendezVous from './components/RendezVous';
import NewsCard from './components/NewsCard';

// Nouvelles extractions
import Layout from './components/Layout';
import PageHome from './pages/PageHome';
import PageMaire from './pages/PageMaire';
import PageConseil from './pages/PageConseil';
import PageHistoire from './pages/PageHistoire';
import PageTourisme from './pages/PageTourisme';
import PageStade from './pages/PageStade';
import PageContact from './pages/PageContact';
import PageService from './pages/PageService';
import PageAgenda from './pages/PageAgenda';
import PageActualites from './pages/PageActualites';
import SignalementForm from './components/SignalementForm';
import SimulateurFiscal from './components/SimulateurFiscal';

// --- TYPES ---
type Page = 'home' | 'etat-civil' | 'urbanisme' | 'economie' | 'conseil' | 'actualites' | 'contact' | 'maire' | 'decouvrir' | 'eservices' | 'histoire' | 'arrondissements' | 'publications' | 'agenda' | 'tourisme' | 'stade' | 'signalement' | 'simulateur' | 'admin-portal' | 'opportunites' | 'rendezvous';

// --- CONSTANTS ---
const NOM_VILLE = "Za-Kpota";
const SLOGAN_VILLE = "Commune de Za-Kpota";
const EMAIL_CONTACT = "contact@mairie-zakpota.bj";
const TEL_CONTACT = "+229 97 00 00 00";
const ADRESSE_MAIRIE = "Hôtel de Ville de Za-Kpota, Centre Ville";

// --- COMPONENTS ---
// Tous les composants ont été extraits dans src/components/


// --- APP COMPONENT ---


export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [store, setStore] = useState(initialStoreData);

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin-portal" element={
          <AdminDashboard
            store={store}
            onUpdateStore={handleUpdateStore}
            onSendPush={handleSendPush}
            onExit={() => window.location.href = '/'}
          />
        } />

        <Route path="/" element={
          <Layout 
            NOM_VILLE={NOM_VILLE}
            ADRESSE_MAIRIE={ADRESSE_MAIRIE}
            TEL_CONTACT={TEL_CONTACT}
            EMAIL_CONTACT={EMAIL_CONTACT}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            notifications={store.notifications}
            onMarkAsRead={handleMarkAsRead}
          />
        }>
          <Route index element={<PageHome />} />
          <Route path="maire" element={<PageMaire />} />
          <Route path="conseil" element={<PageConseil />} />
          <Route path="arrondissements" element={<Arrondissements data={store.arrondissements} />} />
          <Route path="histoire" element={<PageHistoire />} />
          <Route path="publications" element={<RapportsPage store={store} />} />
          
          <Route path="services/:type" element={<PageService services={servicesData} />} />

          <Route path="simulateur" element={<SimulateurFiscal />} />
          <Route path="rendezvous" element={<RendezVous onSubmit={handleRendezVousSubmit} />} />
          <Route path="economie" element={<MarketLogic config={store.configMarche} />} />
          <Route path="opportunites" element={<Opportunities data={store.opportunites} />} />
          <Route path="agenda" element={<PageAgenda agenda={store.agenda} />} />
          <Route path="stade" element={<PageStade stade={store.stade} />} />
          <Route path="tourisme" element={<PageTourisme />} />
          <Route path="actualites" element={<PageActualites news={newsData} />} />
          <Route path="signalement" element={<SignalementForm />} />
          <Route path="contact" element={<PageContact NOM_VILLE={NOM_VILLE} ADRESSE_MAIRIE={ADRESSE_MAIRIE} TEL_CONTACT={TEL_CONTACT} EMAIL_CONTACT={EMAIL_CONTACT} />} />
          
          <Route path="*" element={
            <div className="py-20 container mx-auto px-4 min-h-[60vh] text-center">
              <h1 className="text-4xl font-black text-primary mb-8 uppercase tracking-tighter">
                Page non trouvée
              </h1>
              <p className="text-ink-muted italic mb-12">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
              </p>
              <Link
                to="/"
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-primary transition-all shadow-xl"
              >
                Retour à l'accueil
              </Link>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
