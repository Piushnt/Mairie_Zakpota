/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
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
import { motion, AnimatePresence, LazyMotion, domMax } from 'framer-motion';
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
import PageSuiviDossier from './pages/PageSuiviDossier';
import PageAnnuaireArtisans from './pages/PageAnnuaireArtisans';
import PageService from './pages/PageService';
import PageEconomie from './pages/PageEconomie';
import PageAgenda from './pages/PageAgenda';
import PageActualites from './pages/PageActualites';
import PageNewsDetail from './pages/PageNewsDetail';
import PageSondages from './pages/PageSondages';
import PageBudgetParticipatif from './pages/PageBudgetParticipatif';
const PageCarte = React.lazy(() => import('./pages/PageCarte'));
import SignalementForm from './components/SignalementForm';
import SimulateurFiscal from './components/SimulateurFiscal';
import PageFormulaires from './pages/PageFormulaires';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import Login from './pages/Login';
import PushPrompt from './components/PushPrompt';
import { parseImageUrl } from './utils/imageParser';

// --- TYPES ---
type Page = 'home' | 'etat-civil' | 'urbanisme' | 'economie' | 'conseil' | 'actualites' | 'contact' | 'maire' | 'decouvrir' | 'eservices' | 'histoire' | 'arrondissements' | 'publications' | 'agenda' | 'tourisme' | 'stade' | 'signalement' | 'simulateur' | 'admin-portal' | 'opportunites' | 'rendezvous';

// --- CONSTANTS ---
const NOM_VILLE = "Za-Kpota";
const SLOGAN_VILLE = "Commune de Za-Kpota";
const EMAIL_CONTACT = "contact@mairie-zakpota.bj";
const TEL_CONTACT = "+229 97 00 00 00";
const FALLBACK_NEWS_IMG = "https://images.unsplash.com/photo-1585829365234-781fcd96c813?auto=format&fit=crop&q=80&w=1200";
const ADRESSE_MAIRIE = "Hôtel de Ville de Za-Kpota, Centre Ville";

// --- COMPONENTS ---
// Tous les composants ont été extraits dans src/components/


// --- APP COMPONENT ---


