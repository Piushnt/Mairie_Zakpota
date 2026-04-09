import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowLeft, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTenant } from '../lib/TenantContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'agent' | 'admin'>('agent');
  const [adminPin, setAdminPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { currentTenant } = useTenant();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('register_attempts');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.attempts >= 3) {
        const now = new Date().getTime();
        const diff = now - data.time;
        const waitTime = 15 * 60 * 1000; // 15 mins
        if (diff < waitTime) {
          setCooldown(Math.ceil((waitTime - diff) / 1000));
        } else {
          localStorage.removeItem('register_attempts');
        }
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) {
       setError(`Veuillez patienter ${Math.floor(cooldown / 60)}m ${cooldown % 60}s.`);
       return;
    }
    if (!currentTenant) {
      setError("Impossible de déterminer la mairie. Veuillez accéder via l'URL officielle de votre mairie.");
      return;
    }

    const stored = localStorage.getItem('register_attempts');
    let attempts = 1;
    const nowTime = new Date().getTime();
    if (stored) {
      const data = JSON.parse(stored);
      // Reset after 1 hour anyway
      if (nowTime - data.time < 60 * 60 * 1000) {
        attempts = data.attempts + 1;
      }
    }
    localStorage.setItem('register_attempts', JSON.stringify({ attempts, time: nowTime }));

    if (attempts >= 4) {
      setCooldown(15 * 60);
      setError("Trop de tentatives. Veuillez patienter 15 minutes.");
      return;
    }

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
            role: role,
            tenant_id: currentTenant.id,
            admin_pin: role === 'admin' ? adminPin : undefined
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
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-ink">
                Demande Soumise avec Succès
              </h2>
              <p className="text-ink-muted text-sm font-medium">
                {role === 'admin'
                  ? "Votre candidature en tant que Responsable DSI/SE a été enregistrée. L'équipe GovTech SaaS va examiner et valider votre compte. Vous serez notifié dès approbation."
                  : "Votre compte a été créé. Il est en attente d'approbation par le Responsable DSI de votre mairie. Vous pouvez vous connecter et vérifier régulièrement l'état de votre accès."
                }
              </p>
              <Link to="/login" className="block mt-6 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                Se connecter / Vérifier l'accès
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

                <div className="bg-muted p-4 rounded-2xl space-y-4 border border-border">
                  <p className="text-xs font-black uppercase text-ink/40 tracking-widest text-center">Sélectionnez votre profil</p>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('agent')}
                      className={`flex-1 py-3 text-xs font-bold uppercase rounded-xl transition-all ${role === 'agent' ? 'bg-primary text-white shadow-lg' : 'bg-card text-ink/60 hover:bg-card/50 border border-border'}`}
                    >
                      Employé
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`flex-1 py-3 text-xs font-bold uppercase rounded-xl transition-all ${role === 'admin' ? 'bg-ink text-white shadow-lg' : 'bg-card text-ink/60 hover:bg-card/50 border border-border'}`}
                    >
                      Administrateur
                    </button>
                  </div>

                  {role === 'admin' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-4 border-t border-border mt-4"
                    >
                      <label className="text-xs font-black uppercase text-ink/60 tracking-widest mb-2 block">Code Secret (PIN)</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red/60" />
                        <input
                          type="password"
                          required={role === 'admin'}
                          placeholder="Ex: AD2251XXXX"
                          className="w-full bg-red/5 border border-red/20 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-red transition-all text-sm font-medium text-red"
                          value={adminPin}
                          onChange={(e) => setAdminPin(e.target.value)}
                        />
                      </div>
                      <p className="text-[10px] text-red/60 mt-2 font-medium">Requis pour devenir Administrateur instantanément.</p>
                    </motion.div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className={`w-full text-white rounded-2xl py-4 font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center space-x-2 
                  ${cooldown > 0 ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}
                `}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                 cooldown > 0 ? <span>⏳ Attendre {Math.floor(cooldown / 60)}m {cooldown % 60}s</span> :
                 <span>S'inscrire</span>}
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
