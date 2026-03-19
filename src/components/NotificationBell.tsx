
import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBellProps {
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onViewAll: () => void;
}

const NotificationBell = ({ notifications, onMarkAsRead, onViewAll }: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-ink-muted hover:text-primary transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-ink">Notifications</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-ink-muted hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-ink-muted">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Aucune notification</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-border hover:bg-muted transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold ${!notification.read ? 'text-primary' : 'text-ink'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <button 
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-primary hover:text-primary/80"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted mb-2">
                        {notification.message}
                      </p>
                      <span className="text-[10px] text-ink-muted">
                        {new Date(notification.date).toLocaleDateString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 bg-muted text-center">
                  <button 
                    onClick={() => {
                      onViewAll();
                      setIsOpen(false);
                    }}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Voir toutes les alertes
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
