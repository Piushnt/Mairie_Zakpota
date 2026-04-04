import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agendaData } from '../data/config';
import { Trophy, Users, CheckCircle, Clock, Calendar as CalIcon, MapPin } from 'lucide-react';

import { getOptimizedNetworkUrl } from '../utils/imageParser';

interface PageStadeProps {
  stade: any;
  onReserve: (data: any) => Promise<void>;
}

const PageStade = ({ stade, onReserve }: PageStadeProps) => {
  const [showForm, setShowForm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nom: '',
    prenom: '',
    telephone: '',
    date: new Date().toISOString().split('T')[0],
    creneau: '08:00 - 10:00'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onReserve(formData);
      setSuccess(true);
      setTimeout(() => {
        setShowForm(false);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      alert('Erreur lors de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-12 pb-24 bg-surface">
      <div className="container mx-auto px-4">
        {/* Hero Stade */}
        <div className="relative h-[500px] rounded-[3.5rem] overflow-hidden mb-20 shadow-2xl border-8 border-white">
          <img 
            src={getOptimizedNetworkUrl(agendaData.stade.image, 1200)} 
            alt="Stade Municipal" 
            width={1200}
            height={500}
            loading="lazy"
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
                  Vous souhaitez organiser un événement sportif ou culturel au stade ? Remplissez notre formulaire en ligne.
                </p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:bg-accent hover:text-primary"
                >
                  Réserver le stade
                </button>
             </div>
          </div>
        </div>

        {/* Modal Formulaire */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(false)}
                className="absolute inset-0 bg-ink/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-card rounded-[3rem] p-10 shadow-2xl overflow-hidden border border-border"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-2xl font-black text-ink mb-2 uppercase">Réserver le stade</h3>
                <p className="text-ink-muted text-sm mb-8 font-medium">Votre demande sera soumise au Secrétaire Exécutif pour validation.</p>
                
                {success ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-black text-ink">Demande Envoyée !</h4>
                    <p className="text-ink-muted text-sm font-medium">Nous vous contacterons après validation.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-ink/40 tracking-widest">Nom</label>
                        <input 
                          required
                          type="text" 
                          value={formData.nom}
                          onChange={e => setFormData({...formData, nom: e.target.value})}
                          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-bold"
                          placeholder="Ex: HOUESSOU"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-ink/40 tracking-widest">Prénom</label>
                        <input 
                          required
                          type="text" 
                          value={formData.prenom}
                          onChange={e => setFormData({...formData, prenom: e.target.value})}
                          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-bold"
                          placeholder="Ex: Jean"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-ink/40 tracking-widest">Téléphone</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.telephone}
                        onChange={e => setFormData({...formData, telephone: e.target.value})}
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-bold"
                        placeholder="+229 00 00 00 00"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-ink/40 tracking-widest" htmlFor="booking-date">Date</label>
                        <input 
                          id="booking-date"
                          required
                          aria-label="Sélectionner la date"
                          type="date" 
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-ink/40 tracking-widest" htmlFor="booking-slot">Créneau</label>
                        <select 
                          id="booking-slot"
                          aria-label="Sélectionner le créneau horaire"
                          value={formData.creneau}
                          onChange={e => setFormData({...formData, creneau: e.target.value})}
                          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-bold"
                        >
                          <option>08:00 - 10:00</option>
                          <option>10:00 - 12:00</option>
                          <option>14:00 - 16:00</option>
                          <option>16:00 - 18:00</option>
                          <option>18:00 - 20:00</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:bg-accent hover:text-primary flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CalIcon className="w-4 h-4" />
                          <span>Confirmer la demande</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default PageStade;
