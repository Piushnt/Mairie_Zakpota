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
      className="bg-white dark:bg-slate-900 p-6 shadow-md dark:shadow-2xl border-l-4 border-[#006633] dark:border-[#008a44] flex items-start space-x-6 h-full transition-all group border dark:border-white/5"
    >
      <div className="flex-shrink-0 w-20 h-20 bg-[#F1F5F9] dark:bg-white/5 rounded-lg p-4 flex items-center justify-center text-[#006633] dark:text-[#00c561] group-hover:bg-[#006633] group-hover:text-white dark:group-hover:bg-[#00c561] dark:group-hover:text-slate-900 transition-colors duration-500">
        <Icon className="w-10 h-10" />
      </div>
      
      <div className="flex flex-col justify-between h-full flex-grow">
        <div>
          <h3 className="text-xl font-bold text-[#006633] dark:text-[#00c561] mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed mb-4">
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
