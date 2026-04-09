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
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import NotificationBell from './components/NotificationBell';
import RapportsPage from './components/RapportsPage';
import Arrondissements from './components/Arrondissements';
import MarketLogic from './components/MarketLogic';
import Opportunities from './components/Opportunities';
import RendezVous from './components/RendezVous';
import NewsCard from './components/NewsCard';
import ScrollToTop from './components/ScrollToTop';

// --- NOUVELLES IMPORTATIONS SAAS ---
import { useTenant } from './lib/TenantContext';
import { Helmet } from 'react-helmet-async';
// --- COMPOSANTS ---
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
import Register from './pages/Register';
import PagePending from './pages/PagePending';
import PushPrompt from './components/PushPrompt';
import { parseImageUrl } from './utils/imageParser';

// --- TYPES ---
type Page = 'home' | 'etat-civil' | 'urbanisme' | 'economie' | 'conseil' | 'actualites' | 'contact' | 'maire' | 'decouvrir' | 'eservices' | 'histoire' | 'arrondissements' | 'publications' | 'agenda' | 'tourisme' | 'stade' | 'signalement' | 'simulateur' | 'admin-portal' | 'opportunites' | 'rendezvous';

const FALLBACK_NEWS_IMG = "https://images.unsplash.com/photo-1585829365234-781fcd96c813?auto=format&fit=crop&q=80&w=1200";

// --- COMPONENTS ---
// Tous les composants ont été extraits dans src/components/


// --- APP COMPONENT ---


