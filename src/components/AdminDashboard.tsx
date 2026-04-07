
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
  Menu,
  CalendarCheck,
  Building2,
  Coins,
  Users,
  FileSignature,
  Calculator,
  Newspaper,
  Map as MapIcon,
  Moon,
  Sun,
  BarChart2,
  Users2,
  Hammer,
  Vote,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { parseImageUrl, getOptimizedNetworkUrl } from '../utils/imageParser';
import AdminAI_Assistant from './AdminAI_Assistant';

interface AdminDashboardProps {
  store: any;
  onUpdateStore: (newData: any) => void;
  onSendPush: (title: string, message: string, urlPath?: string, imageUrl?: string, tag?: string) => void;
  onExit: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  userRole?: 'admin' | 'employee';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  store, 
  onUpdateStore, 
  onSendPush, 
  onExit, 
  isDarkMode, 
  toggleDarkMode,
  userRole = 'employee'
}) => {
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'analytics' : 'services');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // RBAC & Audit States
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Audit Helper
  const logAuditAction = async (actionType: string, moduleName: string, description: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('audit_logs').insert([{
        user_id: user.id,
        user_name: user.email,
        action_type: actionType,
        module_name: moduleName,
        description: description
      }]);
      
      // Refresh logs if we are on the audit tab
      if (activeTab === 'audit') fetchAuditLogs();
    } catch (err) {
      console.error("Failed to log audit action:", err);
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
  };

  const fetchAuditLogs = async () => {
    const { data } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(50);
    if (data) setAuditLogs(data);
  };

  const handleApproveUser = async (userId: string, approve: boolean) => {
    const { error } = await supabase.from('user_profiles').update({ is_approved: approve }).eq('id', userId);
    if (!error) {
      showSuccess(approve ? "Utilisateur approuvé !" : "Utilisateur révoqué.");
      fetchUsers();
      logAuditAction(approve ? 'APPROVE' : 'REVOKE', 'Utilisateurs', `A ${approve ? 'approuvé' : 'révoqué'} l'accès de ${users.find(u => u.id === userId)?.email}`);
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('user_profiles').update({ role: newRole }).eq('id', userId);
    if (!error) {
      showSuccess(`Rôle mis à jour : ${newRole}`);
      fetchUsers();
      logAuditAction('UPDATE', 'Utilisateurs', `A changé le rôle de ${users.find(u => u.id === userId)?.email} en ${newRole}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur du système ?")) return;

    const userToRemove = users.find(u => u.id === userId);
    const { error } = await supabase.from('user_profiles').delete().eq('id', userId);
    
    if (!error) {
      showSuccess("Utilisateur supprimé avec succès.");
      fetchUsers();
      logAuditAction('DELETE', 'Utilisateurs', `A supprimé définitivement le compte de : ${userToRemove?.email}`);
    } else {
      setErrorMessage("Échec de la suppression de l'utilisateur.");
    }
  };

  // Local form states
  const [flashNews, setFlashNews] = useState(store.flashNews);
  const [stats, setStats] = useState({
    totalDossiers: 0,
    totalArtisans: 0,
    totalSondages: 0,
    activePolls: 0
  });
  const [services, setServices] = useState(store.services);
  const [agenda, setAgenda] = useState(store.agenda);
  const [reports, setReports] = useState(store.reports || []);
  const [arrondissements, setArrondissements] = useState(store.arrondissements || []);
  const [opportunites, setOpportunites] = useState(store.opportunites || []);
  const [rendezvous, setRendezvous] = useState(store.rendezvous || []);
  const [stadeReservations, setStadeReservations] = useState(store.reservationsStade || []);
  const [news, setNews] = useState(store.news || []);
  const [configMarche, setConfigMarche] = useState(store.configMarche || { referenceDate: '' });
  const [audiences, setAudiences] = useState(store.audiences || []);
  const [council, setCouncil] = useState(store.council || []);
  const [formulaires, setFormulaires] = useState(store.formulaires || []);
  const [taxSettings, setTaxSettings] = useState(store.tax_settings || {
    tfu_rates: { taux_bati: 6, taux_non_bati: 5 },
    patente_rates: { droit_fixe_base: 10000, droit_proportionnel: 10 }
  });
  
  // Za-Kpota 2.0 States
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [sondages, setSondages] = useState<any[]>([]);
  const [newArtisan, setNewArtisan] = useState({ nom: '', metier: 'Menuisier', arrondissement: 'Za-Kpota', telephone: '', is_verified: true });
  const [newSondage, setNewSondage] = useState({ titre: '', description: '', options: [{ label: '', votes: 0 }, { label: '', votes: 0 }] });
  const [newDossier, setNewDossier] = useState({ code: '', citoyen_nom: '', type: 'Acte de Naissance', statut: 'Dépôt' });
  
  const [newFormulaire, setNewFormulaire] = useState({
    title: '',
    category: 'État-civil',
    drive_link: '',
    description: ''
  });
  
  const [locations, setLocations] = useState(store.locations || []);
  const [newLocation, setNewLocation] = useState({
    name: '',
    category: 'Administration',
    description: '',
    lat: 7.1915,
    lng: 2.2635,
    image_url: ''
  });
  
  const [newCouncilMember, setNewCouncilMember] = useState({
    name: '',
    role: '',
    photo_url: '',
    bio: '',
    role_id: ''
  });

  const [newReport, setNewReport] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Conseil de Supervision',
    category: 'Sessions',
    fileUrl: ''
  });

  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    category: 'Administration',
    image_url: ''
  });

  const [customPushTitle, setCustomPushTitle] = useState('');
  const [customPushMessage, setCustomPushMessage] = useState('');
  const [customPushUrl, setCustomPushUrl] = useState('');
  const [customPushImage, setCustomPushImage] = useState('');

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
    setFormulaires(store.formulaires || []);
    if (store.tax_settings && Object.keys(store.tax_settings).length > 0) {
      setTaxSettings(store.tax_settings);
    }
    setLocations(store.locations || []);
    setNews(store.news || []);
    setAudiences(store.audiences || []);
    setCouncil(store.council || []);
    
    const fetchData = async () => {
      const { data: doss } = await supabase.from('dossiers').select('*').order('created_at', { ascending: false });
      const { data: arts } = await supabase.from('artisans').select('*').order('nom', { ascending: true });
      const { data: sond } = await supabase.from('sondages').select('*').order('created_at', { ascending: false });
      
      if (doss) setDossiers(doss);
      if (arts) setArtisans(arts);
      if (sond) setSondages(sond);

      const { data: artData } = await supabase.from('artisans').select('id');
      const { data: dosData } = await supabase.from('dossiers').select('id');
      const { data: sonData } = await supabase.from('sondages').select('id, is_active');
      
      setStats({
        totalArtisans: artData?.length || 0,
        totalDossiers: dosData?.length || 0,
        totalSondages: sonData?.length || 0,
        activePolls: sonData?.filter(s => s.is_active).length || 0
      });

      if (userRole === 'admin') {
        fetchUsers();
        fetchAuditLogs();
      }
      
      setLoading(false);
    };

    fetchData();
  }, [store, userRole, activeTab]);
  
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
      onSendPush("Flash Info", "Le bandeau défilant a été mis à jour.", "/", "", "flash-info");
      showSuccess("Bandeau Flash mis à jour avec succès !");
      logAuditAction('UPDATE', 'Alertes & Push', "A mis à jour le bandeau défilant municipal.");
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

  const handleAddService = (category: string) => {
    const newService = {
      id: `temp-${Date.now()}`,
      name: "Nouveau Service",
      description: "",
      cost: 0,
      delay: "24h",
      pieces: [],
      link: null,
      category: category
    };
    
    const updatedServices = { ...services };
    if (!updatedServices[category]) {
      updatedServices[category] = [];
    }
    updatedServices[category] = [newService, ...updatedServices[category]];
    setServices(updatedServices);
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

      onSendPush("Tarifs Mis à Jour", "Les prix des services municipaux ont été actualisés.", "/services", "", "service-update");
      showSuccess("Tous les tarifs ont été enregistrés avec succès !");
      logAuditAction('UPDATE', 'Tarifs des Actes', "A mis à jour la grille tarifaire complète des actes municipaux.");
    } catch (error: any) {
      console.error('Supabase Error:', error);
      setErrorMessage(`Erreur [${error.code}]: ${error.message || "Échec de l'enregistrement des services"}`);
    }
    setIsSaving(false);
  };

  const handleRemoveService = async (category: string, id: string) => {
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(String(id))) {
        const { error } = await supabase.from('services_tarifs').delete().eq('id', id);
        if (error) throw error;
      }
      
      const newServices = { ...services };
      newServices[category] = newServices[category].filter((s: any) => s.id !== id);
      setServices(newServices);
      onUpdateStore({ services: newServices });
      showSuccess("Acte supprimé localement. Assurez-vous d'enregistrer les tarifs pour synchroniser.");
      logAuditAction('DELETE', 'Tarifs des Actes', `A supprimé un acte dans la catégorie ${category}.`);
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Échec de la suppression.");
    }
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

      onSendPush("Agenda Mis à Jour", "Les événements du stade ont été actualisés.", "/agenda", "", "agenda-update");
      showSuccess("Agenda enregistré avec succès !");
      logAuditAction('UPDATE', 'Planning du Stade', "A mis à jour le planning officiel du stade.");
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
        onSendPush("Nouveau Document Officiel", `Le document "${newReport.title}" est désormais disponible.`, "/publications", "", "document-alert");
        showSuccess("Rapport publié avec succès !");
        logAuditAction('CREATE', 'Rapports Officiels', `A publié un nouveau document : "${newReport.title}"`);
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

      onSendPush("Informations Mises à Jour", "Les contacts des arrondissements ont été actualisés.", "/arrondissements", "", "info-update");
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
        onSendPush("Nouvelle Opportunité", `Une nouvelle annonce "${newOpportunity.title}" a été publiée.`, "/opportunites", "", "job-alert");
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

  const handleSaveTaxSettings = async () => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      await supabase.from('tax_settings').upsert({ key: 'tfu_rates', value: taxSettings.tfu_rates });
      await supabase.from('tax_settings').upsert({ key: 'patente_rates', value: taxSettings.patente_rates });
      
      onUpdateStore({ tax_settings: taxSettings });
      showSuccess("Paramètres fiscaux enregistrés !");
      logAuditAction('UPDATE', 'Paramètres Fiscaux', "A modifié les taux de simulation des taxes (TFU/Patente).");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Erreur sauvegarde taxes: ${err.message}`);
    }
    setIsSaving(false);
  };

  const handleAddFormulaire = async () => {
    if (!newFormulaire.title || !newFormulaire.drive_link) {
      setErrorMessage("Veuillez remplir le titre et le lien.");
      return;
    }
    setIsSaving(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase
        .from('formulaires')
        .insert([newFormulaire])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        const updatedForms = [data[0], ...formulaires];
        setFormulaires(updatedForms);
        onUpdateStore({ formulaires: updatedForms });
        showSuccess("Formulaire ajouté !");
        setNewFormulaire({ title: '', category: 'État-civil', drive_link: '', description: '' });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Erreur: ${err.message}`);
    }
    setIsSaving(false);
  };

  const handleDeleteFormulaire = async (id: string) => {
    if (!window.confirm("Voulez-vous supprimer ce formulaire ?")) return;
    try {
      const { error } = await supabase.from('formulaires').delete().eq('id', id);
      if (error) throw error;
      const updated = formulaires.filter((f: any) => f.id !== id);
      setFormulaires(updated);
      onUpdateStore({ formulaires: updated });
      showSuccess("Formulaire supprimé !");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Erreur: ${err.message}`);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.name || !newLocation.lat || !newLocation.lng) {
      setErrorMessage("Veuillez remplir le nom et les coordonnées GPS.");
      return;
    }
    setIsSaving(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert([newLocation])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        const updated = [data[0], ...locations];
        setLocations(updated);
        onUpdateStore({ locations: updated });
        onSendPush("Nouveau Lieu Ajouté", `${newLocation.name} a été ajouté sur la carte communale.`, "/carte");
        showSuccess("Lieu ajouté à la carte !");
        setNewLocation({
          name: '',
          category: 'Administration',
          description: '',
          lat: 7.1915,
          lng: 2.2635,
          image_url: ''
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Erreur: ${err.message}`);
    }
    setIsSaving(false);
  };

  const handleDeleteLocation = async (id: string) => {
    if (!window.confirm("Voulez-vous supprimer ce lieu de la carte ?")) return;
    try {
      const { error } = await supabase.from('locations').delete().eq('id', id);
      if (error) throw error;
      const updated = locations.filter((l: any) => l.id !== id);
      setLocations(updated);
      onUpdateStore({ locations: updated });
      showSuccess("Lieu supprimé !");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Erreur: ${err.message}`);
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
      onSendPush("Rappel Marché", "La configuration du cycle du marché a été mise à jour.", "/marche");
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
        `La demande de ${reservation.nom} pour le ${reservation.date} a été traitée.`,
        "/stade"
      );
      
      showSuccess(newStatus === 'VALIDE' ? "Réservation validée et ajoutée à l'agenda !" : "Réservation refusée.");
      logAuditAction('UPDATE', 'Gestion Stade', `A ${newStatus === 'VALIDE' ? 'validé' : 'refusé'} la réservation de ${reservation.nom} pour le ${reservation.date}.`);
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
          onSendPush("RDV Confirmé", `Votre rendez-vous est validé.`, "/audiences");
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

  const handleSendCustomPush = () => {
    if (!customPushTitle || !customPushMessage) {
      setErrorMessage("Veuillez remplir le titre et le message.");
      return;
    }
    onSendPush(customPushTitle, customPushMessage, customPushUrl || '/', customPushImage, "custom-alert");
    showSuccess("Notification envoyée avec succès !");
    setCustomPushTitle('');
    setCustomPushMessage('');
    setCustomPushUrl('');
    setCustomPushImage('');
  };

  const handleSaveNews = async () => {
    if (!newNews.title || !newNews.description || !newNews.image_url) {
      setErrorMessage("Veuillez remplir tous les champs de l'actualité.");
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([{
          title: newNews.title,
          description: newNews.description,
          category: newNews.category,
          image_url: newNews.image_url,
          date: new Date().toISOString().split('T')[0]
        }])
        .select();

      if (error) throw error;

      const freshNews = {
        ...data[0],
        desc: data[0].description,
        cat: data[0].category,
        img: data[0].image_url
      };

      const updatedNews = [freshNews, ...news];
      setNews(updatedNews);
      onUpdateStore({ news: updatedNews });

      // Rich Push Notification - Envoi avec image et tag
      onSendPush(
        newNews.title, 
        newNews.description.substring(0, 100) + "...", 
        `/news/${data[0].id}`, 
        getOptimizedNetworkUrl(newNews.image_url), 
        "news-alert"
      );

      showSuccess("Actualité publiée et notification envoyée !");
      logAuditAction('CREATE', 'Actualités', `A publié l'actualité : "${newNews.title}"`);
      setNewNews({
        title: '',
        description: '',
        category: 'Administration',
        image_url: ''
      });
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Erreur lors de la publication.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) {
      const updated = news.filter((n: any) => n.id !== id);
      setNews(updated);
      onUpdateStore({ news: updated });
      showSuccess("Actualité supprimée.");
    }
  };

  const handleUpdateAudienceStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('audiences').update({ status }).eq('id', id);
    if (!error) {
      const updated = audiences.map((a: any) => a.id === id ? { ...a, status } : a);
      setAudiences(updated);
      onUpdateStore({ audiences: updated });
      showSuccess(`Statut mis à jour : ${status}`);
    }
  };

  const handleDeleteAudience = async (id: string) => {
    const { error } = await supabase.from('audiences').delete().eq('id', id);
    if (!error) {
      const updated = audiences.filter((a: any) => a.id !== id);
      setAudiences(updated);
      onUpdateStore({ audiences: updated });
      showSuccess("Message/Demande supprimé.");
    }
  };

  const handleSaveCouncilMember = async () => {
    if (!newCouncilMember.name || !newCouncilMember.role) {
      setErrorMessage("Veuillez remplir le nom et le poste.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: newCouncilMember.name,
        role: newCouncilMember.role,
        photo_url: parseImageUrl(newCouncilMember.photo_url),
        bio: newCouncilMember.bio,
        role_id: newCouncilMember.role_id || null
      };

      const { data, error } = await supabase.from('council').insert([payload]).select('*, council_roles(*)');
      if (error) throw error;
      
      const freshMember = data[0];
      const updated = [...council, { ...freshMember, photo: freshMember.photo_url }];
      
      // Sort by importance
      const sorted = [...updated].sort((a, b) => {
        const orderA = a.council_roles?.importance_order ?? 99;
        const orderB = b.council_roles?.importance_order ?? 99;
        return orderA - orderB;
      });

      setCouncil(sorted);
      onUpdateStore({ council: sorted });
      showSuccess("Membre du conseil ajouté !");
      setNewCouncilMember({ name: '', role: '', photo_url: '', bio: '', role_id: '' });
    } catch (e) {
      console.error(e);
      setErrorMessage("Erreur lors de l'ajout.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCouncilMember = async (id: string) => {
    const { error } = await supabase.from('council').delete().eq('id', id);
    if (!error) {
      const updated = council.filter((c: any) => c.id !== id);
      setCouncil(updated);
      onUpdateStore({ council: updated });
      showSuccess("Membre supprimé.");
    }
  };

  // --- ZA-KPOTA 2.0 HANDLERS ---
  
  const handleAddDossier = async () => {
    if (!newDossier.code || !newDossier.citoyen_nom) return;
    setIsSaving(true);
    const { data, error } = await supabase.from('dossiers').insert([newDossier]).select();
    if (!error && data) {
      setDossiers([data[0], ...dossiers]);
      setNewDossier({ code: '', citoyen_nom: '', type: 'Acte de Naissance', statut: 'Dépôt' });
      showSuccess("Dossier créé !");
    }
    setIsSaving(false);
  };

  const handleUpdateDossierStatus = async (id: string, statut: string) => {
    const { error } = await supabase.from('dossiers').update({ statut }).eq('id', id);
    if (!error) {
      setDossiers(dossiers.map(d => d.id === id ? { ...d, statut } : d));
      showSuccess("Statut du dossier mis à jour !");
    }
  };

  const handleAddArtisan = async () => {
    if (!newArtisan.nom || !newArtisan.telephone) return;
    setIsSaving(true);
    const { data, error } = await supabase.from('artisans').insert([newArtisan]).select();
    if (!error && data) {
      setArtisans([...artisans, data[0]]);
      setNewArtisan({ nom: '', metier: 'Menuisier', arrondissement: 'Za-Kpota', telephone: '', is_verified: true });
      showSuccess("Artisan ajouté à l'annuaire !");
    }
    setIsSaving(false);
  };

  const handleDeleteArtisan = async (id: string) => {
    const { error } = await supabase.from('artisans').delete().eq('id', id);
    if (!error) {
      setArtisans(artisans.filter(a => a.id !== id));
      showSuccess("Artisan supprimé.");
    }
  };

  const handleAddSondage = async () => {
    if (!newSondage.titre) return;
    setIsSaving(true);
    const { data, error } = await supabase.from('sondages').insert([{ ...newSondage, is_active: true }]).select();
    if (!error && data) {
      setSondages([data[0], ...sondages]);
      setNewSondage({ titre: '', description: '', options: [{ label: '', votes: 0 }, { label: '', votes: 0 }] });
      showSuccess("Sondage publié !");
    }
    setIsSaving(false);
  };

  const handleDeleteSondage = async (id: string) => {
    const { error } = await supabase.from('sondages').delete().eq('id', id);
    if (!error) {
      setSondages(sondages.filter(s => s.id !== id));
      showSuccess("Sondage supprimé.");
    }
  };
  
  return (
    <div className="min-h-screen bg-muted flex flex-col lg:flex-row transition-colors duration-300">
      
      {/* Mobile Topbar */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h2 className="font-black text-ink uppercase tracking-widest text-xs">Portail S.E.</h2>
        </div>
        <div className="flex items-center space-x-2">
          {toggleDarkMode && (
            <button 
              onClick={toggleDarkMode}
              className="p-2 bg-muted text-ink rounded-lg"
              title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-[#00c561]" /> : <Moon className="w-5 h-5 text-primary" />}
            </button>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-muted text-ink rounded-lg"
          >
            {isSidebarOpen ? <XCircle className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 bg-card border-r border-border p-6 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden lg:flex items-center space-x-4 mb-12">
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
            { id: 'analytics', label: 'Statistiques', icon: BarChart2, role: 'admin' },
            { id: 'ai', label: 'Intelligence IA', icon: Bot },
            { id: 'services', label: 'Tarifs des Actes', icon: FileText },
            { id: 'agenda', label: 'Planning du Stade', icon: Calendar },
            { id: 'stade_res', label: 'Gestion Stade', icon: Users },
            { id: 'dossiers', label: 'Suivi Dossiers', icon: FileText },
            { id: 'artisans', label: 'Annuaire Artisans', icon: Hammer },
            { id: 'formulaires', label: 'Guichet Numérique', icon: FileSignature },
            { id: 'taxes', label: 'Paramètres Fiscaux', icon: Calculator },
            { id: 'reports', label: 'Rapports Officiels', icon: FileText, role: 'admin' },
            { id: 'mapping', label: 'Lieux & Carte', icon: MapPin, role: 'admin' },
            { id: 'arrondissements', label: 'Arrondissements', icon: MapPin, role: 'admin' },
            { id: 'opportunities', label: 'Opportunités & Appels', icon: Briefcase, role: 'admin' },
            { id: 'news', label: 'Actualités Mairie', icon: Newspaper, role: 'admin' },
            { id: 'market', label: 'Cycle du Marché', icon: ShoppingBag, role: 'admin' },
            { id: 'appointments', label: 'Audiences', icon: CalendarCheck, role: 'admin' },
            { id: 'council', label: 'Conseil Municipal', icon: Users, role: 'admin' },
            { id: 'sondages', label: 'Sondages Citoyens', icon: Vote, role: 'admin' },
            { id: 'users', label: 'Utilisateurs', icon: Users2, role: 'admin' },
            { id: 'audit', label: 'Journal d\'Audit', icon: Clock, role: 'admin' },
            { id: 'flash', label: 'Alertes & Push', icon: Bell, role: 'admin' },
            { id: 'settings', label: 'Configuration', icon: Settings },
          ].filter(item => !item.role || (item.role === 'admin' && userRole === 'admin')).map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl font-bold transition-all min-h-[44px] ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 lg:translate-x-2' 
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
              {activeTab === 'news' && "Actualités & Communiqués"}
              {activeTab === 'appointments' && "Suivi des Rendez-vous"}
              {activeTab === 'stade_res' && "Demandes Réservation Stade"}
              {activeTab === 'flash' && "Alertes Flash & Push"}
              {activeTab === 'dossiers' && "Suivi des Dossiers Citoyens"}
              {activeTab === 'artisans' && "Gestion de l'Annuaire Artisans"}
              {activeTab === 'sondages' && "Sondages & Consultations"}
              {activeTab === 'analytics' && "Tableau de Bord Analytique"}
              {activeTab === 'ai' && "Intelligence Artificielle & Rapports"}
              {activeTab === 'users' && "Gestion des Utilisateurs"}
              {activeTab === 'audit' && "Journal d'Audit Sécurité"}
              {activeTab === 'settings' && "Paramètres Système"}
            </h1>
            <p className="text-ink/40 font-medium">Interface de gestion simplifiée pour les agents de la mairie.</p>
          </div>

          <div className="flex items-center space-x-4">
            {toggleDarkMode && (
              <button 
                onClick={toggleDarkMode}
                className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center text-primary dark:text-[#00c561] hover:bg-primary/5 transition-colors"
                title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
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
          {activeTab === 'ai' && <AdminAI_Assistant />}

          {activeTab === 'users' && userRole === 'admin' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">
                      <th className="px-8 py-6">Utilisateur</th>
                      <th className="px-8 py-6">Rôle</th>
                      <th className="px-8 py-6">Statut</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-all">
                        <td className="px-8 py-6">
                          <p className="font-bold text-ink">{u.first_name} {u.last_name}</p>
                          <p className="text-xs text-ink/40">{u.email}</p>
                        </td>
                        <td className="px-8 py-6">
                          <select 
                            value={u.role}
                            onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                            className="bg-muted border border-border rounded-lg px-3 py-1 text-[10px] font-black uppercase outline-none"
                          >
                            <option value="employee">Employé</option>
                            <option value="admin">Administrateur (SE/DSI)</option>
                          </select>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            u.is_approved ? 'bg-green-500/10 text-green-500' : 'bg-red/10 text-red'
                          }`}>
                            {u.is_approved ? 'Approuvé' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                          {u.role !== 'admin' && (
                            <>
                              {u.is_approved ? (
                                <button 
                                  onClick={() => handleApproveUser(u.id, false)}
                                  className="px-4 py-2 bg-red/10 text-red rounded-xl text-[10px] font-black uppercase hover:bg-red hover:text-white transition-all"
                                >
                                  Révoquer
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleApproveUser(u.id, true)}
                                  className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-green-500/20 hover:scale-105 transition-all"
                                >
                                  Approuver
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-2 text-red hover:bg-red/5 rounded-xl transition-all"
                                title="Supprimer définitivement"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {u.role === 'admin' && (
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest px-4">Admin Principal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit' && userRole === 'admin' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">
                      <th className="px-8 py-6">Date & Heure</th>
                      <th className="px-8 py-6">Agent</th>
                      <th className="px-8 py-6">Action</th>
                      <th className="px-8 py-6">Module</th>
                      <th className="px-8 py-6">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {auditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-all text-xs">
                        <td className="px-8 py-4 font-medium text-ink/40">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-8 py-4 font-bold text-ink">
                          {log.user_name}
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            log.action_type === 'CREATE' ? 'bg-green-500/10 text-green-500' :
                            log.action_type === 'DELETE' ? 'bg-red/10 text-red' :
                            log.action_type === 'UPDATE' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-muted text-ink/40'
                          }`}>
                            {log.action_type}
                          </span>
                        </td>
                        <td className="px-8 py-4 font-bold text-primary uppercase tracking-widest text-[9px]">
                          {log.module_name}
                        </td>
                        <td className="px-8 py-4 text-ink/60 italic">
                          {log.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'flash' && (
            <div className="max-w-2xl space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-ink/40">Message Défilant</label>
                <textarea 
                  value={flashNews}
                  onChange={(e) => setFlashNews(e.target.value)}
                  rows={4}
                  title="Texte du message défilant"
                  className="w-full bg-muted border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-ink font-medium resize-none min-h-[44px]"
                  placeholder="Entrez le message à afficher sur le site..."
                />
              </div>
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start space-x-4">
                <Info className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm text-ink/60 leading-relaxed">
                  Ce message apparaîtra instantanément dans le bandeau défilant en haut de toutes les pages du site. 
                  Une notification push sera également envoyée automatiquement à tous les citoyens abonnés.
                </p>
              </div>
              <div className="flex flex-col gap-4 border-b border-border pb-8">
                <button 
                  onClick={handleSaveFlashNews}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 min-h-[44px]"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Enregistrer le Bandeau & Notifier</span>
                </button>
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-black text-ink mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-primary" /> Alerte Rapide (Push Globale)
                </h3>
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Titre de l'Alerte</label>
                    <input 
                      type="text" 
                      value={customPushTitle}
                      onChange={(e) => setCustomPushTitle(e.target.value)}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: Alerte Méteo Grave"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Message</label>
                    <textarea 
                      value={customPushMessage}
                      onChange={(e) => setCustomPushMessage(e.target.value)}
                      rows={3}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm text-ink min-h-[44px] resize-none"
                      placeholder="Contenu de la notification..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Lien de redirection (Optionnel)</label>
                    <input 
                      type="text" 
                      value={customPushUrl}
                      onChange={(e) => setCustomPushUrl(e.target.value)}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: /carte, /agenda, ou https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">URL de l'image (Rich Media)</label>
                    <input 
                      type="text" 
                      value={customPushImage}
                      onChange={(e) => setCustomPushImage(e.target.value)}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: https://images.unsplash.com/..."
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSendCustomPush}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-red text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red/90 transition-all shadow-xl shadow-red/20 min-h-[44px]"
                >
                  <Bell className="w-4 h-4" />
                  <span>Diffuser l'Alerte Manuellement</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'formulaires' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
                <h3 className="text-xl font-black text-ink mb-6">Ajouter un Formulaire</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Titre</label>
                    <input 
                      type="text" 
                      value={newFormulaire.title}
                      onChange={(e) => setNewFormulaire({...newFormulaire, title: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: Demande de Permis"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Catégorie</label>
                    <select 
                      title="Catégorie du formulaire"
                      value={newFormulaire.category}
                      onChange={(e) => setNewFormulaire({...newFormulaire, category: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      aria-label="Sélectionner la catégorie"
                    >
                      <option>État-civil</option>
                      <option>Urbanisme</option>
                      <option>Économie</option>
                      <option>Affaires Sociales</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Lien Google Drive (PDF)</label>
                    <input 
                      type="url" 
                      value={newFormulaire.drive_link}
                      onChange={(e) => setNewFormulaire({...newFormulaire, drive_link: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Description (Optionnel)</label>
                    <textarea 
                      value={newFormulaire.description}
                      onChange={(e) => setNewFormulaire({...newFormulaire, description: e.target.value})}
                      rows={2}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm resize-none"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAddFormulaire}
                  disabled={isSaving}
                  className="px-8 py-4 bg-ink text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ink/90 transition-all shadow-xl disabled:opacity-50 min-h-[44px] flex items-center justify-center space-x-2"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Ajouter au Guichet</span>
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-ink mb-6">Formulaires Existants</h3>
                {formulaires.map((f: any) => (
                  <div key={f.id} className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-2 inline-block">
                        {f.category}
                      </span>
                      <h4 className="font-bold text-ink">{f.title}</h4>
                      {f.description && <p className="text-xs text-ink-muted mt-1">{f.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={f.drive_link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline">
                        Voir le lien
                      </a>
                      <button title="Supprimer" onClick={() => handleDeleteFormulaire(f.id)} className="p-3 text-red hover:bg-red/10 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'taxes' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
                <h3 className="text-xl font-black text-ink mb-6 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-primary" /> Configuration du Simulateur
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* TFU */}
                  <div className="space-y-6 bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <h4 className="font-bold text-ink mb-4 border-b border-border pb-2">Taxe Foncière Unique (Taux en %)</h4>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-ink/40">Taux Bâti</label>
                      <input 
                        type="number" 
                        title="Taux Bâti (%)"
                        placeholder="Ex: 6"
                        value={taxSettings.tfu_rates?.taux_bati || ''}
                        onChange={(e) => setTaxSettings({...taxSettings, tfu_rates: { ...taxSettings.tfu_rates, taux_bati: parseFloat(e.target.value) }})}
                        className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-ink/40">Taux Non Bâti</label>
                      <input 
                        type="number" 
                        title="Taux Non Bâti (%)"
                        placeholder="Ex: 5"
                        value={taxSettings.tfu_rates?.taux_non_bati || ''}
                        onChange={(e) => setTaxSettings({...taxSettings, tfu_rates: { ...taxSettings.tfu_rates, taux_non_bati: parseFloat(e.target.value) }})}
                        className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Patentes */}
                  <div className="space-y-6 bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <h4 className="font-bold text-ink mb-4 border-b border-border pb-2">Contribution des Patentes (FCFA)</h4>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-ink/40">Droit Fixe de Base</label>
                      <input 
                        type="number" 
                        title="Droit Fixe de Base (FCFA)"
                        placeholder="Ex: 10000"
                        value={taxSettings.patente_rates?.droit_fixe_base || ''}
                        onChange={(e) => setTaxSettings({...taxSettings, patente_rates: { ...taxSettings.patente_rates, droit_fixe_base: parseFloat(e.target.value) }})}
                        className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-ink/40">Droit Proportionnel (%)</label>
                      <input 
                        type="number" 
                        title="Droit Proportionnel (%)"
                        placeholder="Ex: 10"
                        value={taxSettings.patente_rates?.droit_proportionnel || ''}
                        onChange={(e) => setTaxSettings({...taxSettings, patente_rates: { ...taxSettings.patente_rates, droit_proportionnel: parseFloat(e.target.value) }})}
                        className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex border-t border-border pt-8 justify-end">
                  <button 
                    onClick={handleSaveTaxSettings}
                    disabled={isSaving}
                    className="flex items-center justify-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 min-h-[44px]"
                  >
                    {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Mettre à jour les taux officiels</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mapping' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
                <h3 className="text-xl font-black text-ink mb-6 flex items-center gap-2">
                  <MapIcon className="w-6 h-6 text-primary" /> Ajouter un Lieu sur la Carte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Nom de l'infrastructure</label>
                    <input 
                      title="Nom du lieu"
                      type="text" 
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: Centre de Santé de Za-Kpota"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Catégorie</label>
                    <select 
                      title="Catégorie du lieu"
                      value={newLocation.category}
                      onChange={(e) => setNewLocation({...newLocation, category: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                    >
                      <option>Administration</option>
                      <option>Éducation</option>
                      <option>Santé</option>
                      <option>Lieux de Culte</option>
                      <option>Marchés & Commerce</option>
                      <option>Loisirs & Stade</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Latitude</label>
                    <input 
                      title="Latitude"
                      type="number" 
                      step="any"
                      value={newLocation.lat}
                      onChange={(e) => setNewLocation({...newLocation, lat: parseFloat(e.target.value)})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="7.1915"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Longitude</label>
                    <input 
                      title="Longitude"
                      type="number" 
                      step="any"
                      value={newLocation.lng}
                      onChange={(e) => setNewLocation({...newLocation, lng: parseFloat(e.target.value)})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="2.2635"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">URL Image (Optionnel)</label>
                    <input 
                      title="Lien image"
                      type="url" 
                      value={newLocation.image_url}
                      onChange={(e) => setNewLocation({...newLocation, image_url: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Description</label>
                    <textarea 
                      title="Description du lieu"
                      value={newLocation.description}
                      onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                      rows={3}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm resize-none"
                      placeholder="Détails sur l'infrastructure..."
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAddLocation}
                  disabled={isSaving}
                  className="px-8 py-4 bg-ink text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ink/90 transition-all shadow-xl disabled:opacity-50 min-h-[44px] flex items-center justify-center space-x-2"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Ajouter le lieu</span>
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-ink flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" /> Lieux Répertoriés ({locations.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locations.map((loc: any) => (
                    <div key={loc.id} className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-primary">
                          <MapIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-1 rounded">
                            {loc.category}
                          </span>
                          <h4 className="font-bold text-ink block mt-1">{loc.name}</h4>
                          <p className="text-[10px] text-ink/40 font-medium">GPS: {Number(loc.lat).toFixed(4)}, {Number(loc.lng).toFixed(4)}</p>
                        </div>
                      </div>
                      <button 
                        title="Supprimer ce lieu"
                        onClick={() => handleDeleteLocation(loc.id)} 
                        className="p-3 text-red hover:bg-red/5 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Date Limite</label>
                    <input 
                      type="date" 
                      value={newOpportunity.date}
                      onChange={(e) => setNewOpportunity({...newOpportunity, date: e.target.value})}
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-ink min-h-[44px]"
                      title="Date limite"
                    />
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

          {activeTab === 'news' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="max-w-3xl p-8 bg-card rounded-3xl border border-border shadow-xl space-y-8">
                <h3 className="text-xl font-black text-ink flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  Publier une Actualité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Titre de l'Actualité</label>
                    <input 
                      type="text" 
                      value={newNews.title}
                      onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px] text-ink font-bold"
                      placeholder="Ex: Inauguration du nouveau marché"
                      title="Titre de l'article"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Catégorie</label>
                    <select 
                      value={newNews.category}
                      onChange={(e) => setNewNews({...newNews, category: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px] text-ink font-bold"
                      title="Catégorie de l'actualité"
                    >
                      <option value="Administration">🏛️ Administration</option>
                      <option value="Travaux">🏗️ Travaux</option>
                      <option value="Sport">⚽ Sport</option>
                      <option value="Santé">🏥 Santé</option>
                      <option value="Annonces">📢 Annonces</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">URL de l'Image de couverture</label>
                    <input 
                      type="text" 
                      value={newNews.image_url}
                      onChange={(e) => setNewNews({...newNews, image_url: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px] text-ink"
                      placeholder="Lien Direct (ex: Unsplash, PostImg...)"
                      title="URL de l'image"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Contenu / Détails</label>
                    <textarea 
                      value={newNews.description}
                      onChange={(e) => setNewNews({...newNews, description: e.target.value})}
                      rows={5}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm resize-none text-ink font-medium leading-relaxed"
                      title="Détails de l'actualité"
                      placeholder="Décrivez l'événement en quelques lignes..."
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSaveNews}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 min-h-[44px]"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Publier & Notifier les Citoyens</span>
                </button>
              </div>

              <div className="space-y-6 pb-20">
                <h3 className="text-xl font-black text-ink flex items-center gap-2">
                   Flux des Actualités ({news.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.map((item: any) => (
                    <div key={item.id} className="p-6 bg-card rounded-[2rem] border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <div className="relative w-16 h-16 shrink-0 group-hover:scale-105 transition-transform duration-500">
                           <img src={item.img} alt="" className="w-full h-full rounded-2xl object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-ink truncate text-sm">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded">
                               {item.cat}
                             </span>
                             <span className="text-[9px] text-ink/40 font-bold">{item.date}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-3 text-ink/20 hover:text-red hover:bg-red/5 rounded-xl transition-all min-h-[44px] min-w-[44px] shrink-0"
                        title="Supprimer cette actualité"
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
                <h3 className="text-2xl font-black text-ink">Demandes d'Audience & Messages</h3>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    {audiences.filter((a: any) => a.status === 'En attente').length} En attente
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Type</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Citoyen</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Objet / Motif</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Date</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Statut</th>
                      <th className="text-right py-4 px-6 text-[10px] font-black uppercase tracking-widest text-ink/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audiences.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-ink/40 font-medium">Aucune demande d'audience ou message pour le moment.</td>
                      </tr>
                    ) : (
                      audiences.map((aud: any) => (
                        <tr key={aud.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                              aud.type === 'rdv' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                            }`}>
                              {aud.type === 'rdv' ? 'RDV' : 'CONTACT'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-ink">{aud.name}</p>
                            <p className="text-[10px] text-ink/40 font-medium">{aud.email || aud.phone}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-xs font-bold text-ink mb-1">{aud.subject || 'Aucun objet'}</p>
                            <p className="text-[10px] text-ink/40 font-medium line-clamp-1">{aud.message}</p>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col text-[10px] font-bold text-ink">
                              {aud.type === 'rdv' ? (
                                <>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3 text-primary" />
                                    <span>{new Date(aud.appointment_date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 mt-1 text-primary">
                                    <Clock className="w-3 h-3" />
                                    <span>{aud.appointment_time}</span>
                                  </div>
                                </>
                              ) : (
                                <span>{new Date(aud.created_at).toLocaleDateString()}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              aud.status === 'Validé' ? 'bg-primary/10 text-primary' :
                              aud.status === 'Annulé' ? 'bg-red/10 text-red' :
                              'bg-accent/20 text-primary'
                            }`}>
                              {aud.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                             <button 
                                onClick={() => handleUpdateAudienceStatus(aud.id, 'Validé')}
                                className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all"
                                title="Valider / Marquer comme lu"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAudience(aud.id)}
                                className="p-2 text-red hover:bg-red/5 rounded-lg transition-all"
                                title="Supprimer"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'council' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
                <h3 className="text-xl font-black text-ink mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" /> Nouveau Membre du Conseil
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Nom Complet</label>
                    <input 
                      title="Nom du membre"
                      type="text" 
                      value={newCouncilMember.name}
                      onChange={(e) => setNewCouncilMember({...newCouncilMember, name: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: M. Jean Robert SOSSOU"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Poste / Rôle</label>
                    <select 
                      title="Sélectionner le rôle"
                      value={newCouncilMember.role_id}
                      onChange={(e) => {
                        const selectedRole = store.council_roles?.find((r: any) => r.id === e.target.value);
                        setNewCouncilMember({
                          ...newCouncilMember, 
                          role_id: e.target.value,
                          role: selectedRole ? selectedRole.title : ''
                        });
                      }}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px] font-bold"
                    >
                      <option value="">Sélectionner un poste...</option>
                      {store.council_roles?.map((role: any) => (
                        <option key={role.id} value={role.id}>{role.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">URL Photo</label>
                    <input 
                      title="Photo du membre"
                      type="url" 
                      value={newCouncilMember.photo_url}
                      onChange={(e) => setNewCouncilMember({...newCouncilMember, photo_url: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSaveCouncilMember}
                  disabled={isSaving}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl disabled:opacity-50 min-h-[44px] flex items-center justify-center space-x-2"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Ajouter au Conseil</span>
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-ink flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" /> Membres Actuels ({council.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {council.map((member: any) => (
                    <div key={member.id} className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-xl overflow-hidden shadow-inner font-bold">
                          {member.photo_url ? (
                            <img src={parseImageUrl(member.photo_url)} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/20"><User /></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-ink block">{member.name}</h4>
                          <p className="text-[10px] text-primary font-black uppercase tracking-widest">
                            {member.council_roles?.title || member.role}
                          </p>
                        </div>
                      </div>
                      <button 
                        title="Supprimer ce membre"
                        onClick={() => handleDeleteCouncilMember(member.id)} 
                        className="p-3 text-red hover:bg-red/5 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h3 className="text-2xl font-black text-ink capitalize flex items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mr-4">
                          <CategoryIcon className="w-6 h-6" />
                        </div>
                        {category.replace(/-/g, ' ')}
                      </h3>
                      <button 
                        onClick={() => handleAddService(category)}
                        className="px-6 py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Ajouter un Acte
                      </button>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {items.map((service: any) => (
                        <div key={service.id} className="p-8 bg-muted rounded-3xl border border-border space-y-6">
                          <div className="flex justify-between items-start">
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) => {
                                const newServices = {...services};
                                const idx = newServices[category].findIndex((s:any) => s.id === service.id);
                                if(idx > -1) newServices[category][idx].name = e.target.value;
                                setServices(newServices);
                              }}
                              className="font-black text-ink bg-transparent outline-none border-b border-border border-dashed focus:border-primary/50 text-lg w-full max-w-[70%]"
                              title="Nom de l'acte"
                            />
                            <input 
                              type="text"
                              value={service.delay}
                              onChange={(e) => {
                                const newServices = {...services};
                                const idx = newServices[category].findIndex((s:any) => s.id === service.id);
                                if(idx > -1) newServices[category][idx].delay = e.target.value;
                                setServices(newServices);
                              }}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest outline-none w-24 text-center"
                              title="Délai estimé"
                            />
                            <button 
                               onClick={() => handleRemoveService(category, service.id)}
                               className="p-2 text-red hover:bg-red/5 rounded-lg transition-all"
                               title="Supprimer cet acte"
                               aria-label="Supprimer cet acte"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
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

          {activeTab === 'dossiers' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
                <h3 className="text-xl font-black text-ink mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" /> Nouveau Dossier à Suivre
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Code Suivi</label>
                    <input 
                      type="text" 
                      value={newDossier.code}
                      onChange={(e) => setNewDossier({...newDossier, code: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: ZK-2024-001"
                      title="Code de suivi unique"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Nom du Citoyen</label>
                    <input 
                      type="text" 
                      value={newDossier.citoyen_nom}
                      onChange={(e) => setNewDossier({...newDossier, citoyen_nom: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: Koffi AKAKPO"
                      title="Nom complet du demandeur"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Type de Demande</label>
                    <select 
                      value={newDossier.type}
                      onChange={(e) => setNewDossier({...newDossier, type: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      title="Nature de l'acte"
                    >
                      <option>Acte de Naissance</option>
                      <option>Certificat de Résidence</option>
                      <option>Permis de Construire</option>
                      <option>Attestation Foncière</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Statut Initial</label>
                    <select 
                      value={newDossier.statut}
                      onChange={(e) => setNewDossier({...newDossier, statut: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      title="État d'avancement"
                    >
                      <option>Dépôt</option>
                      <option>Vérification</option>
                      <option>Signature</option>
                      <option>Prêt</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={handleAddDossier}
                  disabled={isSaving}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl disabled:opacity-50 min-h-[44px] flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer le Dossier</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {dossiers.map((d: any) => (
                  <div key={d.id} className="p-6 bg-muted rounded-2xl border border-border flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-ink">{d.code} — {d.citoyen_nom}</h4>
                      <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">{d.type} • Créé le {new Date(d.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select 
                        value={d.statut}
                        onChange={(e) => handleUpdateDossierStatus(d.id, e.target.value)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-none outline-none ${
                          d.statut === 'Prêt' ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'
                        }`}
                        title="Modifier le statut"
                      >
                        <option>Dépôt</option>
                        <option>Vérification</option>
                        <option>Signature</option>
                        <option>Prêt</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'artisans' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
                <h3 className="text-xl font-black text-ink mb-6 flex items-center gap-2">
                  <Hammer className="w-6 h-6 text-primary" /> Ajouter un Artisan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Nom & Prénoms</label>
                    <input 
                      type="text" 
                      value={newArtisan.nom}
                      onChange={(e) => setNewArtisan({...newArtisan, nom: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: Michel KPODANH"
                      title="Nom de l'artisan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Métier</label>
                    <select 
                      value={newArtisan.metier}
                      onChange={(e) => setNewArtisan({...newArtisan, metier: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      title="Corps de métier"
                    >
                      <option>Menuisier</option>
                      <option>Maçon</option>
                      <option>Couturier</option>
                      <option>Mécanicien</option>
                      <option>Électricien</option>
                      <option>Agriculture</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Téléphone</label>
                    <input 
                      type="tel" 
                      value={newArtisan.telephone}
                      onChange={(e) => setNewArtisan({...newArtisan, telephone: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="+229 97 00 00 00"
                      title="Numéro de contact"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAddArtisan}
                  disabled={isSaving}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl disabled:opacity-50 min-h-[44px] flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter à l'Annuaire</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artisans.map((art: any) => (
                  <div key={art.id} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-border flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-primary">
                        <Hammer className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-ink dark:text-white">{art.nom}</h4>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">{art.metier} • {art.telephone}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteArtisan(art.id)}
                      className="p-3 text-red hover:bg-red/5 rounded-xl transition-all"
                      title="Supprimer l'artisan"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sondages' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
                <h3 className="text-xl font-black text-ink mb-6 flex items-center gap-2">
                  <Vote className="w-6 h-6 text-primary" /> Créer un Sondage
                </h3>
                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Titre du Sondage</label>
                    <input 
                      type="text" 
                      value={newSondage.titre}
                      onChange={(e) => setNewSondage({...newSondage, titre: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm min-h-[44px]"
                      placeholder="Ex: Priorité pour le budget 2025"
                      title="Titre du sondage"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Options de réponse</label>
                    {newSondage.options.map((opt, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          value={opt.label}
                          onChange={(e) => {
                            const newOptions = [...newSondage.options];
                            newOptions[idx].label = e.target.value;
                            setNewSondage({...newSondage, options: newOptions});
                          }}
                          className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
                          placeholder={`Option ${idx + 1}`}
                          title={`Libellé de l'option ${idx + 1}`}
                        />
                        {newSondage.options.length > 2 && (
                          <button 
                            onClick={() => {
                              const newOptions = newSondage.options.filter((_, i) => i !== idx);
                              setNewSondage({...newSondage, options: newOptions});
                            }}
                            className="p-3 text-red hover:bg-red/5 rounded-xl"
                            title="Supprimer cette option"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      onClick={() => setNewSondage({...newSondage, options: [...newSondage.options, { label: '', votes: 0 }]})}
                      className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      + Ajouter une option
                    </button>
                  </div>
                </div>
                <button 
                  onClick={handleAddSondage}
                  disabled={isSaving}
                  className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl disabled:opacity-50 min-h-[44px] flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publier le Sondage</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sondages.map((s: any) => {
                  const total = s.options.reduce((acc: number, curr: any) => acc + (curr.votes || 0), 0);
                  return (
                    <div key={s.id} className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-border">
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="text-lg font-black text-ink dark:text-white uppercase tracking-tight">{s.titre}</h4>
                        <button 
                          onClick={() => handleDeleteSondage(s.id)}
                          className="p-2 text-red hover:bg-red/5 rounded-lg"
                          title="Supprimer le sondage"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {s.options.map((opt: any, i: number) => {
                          const pct = total > 0 ? Math.round((opt.votes || 0) / total * 100) : 0;
                          return (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-[10px] font-black text-ink/60 dark:text-white/40 uppercase">
                                <span>{opt.label}</span>
                                <span>{opt.votes || 0} votes ({pct}%)</span>
                              </div>
                              <div className="w-full h-2 bg-muted dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-primary text-white rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-2xl" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Total Dossiers</p>
                  <h3 className="text-5xl font-black">{stats.totalDossiers || '...'}</h3>
                  <p className="text-xs font-medium text-white/80 mt-4">En temps réel (Supabase)</p>
                </div>
                <div className="p-8 bg-accent text-primary rounded-[2.5rem] shadow-xl shadow-accent/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Artisans Référencés</p>
                  <h3 className="text-5xl font-black">{stats.totalArtisans || '...'}</h3>
                  <p className="text-xs font-medium text-primary/80 mt-4">Annuaire Local Actif</p>
                </div>
                <div className="p-8 bg-card rounded-[2.5rem] border border-border shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-ink/40 mb-2">Impact Citoyen</p>
                  <h3 className="text-5xl font-black text-primary">{stats.totalSondages || '...'}</h3>
                  <p className="text-xs font-medium text-ink/60 mt-4">Sondages & Consultations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm h-96 flex flex-col items-center justify-center">
                  <BarChart2 className="w-16 h-16 text-primary/10 mb-6" />
                  <p className="text-sm font-bold text-ink/40 italic">Graphique de fréquentation (En attente de connexion Analytics)</p>
                </div>
                <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm">
                  <h4 className="text-sm font-black uppercase tracking-widest text-ink mb-8">Activités Récentes</h4>
                  <div className="space-y-6">
                    {[
                      { type: 'Dossier', msg: 'Z-2024-56 validé par le S.E.', time: 'il y a 2 min' },
                      { type: 'Alerte', msg: 'Push communiqué météo envoyé', time: 'il y a 15 min' },
                      { type: 'Vote', msg: 'Nouvelle participation au sondage Budget', time: 'il y a 40 min' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-ink">{item.msg}</p>
                          <p className="text-[10px] text-ink/40 font-black uppercase tracking-widest">{item.type} • {item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
