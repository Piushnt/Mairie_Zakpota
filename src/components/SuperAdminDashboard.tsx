import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Building2, Save, X, Plus, LogOut, CheckCircle2, PauseCircle,
  Loader2, Settings, Layers, Edit2, Palette, ToggleLeft, ToggleRight, ChevronDown
} from 'lucide-react';

interface SuperAdminDashboardProps {
  onExit: () => void;
  userName: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

type Tab = 'tenants' | 'modules' | 'config';

export default function SuperAdminDashboard({ onExit, userName, isDarkMode, toggleDarkMode }: SuperAdminDashboardProps) {
  const [tenants, setTenants] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [tenantFeatures, setTenantFeatures] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('tenants');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');

  const [newMairie, setNewMairie] = useState({ name: '', subdomain: '', email: '', pin: '' });
  const [editForm, setEditForm] = useState({ name: '', slogan: '', logo_url: '', contact_email: '', contact_phone: '', primary_color: '#006633' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: t }, { data: f }] = await Promise.all([
      supabase.from('tenants').select('*').order('created_at', { ascending: false }),
      supabase.from('features').select('*').order('title')
    ]);
    if (t) {
      setTenants(t);
      if (!selectedTenantId && t.length > 0) setSelectedTenantId(t[0].id);
      // Charger les modules actifs par mairie
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
    setLoading(false);
  };

  const handleToggleTenantStatus = async (id: string, current: boolean) => {
    await supabase.from('tenants').update({ is_active: !current }).eq('id', id);
    fetchAll();
  };

  const handleToggleFeature = async (tenantId: string, featureKey: string, featureId: string, currentlyEnabled: boolean) => {
    const enabled = currentlyEnabled;
    await supabase.from('tenant_features').upsert(
      { tenant_id: tenantId, feature_id: featureId, is_enabled: !enabled },
      { onConflict: 'tenant_id,feature_id' }
    );
    fetchAll();
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.rpc('create_tenant_with_setup', {
        p_name: newMairie.name, p_subdomain: newMairie.subdomain,
        p_contact_email: newMairie.email, p_admin_pin: newMairie.pin
      });
      if (error) throw error;
      setShowAddForm(false);
      setNewMairie({ name: '', subdomain: '', email: '', pin: '' });
      fetchAll();
    } catch (err: any) {
      alert("Erreur d'onboarding : " + err.message);
    } finally {
      setSaving(false);
    }
  };

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
    fetchAll();
    alert('Configuration sauvegardée !');
  };

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);
  const activeFeaturesForSelectedTenant = tenantFeatures[selectedTenantId] || [];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'tenants', label: 'Mairies', icon: Building2 },
    { id: 'modules', label: 'Modules', icon: Layers },
    { id: 'config', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} font-sans`}>
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
            <button onClick={onExit} className="flex items-center space-x-2 bg-red/20 text-white px-4 py-2 rounded-xl hover:bg-red/40 transition text-xs font-bold uppercase">
              <LogOut className="w-4 h-4" /><span>Quitter</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow flex items-center justify-between border-l-4 border-primary">
            <div><p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total</p><p className="text-3xl font-black text-slate-800 dark:text-white">{tenants.length}</p></div>
            <Building2 className="w-10 h-10 text-primary/20" />
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow flex items-center justify-between border-l-4 border-green-500">
            <div><p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Actives</p><p className="text-3xl font-black text-green-600">{tenants.filter(t => t.is_active).length}</p></div>
            <CheckCircle2 className="w-10 h-10 text-green-500/20" />
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow flex items-center justify-between border-l-4 border-red-400">
            <div><p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Suspendues</p><p className="text-3xl font-black text-red-500">{tenants.filter(t => !t.is_active).length}</p></div>
            <PauseCircle className="w-10 h-10 text-red-500/20" />
          </div>
          <button onClick={() => setShowAddForm(true)} className="bg-accent text-slate-950 p-5 rounded-3xl shadow flex items-center justify-center gap-2 hover:scale-105 transition-transform font-black text-sm uppercase tracking-widest">
            <Plus className="w-6 h-6" /> Déployer
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}>
                <tab.icon className="w-4 h-4" />{tab.label}
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
                        {tenants.map(t => (
                          <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-5">
                              <div className="flex items-center gap-3">
                                {t.logo_url ? <img src={t.logo_url} className="w-9 h-9 rounded-full object-cover" alt="" /> : <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-xs">{t.name.substring(0, 2)}</div>}
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
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleEditConfig(t)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary hover:text-white transition" title="Configurer">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleToggleTenantStatus(t.id, t.is_active)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${t.is_active ? 'bg-red-100 text-red-600 hover:bg-red-500 hover:text-white' : 'bg-green-100 text-green-700 hover:bg-green-500 hover:text-white'}`}>
                                  {t.is_active ? 'Suspendre' : 'Réactiver'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                          Modules pour <strong className="text-primary">{selectedTenant.name}</strong> — {activeFeaturesForSelectedTenant.length === 0 ? 'Tous activés (aucune restriction)' : `${activeFeaturesForSelectedTenant.length} actifs`}
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
                                  {isEnabled
                                    ? <ToggleRight className="w-9 h-9 text-primary" />
                                    : <ToggleLeft className="w-9 h-9 text-slate-300" />}
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
                      <select value={editingTenant?.id || ''} onChange={e => { const t = tenants.find(t => t.id === e.target.value); if(t) handleEditConfig(t); }}
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
                          { label: 'URL du Logo', key: 'logo_url', type: 'url', placeholder: 'https://...' },
                          { label: 'Email de contact', key: 'contact_email', type: 'email', placeholder: 'contact@mairie.bj' },
                          { label: 'Téléphone', key: 'contact_phone', type: 'tel', placeholder: '+229 XX XX XX XX' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">{field.label}</label>
                            <input type={field.type} value={(editForm as any)[field.key]} onChange={e => setEditForm({...editForm, [field.key]: e.target.value})}
                              placeholder={field.placeholder}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:border-primary text-slate-800 dark:text-white text-sm font-medium" />
                          </div>
                        ))}

                        <div>
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block">Couleur Primaire</label>
                          <div className="flex items-center gap-4">
                            <input type="color" value={editForm.primary_color} onChange={e => setEditForm({...editForm, primary_color: e.target.value})}
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
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden">
              <div className="bg-primary text-white p-6 relative">
                <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
                <h3 className="text-xl font-black uppercase tracking-widest">Nouveau Déploiement</h3>
                <p className="text-xs text-white/70 mt-1">Créer une nouvelle instance de mairie isolée</p>
              </div>
              <form onSubmit={handleCreateTenant} className="p-8 space-y-5">
                {[
                  { label: 'Nom Officiel', key: 'name', type: 'text', placeholder: 'Mairie de Cotonou' },
                  { label: 'Sous-domaine', key: 'subdomain', type: 'text', placeholder: 'cotonou' },
                  { label: 'Email Technique', key: 'email', type: 'email', placeholder: 'it@mairie-cotonou.bj' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs tracking-widest uppercase font-bold text-slate-500 mb-2 block">{f.label}</label>
                    <input type={f.type} required value={(newMairie as any)[f.key]} onChange={e => setNewMairie({...newMairie, [f.key]: e.target.value})}
                      placeholder={f.placeholder}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 p-4 rounded-2xl outline-none focus:border-primary text-slate-800 dark:text-white text-sm" />
                  </div>
                ))}
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <label className="text-xs tracking-widest uppercase font-bold text-red-500 mb-2 block">Code PIN Administrateur (Secret)</label>
                  <input type="password" required value={newMairie.pin} onChange={e => setNewMairie({...newMairie, pin: e.target.value})}
                    placeholder="PIN confidentiel pour l'Admin de cette mairie"
                    className="w-full bg-white dark:bg-black border border-red-200 p-4 rounded-2xl outline-none focus:border-red-500 text-red-700 font-black text-sm" />
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
