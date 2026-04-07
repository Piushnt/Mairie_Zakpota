import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowLeft, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'employee'
          }
        }
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
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
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">Demande d'Accès</h1>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Personnel Communal</p>
          </div>

          {success ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-ink">
                Compte Créé avec Succès
              </h2>
              <p className="text-ink-muted text-sm font-medium">
                Votre inscription a bien été enregistrée. Les agents communaux pourront se connecter une fois leur accès validé par l'Administrateur, tandis que le S.E. y accèdera directement via le Code PIN.
              </p>
              <Link to="/login" className="block mt-6 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="p-8 space-y-6">
              {error && (
                <div className="bg-red/5 border border-red/10 text-red text-xs p-4 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20" />
                    <input
                      type="text"
                      required
                      placeholder="Prénom"
                      className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="relative flex-1">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20" />
                    <input
                      type="text"
                      required
                      placeholder="Nom"
                      className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20" />
                  <input
                    type="email"
                    required
                    placeholder="Email Professionnel (@mairie-zakpota.bj)"
                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/20" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Mot de passe (Min. 6 caractères)"
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
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>S'inscrire</span>}
              </button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">
                  Déjà un compte ? Se connecter
                </Link>
              </div>
            </form>
          )}

          <div className="p-6 bg-muted/30 border-t border-border text-center">
            <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest leading-relaxed">
              L'accès sera vérifié après inscription.<br/>Gouv.bj • Za-Kpota
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
