import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Share2, MessageCircle, Send, Heart, Check } from 'lucide-react';

import { getOptimizedNetworkUrl } from '../utils/imageParser';
import { supabase } from '../lib/supabase';

const PageNewsDetail = ({ news }: { news: any[] }) => {
  const { id } = useParams<{ id: string }>();
  const article = news.find(n => n.id === id);
  
  const [likes, setLikes] = useState(article?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (article) {
      const liked = localStorage.getItem(`news_liked_${article.id}`) === 'true';
      setIsLiked(liked);
      setLikes(article.likes || 0);
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-black text-ink mb-6">Article introuvable</h2>
        <Link to="/actualites" className="text-primary font-bold flex items-center justify-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Retour aux actualités
        </Link>
      </div>
    );
  }

  const handleLike = async () => {
    try {
      const newLikedStatus = !isLiked;
      setIsLiked(newLikedStatus);
      
      if (newLikedStatus) {
        setLikes(prev => (prev || 0) + 1);
        localStorage.setItem(`news_liked_${article.id}`, 'true');
        await supabase.rpc('increment_news_likes', { row_id: article.id });
      } else {
        setLikes(prev => Math.max(0, (prev || 0) - 1));
        localStorage.removeItem(`news_liked_${article.id}`);
        await supabase.rpc('decrement_news_likes', { row_id: article.id });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const shareUrl = window.location.href;
  const shareText = `Découvrez cette actualité de la Mairie de Za-Kpota : ${article.title}`;

  const handleShare = async (platform: 'whatsapp' | 'telegram' | 'native') => {
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: article.title,
              text: shareText,
              url: shareUrl,
            });
          } catch (err) {
            console.log('Error sharing:', err);
          }
        } else {
          navigator.clipboard.writeText(shareUrl);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }
        break;
    }
  };

  return (
    <main className="pt-32 pb-20 bg-surface min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <Link to="/actualites" className="inline-flex items-center gap-2 text-ink-muted hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Link>
            
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                isLiked ? 'bg-red text-white shadow-lg shadow-red/20' : 'bg-card text-ink-muted border border-border hover:border-red hover:text-red'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes || 0} J'aime</span>
            </button>
          </div>

          <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src={getOptimizedNetworkUrl(article.img || article.image_url, 1200)} 
              alt={article.title} 
              width={1200}
              height={600}
              loading="eager"
              className="w-full h-full object-cover" 
            />
            <div className={`absolute top-8 left-8 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-2xl uppercase tracking-widest shadow-xl`}>
              {article.cat || article.category}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-ink-muted text-sm font-bold">
              <Calendar className="w-5 h-5 text-accent" />
              {article.date}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-ink leading-tight tracking-tighter">
              {article.title}
            </h1>

            <div className="h-1.5 w-24 bg-accent rounded-full mb-12" />

            <div className="prose prose-lg max-w-none text-ink-muted font-medium leading-relaxed space-y-6 whitespace-pre-wrap">
              {article.description || article.desc}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-20 p-10 bg-card rounded-[2.5rem] border border-border flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-xl font-black text-ink mb-2">Vous avez aimé cet article ?</h3>
              <p className="text-ink-muted text-sm font-medium">Partagez l'information avec vos proches à Za-Kpota.</p>
            </div>
            <div className="flex gap-4">
               <button 
                onClick={() => handleShare('whatsapp')}
                title="Partager sur WhatsApp" 
                className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#25D366]/20"
               >
                <MessageCircle className="w-5 h-5" />
               </button>
               
               <button 
                onClick={() => handleShare('telegram')}
                title="Partager sur Telegram" 
                className="w-12 h-12 bg-[#0088cc] text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#0088cc]/20"
               >
                <Send className="w-5 h-5" />
               </button>
               
               <button 
                onClick={() => handleShare('native')}
                title={isCopied ? "Lien copié !" : "Partager"} 
                className={`w-12 h-12 ${isCopied ? 'bg-green-500' : 'bg-primary'} text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-primary/20`}
               >
                {isCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default PageNewsDetail;
