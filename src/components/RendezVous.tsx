import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, Send, CheckCircle2, AlertCircle, ArrowRight, Info } from 'lucide-react';

interface RendezVousProps {
  onSubmit: (data: any) => Promise<void>;
}

const RendezVous: React.FC<RendezVousProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motif: '',
    date: '',
    heure: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await onSubmit(formData);
      setStatus('success');
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        motif: '',
        date: '',
        heure: '',
        message: ''
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.");
    }
  };

  const motifs = [
    "État Civil (Naissance, Mariage, Décès)",
    "Urbanisme & Permis de Construire",
    "Affaires Sociales & Solidarité",
    "Économie & Commerce",
    "Rencontre avec Monsieur le Maire",
    "Autre demande administrative"
  ];

  return (
    <div className="py-12 bg-white dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left side: Info & Instructions */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Prise de Rendez-vous en Ligne
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Gagnez du temps en planifiant votre visite à la mairie de Za-Kpota. Remplissez le formulaire et recevez une confirmation par email ou SMS.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                  <div className="p-3 bg-emerald-500 text-white rounded-2xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Horaires d'accueil</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Du Lundi au Vendredi : 08h00 - 12h30 | 14h00 - 17h30</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800">
                  <div className="p-3 bg-blue-500 text-white rounded-2xl">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Documents à prévoir</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">N'oubliez pas d'apporter votre pièce d'identité et tout document relatif à votre demande.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Besoin d'aide ?</h3>
                  <p className="text-slate-400 mb-6 text-sm">Notre service d'assistance est à votre écoute pour vous guider dans vos démarches.</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">+229 97 00 00 00</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
              </div>
            </motion.div>

            {/* Right side: Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700"
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Demande Envoyée !</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                      Votre demande de rendez-vous a bien été transmise. Nos services vous contacteront sous peu pour confirmer la date et l'heure.
                    </p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all"
                    >
                      Nouveau rendez-vous
                    </button>
                  </motion.div>
                ) : (
                  <form key="form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nom</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            required
                            type="text"
                            placeholder="Votre nom"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Prénom</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            required
                            type="text"
                            placeholder="Votre prénom"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                            value={formData.prenom}
                            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            required
                            type="email"
                            placeholder="votre@email.com"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Téléphone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            required
                            type="tel"
                            placeholder="Ex: +229 97 00 00 00"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                            value={formData.telephone}
                            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Motif du rendez-vous</label>
                      <select 
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                        value={formData.motif}
                        onChange={(e) => setFormData({...formData, motif: e.target.value})}
                      >
                        <option value="">Sélectionnez un motif</option>
                        {motifs.map((m, i) => (
                          <option key={i} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Date souhaitée</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            required
                            type="date"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Heure souhaitée</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            required
                            type="time"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                            value={formData.heure}
                            onChange={(e) => setFormData({...formData, heure: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message (Optionnel)</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                        <textarea 
                          rows={4}
                          placeholder="Précisez votre demande..."
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        ></textarea>
                      </div>
                    </div>

                    {status === 'error' && (
                      <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-2 text-sm">
                        <AlertCircle className="w-5 h-5" />
                        {errorMessage}
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
                    >
                      {status === 'loading' ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Envoyer la demande
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendezVous;
