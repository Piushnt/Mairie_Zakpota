import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Heart, Share2, MessageCircle, Send, Mail } from 'lucide-react';
import { getOptimizedNetworkUrl } from '../utils/imageParser';

export default function NewsCard({ news }: { news: any }) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
  const [shares, setShares] = useState(Math.floor(Math.random() * 20) + 5);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'administration': return 'bg-blue-600';
      case 'travaux': return 'bg-orange-500';
      case 'sport': return 'bg-green-600';
      case 'santé': return 'bg-red-500';
      case 'annonces': return 'bg-purple-600';
      default: return 'bg-primary';
    }
  };

  const shareUrl = window.location.href;
  const shareText = `Découvrez cette actualité de la Mairie de Za-Kpota : ${news.title}`;

  const shareOptions = [
    { 
      name: 'WhatsApp', 
      icon: <MessageCircle className="w-4 h-4" />, 
      color: 'bg-[#25D366]',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
    },
    { 
      name: 'Telegram', 
      icon: <Send className="w-4 h-4" />, 
      color: 'bg-[#0088cc]',
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')
    },
    { 
      name: 'Email', 
      icon: <Mail className="w-4 h-4" />, 
      color: 'bg-ink-muted',
      action: () => window.open(`mailto:?subject=${encodeURIComponent(news.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank')
    }
  ];

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-gray-100 dark:border-white/5"
    >
      <div className="relative overflow-hidden h-64 shrink-0">
        <img 
          src={getOptimizedNetworkUrl(news.img, 600)} 
          alt={news.title} 
          width={600}
          height={400}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className={`absolute top-4 left-4 ${getCategoryColor(news.cat)} text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-lg`}>
          {news.cat}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center text-ink-muted text-xs mb-4">
          <Calendar className="w-4 h-4 mr-2 text-accent" /> {news.date}
        </div>
        <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors text-ink line-clamp-2">
          {news.title}
        </h3>
        <p className="text-ink-muted text-sm mb-6 line-clamp-3 flex-grow">
          {news.desc}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-border relative">
          <button 
            onClick={() => navigate(`/news/${news.id}`)}
            className="text-sm font-bold text-primary flex items-center group/btn"
          >
            Lire <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
          </button>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setIsLiked(!isLiked);
                setLikes(prev => isLiked ? prev - 1 : prev + 1);
              }}
              className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-red' : 'text-ink-muted hover:text-red'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${showShareMenu ? 'text-primary' : 'text-ink-muted hover:text-primary'}`}
              >
                <Share2 className="w-4 h-4" />
                <span>{shares}</span>
              </button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-4 bg-card shadow-2xl rounded-2xl p-2 border border-border z-50 min-w-[160px]"
                  >
                    <div className="grid grid-cols-1 gap-1">
                      {shareOptions.map((opt) => (
                        <button 
                          key={opt.name}
                          onClick={() => {
                            opt.action();
                            setShares(prev => prev + 1);
                            setShowShareMenu(false);
                          }}
                          className="flex items-center space-x-3 p-2 hover:bg-muted rounded-xl transition-colors text-left"
                        >
                          <div className={`w-8 h-8 ${opt.color} text-white rounded-lg flex items-center justify-center`}>
                            {opt.icon}
                          </div>
                          <span className="text-xs font-bold text-ink">{opt.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
