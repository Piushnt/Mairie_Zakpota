import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing } from 'lucide-react';
import { checkSubscriptionStatus, subscribeToPushNotifications } from '../lib/pushNotifications';

const FloatingPushSubscribe = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const verifyStatus = async () => {
    const isSubscribed = await checkSubscriptionStatus();
    setShouldShow(!isSubscribed);
  };

  useEffect(() => {
    // Premier check au montage
    verifyStatus();

    // Re-vérifier quand l'onglet redevient actif (si l'utilisateur a accepté ailleurs par ex)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        verifyStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    const success = await subscribeToPushNotifications();
    if (success) {
      setShouldShow(false);
    }
    setIsSubscribing(false);
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ x: -100, opacity: 0, scale: 0.5 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -100, opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            title="S'abonner aux alertes"
            className="group relative flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:bg-accent transition-all duration-300"
          >
            {/* Ping animation when not subscribed */}
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:hidden" />
            
            {isSubscribing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <BellRing className="w-6 h-6 animate-pulse" />
            )}

            {/* Label on hover */}
            <div className="absolute left-16 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              S'abonner aux alertes
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingPushSubscribe;
