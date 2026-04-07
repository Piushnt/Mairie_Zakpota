import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Verify RBAC profile
      const { data: profileError, data: profile } = await supabase
        .from('user_profiles')
        .select('is_approved')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
        
      if (profile && profile.is_approved === false) {
        await supabase.auth.signOut();
        throw new Error("Compte en attente d'approbation par le SE.");
      }
      
      navigate('/admin-portal');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-ink/40 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Retour au site</span>
        </button>

        <div className="bg-card rounded-[32px] shadow-2xl overflow-hidden border border-border">
          <div className="bg-primary p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <img src="/img/logo-mairie.jpg" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">Portail S.E.</h1>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Mairie de Za-Kpota</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="bg-red/5 border border-red/10 text-red text-xs p-4 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20" />
                <input
                  type="email"
                  placeholder="Email Professionnel"
                  className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white rounded-2xl py-4 font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Se Connecter</span>}
            </button>
            <div className="text-center mt-4">
              <Link to="/register" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">
                Demander un accès (Inscription)
              </Link>
            </div>
          </form>

          <div className="p-6 bg-muted/30 border-t border-border text-center">
            <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest leading-relaxed">
              Accès réservé au personnel autorisé.<br/>Gouv.bj • Za-Kpota
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
