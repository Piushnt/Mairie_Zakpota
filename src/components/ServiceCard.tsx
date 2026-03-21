import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  desc: string;
  url: string;
  logo?: string;
  Icon?: any;
}

const ServiceCard = ({ title, desc, url, logo, Icon }: ServiceCardProps) => (
  <div className="bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_0_rgba(0,102,51,0.1)] hover:border-primary/30 transition-all duration-500 group flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 blur-2xl" />
    
    <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-white rounded-3xl p-5 shadow-inner group-hover:bg-primary group-hover:shadow-primary/20 transition-all duration-500">
      {Icon ? (
        <Icon className="w-12 h-12 text-primary group-hover:text-white group-hover:rotate-12 transition-all duration-500" />
      ) : (
        <img 
          src={logo || "/img/logo-mairie.jpg"} 
          alt={title} 
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" 
        />
      )}
    </div>
    
    <div className="flex-grow text-center md:text-left relative z-10">
      <h3 className="text-2xl font-black text-primary mb-2 uppercase tracking-tight group-hover:translate-x-1 transition-transform">{title}</h3>
      <p className="text-ink-muted text-[13px] leading-relaxed mb-8 font-medium">
        {desc}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:text-accent transition-colors"
      >
        <span>Accéder au service</span>
        <div className="ml-3 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
          <ExternalLink className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </a>
    </div>
  </div>
);

export default ServiceCard;
