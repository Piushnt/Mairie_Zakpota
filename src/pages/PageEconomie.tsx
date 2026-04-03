import React from 'react';
import MarketLogic from '../components/MarketLogic';
import ArtisanDirectory from '../components/ArtisanDirectory';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Briefcase, TrendingUp } from 'lucide-react';

const PageEconomie = ({ configMarche }: { configMarche: any }) => {
  return (
    <main className="bg-surface min-h-screen">
      <Helmet>
        <title>Économie & Commerce - Mairie de Za-Kpota</title>
        <meta name="description" content="Découvrez les jours de marché et l'annuaire des artisans de la commune de Za-Kpota." />
      </Helmet>

      {/* Header Section */}
      <section className="pt-20 pb-12 bg-white dark:bg-slate-900 border-b border-border dark:border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Développement Local</h4>
            <h1 className="text-5xl md:text-6xl font-black text-ink dark:text-white tracking-tight leading-none mb-6">
              Économie & <span className="text-primary">Commerce</span>
            </h1>
            <p className="text-ink-muted dark:text-white/40 text-xl font-medium leading-relaxed max-w-2xl">
              Za-Kpota, un carrefour commercial dynamique au cœur du Zou. Retrouvez ici tous les outils pour vos activités économiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { label: 'Marchés Actifs', value: '03', icon: ShoppingBag, color: 'text-primary' },
              { label: 'Artisans Référencés', value: '120+', icon: Briefcase, color: 'text-accent' },
              { label: 'Croissance Annuelle', value: '+5.4%', icon: TrendingUp, color: 'text-green-500' },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-muted dark:bg-white/5 rounded-3xl border border-border dark:border-white/5 flex items-center space-x-6">
                <div className={`w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-ink/30 dark:text-white/20 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-ink dark:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <div id="marches">
        <MarketLogic config={configMarche} />
      </div>



      {/* Appels d'offres CTA */}
      <section className="py-20 bg-primary overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:bg-white/20 transition-all" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">Vous êtes un entrepreneur ?</h2>
          <p className="text-white/70 text-lg font-medium mb-10 max-w-2xl mx-auto">
            Consultez nos appels d'offres et opportunités de recrutement pour collaborer avec la Mairie.
          </p>
          <a 
            href="/opportunites"
            className="inline-flex items-center px-10 py-5 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent transition-all shadow-2xl"
          >
            Voir les opportunités
          </a>
        </div>
      </section>
    </main>
  );
};

export default PageEconomie;
