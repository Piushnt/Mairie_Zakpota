import React from 'react';
import { Helmet } from 'react-helmet-async';
import ArtisanDirectory from '../components/ArtisanDirectory';
import { Hammer, Sparkles } from 'lucide-react';

const PageAnnuaireArtisans = () => {
  return (
    <main className="bg-surface min-h-screen pt-20 pb-24 transition-colors">
      <Helmet>
        <title>Annuaire des Artisans - Mairie de Za-Kpota</title>
        <meta name="description" content="Découvrez les artisans locaux certifiés de la commune de Za-Kpota. Trouvez un menuisier, maçon, mécanicien et plus." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Économie Locale</h4>
          <h1 className="text-4xl md:text-6xl font-black text-ink dark:text-white tracking-tight mb-8 leading-tight">
            Annuaire des <span className="text-primary">Artisans</span>
          </h1>
          <p className="text-ink-muted dark:text-white/40 text-lg md:text-xl font-medium leading-relaxed">
            Trouvez les meilleurs professionnels à proximité et contribuez au dynamisme de Za-Kpota.
          </p>
          <div className="h-1.5 w-16 bg-accent mx-auto mt-10 rounded-full" />
        </div>

        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] border border-border dark:border-white/5 p-4 md:p-12 mb-16">
          <ArtisanDirectory />
        </div>

        <div className="max-w-3xl mx-auto p-12 bg-primary text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:bg-white/20 transition-all" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <Sparkles className="w-12 h-12 text-accent mb-6" />
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Vous êtes artisan à Za-Kpota ?</h3>
            <p className="text-white/80 font-medium leading-relaxed mb-10 max-w-lg">
              Inscrivez-vous gratuitement dans l'annuaire communal pour gagner en visibilité et rassurer vos futurs clients grâce à la certification de la Mairie.
            </p>
            <button className="px-10 py-5 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent transition-all shadow-xl">
              Soumettre ma candidature
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageAnnuaireArtisans;
