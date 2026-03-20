
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Bell, 
  Save, 
  Plus, 
  Trash2, 
  MapPin,
  Briefcase,
  ShoppingBag,
  Clock,
  CheckCircle, 
  AlertCircle,
  XCircle,
  ChevronRight,
  Settings,
  LogOut,
  User,
  Search,
  ArrowRight,
  Info,
  CalendarCheck,
  Building2,
  Coins,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  store: any;
  onUpdateStore: (newData: any) => void;
  onSendPush: (title: string, message: string) => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ store, onUpdateStore, onSendPush, onExit }) => {
  const [activeTab, setActiveTab] = useState('services');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Local form states
  const [flashNews, setFlashNews] = useState(store.flashNews);
  const [services, setServices] = useState(store.services);
  const [agenda, setAgenda] = useState(store.agenda);
  const [reports, setReports] = useState(store.reports || []);
  const [arrondissements, setArrondissements] = useState(store.arrondissements || []);
  const [opportunites, setOpportunites] = useState(store.opportunites || []);
  const [rendezvous, setRendezvous] = useState(store.rendezvous || []);
  const [stadeReservations, setStadeReservations] = useState(store.reservationsStade || []);
  const [configMarche, setConfigMarche] = useState(store.configMarche || { referenceDate: '' });
  const [newReport, setNewReport] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Conseil de Supervision',
    category: 'Sessions',
    fileUrl: ''
  });

  // Synchronize local state with store updates from parent
  useEffect(() => {
    setFlashNews(store.flashNews);
    setServices(store.services || {});
    setAgenda(store.agenda || []);
    setReports(store.reports || []);
    setArrondissements(store.arrondissements || []);
    setOpportunites(store.opportunites || []);
    setRendezvous(store.rendezvous || []);
    setStadeReservations(store.reservationsStade || []);
    setConfigMarche(store.configMarche || { referenceDate: '' });
  }, [store]);

  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    type: 'Marché Public',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveFlashNews = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('site_config')
      .upsert({ key: 'flash_news', value: flashNews });

    if (!error) {
      onUpdateStore({ ...store, flashNews });
      onSendPush("Flash Info", "Le bandeau défilant a été mis à jour.");
      showSuccess("Bandeau Flash mis à jour avec succès !");
    } else {
      console.error(error);
      setErrorMessage("Échec de la mise à jour du bandeau.");
    }
    setIsSaving(false);
  };

  const handleUpdateServicePrice = (category: string, serviceId: number, newPrice: string) => {
    const updatedServices = { ...services };
    const categoryItems = [...updatedServices[category]];
    const serviceIndex = categoryItems.findIndex((s: any) => s.id === serviceId);
    if (serviceIndex !== -1) {
      categoryItems[serviceIndex] = {
        ...categoryItems[serviceIndex],
        cost: Number(newPrice)
      };
      updatedServices[category] = categoryItems;
      setServices(updatedServices);
    }
  };

  const handleAddPiece = (category: string, serviceId: number, piece: string) => {
    if (!piece.trim()) return;
    const updatedServices = { ...services };
    const categoryItems = [...updatedServices[category]];
    const serviceIndex = categoryItems.findIndex((s: any) => s.id === serviceId);
    if (serviceIndex !== -1) {
      categoryItems[serviceIndex] = {
        ...categoryItems[serviceIndex],
        pieces: [...categoryItems[serviceIndex].pieces, piece]
      };
      updatedServices[category] = categoryItems;
      setServices(updatedServices);
    }
  };

  const handleRemovePiece = (category: string, serviceId: number, pieceIndex: number) => {
    const updatedServices = { ...services };
    const categoryItems = [...updatedServices[category]];
    const serviceIndex = categoryItems.findIndex((s: any) => s.id === serviceId);
    if (serviceIndex !== -1) {
      const updatedPieces = [...categoryItems[serviceIndex].pieces];
      updatedPieces.splice(pieceIndex, 1);
      categoryItems[serviceIndex] = {
        ...categoryItems[serviceIndex],
        pieces: updatedPieces
      };
      updatedServices[category] = categoryItems;
      setServices(updatedServices);
    }
  };

  const handleSaveServices = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      // Collect all services from all categories into one array
      const allServicesToUpdate: any[] = [];
      Object.keys(services).forEach(category => {
        services[category].forEach((s: any) => {
          const serviceData: any = {
            category: category,
            name: s.name,
            cost: Number(s.cost),
            pieces: s.pieces,
            delay: s.delay
          };
          
          // Only include ID if it's a valid UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(String(s.id))) {
            serviceData.id = s.id;
          }
          
          allServicesToUpdate.push(serviceData);
        });
      });

      const { data, error } = await supabase
        .from('services_tarifs')
        .upsert(allServicesToUpdate)
        .select();

      if (error) throw error;
      
      // Update local state with fresh data (including new UUIDs)
      if (data) {
        const grouped: any = {};
        data.forEach(t => {
          if (!grouped[t.category]) grouped[t.category] = [];
          grouped[t.category].push(t);
        });
        setServices(grouped);
        onUpdateStore({ services: grouped });
      }

      onSendPush("Tarifs Mis à Jour", "Les prix des services municipaux ont été actualisés.");
      showSuccess("Tous les tarifs ont été enregistrés avec succès !");
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur [${error.code}]: ${error.message || "Échec de l'enregistrement des services"}`);
    }
    setIsSaving(false);
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: "Nouvel Événement",
      date: new Date().toISOString().split('T')[0],
      type: "Sport",
      description: "Description de l'événement...",
      location: "Stade Municipal",
      img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"
    };
    setAgenda([newEvent, ...agenda]);
  };

  const handleRemoveEvent = (id: number) => {
    setAgenda(agenda.filter((e: any) => e.id !== id));
  };

  const handleUpdateEvent = (id: number, field: string, value: any) => {
    setAgenda(agenda.map((e: any) => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleSaveAgenda = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      const formattedEvents = agenda.map((e: any) => {
        const eventData: any = {
          title: e.title,
          date: e.date,
          type: e.type,
          description: e.description,
          location: e.location,
          image_url: e.img
        };
        
        if (uuidRegex.test(String(e.id))) {
          eventData.id = e.id;
        }
        
        return eventData;
      });

      const { data, error } = await supabase
        .from('agenda_events')
        .upsert(formattedEvents)
        .select();

      if (error) throw error;

      if (data) {
        const updatedAgenda = data.map(e => ({ ...e, img: e.image_url }));
        setAgenda(updatedAgenda);
        onUpdateStore({ agenda: updatedAgenda });
      }

      onSendPush("Agenda Mis à Jour", "Les événements du stade ont été actualisés.");
      showSuccess("Agenda enregistré avec succès !");
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur [${error.code}]: ${error.message || "Échec de l'enregistrement de l'agenda"}`);
    }
    setIsSaving(false);
  };

  const handleAddReport = async () => {
    if (!newReport.title || !newReport.fileUrl) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const reportData = {
        title: newReport.title,
        date: newReport.date,
        year: parseInt(newReport.date.split('-')[0]),
        type: newReport.type,
        category: newReport.category,
        file_url: newReport.fileUrl
      };

      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const freshReport = { ...data[0], fileUrl: data[0].file_url };
        const updatedReports = [freshReport, ...reports];
        setReports(updatedReports);
        onUpdateStore({ reports: updatedReports });
        onSendPush("Nouveau Document Officiel", `Le document "${newReport.title}" est désormais disponible.`);
        showSuccess("Rapport publié avec succès !");
        setNewReport({
          title: '',
          date: new Date().toISOString().split('T')[0],
          type: 'Conseil de Supervision',
          category: 'Sessions',
          fileUrl: ''
        });
      }
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur [${error.code}]: ${error.message || "Échec de la publication"}`);
    }
    setIsSaving(false);
  };

  const handleRemoveReport = async (id: any) => {
    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) throw error;
      
      const updatedReports = reports.filter((r: any) => r.id !== id);
      setReports(updatedReports);
      onUpdateStore({ reports: updatedReports });
      showSuccess("Rapport supprimé.");
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur de suppression: ${error.message}`);
    }
  };

  // --- NEW HANDLERS ---

  const handleUpdateArrondissement = (id: number, field: string, value: any) => {
    setArrondissements(arrondissements.map((a: any) => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleSaveArrondissements = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      const formattedArrs = arrondissements.map((a: any) => {
        const arrData: any = {
          nom: a.name,
          ca: a.chef,
          contact: a.contact,
          localisation: a.localisation,
          quartiers: a.quartiers,
          image_url: a.img
        };
        
        if (uuidRegex.test(String(a.id))) {
          arrData.id = a.id;
        }
        
        return arrData;
      });

      const { data, error } = await supabase
        .from('arrondissements')
        .upsert(formattedArrs)
        .select();

      if (error) throw error;

      if (data) {
        const updatedArrs = data.map(a => ({
          ...a,
          name: a.nom,
          chef: a.ca,
          img: a.image_url
        }));
        setArrondissements(updatedArrs);
        onUpdateStore({ arrondissements: updatedArrs });
      }

      onSendPush("Informations Mises à Jour", "Les contacts des arrondissements ont été actualisés.");
      showSuccess("Arrondissements enregistrés avec succès !");
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur [${error.code}]: ${error.message || "Échec de l'enregistrement"}`);
    }
    setIsSaving(false);
  };

  const handleAddOpportunity = async () => {
    if (!newOpportunity.title || !newOpportunity.description) {
      setErrorMessage("Veuillez remplir le titre et la description.");
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('opportunites')
        .insert([{
          titre: newOpportunity.title,
          type: newOpportunity.type,
          description: newOpportunity.description,
          date_limite: newOpportunity.date,
          statut: 'ouvert'
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const freshOpp = { 
          ...data[0], 
          title: data[0].titre, 
          date: data[0].date_limite 
        };
        const updatedOpps = [freshOpp, ...opportunites];
        setOpportunites(updatedOpps);
        onUpdateStore({ opportunites: updatedOpps });
        onSendPush("Nouvelle Opportunité", `Une nouvelle annonce "${newOpportunity.title}" a été publiée.`);
        showSuccess("Opportunité publiée avec succès !");
        setNewOpportunity({
          title: '',
          type: 'Marché Public',
          date: new Date().toISOString().split('T')[0],
          description: ''
        });
      }
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur [${error.code}]: ${error.message || "Échec de la publication"}`);
    }
    setIsSaving(false);
  };

  const handleRemoveOpportunity = async (id: any) => {
    try {
      const { error } = await supabase.from('opportunites').delete().eq('id', id);
      if (error) throw error;
      
      const updatedOpps = opportunites.filter((o: any) => o.id !== id);
      setOpportunites(updatedOpps);
      onUpdateStore({ opportunites: updatedOpps });
      showSuccess("Opportunité supprimée.");
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur de suppression: ${error.message}`);
    }
  };

  const handleSaveMarketConfig = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ key: 'market_config', value: configMarche });

      if (error) throw error;

      onUpdateStore({ configMarche });
      onSendPush("Rappel Marché", "La configuration du cycle du marché a été mise à jour.");
      showSuccess("Configuration du marché enregistrée !");
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur sauvegarde marché: ${error.message}`);
    }
    setIsSaving(false);
  };

  const handleStadeReservationAction = async (reservation: any, newStatus: 'VALIDE' | 'REFUSE') => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const { error: resError } = await supabase
        .from('reservations_stade')
        .update({ statut: newStatus })
        .eq('id', reservation.id);

      if (resError) throw resError;

      let updatedStoreAgenda = [...agenda];
      if (newStatus === 'VALIDE') {
        const eventData = {
          title: `Réservation : ${reservation.nom} ${reservation.prenom}`,
          date: reservation.date,
          type: "Sport",
          description: `Créneau réservé : ${reservation.creneau}. Contact : ${reservation.telephone}`,
          location: "Stade Municipal",
          image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"
        };

        const { data: eventResult, error: eventError } = await supabase
          .from('agenda_events')
          .insert([eventData])
          .select();

        if (eventError) throw eventError;
        if (eventResult) {
          updatedStoreAgenda = [{ ...eventResult[0], img: eventResult[0].image_url || eventData.image_url }, ...updatedStoreAgenda];
        }
      }

      const updatedReservations = stadeReservations.map((r: any) => 
        r.id === reservation.id ? { ...r, statut: newStatus } : r
      );
      
      setStadeReservations(updatedReservations);
      setAgenda(updatedStoreAgenda);
      
      onUpdateStore({ 
        reservationsStade: updatedReservations,
        agenda: updatedStoreAgenda
      });

      onSendPush(
        newStatus === 'VALIDE' ? "Réservation Confirmée" : "Réservation Refusée",
        `La demande de ${reservation.nom} pour le ${reservation.date} a été traitée.`
      );
      
      showSuccess(newStatus === 'VALIDE' ? "Réservation validée et ajoutée à l'agenda !" : "Réservation refusée.");
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur [${error.code}]: Échec de l'action.`);
    }
    setIsSaving(false);
  };

  const handleValidateAppointment = async (id: any) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Validé' })
        .eq('id', id);

      if (error) throw error;

      const updatedRdv = rendezvous.map((r: any) => {
        if (r.id === id) {
          onSendPush("RDV Confirmé", `Votre rendez-vous est validé.`);
          return { ...r, status: 'Validé' };
        }
        return r;
      });
      setRendezvous(updatedRdv);
      onUpdateStore({ rendezvous: updatedRdv });
      showSuccess("Rendez-vous validé !");
    } catch (error: any) {
      setErrorMessage(`Erreur validation: ${error.message}`);
    }
  };

  const handleCancelAppointment = async (id: any) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Annulé' })
        .eq('id', id);

      if (error) throw error;

      const updatedRdv = rendezvous.map((r: any) => {
        if (r.id === id) return { ...r, status: 'Annulé' };
        return r;
      });
      setRendezvous(updatedRdv);
      onUpdateStore({ rendezvous: updatedRdv });
      showSuccess("Rendez-vous annulé.");
    } catch (error: any) {
      setErrorMessage(`Erreur annulation: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col lg:flex-row transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-card border-r border-border p-8 flex flex-col transition-colors">
        <div className="flex items-center space-x-4 mb-12">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-ink uppercase tracking-widest text-sm">Portail S.E.</h2>
            <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">Secrétaire Exécutif</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {[
            { id: 'services', label: 'Tarifs des Actes', icon: FileText },
            { id: 'agenda', label: 'Planning du Stade', icon: Calendar },
            { id: 'reports', label: 'Rapports Officiels', icon: FileText },
            { id: 'arrondissements', label: 'Arrondissements', icon: MapPin },
            { id: 'opportunities', label: 'Opportunités & Appels', icon: Briefcase },
            { id: 'market', label: 'Cycle du Marché', icon: ShoppingBag },
            { id: 'appointments', label: 'Audiences Citoyennes', icon: CalendarCheck },
            { id: 'stade_res', label: 'Gestion du Stade', icon: Users },
            { id: 'flash', label: 'Bandeau d\'Alerte', icon: Bell },
            { id: 'settings', label: 'Configuration', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all min-h-[44px] ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-2' 
                  : 'text-ink/40 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-ink/40">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Agent Municipal</p>
              <p className="text-[10px] text-ink/40 uppercase font-bold tracking-widest">Connecté</p>
            </div>
          </div>
          <button 
            onClick={onExit}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-red/10 text-red font-bold hover:bg-red hover:text-white transition-all min-h-[44px]"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Quitter le Portail</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black text-ink mb-2">
              {activeTab === 'services' && "Gestion des Services"}
              {activeTab === 'agenda' && "Agenda du Stade"}
              {activeTab === 'reports' && "Rapports & Documents"}
              {activeTab === 'arrondissements' && "Éditeur d'Arrondissements"}
              {activeTab === 'opportunities' && "Gestionnaire d'Opportunités"}
              {activeTab === 'market' && "Configurateur de Marché"}
              {activeTab === 'appointments' && "Suivi des Rendez-vous"}
              {activeTab === 'stade_res' && "Demandes Réservation Stade"}
              {activeTab === 'flash' && "Bandeau Flash News"}
              {activeTab === 'settings' && "Paramètres Système"}
            </h1>
            <p className="text-ink/40 font-medium">Interface de gestion simplifiée pour les agents de la mairie.</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-12 pr-6 py-3 bg-card border border-border rounded-xl outline-none focus:border-primary transition-all text-sm text-ink min-h-[44px]"
              />
            </div>
          </div>
        </header>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-primary text-white rounded-2xl flex items-center space-x-3 shadow-lg shadow-primary/20"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm">{successMessage}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-red text-white rounded-2xl flex items-center space-x-3 shadow-lg shadow-red/20"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-bold text-sm">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        <div className="bg-card rounded-[2.5rem] shadow-2xl border border-border p-8 lg:p-12 transition-colors">
          {activeTab === 'flash' && (
            <div className="max-w-2xl space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-ink/40">Message Défilant</label>
                <textarea 
                  value={flashNews}
                  onChange={(e) => setFlashNews(e.target.value)}
                  rows={4}
                  className="w-full bg-muted border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-ink font-medium resize-none min-h-[44px]"
                  placeholder="Entrez le message à afficher sur le site..."
                />
              </div>
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start space-x-4">
                <Info className="w-6 h-6 text-primary mt-1" />
                <p className="text-sm text-ink/60 leading-relaxed">
                  Ce message apparaîtra instantanément dans le bandeau défilant en haut de toutes les pages du site. 
                  Une notification push sera également envoyée aux citoyens abonnés.
                </p>
              </div>
              <button 
                onClick={handleSaveFlashNews}
                disabled={isSaving}
                className="flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 min-h-[44px]"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Enregistrer & Notifier</span>
              </button>
            </div>
          )}

          {activeTab === 'arrondissements' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {arrondissements.map((arr: any) => (
                  <div key={arr.id} className="p-8 bg-muted rounded-3xl border border-border space-y-6">
                    <h4 className="text-lg font-black text-ink flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-primary" />
                      {arr.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Chef d'Arrondissement</label>
                        <input 
                          type="text" 
                          value={arr.chef}
                          onChange={(e) => handleUpdateArrondissement(arr.id, 'chef', e.target.value)}
                          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-ink min-h-[44px]"
                          title="Nom du Chef d'Arrondissement"
                          placeholder="Ex: M. SOSSOU"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Contact</label>
                        <input 
                          type="text" 
                          value={arr.contact}
                          onChange={(e) => handleUpdateArrondissement(arr.id, 'contact', e.target.value)}
                          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-ink min-h-[44px]"
                          title="Contact de l'Arrondissement"
                          placeholder="Ex: +229 97 00 00 00"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleSaveArrondissements}
                disabled={isSaving}
                className="flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 min-h-[44px]"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Enregistrer les Modifications</span>
              </button>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="space-y-12">
              <div className="max-w-3xl p-8 bg-muted rounded-3xl border border-border space-y-8">
                <h3 className="text-xl font-black text-ink">Nouvelle Annonce</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Titre</label>
                    <input 
                      type="text" 
                      value={newOpportunity.title}
                      onChange={(e) => setNewOpportunity({...newOpportunity, title: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-ink min-h-[44px]"
                      placeholder="Ex: Recrutement saisonnier"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Type</label>
                    <select 
                      value={newOpportunity.type}
                      onChange={(e) => setNewOpportunity({...newOpportunity, type: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-ink min-h-[44px]"
                      title="Type d'opportunité"
                    >
                      <option>Marché Public</option>
                      <option>Emploi</option>
                      <option>Événement</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Description</label>
                    <textarea 
                      value={newOpportunity.description}
                      onChange={(e) => setNewOpportunity({...newOpportunity, description: e.target.value})}
                      rows={3}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-ink resize-none min-h-[44px]"
                      title="Description de l'opportunité"
                      placeholder="Détails de l'annonce..."
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAddOpportunity}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publier l'Opportunité</span>
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-ink">Annonces Actives</h3>
                <div className="grid grid-cols-1 gap-4">
                  {opportunites.map((opp: any) => (
                    <div key={opp.id} className="p-6 bg-muted rounded-2xl border border-border flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-ink">{opp.title}</p>
                          <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{opp.type} • {opp.date}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveOpportunity(opp.id)}
                        className="p-2 text-red hover:bg-red/5 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
                        title="Supprimer cette opportunité"
                        aria-label="Supprimer cette opportunité"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'market' && (
            <div className="max-w-2xl space-y-8">
              <div className="p-8 bg-muted rounded-3xl border border-border space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-black text-ink">Cycle du Marché</h3>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Date de référence (Dernier marché)</label>
                  <input 
                    type="date" 
                    value={configMarche.referenceDate}
                    onChange={(e) => setConfigMarche({ referenceDate: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl px-6 py-4 outline-none focus:border-primary text-ink font-bold min-h-[44px]"
                    title="Date du prochain marché"
                  />
                  <p className="text-xs text-ink/40 font-medium leading-relaxed">
                    Cette date sert de base au calcul automatique des prochains jours de marché (tous les 5 jours). 
                    Ajustez-la uniquement en cas de décalage exceptionnel du calendrier traditionnel.
                  </p>
                </div>
                <button 
                  onClick={handleSaveMarketConfig}
                  disabled={isSaving}
                  className="flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all min-h-[44px]"
                  title="Enregistrer la configuration du marché"
                  aria-label="Enregistrer la configuration du marché"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Enregistrer & Rappeler</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-ink">Demandes d'Audience</h3>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    {rendezvous.filter((r: any) => r.status === 'En attente').length} En attente
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Citoyen</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Motif</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Date & Heure</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Statut</th>
                      <th className="text-right py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rendezvous.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-ink/40 font-medium">Aucune demande de rendez-vous pour le moment.</td>
                      </tr>
                    ) : (
                      rendezvous.map((rdv: any) => (
                        <tr key={rdv.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold text-ink">{rdv.name}</p>
                            <p className="text-xs text-ink/40">{rdv.phone}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-muted border border-border rounded-lg text-xs font-bold text-ink/60">{rdv.motif}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2 text-sm font-bold text-ink">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span>{new Date(rdv.date).toLocaleDateString()}</span>
                              <Clock className="w-4 h-4 text-primary ml-2" />
                              <span>{rdv.time}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              rdv.status === 'Validé' ? 'bg-primary/10 text-primary' :
                              rdv.status === 'Annulé' ? 'bg-red/10 text-red' :
                              'bg-accent/20 text-primary'
                            }`}>
                              {rdv.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            {rdv.status === 'En attente' && (
                              <>
                                <button 
                                  onClick={() => handleValidateAppointment(rdv.id)}
                                  className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all min-h-[44px] min-w-[44px]"
                                  title="Valider le rendez-vous"
                                  aria-label="Valider le rendez-vous"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleCancelAppointment(rdv.id)}
                                  className="p-2 bg-red/10 text-red rounded-xl hover:bg-red hover:text-white transition-all min-h-[44px] min-w-[44px]"
                                  title="Annuler le rendez-vous"
                                  aria-label="Annuler le rendez-vous"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-12">
              {Object.entries(services).map(([category, items]: [string, any]) => {
                const CategoryIcon = ({
                  'etat-civil': Users,
                  'urbanisme-foncier': Building2,
                  'marches-publics': ShoppingBag,
                  'taxe-developpement': Coins,
                  'divers': FileText
                } as any)[category] || FileText;

                return (
                  <div key={category} className="space-y-8">
                    <h3 className="text-2xl font-black text-ink capitalize flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mr-4">
                        <CategoryIcon className="w-6 h-6" />
                      </div>
                      {category.replace(/-/g, ' ')}
                    </h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {items.map((service: any) => (
                        <div key={service.id} className="p-8 bg-muted rounded-3xl border border-border space-y-6">
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-black text-ink">{service.name}</h4>
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">{service.delay}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Tarif (FCFA)</label>
                            <input 
                              type="number" 
                              value={service.cost}
                              onChange={(e) => handleUpdateServicePrice(category, service.id, e.target.value)}
                              className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all font-bold text-primary"
                              title="Tarif du service"
                              placeholder="Montant en FCFA"
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Pièces à fournir</label>
                            <div className="space-y-2">
                              {service.pieces.map((piece: string, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-card p-3 rounded-xl border border-border">
                                  <span className="text-xs text-ink/60">{piece}</span>
                                  <button 
                                    onClick={() => handleRemovePiece(category, service.id, idx)}
                                    className="text-red hover:bg-red/5 p-1 rounded-lg transition-colors"
                                    title={`Supprimer la pièce "${piece}"`}
                                    aria-label={`Supprimer la pièce "${piece}"`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              <input 
                                type="text" 
                                placeholder="Ajouter une pièce..." 
                                title="Ajouter une nouvelle pièce justificative"
                                className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-xs outline-none focus:border-primary text-ink"
                                onKeyDown={(e: any) => {
                                  if (e.key === 'Enter') {
                                    handleAddPiece(category, service.id, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <button 
                                className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
                                title="Ajouter une pièce"
                                aria-label="Ajouter une pièce"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <button 
                onClick={handleSaveServices}
                disabled={isSaving}
                className="flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                title="Enregistrer les tarifs des services"
                aria-label="Enregistrer les tarifs des services"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Enregistrer les Tarifs</span>
              </button>
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-ink">Événements à venir</h3>
                <button 
                  onClick={handleAddEvent}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  title="Ajouter un nouvel événement"
                  aria-label="Ajouter un nouvel événement"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un événement</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {agenda.map((event: any) => (
                  <div key={event.id} className="p-8 bg-muted rounded-3xl border border-border flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-muted border border-border">
                      <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Titre</label>
                          <input 
                            type="text" 
                            value={event.title}
                            onChange={(e) => handleUpdateEvent(event.id, 'title', e.target.value)}
                            className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary text-ink"
                            title="Titre de l'événement"
                            placeholder="Nom de la rencontre"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Description</label>
                          <textarea 
                            value={event.description}
                            onChange={(e) => handleUpdateEvent(event.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary resize-none text-ink"
                            title="Description de l'événement"
                            placeholder="Détails de la rencontre..."
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Date</label>
                            <input 
                              type="date" 
                              value={event.date}
                              onChange={(e) => handleUpdateEvent(event.id, 'date', e.target.value)}
                              className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary text-ink"
                              title="Date de l'événement"
                              placeholder="AAAA-MM-JJ"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Type</label>
                            <select 
                              value={event.type}
                              onChange={(e) => handleUpdateEvent(event.id, 'type', e.target.value)}
                              className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary text-ink"
                              title="Type d'événement"
                              aria-label="Type d'événement"
                            >
                              <option className="bg-card">Sport</option>
                              <option className="bg-card">Culture</option>
                              <option className="bg-card">Social</option>
                              <option className="bg-card">Gouvernance</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Lieu</label>
                            <input 
                              type="text" 
                              value={event.location}
                              onChange={(e) => handleUpdateEvent(event.id, 'location', e.target.value)}
                              className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary text-ink"
                              title="Lieu de l'événement"
                              placeholder="Ex: Stade Municipal"
                            />
                          </div>
                          <button 
                            onClick={() => handleRemoveEvent(event.id)}
                            className="ml-4 p-3 text-red hover:bg-red/5 rounded-xl transition-colors"
                            title={`Supprimer l'événement "${event.title}"`}
                            aria-label={`Supprimer l'événement "${event.title}"`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleSaveAgenda}
                disabled={isSaving}
                className="flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                title="Enregistrer les modifications de l'agenda"
                aria-label="Enregistrer les modifications de l'agenda"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Enregistrer l'Agenda</span>
              </button>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-12">
              <div className="max-w-3xl p-8 bg-muted rounded-3xl border border-border space-y-8">
                <h3 className="text-xl font-black text-ink">Publier un nouveau document</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Titre du document</label>
                    <input 
                      type="text" 
                      value={newReport.title}
                      onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-ink"
                      title="Titre du rapport"
                      placeholder="Ex: Rapport de Session Mars 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Date de la séance</label>
                    <input 
                      type="date" 
                      value={newReport.date}
                      onChange={(e) => setNewReport({...newReport, date: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-ink"
                      title="Date de la séance ou du document"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Type de document</label>
                    <select 
                      value={newReport.type}
                      onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-ink min-h-[44px]"
                      title="Type de document"
                      aria-label="Type de document"
                    >
                      <option className="bg-card">Conseil de Supervision</option>
                      <option className="bg-card">Session Communale</option>
                      <option className="bg-card">Arrêté Municipal</option>
                      <option className="bg-card">Rapport d'Activité</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Catégorie</label>
                    <select 
                      value={newReport.category}
                      onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-ink min-h-[44px]"
                      title="Catégorie du document"
                      aria-label="Catégorie du document"
                    >
                      <option className="bg-card">Sessions</option>
                      <option className="bg-card">Finances</option>
                      <option className="bg-card">Urbanisme</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Lien du fichier (PDF/Word/Image)</label>
                    <input 
                      type="text" 
                      value={newReport.fileUrl}
                      onChange={(e) => setNewReport({...newReport, fileUrl: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-ink min-h-[44px]"
                      title="URL du fichier (PDF/Image)"
                      placeholder="https://votre-site.com/doc.pdf"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddReport}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                  title="Publier le document et notifier les citoyens"
                  aria-label="Publier le document et notifier les citoyens"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Publier & Notifier les Citoyens</span>
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-ink">Documents récents</h3>
                <div className="grid grid-cols-1 gap-4">
                  {reports.map((report: any) => (
                    <div key={report.id} className="p-6 bg-muted rounded-2xl border border-border flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-ink">{report.title}</p>
                          <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{report.type} • {report.date}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveReport(report.id)}
                        className="p-2 text-red hover:bg-red/5 rounded-lg transition-colors"
                        title={`Supprimer le document "${report.title}"`}
                        aria-label={`Supprimer le document "${report.title}"`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stade_res' && (
            <div className="space-y-8">
              <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">
                        <th className="px-8 py-6">Citoyen</th>
                        <th className="px-8 py-6">Contact</th>
                        <th className="px-8 py-6">Date & Créneau</th>
                        <th className="px-8 py-6">Statut</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {stadeReservations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-12 text-center text-ink/40 font-bold">
                            Aucune demande de réservation pour le moment.
                          </td>
                        </tr>
                      ) : (
                        stadeReservations.map((res: any) => (
                          <tr key={res.id} className="group hover:bg-muted/30 transition-all">
                            <td className="px-8 py-6">
                              <p className="font-bold text-ink uppercase">{res.nom} {res.prenom}</p>
                              <p className="text-[10px] text-ink/40 font-bold tracking-widest uppercase">Demandeur</p>
                            </td>
                            <td className="px-8 py-6">
                              <p className="font-bold text-ink text-sm">{res.telephone}</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3 h-3 text-primary" />
                                <span className="text-sm font-bold text-ink">{res.date}</span>
                              </div>
                              <p className="text-[10px] font-black text-primary uppercase mt-1 tracking-widest">{res.creneau}</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                res.statut === 'VALIDE' ? 'bg-green-500/10 text-green-500' :
                                res.statut === 'REFUSE' ? 'bg-red/10 text-red' :
                                'bg-orange-500/10 text-orange-500'
                              }`}>
                                {res.statut}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              {res.statut === 'EN_ATTENTE' && (
                                <div className="flex items-center justify-end space-x-2">
                                  <button 
                                    onClick={() => handleStadeReservationAction(res, 'VALIDE')}
                                    className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 hover:scale-105 transition-all"
                                    title="Confirmer la réservation"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleStadeReservationAction(res, 'REFUSE')}
                                    className="p-3 bg-red text-white rounded-xl shadow-lg shadow-red/20 hover:scale-105 transition-all"
                                    title="Refuser la réservation"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                              {res.statut !== 'EN_ATTENTE' && (
                                <span className="text-[10px] font-bold text-ink/20 uppercase tracking-widest">Traité</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-8">
              <div className="p-8 bg-muted rounded-3xl border border-border">
                <h3 className="text-xl font-black text-ink mb-6">Notifications Push</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-ink">Activer FCM</p>
                      <p className="text-xs text-ink/40">Lier l'application à Firebase Cloud Messaging</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-card rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-ink">Service Worker</p>
                      <p className="text-xs text-ink/40">État du worker pour le mode hors-ligne</p>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">Actif</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
