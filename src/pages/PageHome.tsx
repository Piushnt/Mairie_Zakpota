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
    <section className="py-24 bg-paper dark:bg-slate-900/50 border-y border-border dark:border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.01] dark:bg-primary/[0.05] pointer-events-none" />
        
        <div className="container mx-auto px-4 flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1 bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">Transparence Municipale</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary dark:text-[#00c561] uppercase tracking-tight mb-6">Rapports & Documents Officiels</h2>
            <p className="text-slate-600 dark:text-white/60 font-medium text-lg leading-relaxed">
              Consultez les derniers comptes-rendus de sessions, les arrêtés municipaux et les rapports d'activités pour rester informé de la gestion de votre commune.
            </p>
            <div className="mt-10">
              <Link 
                to="/publications" 
                className="inline-flex items-center px-8 py-4 bg-primary dark:bg-[#00c561] text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20 dark:shadow-none"
              >
                Accéder aux archives
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.slice(0, 4).map((report) => (
              <div 
                key={report.id} 
                className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/5 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary dark:text-[#00c561] group-hover:bg-primary dark:group-hover:bg-[#00c561] group-hover:text-white dark:group-hover:text-slate-900 transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary dark:group-hover:text-[#00c561] transition-colors">{report.title}</h4>
                    <p className="text-[10px] text-slate-600 dark:text-white/40 font-black uppercase tracking-widest mt-1">{report.type} • {report.date}</p>
                    <a 
                      href={report.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-4 inline-flex items-center text-[10px] font-black text-primary dark:text-[#00c561] uppercase tracking-widest hover:text-accent dark:hover:text-white"
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Télécharger
                    </a>
                  </div>
                </div>
              </div>
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
          <div className="bg-white p-10 rounded-xl shadow-sm border-b-8 border-accent text-center border border-gray-100">
            <h6 className="text-5xl font-black text-primary mb-2 tracking-tighter">13</h6>
            <p className="text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Arrondissements</p>
          </div>
          <div className="bg-white p-10 rounded-xl shadow-sm border-b-8 border-primary text-center border border-gray-100">
            <h6 className="text-5xl font-black text-primary mb-2 tracking-tighter">150K+</h6>
            <p className="text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Habitants</p>
          </div>
          <div className="bg-white p-10 rounded-xl shadow-sm border-b-8 border-red text-center border border-gray-100">
            <h6 className="text-5xl font-black text-primary mb-2 tracking-tighter">45+</h6>
            <p className="text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Projets en cours</p>
          </div>
          <div className="bg-white p-10 rounded-xl shadow-sm border-b-8 border-green-500 text-center border border-gray-100">
             <div className="flex justify-center items-center mb-2">
                <span className="text-5xl font-black text-primary tracking-tighter">98</span>
                <span className="text-2xl font-black text-primary">%</span>
             </div>
            <p className="text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default PageHome;
