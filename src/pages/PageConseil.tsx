import React from 'react';
import { conseilMunicipal } from '../data/config';
import { Mail, Phone, ExternalLink } from 'lucide-react';

const PageConseil = ({ council }: { council: any[] }) => {
  const displayCouncil = council && council.length > 0 ? council : conseilMunicipal;
  
  return (
    <main className="pt-12 pb-24 bg-surface">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Gouvernance</h4>
        <h2 className="text-5xl font-black text-ink tracking-tight mb-8">Le Conseil Municipal</h2>
        <p className="text-ink-muted text-lg font-medium leading-relaxed">
          Un organe délibérant composé d'hommes et de femmes engagés pour le développement de Za-Kpota, travaillant au service de l'intérêt général.
        </p>
        <div className="h-1.5 w-16 bg-accent mx-auto mt-10 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayCouncil.map((member, i) => (
          <div key={i} className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border group hover:border-primary/50 transition-all hover:shadow-2xl">
            <div className="aspect-square overflow-hidden relative">
              <img 
                src={member.photo} 
                alt={member.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div className="flex space-x-4">
                  <button title={`Contacter ${member.name} par email`} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-accent transition-colors"><Mail className="w-4 h-4 text-primary" /></button>
                  <button title={`Contacter ${member.name} par téléphone`} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-accent transition-colors"><Phone className="w-4 h-4 text-primary" /></button>
                </div>
              </div>
            </div>
            <div className="p-8 text-center">
              <h3 className="text-xl font-black text-ink mb-2 uppercase tracking-tight">{member.name}</h3>
              <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-6">
                {member.council_roles?.title || member.role}
              </p>
              <button className="w-full py-4 bg-muted hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Voir le profil détaillé
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-32 bg-primary text-white p-12 lg:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-8 tracking-tight">Transparence & Démocratie</h2>
            <p className="text-white/70 text-lg font-medium leading-relaxed mb-10">
              Les délibérations du conseil municipal sont publiques. Nous mettons à votre disposition l'ensemble des comptes-rendus et décisions pour un suivi transparent de l'action communale.
            </p>
            <button className="px-8 py-5 bg-accent text-primary font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white transition-all shadow-xl shadow-accent/20 flex items-center space-x-3">
              <span>Consulter les rapports</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6">
             <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <h4 className="text-accent font-black text-xl mb-4">25 Conseillers</h4>
                <p className="text-sm text-white/50 leading-relaxed font-medium">Représentant les 13 arrondissements de la commune de Za-Kpota.</p>
             </div>
             <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <h4 className="text-accent font-black text-xl mb-4">Séance Mensuelle</h4>
                <p className="text-sm text-white/50 leading-relaxed font-medium">Réunion ordinaire chaque premier jeudi du mois à l'Hôtel de Ville.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);
};

export default PageConseil;
