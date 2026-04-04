import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  desc: string;
  url: string;
  category?: string;
  Icon: any;
  iconColor?: string;
}

const ServiceCard = ({ title, desc, url, category = "Service Public", Icon, iconColor }: ServiceCardProps) => {
  const isExternal = url.startsWith('http');
  
  return (
    <motion.div
      className="bg-card p-10 rounded-[24px] shadow-sm border border-border/50 hover:shadow-2xl hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col justify-between h-full"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className={`w-7 h-7 text-primary`} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
            {category}
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-black mb-4 tracking-tight text-ink uppercase">
          {title}
        </h3>
        <p className="text-ink-muted leading-relaxed mb-8 text-sm font-medium">
          {desc}
        </p>
      </div>
      
      <div className="relative z-10 mt-auto">
        {isExternal ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-fit text-[10px] font-black uppercase tracking-widest text-primary flex items-center hover:text-accent transition-colors underline decoration-accent underline-offset-4 group/btn"
          >
            Voir les procédures <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        ) : (
          <Link 
            to={url} 
            className="w-fit text-[10px] font-black uppercase tracking-widest text-primary flex items-center hover:text-accent transition-colors underline decoration-accent underline-offset-4 group/btn"
          >
            Voir les procédures <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceCard;

