import React from 'react';
import { Mail, Phone, MapPin, Search } from 'lucide-react';

interface PageContactProps {
  NOM_VILLE: string;
  ADRESSE_MAIRIE: string;
  TEL_CONTACT: string;
  EMAIL_CONTACT: string;
}

const PageContact = ({ NOM_VILLE, ADRESSE_MAIRIE, TEL_CONTACT, EMAIL_CONTACT }: PageContactProps) => (
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
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Votre Nom" className="w-full bg-card border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-sm font-bold" />
              <input type="email" placeholder="Votre Email" className="w-full bg-card border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-sm font-bold" />
            </div>
            <input type="text" placeholder="Sujet" className="w-full bg-card border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all text-sm font-bold" />
            <textarea rows={6} placeholder="Votre Message" className="w-full bg-card border border-border rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all resize-none text-sm font-bold"></textarea>
            <button className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">Envoyer le message</button>
          </form>
        </div>
        
        <div className="rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl min-h-[500px] bg-muted flex items-center justify-center text-ink-muted relative group">
           {/* On pourrait mettre un composant de carte ici */}
           <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors" />
           <div className="relative z-10 text-center p-12">
              <MapPin className="w-20 h-20 text-primary mx-auto mb-8 opacity-20" />
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Hôtel de Ville</h4>
              <p className="text-sm font-medium italic mb-10 opacity-70">Centre de la Commune de Za-Kpota</p>
              <button className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl">Ouvrir dans Google Maps</button>
           </div>
        </div>
      </div>
    </div>
  </main>
);

export default PageContact;
