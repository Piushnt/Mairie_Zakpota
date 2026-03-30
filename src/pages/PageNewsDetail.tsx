import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Share2, MessageCircle, Send, Mail } from 'lucide-react';

const PageNewsDetail = ({ news }: { news: any[] }) => {
  const { id } = useParams<{ id: string }>();
  const article = news.find(n => n.id === id);

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

  return (
    <main className="pt-32 pb-20 bg-surface min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Link to="/actualites" className="inline-flex items-center gap-2 text-ink-muted hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>

          <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src={article.img || article.image_url} 
              alt={article.title} 
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

            <div className="prose prose-lg max-w-none text-ink-muted font-medium leading-relaxed space-y-6">
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
               <button title="Partager sur WhatsApp" className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><MessageCircle className="w-5 h-5" /></button>
               <button title="Partager sur Telegram" className="w-12 h-12 bg-[#0088cc] text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><Send className="w-5 h-5" /></button>
               <button title="Partager" className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><Share2 className="w-5 h-5" /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default PageNewsDetail;
