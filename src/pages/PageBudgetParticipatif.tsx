import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HelpingHand, Lightbulb, Pickaxe, CheckCircle2, ChevronLeft, ChevronRight, ArrowRight, Wallet, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const PageBudgetParticipatif = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    quartier: '',
    telephone: '',
    titre: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.titre || !formData.description || !formData.telephone) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.from('audiences').insert([{
        name: `${formData.nom} ${formData.prenom}`,
        email: `${formData.quartier} - ${formData.telephone}`,
        phone: formData.telephone,
        subject: `Proposition Budget Participatif : ${formData.titre}`,
        message: formData.description,
        type: 'contact',
        status: 'En attente'
      }]);

      if (error) throw error;
      
      setIsSuccess(true);
      setFormData({
        nom: '', prenom: '', quartier: '', telephone: '', titre: '', description: ''
      });
    } catch (error: any) {
      setErrorMsg("Une erreur est survenue lors de l'envoi de votre proposition.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: Lightbulb, title: "1. Dépôt d'Idées", desc: "Suggérez un projet qui améliore la commune." },
    { icon: Info, title: "2. Étude de Faisabilité", desc: "La mairie vérifie la viabilité technique et financière." },
    { icon: CheckCircle2, title: "3. Vote Citoyen", desc: "Les habitants choisissent leurs projets préférés." },
    { icon: Pickaxe, title: "4. Réalisation", desc: "La commune concrétise le projet gagnant." }
  ];

  return (
    <div className="min-h-screen bg-muted py-24">
      <Helmet>
        <title>Budget Participatif - Mairie de Za-Kpota</title>
        <meta name="description" content="Proposez et votez pour les projets qui construiront le Za-Kpota de demain." />
      </Helmet>

      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-ink-muted hover:text-primary transition-colors font-bold text-sm mb-12">
          <ChevronLeft className="w-4 h-4 mr-2" /> Retour à l'accueil
        </Link>
        
        {/* En-tête */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8 shadow-inner shadow-primary/20">
            <Wallet className="w-10 h-10" />
          </div>
          <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">5% du Budget Communal</h4>
          <h1 className="text-4xl md:text-6xl font-black text-ink uppercase tracking-tight mb-6">Budget <span className="text-primary">Participatif</span></h1>
          <p className="text-ink-muted text-lg font-medium leading-relaxed">
            Parce que vous êtes les mieux placés pour connaître les besoins de votre quartier, la mairie vous confie une part de son budget d'investissement.
          </p>
        </div>

        {/* Le Processus Bento */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-[24px] border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="font-black text-ink uppercase tracking-tight text-lg mb-3">{step.title}</h3>
              <p className="text-ink-muted text-sm font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Section Formulaire et Explications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          <div className="lg:col-span-2">
            <div className="bg-card p-10 rounded-[24px] border border-border/50 shadow-sm">
              <h2 className="text-2xl font-black text-ink uppercase tracking-tight mb-8">Soumettre une Idée</h2>
              
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 p-8 rounded-2xl border border-green-500/20 text-center"
                >
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-ink uppercase mb-2">Projet Soumis !</h3>
                  <p className="text-ink-muted font-medium">
                    Merci pour votre implication. Votre idée a été transmise au conseil municipal pour étude de faisabilité.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 px-6 py-3 bg-white border border-border rounded-xl font-bold text-sm hover:bg-muted transition-colors"
                  >
                    Soumettre un autre projet
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-bold text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-ink/40">Nom *</label>
                      <input 
                        type="text" 
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm font-bold"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-ink/40">Prénom</label>
                      <input 
                        type="text" 
                        value={formData.prenom}
                        onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm font-bold"
                        placeholder="Votre prénom"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-ink/40">Téléphone *</label>
                      <input 
                        type="tel" 
                        value={formData.telephone}
                        onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm font-bold"
                        placeholder="+229 __ __ __ __"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-ink/40">Quartier / Arrondissement</label>
                      <input 
                        type="text" 
                        value={formData.quartier}
                        onChange={(e) => setFormData({...formData, quartier: e.target.value})}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm font-bold"
                        placeholder="Où habitez-vous ?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Titre du Projet *</label>
                    <input 
                      type="text" 
                      value={formData.titre}
                      onChange={(e) => setFormData({...formData, titre: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm font-bold"
                      placeholder="Donnez un nom court à votre idée"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/40">Description détaillée *</label>
                    <textarea 
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-sm font-bold resize-none"
                      placeholder="Expliquez votre projet, les bénéfices pour le quartier, le public visé..."
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent transition-all hover:text-primary shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? "Envoi en cours..." : "Soumettre mon idée"}</span>
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-10 bg-primary text-white rounded-[24px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-white/20 transition-colors pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                  <HelpingHand className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">Sondages Actuels</h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed mb-6">
                   Participez aux consultations en cours pour orienter les décisions de la Mairie avant les séances du conseil.
                </p>
                <Link to="/sondages" className="w-fit min-h-[44px] text-[10px] font-black uppercase tracking-widest text-accent flex items-center hover:text-white transition-colors relative z-10 outline-none">
                  Voir les sondages <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-card p-10 border border-border/50 rounded-[24px] shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Critères d'éligibilité</h4>
              <ul className="space-y-4 text-sm font-medium text-ink-muted">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                  <span>Répondre à l'intérêt général</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                  <span>Relever des compétences de la Commune</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                  <span>Constituer une dépense d'investissement (pas de frais de fonctionnement)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                  <span>Être réalisable techniquement et juridiquement</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PageBudgetParticipatif;
