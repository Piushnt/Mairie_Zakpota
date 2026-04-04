import React from 'react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import NewsCard from '../components/NewsCard';
import PartnersSection from '../components/PartnersSection';
import MunicipalServices from '../components/MunicipalServices';
import PhotoGallery from '../components/PhotoGallery';
import SignalementForm from '../components/SignalementForm';
import CommunityPolls from '../components/CommunityPolls';
import { 
  ChevronRight, 
  Users, 
  Building2, 
  ShoppingBag, 
  Coins,
  FileText,
  Download
} from 'lucide-react';
import { newsData } from '../data/config';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PageHome = ({ reports = [], news = [] }: { reports?: any[], news?: any[] }) => (
  <main className="pb-20 bg-surface transition-colors duration-300">
    <Helmet>
      <title>Accueil - Mairie de Za-Kpota</title>
      <meta name="description" content="Découvrez les services, l'actualité et les opportunités de la Mairie de Za-Kpota." />
    </Helmet>
    <Hero news={news} />

    <section className="container mx-auto px-4 mt-8 relative z-20">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight uppercase mb-4">Services <span className="text-primary hover:text-accent transition-colors">Essentiels</span></h2>
        <div className="h-1.5 w-20 bg-accent rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ServiceCard
          title="État Civil & Suivi"
          category="Administratif"
          desc="Demandez vos actes de naissance, mariage ou décès en ligne. Suivez l'évolution de votre demande en temps réel."
          url="/suivi-dossier" 
          Icon={Users}
          iconColor="text-primary"
        />
        <ServiceCard
          title="Urbanisme & Foncier"
          category="Habitat"
          desc="Permis de construire, certificat d'urbanisme et démarches foncières. Consultez le Plan Directeur d'Urbanisme."
          url="/services/urbanisme"
          Icon={Building2}
          iconColor="text-accent"
        />
        <ServiceCard
          title="Marchés Publics"
          category="Économie"
          desc="Consultez les appels d'offres en cours et les résultats des attributions pour la commune de Za-Kpota."
          url="https://marches-publics.bj"
          Icon={ShoppingBag}
          iconColor="text-red"
        />
        <ServiceCard
          title="Taxe de Développement"
          category="Fiscalité"
          desc="Payez vos taxes locales et contribuez au développement des infrastructures de notre commune."
          url="/simulateur"
          Icon={Coins}
          iconColor="text-primary"
        />
      </div>
    </section>

    {/* Section Documents Officiels */}
    <section className="py-24 bg-paper border-y border-border relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row lg:items-center justify-between gap-16 relative z-10">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Transparence Municipale</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-ink tracking-tight uppercase mb-6">
              Rapports & Documents Officiels
            </h2>
            <div className="h-1.5 w-16 bg-accent rounded-full mb-6" />
            <p className="text-ink-muted text-sm font-medium leading-relaxed mb-10">
              Consultez les derniers comptes-rendus de sessions, les arrêtés municipaux et les rapports d'activités pour rester informé de la gestion de votre commune.
            </p>
            <Link 
              to="/publications" 
              className="w-fit min-h-[44px] px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center group/btn"
            >
              Accéder aux archives
              <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 lg:mt-0">
            {reports.slice(0, 4).map((report) => (
              <a 
                href={report.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                key={report.id} 
                className="bg-card p-8 rounded-[24px] shadow-sm border border-border/50 hover:shadow-2xl hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-black text-ink text-lg mb-2 group-hover:text-primary transition-colors leading-tight">{report.title}</h4>
                  <p className="text-ink-muted text-[10px] font-bold uppercase tracking-wider">{report.type} • {report.date}</p>
                </div>
                <div className="mt-8 flex items-center text-[10px] font-black uppercase tracking-widest text-primary underline decoration-accent underline-offset-4 group-hover:text-accent transition-colors relative z-10 w-fit">
                   Télécharger <Download className="w-3 h-3 ml-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
    </section>



    <CommunityPolls />
    <PartnersSection />

    <MunicipalServices />

    <PhotoGallery />

    <SignalementForm />

    <section className="bg-muted py-24 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card p-10 rounded-[24px] shadow-sm border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h6 className="text-5xl font-black text-ink mb-2 tracking-tighter relative z-10">13</h6>
            <p className="text-ink-muted font-black text-[10px] uppercase tracking-[0.3em] relative z-10">Arrondissements</p>
          </div>
          <div className="bg-card p-10 rounded-[24px] shadow-sm border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h6 className="text-5xl font-black text-ink mb-2 tracking-tighter relative z-10">150K+</h6>
            <p className="text-ink-muted font-black text-[10px] uppercase tracking-[0.3em] relative z-10">Habitants</p>
          </div>
          <div className="bg-card p-10 rounded-[24px] shadow-sm border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red/10 rounded-full blur-2xl group-hover:bg-red/20 transition-colors -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h6 className="text-5xl font-black text-ink mb-2 tracking-tighter relative z-10">45+</h6>
            <p className="text-ink-muted font-black text-[10px] uppercase tracking-[0.3em] relative z-10">Projets en cours</p>
          </div>
          <div className="bg-card p-10 rounded-[24px] shadow-sm border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             <div className="flex justify-center items-center mb-2 relative z-10">
                <span className="text-5xl font-black text-ink tracking-tighter">98</span>
                <span className="text-2xl font-black text-ink">%</span>
             </div>
            <p className="text-ink-muted font-black text-[10px] uppercase tracking-[0.3em] relative z-10">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default PageHome;
