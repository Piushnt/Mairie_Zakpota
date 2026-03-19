import React from 'react';
import { motion } from 'framer-motion';
import { agendaData } from '../data/config';
import { Trophy, Users, CheckCircle, Clock, Calendar as CalIcon, MapPin } from 'lucide-react';

interface PageStadeProps {
  stade: any;
}

const PageStade = ({ stade }: PageStadeProps) => (
  <main className="pt-12 pb-24 bg-surface">
    <div className="container mx-auto px-4">
      {/* Hero Stade */}
      <div className="relative h-[500px] rounded-[3.5rem] overflow-hidden mb-20 shadow-2xl border-8 border-white">
        <img 
          src={agendaData.stade.image} 
          alt="Stade Municipal" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <h4 className="text-accent font-black uppercase tracking-[0.4em] text-[10px] mb-4">Infrastructure Sportive</h4>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">Stade Municipal de <br /> Za-Kpota</h2>
          <div className="flex items-center text-white/70 space-x-6 font-bold uppercase tracking-widest text-[10px]">
             <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Quartier Résidentiel</span>
             <span className="flex items-center"><Users className="w-4 h-4 mr-2" /> 5 000 Places</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Prochains Matchs */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-ink uppercase tracking-tight">Prochaines Rencontres</h3>
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {agendaData.stade.nextMatches.map((match, i) => (
                <div key={i} className="bg-card p-6 md:p-8 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-center group hover:border-primary/30 transition-all">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center md:justify-start justify-center">
                       <Clock className="w-3 h-3 mr-2" /> {match.date} à {match.time}
                    </p>
                    <h4 className="text-xl font-black text-ink tracking-tight uppercase">{match.teams}</h4>
                  </div>
                  <button className="px-6 py-3 bg-muted group-hover:bg-primary group-hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Billetterie</button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-ink uppercase tracking-tight">Derniers Résultats</h3>
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {agendaData.stade.results.map((res, i) => (
                <div key={i} className="bg-muted p-6 md:p-8 rounded-3xl border border-transparent flex justify-between items-center">
                  <h4 className="text-sm font-black text-ink tracking-tight uppercase">{res.teams}</h4>
                  <div className="px-6 py-2 bg-primary text-white rounded-full font-black text-lg">{res.score}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-ink/30">{res.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Équipements */}
        <div className="space-y-8">
           <div className="bg-primary text-white p-10 rounded-[2.5rem] shadow-xl">
              <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-accent">Équipements</h3>
              <ul className="space-y-6">
                 {agendaData.stade.equipements.map((eq, i) => (
                   <li key={i} className="flex items-start space-x-4">
                      <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                         <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                      </div>
                      <p className="text-sm font-bold text-white/80 leading-relaxed">{eq}</p>
                   </li>
                 ))}
              </ul>
           </div>
           
           <div className="bg-card p-10 rounded-[2.5rem] border border-border">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight text-ink">Réservation</h3>
              <p className="text-ink-muted text-sm font-medium leading-relaxed mb-8">
                Vous souhaitez organiser un événement sportif ou culturel au stade ? Contactez la direction des sports.
              </p>
              <button className="w-full py-4 bg-muted hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Formulaire de demande</button>
           </div>
        </div>
      </div>
    </div>
  </main>
);

export default PageStade;
