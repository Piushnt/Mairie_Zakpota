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
import { supabase } from './lib/supabase';
import AdminDashboard from './components/AdminDashboard';
import NotificationBell from './components/NotificationBell';
import RapportsPage from './components/RapportsPage';
import Arrondissements from './components/Arrondissements';
import MarketLogic from './components/MarketLogic';
import Opportunities from './components/Opportunities';
import RendezVous from './components/RendezVous';
import NewsCard from './components/NewsCard';
import ScrollToTop from './components/ScrollToTop';

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
import Login from './pages/Login';

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
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(initialStoreData);
  const [session, setSession] = useState<any>(null);

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch Data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Fetch all tables in parallel
        const [
          { data: tarifs },
          { data: news },
          { data: rdv },
          { data: opps },
          { data: arrs },
          { data: events },
          { data: config },
          { data: reps },
          { data: stadeRes }
        ] = await Promise.all([
          supabase.from('services_tarifs').select('*'),
          supabase.from('news').select('*').order('date', { ascending: false }),
          supabase.from('appointments').select('*'),
          supabase.from('opportunites').select('*'),
          supabase.from('arrondissements').select('*').order('nom'),
          supabase.from('agenda_events').select('*').order('date'),
          supabase.from('site_config').select('*'),
          supabase.from('reports').select('*').order('date', { ascending: false }),
          supabase.from('reservations_stade').select('*').order('created_at', { ascending: false })
        ]);

        const newStore = { ...initialStoreData };

        if (tarifs && tarifs.length > 0) {
          const grouped: any = {};
          tarifs.forEach(t => {
            if (!grouped[t.category]) grouped[t.category] = [];
            grouped[t.category].push(t);
          });
          newStore.services = grouped;
        }

        if (rdv) {
          newStore.rendezvous = rdv.map(r => ({
            ...r,
            name: r.citizen_name,
            phone: r.citizen_phone,
            email: r.citizen_email,
            motif: r.service,
            date: r.appointment_date,
            time: r.appointment_time
          }));
        }

        if (opps) {
          newStore.opportunites = opps.map(o => ({
            ...o,
            title: o.titre,
            date: o.date_limite
          }));
        }

        if (arrs && arrs.length > 0) {
          newStore.arrondissements = arrs.map(a => ({
            ...a,
            name: a.nom,
            chef: a.ca,
            img: a.image_url
          }));
        }

        if (events && events.length > 0) {
          newStore.agenda = events.map(e => ({
            ...e,
            img: e.image_url
          }));
        }

        if (news) {
          newStore.news = news.map(n => ({
            ...n,
            desc: n.description,
            cat: n.category,
            img: n.image_url
          }));
        }

        if (reps) {
          newStore.reports = reps.map(r => ({
            ...r,
            fileUrl: r.file_url
          }));
        }

        if (config) {
          const flash = config.find(c => c.key === 'flash_news')?.value;
          const market = config.find(c => c.key === 'market_config')?.value;
          const stade = config.find(c => c.key === 'stade_config')?.value;
          
          if (flash) newStore.flashNews = flash;
          if (market) newStore.configMarche = market;
          if (stade) newStore.stade = stade;
        }

        if (stadeRes) {
          newStore.reservationsStade = stadeRes;
        }

        setStore(newStore);
      } catch (error) {
        console.error('Error loading Supabase data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Service Worker removed to prevent stale cache on Vercel

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleUpdateStore = async (newData: any) => {
    setStore(newData);
  };

  const handleSendPush = async (title: string, message: string, urlPath: string = '/') => {
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

    try {
      await fetch('/api/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          body: message,
          url: urlPath
        })
      });
    } catch (e) {
      console.error('Erreur lors de l\'envoi du Push serveur', e);
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
    const { error } = await supabase.from('appointments').insert([{
      citizen_name: data.nom,
      citizen_email: data.email,
      citizen_phone: data.telephone,
      service: data.service,
      appointment_date: data.date,
      appointment_time: data.heure,
      status: 'en_attente'
    }]);

    if (error) {
      console.error('Error submitting appointment:', error);
      throw error;
    }

    setStore(prev => ({
      ...prev,
      rendezvous: [
        ...prev.rendezvous,
        { id: Date.now().toString(), ...data, statut: 'en_attente', dateDemande: new Date().toISOString() }
      ]
    }));
  };

  const handleStadeReservation = async (data: any) => {
    const { error } = await supabase.from('reservations_stade').insert([{
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      date: data.date,
      creneau: data.creneau,
      statut: 'EN_ATTENTE'
    }]);

    if (error) {
      console.error('Error submitting stadium reservation:', error);
      throw error;
    }

    // Proactive update for local store
    setStore(prev => ({
      ...prev,
      reservationsStade: [
        { id: Date.now().toString(), ...data, statut: 'EN_ATTENTE', created_at: new Date().toISOString() },
        ...prev.reservationsStade
      ]
    }));
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-portal" element={
          session ? (
            <AdminDashboard
              store={store}
              onUpdateStore={handleUpdateStore}
              onSendPush={handleSendPush}
              onExit={() => window.location.href = '/'}
            />
          ) : (
            <Login />
          )
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
            flashNews={store.flashNews}
          />
        }>
          <Route index element={<PageHome reports={store.reports} />} />
          <Route path="maire" element={<PageMaire />} />
          <Route path="conseil" element={<PageConseil />} />
          <Route path="arrondissements" element={<Arrondissements data={store.arrondissements} />} />
          <Route path="histoire" element={<PageHistoire />} />
          <Route path="publications" element={<RapportsPage store={store} />} />
          
          <Route path="services/:type" element={<PageService services={Object.keys(store.services || {}).length > 0 ? store.services : servicesData} />} />

          <Route path="simulateur" element={<SimulateurFiscal />} />
          <Route path="rendezvous" element={<RendezVous onSubmit={handleRendezVousSubmit} />} />
          <Route path="economie" element={<MarketLogic config={store.configMarche} />} />
          <Route path="opportunites" element={<Opportunities data={store.opportunites} />} />
          <Route path="agenda" element={<PageAgenda agenda={store.agenda} />} />
          <Route path="stade" element={<PageStade stade={store.stade} onReserve={handleStadeReservation} />} />
          <Route path="tourisme" element={<PageTourisme />} />
          <Route path="actualites" element={<PageActualites news={store.news.length > 0 ? store.news : newsData} />} />
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
