import React from 'react';
import { Helmet } from 'react-helmet-async';
import FolderTracking from '../components/FolderTracking';
import { Search, Info } from 'lucide-react';

const PageSuiviDossier = () => {
  return (
    <main className="bg-surface min-h-screen pt-20 pb-24 transition-colors">
      <Helmet>
        <title>Suivi de Dossier - Mairie de Za-Kpota</title>
        <meta name="description" content="Suivez l'avancement de votre dossier administratif en temps réel sur le portail de la Mairie de Za-Kpota." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">E-Administration</h4>
          <h1 className="text-4xl md:text-6xl font-black text-ink dark:text-white tracking-tight mb-8 leading-tight">
            Suivi de <span className="text-primary">Dossier</span>
          </h1>
          <p className="text-ink-muted dark:text-white/40 text-lg md:text-xl font-medium leading-relaxed">
            Consultez instantanément l'état de traitement de vos demandes d'actes (naissance, mariage, foncier).
          </p>
          <div className="h-1.5 w-16 bg-accent mx-auto mt-10 rounded-full" />
        </div>

        <div className="relative z-10">
          <FolderTracking />
        </div>

        <div className="max-w-2xl mx-auto mt-20 p-8 bg-card dark:bg-slate-900 rounded-[2.5rem] border border-border dark:border-white/5 flex items-start space-x-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-ink dark:text-white mb-2">Comment ça marche ?</h4>
            <p className="text-sm text-ink-muted dark:text-white/40 leading-relaxed font-medium">
              Saisissez l'identifiant unique qui vous a été remis lors du dépôt de votre dossier à la Mairie ou dans votre arrondissement. 
              Si vous n'avez pas de code, contactez le service de l'État Civil.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageSuiviDossier;
