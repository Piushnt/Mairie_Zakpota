import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  desc: string;
  url: string;
  logo?: string;
}

const ServiceCard = ({ title, desc, url, logo }: ServiceCardProps) => (
  <div className="bg-card p-8 rounded-3xl shadow-sm border border-border hover:border-primary/50 transition-all group flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-primary/5 rounded-2xl p-4 group-hover:bg-primary/10 transition-colors">
      <img 
        src={logo || "/img/logo-mairie.jpg"} 
        alt={title} 
        className="max-w-full max-h-full object-contain" 
      />
    </div>
    <div className="flex-grow text-center md:text-left">
      <h3 className="text-xl font-black text-primary mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-ink-muted text-sm leading-relaxed mb-6">
        {desc}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
      >
        Accéder au service <ExternalLink className="w-3 h-3 ml-2" />
      </a>
    </div>
  </div>
);

export default ServiceCard;
