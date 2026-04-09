import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Building2, Save, X, Plus, LogOut, CheckCircle2, PauseCircle,
  Loader2, Settings, Layers, Edit2, Palette, ToggleLeft, ToggleRight,
  UserCheck, XCircle, Clock, KeyRound, Eye, EyeOff, Image, RefreshCw, Search
} from 'lucide-react';

interface SuperAdminDashboardProps {
  onExit: () => void;
  userName: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

type Tab = 'tenants' | 'candidatures' | 'modules' | 'config';

export default function SuperAdminDashboard({ onExit, userName, isDarkMode, toggleDarkMode }: SuperAdminDashboardProps) {
  const [tenants, setTenants] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [tenantFeatures, setTenantFeatures] = useState<Record<string, string[]>>({});
  const [pendingAdmins, setPendingAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [tenantSearch, setTenantSearch] = useState('');
  const [candidatureSearch, setCandidatureSearch] = useState('');

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('tenants');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [showPinFor, setShowPinFor] = useState<string | null>(null);
  const [pinEdit, setPinEdit] = useState('');
  const [showPinValue, setShowPinValue] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newMairie, setNewMairie] = useState({ name: '', subdomain: '', email: '', pin: '', logo_url: '', primary_color: '#006633' });
  const [editForm, setEditForm] = useState({ name: '', slogan: '', logo_url: '', contact_email: '', contact_phone: '', primary_color: '#006633' });

  useEffect(() => { fetchAll(); }, []);

  const notify = (type: 'success' | 'error', text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 3500);
  };

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: t }, { data: f }] = await Promise.all([
      supabase.from('tenants').select('*').order('created_at', { ascending: false }),
      supabase.from('features').select('*').order('title')
    ]);
    if (t) {
      setTenants(t);
      if (!selectedTenantId && t.length > 0) setSelectedTenantId(t[0].id);
      const { data: tf } = await supabase.from('tenant_features').select('tenant_id, feature_id, is_enabled, features(key_name)');
      const map: Record<string, string[]> = {};
      (tf || []).forEach((row: any) => {
        if (row.is_enabled && row.features?.key_name) {
          if (!map[row.tenant_id]) map[row.tenant_id] = [];
          map[row.tenant_id].push(row.features.key_name);
        }
      });
      setTenantFeatures(map);
    }
    if (f) setFeatures(f);

    // Chargement candidatures admins en attente (toutes mairies)
    const { data: admins } = await supabase
      .from('user_profiles')
      .select('*, tenants(name, subdomain)')
      .eq('role', 'admin')
      .eq('is_approved', false)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    setPendingAdmins(admins || []);

    setLoading(false);
  };

  // -------- Handlers Mairies --------
  const handleToggleTenantStatus = async (id: string, current: boolean) => {
    await supabase.from('tenants').update({ is_active: !current }).eq('id', id);
    notify('success', current ? 'Mairie suspendue.' : 'Mairie réactivée.');
    fetchAll();
  };

  const handleUpdatePin = async (tenantId: string) => {
    if (!pinEdit || pinEdit.length < 4) { notify('error', 'Le PIN doit contenir au moins 4 caractères.'); return; }
    setSaving(true);
    try {
      // On utilise la RPC qui re-hash le PIN via bcrypt
      const { error } = await supabase.rpc('update_tenant_pin', { p_tenant_id: tenantId, p_new_pin: pinEdit });
      if (error) throw error;
      notify('success', 'PIN mis à jour avec succès.');
      setShowPinFor(null);
      setPinEdit('');
    } catch (e: any) {
      notify('error', 'Erreur mise à jour PIN : ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // -------- Handlers Candidatures Admins --------
  const handleApproveAdmin = async (userId: string, tenantId: string) => {
    const { error } = await supabase.from('user_profiles').update({ is_approved: true }).eq('id', userId);
    if (!error) {
      notify('success', 'Administrateur validé. Il peut désormais se connecter.');
      // Audit
      await supabase.from('audit_logs').insert([{
        tenant_id: tenantId,
        user_id: userId,
        action: 'APPROVE_ADMIN',
        entity: 'user_profiles',
        entity_id: userId,
        description: 'Compte administrateur approuvé par le Super Admin.'
      }]);
      fetchAll();
    } else {
      notify('error', 'Erreur validation : ' + error.message);
    }
  };

  const handleRejectAdmin = async (userId: string, email: string) => {
    const reason = window.prompt(`Motif du rejet pour ${email} (ex: Mairie incorrecte) :`);
    if (reason === null) return;

    const { error } = await supabase.from('user_profiles').update({
      deleted_at: new Date().toISOString(),
      is_approved: false,
      rejection_reason: reason
    }).eq('id', userId);
    
    if (!error) {
      notify('success', 'Candidature rejetée.');
      fetchAll();
    }
  };

  // -------- Handlers Modules --------
  const handleToggleFeature = async (tenantId: string, featureKey: string, featureId: string, currentlyEnabled: boolean) => {
    await supabase.from('tenant_features').upsert(
      { tenant_id: tenantId, feature_id: featureId, is_enabled: !currentlyEnabled },
      { onConflict: 'tenant_id,feature_id' }
    );
    fetchAll();
  };

  // -------- Handlers Config --------
  const handleEditConfig = (t: any) => {
    setEditingTenant(t);
    setEditForm({
      name: t.name || '', slogan: t.slogan || '', logo_url: t.logo_url || '',
      contact_email: t.contact_email || '', contact_phone: t.contact_phone || '',
      primary_color: t.primary_color || '#006633'
    });
    setActiveTab('config');
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;
    setSaving(true);
    await supabase.from('tenants').update(editForm).eq('id', editingTenant.id);
    setSaving(false);
    notify('success', 'Configuration sauvegardée !');
    fetchAll();
  };

  // -------- Handler Création Mairie --------
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: tenantId, error } = await supabase.rpc('create_tenant_with_setup', {
        p_name: newMairie.name, p_subdomain: newMairie.subdomain,
        p_contact_email: newMairie.email, p_admin_pin: newMairie.pin
      });
      if (error) throw error;

      // Mise à jour logo & couleur si fournis
      if (tenantId && (newMairie.logo_url || newMairie.primary_color !== '#006633')) {
        await supabase.from('tenants').update({
          logo_url: newMairie.logo_url || null,
          primary_color: newMairie.primary_color
        }).eq('id', tenantId);
      }

      setShowAddForm(false);
      setNewMairie({ name: '', subdomain: '', email: '', pin: '', logo_url: '', primary_color: '#006633' });
      notify('success', `Mairie "${newMairie.name}" déployée avec succès !`);
      fetchAll();
    } catch (err: any) {
      notify('error', "Erreur d'onboarding : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);
  const activeFeaturesForSelectedTenant = tenantFeatures[selectedTenantId] || [];

  const tabs: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: 'tenants', label: 'Mairies', icon: Building2 },
    { id: 'candidatures', label: 'Candidatures', icon: UserCheck, badge: pendingAdmins.length },
    { id: 'modules', label: 'Modules', icon: Layers },
    { id: 'config', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} font-sans`}>

      {/* Toast notification */}
      <AnimatePresence>
        {actionMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-3 ${actionMsg.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {actionMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {actionMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="bg-primary text-white p-4 shadow-2xl sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-xl font-black tracking-widest uppercase">GovTech SaaS</h1>
              <p className="text-[10px] text-accent font-bold uppercase tracking-[0.2em]">Pôle Gouvernance Super Admin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium hidden md:block">Chef d'Orchestre : <strong>{userName}</strong></span>
            <button onClick={toggleDarkMode} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-lg">{isDarkMode ? '☀️' : '🌙'}</button>
            <button onClick={onExit} className="flex items-center space-x-2 bg-red-500/20 text-white px-4 py-2 rounded-xl hover:bg-red-500/40 transition text-xs font-bold uppercase">
              <LogOut className="w-4 h-4" /><span>Quitter</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow flex items-center justify-between border-l-4 border-primary">
            <div><p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Mairies</p><p className="text-3xl font-black text-slate-800 dark:text-white">{tenants.length}</p></div>
            <Building2 className="w-10 h-10 text-primary/20" />
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow flex items-center justify-between border-l-4 border-green-500">
            <div><p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Actives</p><p className="text-3xl font-black text-green-600">{tenants.filter(t => t.is_active).length}</p></div>
            <CheckCircle2 className="w-10 h-10 text-green-500/20" />
          </div>
          <div className={`bg-white dark:bg-slate-900 p-5 rounded-3xl shadow flex items-center justify-between border-l-4 ${pendingAdmins.length > 0 ? 'border-amber-400' : 'border-slate-200'}`}>
            <div><p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">En Attente</p><p className={`text-3xl font-black ${pendingAdmins.length > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{pendingAdmins.length}</p></div>
            <Clock className={`w-10 h-10 ${pendingAdmins.length > 0 ? 'text-amber-400/40' : 'text-slate-200'}`} />
          </div>
          <button onClick={() => setShowAddForm(true)} className="bg-accent text-slate-950 p-5 rounded-3xl shadow flex items-center justify-center gap-2 hover:scale-105 transition-transform font-black text-sm uppercase tracking-widest">
            <Plus className="w-6 h-6" /> Déployer
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === tab.id ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}>
                <tab.icon className="w-4 h-4" />{tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <>
                {/* ===== ONGLET MAIRIES ===== */}
                {activeTab === 'tenants' && (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Rechercher une mairie..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 outline-none focus:border-primary text-sm"
                          value={tenantSearch}
                          onChange={(e) => setTenantSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead><tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-xs uppercase tracking-widest">
                          <th className="pb-4 font-bold">Mairie</th>
                        <th className="pb-4 font-bold">Domaine</th>
                        <th className="pb-4 font-bold">Contact</th>
                        <th className="pb-4 font-bold text-center">Statut</th>
                        <th className="pb-4 font-bold text-right">Actions</th>
                      </tr></thead>
                      <tbody>
                        {tenants.filter(t => t.name.toLowerCase().includes(tenantSearch.toLowerCase()) || t.subdomain.toLowerCase().includes(tenantSearch.toLowerCase())).map(t => (
                          <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-5">
                              <div className="flex items-center gap-3">
                                {t.logo_url ? <img src={t.logo_url} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt="" onError={e => (e.currentTarget.style.display='none')} /> : <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-xs">{t.name.substring(0, 2)}</div>}
                                <div><p className="font-bold text-slate-800 dark:text-white">{t.name}</p><p className="text-[10px] text-slate-400">{t.slogan || '—'}</p></div>
                              </div>
                            </td>
                            <td className="py-5 text-primary font-medium text-xs">{t.subdomain}.egouv.bj</td>
                            <td className="py-5 text-slate-500 text-xs">{t.contact_email || '—'}</td>
                            <td className="py-5 text-center">
                              <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-black rounded-full ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {t.is_active ? 'Actif' : 'Suspendu'}
                              </span>
                            </td>
                            <td className="py-5 text-right">
                              <div className="flex items-center justify-end gap-2 flex-wrap">
                                {/* Modifier PIN */}
                                <button
                                  onClick={() => { setShowPinFor(t.id); setPinEdit(''); setShowPinValue(false); }}
                                  className="p-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-500 hover:text-white transition"
                                  title="Modifier le PIN admin"
                                >
                                  <KeyRound className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleEditConfig(t)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary hover:text-white transition" title="Configurer">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleToggleTenantStatus(t.id, t.is_active)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${t.is_active ? 'bg-red-100 text-red-600 hover:bg-red-500 hover:text-white' : 'bg-green-100 text-green-700 hover:bg-green-500 hover:text-white'}`}>
                                  {t.is_active ? 'Suspendre' : 'Réactiver'}
                                </button>
                              </div>

                              {/* Inline PIN editor */}
                              {showPinFor === t.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left space-y-3"
                                >
                                  <p className="text-xs font-black uppercase text-amber-700 tracking-widest">Nouveau PIN pour {t.name}</p>
                                  <div className="relative">
                                    <input
                                      type={showPinValue ? 'text' : 'password'}
                                      value={pinEdit}
                                      onChange={e => setPinEdit(e.target.value)}
                                      placeholder="Min. 4 caractères"
                                      className="w-full bg-white border border-amber-300 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-amber-500 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowPinValue(!showPinValue)} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-700">
                                      {showPinValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => handleUpdatePin(t.id)} disabled={saving} className="flex-1 bg-amber-500 text-white py-2 rounded-xl text-xs font-black uppercase hover:bg-amber-600 transition flex items-center justify-center gap-1">
                                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Sauvegarder
                                    </button>
                                    <button onClick={() => setShowPinFor(null)} className="px-4 bg-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-300 transition">
                                      Annuler
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </div>
                )}

                {/* ===== ONGLET CANDIDATURES ADMINS ===== */}
                {activeTab === 'candidatures' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-8 h-8 text-amber-500" />
                        <div>
                          <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Candidatures Administrateurs</h3>
                          <p className="text-xs text-slate-400 mt-1">Comptes DSI/SE en attente de validation GovTech SaaS</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Search Bar for candidatures */}
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Rechercher une candidature..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 outline-none focus:border-amber-500 text-sm"
                            value={candidatureSearch}
                            onChange={(e) => setCandidatureSearch(e.target.value)}
                          />
                        </div>
                        <button onClick={fetchAll} className="p-2 bg-slate-100 rounded-xl text-slate-500 hover:text-primary transition shadow-sm" title="Rafraîchir">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {pendingAdmins.filter(a => (a.first_name + ' ' + a.last_name + ' ' + a.email).toLowerCase().includes(candidatureSearch.toLowerCase())).length === 0 ? (
                      <div className="text-center py-16 text-slate-300">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-400" />
                        <p className="font-bold text-slate-500">Aucune candidature en attente</p>
                        <p className="text-xs text-slate-400 mt-1">Toutes les demandes ont été traitées.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingAdmins.filter(a => (a.first_name + ' ' + a.last_name + ' ' + a.email).toLowerCase().includes(candidatureSearch.toLowerCase())).map(admin => (
                          <motion.div
                            key={admin.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl gap-4"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-black text-sm shrink-0">
                                {(admin.first_name?.[0] || '') + (admin.last_name?.[0] || '')}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 dark:text-white truncate">
                                  {admin.first_name} {admin.last_name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{admin.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">
                                    {admin.tenants?.name || 'Mairie inconnue'}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(admin.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleApproveAdmin(admin.id, admin.tenant_id)}
                                className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-black uppercase hover:bg-green-600 transition shadow-sm"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Valider
                              </button>
                              <button
                                onClick={() => handleRejectAdmin(admin.id, admin.email)}
                                className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-black uppercase hover:bg-red-500 hover:text-white transition"
                              >
                                <XCircle className="w-4 h-4" /> Rejeter
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ===== ONGLET MODULES ===== */}
                {activeTab === 'modules' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Mairie sélectionnée :</label>
                      <select value={selectedTenantId} onChange={e => setSelectedTenantId(e.target.value)}
                        className="bg-muted border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-primary dark:bg-slate-800 dark:text-white">
                        {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>

                    {selectedTenant && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-4">
                          Modules pour <strong className="text-primary">{selectedTenant.name}</strong> — {activeFeaturesForSelectedTenant.length === 0 ? 'Tous activés' : `${activeFeaturesForSelectedTenant.length} actifs`}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {features.map(f => {
                            const isEnabled = activeFeaturesForSelectedTenant.length === 0 || activeFeaturesForSelectedTenant.includes(f.key_name);
                            return (
                              <div key={f.id} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isEnabled ? 'border-primary/20 bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 opacity-60'}`}>
                                <div>
                                  <p className="font-black text-slate-800 dark:text-white text-sm">{f.title}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">{f.description}</p>
                                </div>
                                <button onClick={() => handleToggleFeature(selectedTenantId, f.key_name, f.id, isEnabled)} className="ml-4 shrink-0">
                                  {isEnabled ? <ToggleRight className="w-9 h-9 text-primary" /> : <ToggleLeft className="w-9 h-9 text-slate-300" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ===== ONGLET CONFIGURATION ===== */}
                {activeTab === 'config' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Mairie à configurer :</label>
                      <select value={editingTenant?.id || ''} onChange={e => { const t = tenants.find(t => t.id === e.target.value); if (t) handleEditConfig(t); }}
                        className="bg-muted border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-primary dark:bg-slate-800 dark:text-white">
                        <option value="">-- Sélectionner --</option>
                        {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>

                    {editingTenant && (
                      <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: 'Nom Officiel', key: 'name', type: 'text', placeholder: 'Mairie de Cotonou' },
                          { label: 'Slogan', key: 'slogan', type: 'text', placeholder: 'Ensemble, bâtissons...' },
                          { label: 'URL du Logo (imgBB)', key: 'logo_url', type: 'url', placeholder: 'https://i.ibb.co/...' },
                          { label: 'Email de contact', key: 'contact_email', type: 'email', placeholder: 'contact@mairie.bj' },
                          { label: 'Téléphone', key: 'contact_phone', type: 'tel', placeholder: '+229 XX XX XX XX' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">{field.label}</label>
                            <input type={field.type} value={(editForm as any)[field.key]} onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                              placeholder={field.placeholder}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:border-primary text-slate-800 dark:text-white text-sm font-medium" />
                          </div>
                        ))}

                        {/* Aperçu logo */}
                        {editForm.logo_url && (
                          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                            <Image className="w-5 h-5 text-slate-400" />
                            <img src={editForm.logo_url} alt="Aperçu logo" className="w-16 h-16 object-contain rounded-xl border border-slate-200" onError={e => (e.currentTarget.src = '')} />
                            <p className="text-xs text-slate-500 font-medium">Aperçu du logo</p>
                          </div>
                        )}

                        <div>
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">Couleur Primaire</label>
                          <div className="flex items-center gap-4">
                            <input type="color" value={editForm.primary_color} onChange={e => setEditForm({ ...editForm, primary_color: e.target.value })}
                              className="w-16 h-14 rounded-2xl border-2 border-slate-200 cursor-pointer" />
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                              <p className="text-xs font-bold text-slate-400">Aperçu</p>
                              <div className="h-5 rounded-full mt-1" style={{ backgroundColor: editForm.primary_color }} />
                            </div>
                            <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-300">{editForm.primary_color}</span>
                          </div>
                        </div>

                        <div className="col-span-full flex justify-end pt-4">
                          <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary/90 transition">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Sauvegarder
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL Nouvelle Mairie */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 relative sticky top-0 z-10">
                <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
                <h3 className="text-xl font-black uppercase tracking-widest">Nouveau Déploiement</h3>
                <p className="text-xs text-white/70 mt-1">Créer une nouvelle instance de mairie isolée</p>
              </div>
              <form onSubmit={handleCreateTenant} className="p-8 space-y-5">
                {[
                  { label: 'Nom Officiel', key: 'name', type: 'text', placeholder: 'Mairie de Cotonou' },
                  { label: 'Sous-domaine', key: 'subdomain', type: 'text', placeholder: 'cotonou' },
                  { label: 'Email Technique', key: 'email', type: 'email', placeholder: 'it@mairie-cotonou.bj' },
                  { label: 'URL Logo (imgBB)', key: 'logo_url', type: 'url', placeholder: 'https://i.ibb.co/... (optionnel)' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs tracking-widest uppercase font-bold text-slate-500 mb-2 block">{f.label}{f.key !== 'logo_url' && ' *'}</label>
                    <input type={f.type} required={f.key !== 'logo_url'} value={(newMairie as any)[f.key]} onChange={e => setNewMairie({ ...newMairie, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 p-4 rounded-2xl outline-none focus:border-primary text-slate-800 dark:text-white text-sm" />
                  </div>
                ))}

                {/* Couleur */}
                <div>
                  <label className="text-xs tracking-widest uppercase font-bold text-slate-500 mb-2 block">Couleur Primaire</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={newMairie.primary_color} onChange={e => setNewMairie({ ...newMairie, primary_color: e.target.value })} className="w-14 h-12 rounded-xl border-2 border-slate-200 cursor-pointer" />
                    <span className="font-mono text-sm text-slate-600">{newMairie.primary_color}</span>
                  </div>
                </div>

                {/* PIN */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <label className="text-xs tracking-widest uppercase font-bold text-red-500 mb-2 block">Code PIN Administrateur (Secret) *</label>
                  <input type="password" required value={newMairie.pin} onChange={e => setNewMairie({ ...newMairie, pin: e.target.value })}
                    placeholder="PIN confidentiel pour l'Admin de cette mairie (min. 4 caract.)"
                    className="w-full bg-white dark:bg-black border border-red-200 p-4 rounded-2xl outline-none focus:border-red-500 text-red-700 font-black text-sm" />
                  <p className="text-[10px] text-red-400 mt-2">Ce PIN sera communiqué uniquement au DSI/SE. Il pourra être modifié à tout moment.</p>
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-4 rounded-2xl font-bold uppercase text-xs text-slate-400 hover:text-slate-700 transition">Annuler</button>
                  <button type="submit" disabled={saving} className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl hover:bg-primary/90 transition">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Déployer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


