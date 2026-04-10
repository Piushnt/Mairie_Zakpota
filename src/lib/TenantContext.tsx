import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Loader2 } from 'lucide-react';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  domain: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
  slogan: string | null;
  primary_color: string | null;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  loading: boolean;
  error: Error | null;
  activeFeatures: string[];
  isFeatureEnabled: (key: string) => boolean;
}

const TenantContext = createContext<TenantContextType>({
  currentTenant: null,
  loading: true,
  error: null,
  activeFeatures: [],
  isFeatureEnabled: () => true,
});

export const useTenant = () => useContext(TenantContext);

// Routes qui ne nécessitent JAMAIS de tenant (Super Admin global, auth)
const AUTH_BYPASS_PATHS = ['/login', '/saas-superadmin-portal', '/register', '/pending'];

const isAuthBypassRoute = () =>
  AUTH_BYPASS_PATHS.some(p => window.location.pathname.startsWith(p));

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

  // Helper : vérifier si un module est actif. Par défaut tout est activé si aucune config n'existe.
  const isFeatureEnabled = (key: string): boolean => {
    if (activeFeatures.length === 0) return true; // Pas de config = tout activé
    return activeFeatures.includes(key);
  };

  const fetchFeatures = async (tenantId: string) => {
    try {
      const { data } = await supabase
        .from('tenant_features')
        .select('features(key_name), is_enabled')
        .eq('tenant_id', tenantId)
        .eq('is_enabled', true);

      if (data && data.length > 0) {
        const keys = data
          .filter((tf: any) => tf.features?.key_name)
          .map((tf: any) => tf.features.key_name as string);
        setActiveFeatures(keys);
      }
    } catch {
      // Silencieux — isFeatureEnabled retournera true (fallback sécurisé)
    }
  };

  useEffect(() => {
    // Si on est sur une route d'auth/super-admin, bypass immédiat
    if (isAuthBypassRoute()) {
      setLoading(false);
      return;
    }

    const fetchTenant = async () => {
      try {
        const hostname = window.location.hostname;
        const cacheKey = `mairie_tenant_${hostname}`;

        // 1. Check in cache (tenant seulement, les features toujours rechargées)
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          setCurrentTenant(parsed);
          await fetchFeatures(parsed.id);
          setLoading(false);
          return;
        }

        // 2. Resolve via domaine custom en priorité
        let resolvedTenant: Tenant | null = null;

        const { data: domainData } = await supabase
          .from('tenants')
          .select('*')
          .eq('domain', hostname)
          .eq('is_active', true)
          .maybeSingle(); // ← Remplace .single() pour éviter 406

        if (domainData) {
          resolvedTenant = domainData;
        } else {
          // 3. Fallback par sous-domaine
          const subdomain = hostname.split('.')[0];

          const { data: subData } = await supabase
            .from('tenants')
            .select('*')
            .eq('subdomain', subdomain)
            .eq('is_active', true)
            .maybeSingle();

          if (subData) {
            resolvedTenant = subData;
          } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // 4. En local : fallback sur 'zakpota' pour dev
            console.warn("Dev local : tentative fallback tenant 'zakpota'.");
            const { data: fallbackData } = await supabase
              .from('tenants')
              .select('*')
              .eq('subdomain', 'zakpota')
              .eq('is_active', true)
              .maybeSingle();

            if (fallbackData) resolvedTenant = fallbackData;
          }
        }

        if (!resolvedTenant) {
          throw new Error("Mairie introuvable. Vérifiez l'adresse web saisie et réessayez.");
        }

        setCurrentTenant(resolvedTenant);
        sessionStorage.setItem(cacheKey, JSON.stringify(resolvedTenant));
        sessionStorage.setItem('mairie_tenant_id', resolvedTenant.id);
        await fetchFeatures(resolvedTenant.id);

      } catch (err: any) {
        console.error("Tenant Resolution Error:", err);
        setError(err instanceof Error ? err : new Error(err?.message || 'Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, []);

  // ----- Rendu conditionnel -----

  // Chargement en cours
  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h1 className="text-xl font-black text-ink uppercase tracking-tighter">Initialisation...</h1>
        <p className="text-ink/60 text-sm font-medium mt-2">Recherche de la mairie en cours</p>
      </div>
    );
  }

  // Routes Super Admin / Auth : bypass total, pas besoin de tenant
  if (isAuthBypassRoute()) {
    return (
      <TenantContext.Provider value={{ currentTenant, loading, error, activeFeatures, isFeatureEnabled }}>
        {children}
      </TenantContext.Provider>
    );
  }

  // Erreur résolution tenant : page 404 propre
  if (error || !currentTenant) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-[32px] shadow-2xl border border-red/20 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-red/10 rounded-3xl flex items-center justify-center mx-auto text-red">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h2 className="text-2xl font-black text-red uppercase tracking-tighter">Portail Introuvable</h2>
          <p className="text-ink/60 text-sm font-medium leading-relaxed">
            {error?.message || "La plateforme correspondant à ce domaine est inactive ou introuvable."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              🔄 Réessayer
            </button>
            <a
              href="/login"
              className="block w-full border border-slate-300 text-slate-500 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition"
            >
              Accès Administration →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ currentTenant, loading, error, activeFeatures, isFeatureEnabled }}>
      {children}
    </TenantContext.Provider>
  );
};
