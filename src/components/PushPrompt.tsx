import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

export default function PushPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ne rien afficher si on n'est pas dans un contexte avec notifications
    if (!('Notification' in window)) return;

    // Ne rien afficher si l'utilisateur a déjà pris sa décision définitive (accordé ou refusé)
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;

    // Ne rien afficher si l'utilisateur a remis à plus tard durant cette session
    if (sessionStorage.getItem('push_prompt_dismissed') === 'true') return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000); // 15 secondes avant affichage

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async () => {
    setIsVisible(false); // On cache la soft prompt pour laisser le navigateur faire sa demande native
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Optionnel : L'inscription réelle au ServiceWorkerPushManager pourrait avoir lieu ici
        // si on gère VAPID clés côté client. Dans notre architecture, c'est idéalement
        // géré via sw.js et une API. Pour l'instant, l'accord suffit au navigateur.
        console.log("Permission accordée !");
      }
    } catch (error) {
      console.error("Erreur de demande de push:", error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('push_prompt_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-8 md:bottom-8 md:w-[400px]"
        >
          <div className="bg-card px-6 py-5 rounded-3xl border border-border shadow-2xl relative overflow-hidden">
            {/* Déco */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-ink/40 hover:text-ink transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Bell className="w-6 h-6 animate-[wiggle_1s_ease-in-out_infinite]" />
              </div>
              <div className="pr-4">
                <h4 className="font-black text-ink text-sm uppercase tracking-tight mb-1">Restez connecté !</h4>
                <p className="text-xs text-ink/70 font-medium leading-relaxed">
                  Recevez les alertes de Za-Kpota (Actes, Stade, Urgences) en temps réel directement sur votre téléphone.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleSubscribe}
                className="flex-1 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
              >
                M'abonner
              </button>
              <button 
                onClick={handleDismiss}
                className="px-6 py-3 bg-muted text-ink/60 hover:text-ink text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                Plus tard
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
