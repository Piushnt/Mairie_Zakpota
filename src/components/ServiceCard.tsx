import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  desc: string;
  url: string;
  Icon: any;
}

const ServiceCard = ({ title, desc, url, Icon }: ServiceCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card p-6 shadow-md dark:shadow-2xl border-l-4 border-primary dark:border-accent flex items-start space-x-6 h-full transition-all group border border-border dark:border-white/5"
    >
      <div className="flex-shrink-0 w-20 h-20 bg-muted dark:bg-white/5 rounded-lg p-4 flex items-center justify-center text-primary dark:text-[#00c561] group-hover:bg-primary group-hover:text-white dark:group-hover:bg-[#00c561] dark:group-hover:text-slate-900 transition-colors duration-500">
        <Icon className="w-10 h-10" />
      </div>
      
      <div className="flex flex-col justify-between h-full flex-grow">
        <div>
          <h3 className="text-xl font-bold text-primary dark:text-[#00c561] mb-2">{title}</h3>
          <p className="text-ink-muted text-sm leading-relaxed mb-4">
            {desc}
          </p>
        </div>
        
        <div className="mt-auto">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#006633] dark:text-[#00c561] hover:underline flex items-center space-x-2 text-[13px] font-bold break-all opacity-80 hover:opacity-100 transition-opacity"
          >
            <span>{url}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
