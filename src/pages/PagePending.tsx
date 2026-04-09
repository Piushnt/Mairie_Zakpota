import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, LogOut, Building2, User, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTenant } from '../lib/TenantContext';

interface PagePendingProps {
  userName: string;
  userRole: 'admin' | 'agent';
}

export default function PagePending({ userName, userRole }: PagePendingProps) {
  const { currentTenant } = useTenant();
  const isAdmin = userRole === 'admin';
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('user_profiles')
        .select('is_approved, deleted_at, rejection_reason')
        .eq('id', user.id)
        .maybeSingle();
        
      if (data) {
        if (data.is_approved) {
          window.location.reload();
        } else if (data.deleted_at) {
          setRejectionReason(data.rejection_reason || "Votre demande d'accès a été refusée par l'administrateur.");
          if (interval) clearInterval(interval);
        }
      }
    };

    interval = setInterval(checkStatus, 15000);
    checkStatus();

    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-lg w-full"
      >
        {/* Card principale */}
        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">

          {/* Header */}
          <div className="bg-primary p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full" />
              <div className="absolute -bottom-12 -left-8 w-60 h-60 bg-white rounded-full" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                {rejectionReason ? 'Accès Refusé' : 'Compte en Attente'}
              </h1>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-2">
                {rejectionReason ? 'Dossier clos' : 'Validation requise'}
              </p>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-10 space-y-8">

            {/* Message personnalisé */}
            <div className="text-center space-y-3">
              <p className="text-lg font-black text-slate-800">
                Bonjour, <span className="text-primary">{userName || 'Bienvenue'}</span> 👋
              </p>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {isAdmin ? (
                  <>
                    Votre demande d'accès en tant que <strong className="text-slate-700">Responsable DSI / Secrétaire Exécutif</strong> pour{' '}
                    <strong className="text-primary">{currentTenant?.name}</strong> a bien été reçue.
                    <br /><br />
                    Elle est actuellement examinée par l'équipe <strong className="text-slate-700">GovTech SaaS</strong>.
                    Vous recevrez une réponse dès validation.
                  </>
                ) : (
                  <>
                    Votre inscription en tant qu'<strong className="text-slate-700">Agent Municipal</strong> de{' '}
                    <strong className="text-primary">{currentTenant?.name}</strong> a bien été enregistrée.
                    <br /><br />
                    Elle doit être approuvée par le <strong className="text-slate-700">Responsable DSI</strong> de votre mairie.
                    Vous pouvez re-vérifier l'accès dans quelques instants.
                  </>
                )}
              </p>
            </div>

            {/* Bloc central */}
            {rejectionReason ? (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-3xl p-6 text-center space-y-4">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="font-black text-red-600 text-lg uppercase">Demande rejetée</h3>
                <p className="text-red-500/80 text-sm font-medium">{rejectionReason}</p>
                <p className="text-xs text-red-400 mt-4 font-bold uppercase tracking-widest">
                  Veuillez contacter votre responsable DSI pour plus d'informations.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Processus de validation</p>

                  {isAdmin ? (
                    <div className="space-y-3">
                      <Step done label="Inscription soumise" icon={User} />
                      <Step done={false} active label="Vérification par le Super Admin GovTech" icon={ShieldCheck} />
                      <Step done={false} label="Accès au Dashboard Mairie" icon={Building2} />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Step done label="Inscription soumise" icon={User} />
                      <Step done={false} active label="Validation par votre Responsable DSI" icon={ShieldCheck} />
                      <Step done={false} label="Accès à votre espace Agent" icon={Building2} />
                    </div>
                  )}
                </div>

                {/* Bouton Re-vérifier */}
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-primary/10 text-primary py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all"
                >
                  🔄 Vérifier l'état de mon accès
                </button>
              </>
            )}

            {/* Déconnexion */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest py-2"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-400 font-medium mt-6 uppercase tracking-widest">
          GovTech SaaS • Plateforme E-Administration Béninoise
        </p>
      </motion.div>
    </div>
  );
}

// Composant Step
function Step({ done, active, label, icon: Icon }: { done: boolean; active?: boolean; label: string; icon: any }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
        done ? 'bg-green-500 text-white' :
        active ? 'bg-primary text-white animate-pulse' :
        'bg-slate-200 text-slate-400'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className={`text-sm font-semibold ${done ? 'text-green-600 line-through opacity-60' : active ? 'text-primary font-bold' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}
