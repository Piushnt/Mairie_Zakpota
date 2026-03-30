import React from 'react';
import { Mail, Phone, MapPin, Search } from 'lucide-react';

interface PageContactProps {
  NOM_VILLE: string;
  ADRESSE_MAIRIE: string;
  TEL_CONTACT: string;
  EMAIL_CONTACT: string;
  onSubmit: (data: any) => Promise<void>;
}

import LazyMap from '../components/LazyMap';

const PageContact = ({ NOM_VILLE, ADRESSE_MAIRIE, TEL_CONTACT, EMAIL_CONTACT, onSubmit }: PageContactProps) => {
  const [formData, setFormData] = React.useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await onSubmit(formData);
      setStatus('success');
      setFormData({ nom: '', email: '', sujet: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  const MAP_CENTER: [number, number] = [7.1915, 2.2635];
  
  return (
    <main className="pt-12 pb-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Contact</h4>
          <h2 className="text-5xl font-black text-ink tracking-tight mb-8">Nous Contacter</h2>
          <p className="text-ink-muted text-lg font-medium leading-relaxed">
            Vous avez une question ? Un besoin particulier ? Nos équipes sont à votre écoute pour vous accompagner dans vos démarches.
          </p>
          <div className="h-1.5 w-16 bg-accent mx-auto mt-10 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-card p-10 rounded-3xl border border-border shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-black text-ink mb-4 uppercase tracking-tight">Téléphone</h3>
            <p className="text-primary font-black text-xl mb-4">{TEL_CONTACT}</p>
            <p className="text-xs text-ink-muted font-medium">Du Lundi au Vendredi <br /> 8h - 12h30 | 15h - 18h</p>
          </div>

          <div className="bg-card p-10 rounded-3xl border border-border shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-black text-ink mb-4 uppercase tracking-tight">Email</h3>
            <p className="text-primary font-black text-lg mb-4">{EMAIL_CONTACT}</p>
            <p className="text-xs text-ink-muted font-medium">Réponse sous 48h ouvrées</p>
          </div>

          <div className="bg-card p-10 rounded-3xl border border-border shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-black text-ink mb-4 uppercase tracking-tight">Adresse</h3>
            <p className="text-ink font-bold text-sm mb-4 leading-relaxed">{ADRESSE_MAIRIE}</p>
            <p className="text-xs text-ink-muted font-medium">Za-Kpota Centre, Zou, Bénin</p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-muted p-12 lg:p-16 rounded-[3rem] border border-border">
            <h3 className="text-2xl font-black text-ink mb-10 tracking-tight uppercase">Formulaire de Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  required
                  type="text" 
                  placeholder="Votre Nom" 
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full bg-card border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-sm font-bold" 
                />
                <input 
                  required
                  type="email" 
                  placeholder="Votre Email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-card border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-sm font-bold" 
                />
              </div>
              <input 
                required
                type="text" 
                placeholder="Sujet" 
                value={formData.sujet}
                onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                className="w-full bg-card border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-sm font-bold" 
              />
              <textarea 
                required
                rows={6} 
                placeholder="Votre Message" 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-card border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all resize-none text-sm font-bold"
              ></textarea>
              
              {status === 'success' && (
                <div className="p-4 bg-green-500/10 text-green-600 rounded-2xl text-xs font-bold text-center">
                  Votre message a été envoyé avec succès ! Nous vous répondrons sous peu.
                </div>
              )}

              <button 
                disabled={status === 'loading'}
                className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
          
          <div className="rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl min-h-[500px] bg-muted relative flex flex-col items-center justify-center text-ink-muted group">
             <div className="absolute inset-x-0 top-0 h-3/4">
               <LazyMap 
                 center={MAP_CENTER} 
                 zoom={15} 
                 height="100%" 
                 markers={[{ id: 'mairie-zakpota', name: 'Mairie de Za-Kpota', category: 'Administration', lat: 7.1915, lng: 2.2635 }]} 
               />
             </div>
             
             <div className="relative z-10 text-center p-8 mt-[60%] lg:mt-[50%] bg-white/95 backdrop-blur-md w-full border-t border-border">
                <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Hôtel de Ville</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-6 italic">Mairie de la Commune de Za-Kpota</p>
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex flex-col items-center px-6 py-2 border-r border-border">
                    <span className="text-[9px] font-black text-ink/40 uppercase tracking-widest leading-none mb-1">Status</span>
                    <span className="text-xs font-black text-green-600">OUVERT</span>
                  </div>
                  <div className="flex flex-col items-center px-6 py-2">
                    <span className="text-[9px] font-black text-ink/40 uppercase tracking-widest leading-none mb-1">Horaire</span>
                    <span className="text-xs font-black text-ink">08h - 17h</span>
                  </div>
                </div>
                <div className="mt-8">
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=7.1915,2.2635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-105"
                  >
                    Ouvrir dans Google Maps
                  </a>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageContact;
