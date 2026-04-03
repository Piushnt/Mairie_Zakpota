import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
      whileHover={{ y: -8 }}
      className="bg-card group relative p-8 rounded-[2rem] border border-border dark:border-white/5 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,102,51,0.12)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] flex flex-col h-full"
    >
      <div className={`w-16 h-16 rounded-[1.25rem] bg-primary/5 dark:bg-primary/10 flex items-center justify-center ${iconColor || 'text-primary'} mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
        <Icon className="w-8 h-8" />
      </div>

      <div className="flex flex-col flex-1">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3 font-bold">
          {category}
        </span>
        <h3 className="text-xl font-bold text-slate-950 dark:text-white uppercase tracking-tight mb-4 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-[13px] font-medium leading-relaxed mb-6 flex-1">
          {desc}
        </p>
      </div>

      <div className="pt-6 border-t border-border/50 dark:border-white/5 mt-auto">
        {isExternal ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-[10px] font-black text-primary dark:text-[#00c561] uppercase tracking-[0.2em] group/btn hover:text-accent transition-all"
          >
            <span>Démarrer la procédure</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
          </a>
        ) : (
          <Link 
            to={url} 
            className="inline-flex items-center space-x-2 text-[10px] font-black text-primary dark:text-[#00c561] uppercase tracking-[0.2em] group/btn hover:text-accent transition-all"
          >
            <span>Démarrer la procédure</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceCard;

