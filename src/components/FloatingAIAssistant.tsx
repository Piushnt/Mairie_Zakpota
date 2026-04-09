import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Paperclip, Mic, ArrowRight } from 'lucide-react';
import { askMunicipalAI } from '../lib/gemini';
import { getOrCreateAISession, saveAIMessage, fetchAISessionHistory } from '../utils/aiSupport';
import { useTenant } from '../lib/TenantContext';

const FloatingAIAssistant = () => {
  const { currentTenant, isFeatureEnabled } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const loadHistory = async () => {
    const sessionId = await getOrCreateAISession(currentTenant?.id || '');
    const history = await fetchAISessionHistory(sessionId);
    if (history.length > 0) {
      setChatHistory(history);
    } else {
      const tenantName = currentTenant?.name || 'votre mairie';
      setChatHistory([{ role: 'bot', text: `Bonjour ! Je suis l'assistant municipal de ${tenantName}. Comment puis-je vous aider aujourd'hui ?` }]);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const sessionId = await getOrCreateAISession(currentTenant?.id || '');
      await saveAIMessage(sessionId, 'user', userMsg, currentTenant?.id || '');

      const response = await askMunicipalAI(userMsg, chatHistory);
      
      setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
      await saveAIMessage(sessionId, 'model', response, currentTenant?.id || '');
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'bot', text: "Désolé, je rencontre un problème de connexion. Veuillez réessayer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Tarifs du stade ?",
    "Acte de naissance ?",
    "Date du marché ?",
    "Contacter la mairie"
  ];

  // Si le module ia_assistant est désactivé pour cette mairie, on ne rend rien
  if (!isFeatureEnabled('ia_assistant')) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-card rounded-[2.5rem] shadow-2xl border border-border flex flex-col overflow-hidden backdrop-blur-xl bg-card/95"
          >
            {/* Header */}
            <div className="p-6 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">{currentTenant?.name || 'Mairie'} GPT</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold opacity-70">Assistant Municipal Officiel</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                title="Fermer l'assistant"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
              {chatHistory.map((chat, i) => (
                <div 
                  key={i} 
                  className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    chat.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-muted text-ink rounded-tl-none border border-border'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-4 rounded-2xl rounded-tl-none border border-border flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {chatHistory.length <= 1 && (
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                {suggestions.map(s => (
                  <button 
                    key={s}
                    onClick={() => setMessage(s)}
                    className="px-3 py-1.5 bg-muted hover:bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20 transition-all transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 sm:p-6 border-t border-border bg-muted/30">
              <div className="relative flex items-center gap-2 sm:gap-3">
                <button className="p-2 text-ink/40 hover:text-primary transition-colors" title="Joindre un fichier">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Posez votre question..."
                  className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all font-medium"
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  title="Envoyer le message"
                  className="p-2.5 sm:p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-accent hover:text-primary transition-all disabled:opacity-50 disabled:grayscale shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-ink/30 mt-4 font-medium flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Propulsé par Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Fermer le chat" : "Ouvrir l'assistant municipal"}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-accent text-primary' : 'bg-primary text-white'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-accent rounded-full border-4 border-surface animate-bounce" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingAIAssistant;