export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Za-Kpota 2.0: Light Mode by Default
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
          { data: auds },
          { data: opps },
          { data: arrs },
          { data: events },
          { data: config },
          { data: reps },
          { data: stadeRes },
          { data: forms },
          { data: taxes },
          { data: locs },
          { data: counRes },
          { data: roles }
        ] = await Promise.all([
          supabase.from('services_tarifs').select('*'),
          supabase.from('news').select('*').order('date', { ascending: false }),
          supabase.from('audiences').select('*').order('created_at', { ascending: false }),
          supabase.from('opportunites').select('*'),
          supabase.from('arrondissements').select('*').order('nom'),
          supabase.from('agenda_events').select('*').order('date'),
          supabase.from('site_config').select('*'),
          supabase.from('reports').select('*').order('date', { ascending: false }),
          supabase.from('reservations_stade').select('*').order('created_at', { ascending: false }),
          supabase.from('formulaires').select('*').order('created_at', { ascending: false }),
          supabase.from('tax_settings').select('*'),
          supabase.from('locations').select('*').order('name'),
          supabase.from('council').select('*, council_roles(*)'),
          supabase.from('council_roles').select('*').order('importance_order', { ascending: true })
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

        if (auds) {
          newStore.rendezvous = auds.filter(a => a.type === 'rdv').map(r => ({
            ...r,
            nom: r.name.split(' ')[0] || r.name,
            prenom: r.name.split(' ').slice(1).join(' ') || '',
            motif: r.subject || 'RDV',
            date: r.appointment_date,
            time: r.appointment_time
          }));
          newStore.audiences = auds;
        }

        if (opps) {
          newStore.opportunites = opps.map(o => ({
            ...o,
            title: o.titre,
            dateLimite: o.date_limite || ''
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
          newStore.news = news.map(n => {
            const parsed = parseImageUrl(n.image_url);
            return {
              ...n,
              desc: n.description,
              cat: n.category,
              img: parsed || FALLBACK_NEWS_IMG,
              image_url: parsed || FALLBACK_NEWS_IMG
            };
          });
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

        if (forms) {
          newStore.formulaires = forms;
        }

        if (taxes) {
          const taxSettingsObj = taxes.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
          newStore.tax_settings = taxSettingsObj;
        }

        if (locs) {
          newStore.locations = locs;
        }

        if (counRes) {
          // Sort council by role importance
          const sortedCouncil = [...counRes].sort((a, b) => {
            const orderA = a.council_roles?.importance_order ?? 99;
            const orderB = b.council_roles?.importance_order ?? 99;
            return orderA - orderB;
          });
          newStore.council = sortedCouncil.map(c => ({
            ...c,
            photo: parseImageUrl(c.photo_url),
            photo_url: parseImageUrl(c.photo_url)
          }));
        }

        if (roles) {
          newStore.council_roles = roles;
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
    setStore(prev => ({ ...prev, ...newData }));
  };

  const handleSendPush = async (title: string, message: string, urlPath: string = '/', imageUrl?: string, tag?: string) => {
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
      if (!('serviceWorker' in navigator)) return;
      
      console.log('Simulation Envoi Push:', { title, message, urlPath, imageUrl, tag });
      
      const payload = {
        title: title,
        body: message,
        url: urlPath,
        image: imageUrl ? parseImageUrl(imageUrl) : undefined, // Rich Media coverage image
        badge: '/badge.png', // Monochrome icon for status bar
        icon: '/logo.jpg',   // Colorful icon for notification center
        tag: tag
      };

      await fetch('/api/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
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

  const handleAudienceSubmit = async (data: any) => {
    const { error } = await supabase.from('audiences').insert([{
      name: data.nom + (data.prenom ? ' ' + data.prenom : ''),
      email: data.email,
      phone: data.telephone,
      subject: data.motif || data.sujet,
      message: data.message,
      type: data.type, // 'contact' or 'rdv'
      appointment_date: data.date || null,
      appointment_time: data.heure || null,
      status: 'En attente'
    }]);

    if (error) {
      console.error('Error submitting audience:', error);
      throw error;
    }

    // On recharge les données pour mettre à jour le store
    // loadData(); // Ou on met à jour localement
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
    <HelmetProvider>
      <BrowserRouter>
        <LazyMotion features={domMax}>
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
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
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
            <Route index element={<PageHome reports={store.reports} news={store.news} />} />
            <Route path="maire" element={<PageMaire />} />
            <Route path="conseil" element={<PageConseil council={store.council} />} />
            <Route path="arrondissements" element={<Arrondissements data={store.arrondissements} />} />
            <Route path="histoire" element={<PageHistoire />} />
            <Route path="publications" element={<RapportsPage store={store} />} />

            <Route path="services" element={<PageService services={Object.keys(store.services || {}).length > 0 ? store.services : servicesData} />} />
            <Route path="services/:type" element={<PageService services={Object.keys(store.services || {}).length > 0 ? store.services : servicesData} />} />

            <Route path="simulateur" element={<SimulateurFiscal settings={store.tax_settings} />} />
            <Route path="formulaires" element={<PageFormulaires formulaires={store.formulaires} />} />
            <Route path="rendezvous" element={<RendezVous onSubmit={(data) => handleAudienceSubmit({...data, type: 'rdv'})} />} />
            <Route path="suivi-dossier" element={<PageSuiviDossier />} />
            <Route path="artisans" element={<PageAnnuaireArtisans />} />
            <Route path="economie" element={<PageEconomie configMarche={store.configMarche} />} />
            <Route path="opportunites" element={<Opportunities data={store.opportunites} />} />
            <Route path="agenda" element={<PageAgenda agenda={store.agenda} />} />
            <Route path="stade" element={<PageStade stade={store.stade} onReserve={handleStadeReservation} />} />
            <Route path="tourisme" element={<PageTourisme />} />
            <Route path="carte" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-widest text-primary">Chargement de la carte...</div>}>
                <PageCarte locations={store.locations} />
              </React.Suspense>
            } />
            <Route path="actualites" element={<PageActualites news={store.news.length > 0 ? store.news : newsData} />} />
            <Route path="news/:id" element={<PageNewsDetail news={store.news.length > 0 ? store.news : newsData} />} />
            <Route path="sondages" element={<PageSondages />} />
            <Route path="budget-participatif" element={<PageBudgetParticipatif />} />
            <Route path="signalement" element={<SignalementForm />} />
            <Route path="contact" element={<PageContact onSubmit={(data) => handleAudienceSubmit({...data, type: 'contact'})} NOM_VILLE={NOM_VILLE} ADRESSE_MAIRIE={ADRESSE_MAIRIE} TEL_CONTACT={TEL_CONTACT} EMAIL_CONTACT={EMAIL_CONTACT} />} />

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
        </LazyMotion>
        <FloatingAIAssistant />
        <PushPrompt />
      </BrowserRouter>
    </HelmetProvider>
  );
}
