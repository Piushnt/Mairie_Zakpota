import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PushNotificationPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // Vérifier si les notifications Push sont supportées
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    // Vérifier si l'utilisateur n'a pas encore fait de choix
    if (Notification.permission === 'default') {
      const hasDismissedThisSession = sessionStorage.getItem('pushPromptDismissed');
      if (!hasDismissedThisSession) {
        // Attendre 3 secondes avant d'afficher pour ne pas être trop agressif au premier load
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pushPromptDismissed', 'true');
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const { subscribeToPushNotifications } = await import('../lib/pushNotifications');
      const success = await subscribeToPushNotifications();
      
      if (success) {
        setIsVisible(false);
        // Si réussi, on n'aura plus besoin d'afficher car Notification.permission sera 'granted'
      } else {
        // Si l'utilisateur refuse le modal système, Notification.permission passe à 'denied'
        setIsVisible(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          className="fixed bottom-0 md:bottom-6 left-0 right-0 md:left-auto md:right-6 md:max-w-md z-50 p-4"
        >
          <div className="bg-card rounded-3xl md:rounded-2xl shadow-2xl border border-border p-6 relative overflow-hidden flex flex-col">
            <button 
              onClick={handleDismiss}
              title="Fermer"
              className="absolute top-4 right-4 text-ink-muted hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div className="pr-4">
                <h3 className="font-black text-ink mb-1">Restez informé !</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Recevez les alertes de la Mairie (Marchés, État-civil, Urgences) directement sur votre téléphone.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleDismiss}
                disabled={isSubscribing}
                className="px-4 py-3 rounded-xl font-bold text-sm text-ink-muted bg-muted hover:bg-muted/80 transition-colors w-full"
              >
                Plus tard
              </button>
              <button 
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className={`px-4 py-3 rounded-xl font-black text-sm text-white uppercase tracking-widest transition-colors w-full shadow-lg ${isSubscribing ? 'bg-primary/50' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
              >
                {isSubscribing ? 'Connexion...' : "M'abonner"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PushNotificationPrompt;
