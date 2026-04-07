import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, Clock, FileText, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FolderTracking = () => {
  const [folderId, setFolderId] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderId.trim()) return;

    setLoading(true);
    setError('');
    setStatus(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('dossiers')
        .select('*')
        .eq('code', folderId.trim().toUpperCase())
        .single();

      if (fetchError || !data) {
        setError("Aucun dossier trouvé avec cet identifiant. Vérifiez votre code (ex: ZK-9912).");
      } else {
        setStatus(data);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut.toLowerCase()) {
      case 'prêt':
      case 'signé':
        return <CheckCircle2 className="w-12 h-12 text-green-500" />;
      case 'en attente':
        return <Clock className="w-12 h-12 text-amber-500" />;
      case 'rejeté':
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      default:
        return <Loader2 className="w-12 h-12 text-primary animate-spin-slow" />;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut.toLowerCase()) {
      case 'prêt':
      case 'signé': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'en attente': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'en cours': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card dark:bg-slate-900 border border-border dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-ink dark:text-white uppercase tracking-tight leading-none mb-1">Suivi de Dossier</h3>
              <p className="text-[10px] text-ink-muted dark:text-white/40 font-black uppercase tracking-widest">Za-Kpota E-Admin v2.0</p>
            </div>
          </div>

          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20" />
              <input 
                type="text" 
                placeholder="Identifiant (ex: ZK-9912)" 
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full bg-muted dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-5 outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold transition-all uppercase"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Rechercher <ArrowRight className="w-4 h-4 ml-2" /></>}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start space-x-4"
              >
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                <p className="text-sm font-medium text-red-600">{error}</p>
              </motion.div>
            )}

            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="p-8 border border-border dark:border-white/10 rounded-3xl bg-surface/50 dark:bg-white/5 backdrop-blur-md">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="mb-6">
                      {getStatusIcon(status.statut)}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-4 ${getStatusColor(status.statut)}`}>
                      Statut : {status.statut}
                    </span>
                    <h4 className="text-2xl font-black text-ink dark:text-white uppercase tracking-tight">{status.citoyen_nom}</h4>
                    <p className="text-xs text-ink-muted dark:text-white/40 font-bold uppercase tracking-widest mt-1">{status.type}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted dark:bg-slate-800 rounded-2xl">
                      <p className="text-[8px] font-black uppercase tracking-widest text-ink/30 dark:text-white/20 mb-2">Code Dossier</p>
                      <p className="text-sm font-bold text-ink dark:text-white">{status.code}</p>
                    </div>
                    <div className="p-4 bg-muted dark:bg-slate-800 rounded-2xl">
                      <p className="text-[8px] font-black uppercase tracking-widest text-ink/30 dark:text-white/20 mb-2">Service</p>
                      <p className="text-sm font-bold text-ink dark:text-white">Délivrance d'actes</p>
                    </div>
                  </div>

                  {status.statut === 'Dépôt' && (
                    <div className="mt-6 flex flex-col space-y-4">
                      <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-2xl">
                        <p className="text-xs font-bold text-amber-600 mb-2 flex items-center gap-2">
                           <AlertCircle className="w-4 h-4" /> Frais de dossier en attente
                        </p>
                        <p className="text-sm text-ink-muted leading-relaxed">
                          Pour valider votre demande et passer à l'étape de vérification, veuillez vous acquitter des frais de timbres (1,500 FCFA).
                        </p>
                      </div>
                      <button 
                         onClick={() => {
                           alert("Redirection vers Kkiapay (1,500 FCFA)...");
                           setTimeout(() => alert("Paiement reçu ! Votre dossier est passé en statut : Vérification"), 2000);
                         }}
                         className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                      >
                         Payer via Kkiapay (1,500 FCFA)
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <p className="mt-8 text-center text-[10px] text-ink-muted dark:text-white/20 font-medium">
            Entrez le code figurant sur votre reçu de dépôt pour consulter l'avancement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FolderTracking;