export default function App() {
  const { currentTenant, isFeatureEnabled } = useTenant();
  
  // Variables SaaS Dynamiques
  const NOM_VILLE = currentTenant?.name || "Mairie";
  const SLOGAN_VILLE = `Portail Officiel de ${NOM_VILLE}`;
  const EMAIL_CONTACT = currentTenant?.contact_email || "contact@mairie.bj";
  const TEL_CONTACT = currentTenant?.contact_phone || "Non renseigné";
  const ADRESSE_MAIRIE = `Hôtel de Ville de ${NOM_VILLE}`;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(initialStoreData);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<'super_admin' | 'admin' | 'agent'>('agent');
  const [userName, setUserName] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsProfileLoaded(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsProfileLoaded(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    // maybeSingle() évite l'erreur 406 si le profil n'existe pas encore (async trigger)
    const { data } = await supabase
      .from('user_profiles')
      .select('role, first_name, last_name, is_approved, tenant_id')
      .eq('id', userId)
      .maybeSingle();
    if (data) {
      setUserRole(data.role as 'super_admin' | 'admin' | 'agent');
      setUserName(`${data.first_name || ''} ${data.last_name || ''}`.trim());
      setIsApproved(data.is_approved);
      // Log connexion admin dans audit_logs
      if (data.role === 'admin' && data.tenant_id) {
        try { await supabase.rpc('log_admin_login', { p_tenant_id: data.tenant_id }); } catch {}
      }
    }
    setIsProfileLoaded(true);
  };

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
        // SAAS IMPORTANT : Filtrage explicite public (mode anon) avec '.eq' (News, arr, services...)
        // SAAS IMPORTANT : PAS de filtrage client sur les tables privées (audiences, res_stade...) -> RLS s'en charge.
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
          supabase.from('services_tarifs').select('*').eq('tenant_id', currentTenant!.id),
          supabase.from('news').select('*').eq('tenant_id', currentTenant!.id).order('date', { ascending: false }),
          supabase.from('audiences').select('*').order('created_at', { ascending: false }), // RLS STRICT
          supabase.from('opportunites').select('*').eq('tenant_id', currentTenant!.id),
          supabase.from('arrondissements').select('*').eq('tenant_id', currentTenant!.id).order('nom'),
          supabase.from('agenda_events').select('*').eq('tenant_id', currentTenant!.id).order('date'),
          supabase.from('site_config').select('*').eq('tenant_id', currentTenant!.id),
          supabase.from('reports').select('*').eq('tenant_id', currentTenant!.id).order('date', { ascending: false }),
          supabase.from('reservations_stade').select('*').order('created_at', { ascending: false }), // RLS STRICT
          supabase.from('formulaires').select('*').eq('tenant_id', currentTenant!.id).order('created_at', { ascending: false }),
          supabase.from('tax_settings').select('*').eq('tenant_id', currentTenant!.id),
          supabase.from('locations').select('*').eq('tenant_id', currentTenant!.id).order('name'),
          supabase.from('council').select('*, council_roles(*)').eq('tenant_id', currentTenant!.id),
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
      tenant_id: currentTenant!.id,
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
      tenant_id: currentTenant!.id,
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
      <Helmet>
        <title>{NOM_VILLE} | Portail Officiel</title>
        <meta name="description" content={SLOGAN_VILLE} />
        {currentTenant?.logo_url && <link rel="icon" href={currentTenant.logo_url} />}
      </Helmet>
      <BrowserRouter>
        <LazyMotion features={domMax}>
          <ScrollToTop />
          <Routes>
          <Route path="/login" element={
            session && isProfileLoaded
              ? <Navigate to={userRole === 'super_admin' ? '/saas-superadmin-portal' : '/admin-portal'} replace />
              : <Login />
          } />
          <Route path="/register" element={
            session && isProfileLoaded && isApproved
              ? <Navigate to="/admin-portal" replace />
              : <Register />
          } />
          <Route path="/pending" element={
            session && isProfileLoaded && !isApproved && userRole !== 'super_admin'
              ? <PagePending userName={userName} userRole={userRole as 'admin' | 'agent'} />
              : <Navigate to="/" replace />
          } />

          {/* Route dédiée Super Admin — URL non publiée, accès direct */}
          <Route path="/saas-superadmin-portal" element={
            !isProfileLoaded ? (
              <div className="min-h-screen flex items-center justify-center bg-muted">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : session && userRole === 'super_admin' ? (
              <SuperAdminDashboard
                onExit={() => window.location.href = '/'}
                userName={userName}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            ) : (
              // Accès interdit : redirige vers login sans révéler l'existence de la route
              <Navigate to="/login" replace />
            )
          } />

          {/* Route Admin/Agent — Plus accessible au super_admin */}
          <Route path="/admin-portal" element={
            !isProfileLoaded ? (
              <div className="min-h-screen flex items-center justify-center bg-muted">
                 <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : session ? (
              userRole === 'super_admin' ? (
                // Super admin ne passe jamais par ici
                <Navigate to="/saas-superadmin-portal" replace />
              ) : isApproved ? (
                <AdminDashboard
                  store={store}
                  onUpdateStore={handleUpdateStore}
                  onSendPush={handleSendPush}
                  onExit={() => window.location.href = '/'}
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                  userRole={userRole as 'admin' | 'agent'}
                  userName={userName}
                  tenantId={currentTenant?.id || ''}
                />
              ) : (
                // Compte non approuvé → page dédiée
                <Navigate to="/pending" replace />
              )
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

            <Route path="simulateur" element={isFeatureEnabled('simulateur') ? <SimulateurFiscal settings={store.tax_settings} /> : <Navigate to="/" replace />} />
            <Route path="formulaires" element={<PageFormulaires formulaires={store.formulaires} />} />
            <Route path="rendezvous" element={<RendezVous onSubmit={(data) => handleAudienceSubmit({...data, type: 'rdv'})} />} />
            <Route path="suivi-dossier" element={<PageSuiviDossier />} />
            <Route path="artisans" element={isFeatureEnabled('artisans') ? <PageAnnuaireArtisans /> : <Navigate to="/" replace />} />
            <Route path="economie" element={isFeatureEnabled('marche') ? <PageEconomie configMarche={store.configMarche} /> : <Navigate to="/" replace />} />
            <Route path="opportunites" element={isFeatureEnabled('opportunites') ? <Opportunities data={store.opportunites} /> : <Navigate to="/" replace />} />
            <Route path="agenda" element={isFeatureEnabled('agenda') ? <PageAgenda agenda={store.agenda} /> : <Navigate to="/" replace />} />
            <Route path="stade" element={isFeatureEnabled('stade') ? <PageStade stade={store.stade} onReserve={handleStadeReservation} /> : <Navigate to="/" replace />} />
            <Route path="tourisme" element={<PageTourisme />} />
            <Route path="carte" element={isFeatureEnabled('carte') ? (
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-widest text-primary">Chargement de la carte...</div>}>
                <PageCarte locations={store.locations} />
              </React.Suspense>
            ) : <Navigate to="/" replace />} />
            <Route path="actualites" element={isFeatureEnabled('actualites') ? <PageActualites news={store.news.length > 0 ? store.news : newsData} /> : <Navigate to="/" replace />} />
            <Route path="news/:id" element={isFeatureEnabled('actualites') ? <PageNewsDetail news={store.news.length > 0 ? store.news : newsData} /> : <Navigate to="/" replace />} />
            <Route path="sondages" element={isFeatureEnabled('sondages') ? <PageSondages /> : <Navigate to="/" replace />} />
            <Route path="budget-participatif" element={isFeatureEnabled('budget_participatif') ? <PageBudgetParticipatif /> : <Navigate to="/" replace />} />
            <Route path="signalement" element={isFeatureEnabled('signalement') ? <SignalementForm /> : <Navigate to="/" replace />} />
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
