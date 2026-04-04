import React from 'react';
import { Helmet } from 'react-helmet-async';
import CommunityPolls from '../components/CommunityPolls';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageSondages = () => {
  return (
    <div className="min-h-screen bg-muted py-24">
      <Helmet>
        <title>Sondages Citoyens - Mairie de Za-Kpota</title>
        <meta name="description" content="Participez aux décisions de la commune en répondant aux sondages citoyens." />
      </Helmet>

      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-ink-muted hover:text-primary transition-colors font-bold text-sm mb-12">
          <ChevronLeft className="w-4 h-4 mr-2" /> Retour à l'accueil
        </Link>
      </div>

      {/* Le composant est réutilisé ici. Le side-block `BudgetParticipatif` est caché pour le focus complet */}
      <CommunityPolls hideBudgetBlock={true} />
    </div>
  );
};

export default PageSondages;
