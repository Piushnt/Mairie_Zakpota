import React from 'react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import NewsCard from '../components/NewsCard';
import PartnersSection from '../components/PartnersSection';
import MunicipalServices from '../components/MunicipalServices';
import PhotoGallery from '../components/PhotoGallery';
import SignalementForm from '../components/SignalementForm';
import { ChevronRight } from 'lucide-react';
import { newsData } from '../data/config';
import { Link } from 'react-router-dom';

const PageHome = () => (
  <main className="pb-20 bg-surface transition-colors duration-300">
    <Hero />

    <section className="container mx-auto px-4 -mt-20 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ServiceCard
          title="État Civil"
          desc="Demandez vos actes de naissance, mariage ou décès en ligne. Suivez l'évolution de votre demande en temps réel."
          url="https://service-public.bj/etat-civil"
          logo="/img/logo-mairie.jpg"
        />
        <ServiceCard
          title="Urbanisme & Foncier"
          desc="Permis de construire, certificat d'urbanisme et démarches foncières. Consultez le Plan Directeur d'Urbanisme."
          url="https://zakpota.bj/urbanisme"
          logo="/img/logo-mairie.jpg"
        />
        <ServiceCard
          title="Marchés Publics"
          desc="Consultez les appels d'offres en cours et les résultats des attributions pour la commune de Za-Kpota."
          url="https://marches-publics.bj"
          logo="/img/logo-mairie.jpg"
        />
        <ServiceCard
          title="Taxe de Développement"
          desc="Payez vos taxes locales et contribuez au développement des infrastructures de notre commune."
          url="https://zakpota.bj/taxes"
          logo="/img/logo-mairie.jpg"
        />
      </div>
    </section>

    <section className="container mx-auto px-4 mt-24">
      <div className="flex items-center justify-between mb-12 border-b-2 border-border pb-6">
        <div>
          <h2 className="text-4xl font-black text-primary uppercase tracking-tight">Actualités Municipales</h2>
          <p className="text-ink-muted mt-2 font-medium">Toute l'actualité de votre commune en temps réel</p>
        </div>
        <Link to="/actualites" className="text-xs font-black uppercase tracking-widest text-primary hover:text-accent flex items-center group transition-colors">
          Toutes les actualités <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {newsData.slice(0, 3).map((news) => (
          <div key={news.id}>
            <NewsCard news={news} />
          </div>
        ))}
      </div>
    </section>

    <PartnersSection />

    <MunicipalServices />

    <PhotoGallery />

    <SignalementForm />

    <section className="bg-muted py-24 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card p-10 rounded-[2.5rem] shadow-sm border-b-8 border-accent text-center border border-border">
            <h6 className="text-5xl font-black text-primary mb-2 tracking-tighter">13</h6>
            <p className="text-ink-muted font-black text-[10px] uppercase tracking-[0.3em]">Arrondissements</p>
          </div>
          <div className="bg-card p-10 rounded-[2.5rem] shadow-sm border-b-8 border-primary text-center border border-border">
            <h6 className="text-5xl font-black text-primary mb-2 tracking-tighter">150K+</h6>
            <p className="text-ink-muted font-black text-[10px] uppercase tracking-[0.3em]">Habitants</p>
          </div>
          <div className="bg-card p-10 rounded-[2.5rem] shadow-sm border-b-8 border-red text-center border border-border">
            <h6 className="text-5xl font-black text-primary mb-2 tracking-tighter">45+</h6>
            <p className="text-ink-muted font-black text-[10px] uppercase tracking-[0.3em]">Projets en cours</p>
          </div>
          <div className="bg-card p-10 rounded-[2.5rem] shadow-sm border-b-8 border-green-500 text-center border border-border">
             <div className="flex justify-center items-center mb-2">
                <span className="text-5xl font-black text-primary tracking-tighter">98</span>
                <span className="text-2xl font-black text-primary">%</span>
             </div>
            <p className="text-ink-muted font-black text-[10px] uppercase tracking-[0.3em]">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default PageHome;
