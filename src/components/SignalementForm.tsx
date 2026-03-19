import React, { useState } from 'react';
import { MapPin, Clock, Check, Map, Send } from 'lucide-react';

const SignalementForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [location, setLocation] = useState<string>('');

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section className="container mx-auto px-4 mt-24">
      <div className="bg-card rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-border">
        <div className="p-12 lg:p-20 bg-primary text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h4 className="font-black uppercase tracking-[0.4em] text-[10px] mb-6 text-accent">Participation Citoyenne</h4>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tighter">Signaler une anomalie</h2>
            <p className="text-white/70 text-lg mb-12 leading-relaxed font-medium">
              Aidez-nous à améliorer votre cadre de vie. Signalez tout problème de voirie, d'éclairage ou de propreté directement.
            </p>
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-black text-white uppercase tracking-wider text-xs">Géolocalisation</p>
                  <p className="text-sm text-white/50">Pour une intervention ciblée</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-black text-white uppercase tracking-wider text-xs">Suivi en direct</p>
                  <p className="text-sm text-white/50">Validation sous 48h ouvrées</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-12 lg:p-20 bg-card">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8 shadow-inner">
                <Check className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black mb-4 text-ink tracking-tight">C'est noté !</h3>
              <p className="text-ink-muted font-medium mb-10">Merci pour votre vigilance. Nos équipes techniques vont analyser votre signalement.</p>
              <button 
                onClick={() => setStatus('idle')} 
                className="text-primary font-black uppercase tracking-widest text-xs hover:text-accent transition-colors flex items-center"
              >
                Faire un autre signalement
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Nom complet</label>
                  <input required type="text" className="w-full bg-muted border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all text-ink font-bold text-sm" placeholder="Votre nom" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Email</label>
                  <input required type="email" className="w-full bg-muted border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all text-ink font-bold text-sm" placeholder="votre@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Catégorie</label>
                <select required title="Choisir une catégorie" className="w-full bg-muted border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all text-ink font-bold text-sm appearance-none">
                  <option>Éclairage public</option>
                  <option>Voirie (Nids de poule)</option>
                  <option>Assainissement / Inondation</option>
                  <option>Propreté / Déchets</option>
                  <option>Sécurité</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Lieu exact</label>
                <div className="flex space-x-2">
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Adresse ou coordonées GPS"
                    className="flex-grow bg-muted border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all text-ink font-bold text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="bg-accent text-primary p-4 rounded-2xl hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
                    title="Ma position actuelle"
                  >
                    <Map className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Détails de l'anomalie</label>
                <textarea required rows={4} className="w-full bg-muted border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all resize-none text-ink font-bold text-sm" placeholder="Décrivez le problème ici..."></textarea>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 group"
              >
                {status === 'loading' ? (
                  <span>Envoi en cours...</span>
                ) : (
                  <>
                    <span>Envoyer le signalement</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignalementForm;
