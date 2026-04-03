import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Info } from 'lucide-react';
import { askMunicipalAI } from '../lib/gemini';

const MunicipalAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'bot', text: "Bienvenue sur Za-Kpota GPT ! Je suis votre assistant municipal officiel. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      // Real Gemini AI call with history
      const response = await askMunicipalAI(userMsg, messages);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Une erreur est survenue lors de la communication avec l'assistant. Veuillez réessayer plus tard ou contacter le secrétariat." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare className="w-8 h-8 relative z-10" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110]"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed inset-0 sm:inset-auto sm:bottom-8 sm:right-8 z-[120] w-full sm:max-w-[400px] sm:h-[600px] h-full bg-white dark:bg-slate-900 sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-border dark:border-white/10"
            >
              {/* Header */}
              <div className="p-6 bg-primary text-white flex items-center justify-between relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-2xl" />
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight leading-none mb-1">Za-Kpota GPT</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">En ligne</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all relative z-10"
                  title="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/10"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] sm:max-w-[85%] flex space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                        msg.role === 'user' ? 'bg-primary text-white' : 'bg-muted dark:bg-slate-800 text-primary'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
                          : 'bg-muted dark:bg-slate-800 text-ink dark:text-white/80 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions Section - Mobile Scrollable */}
              <div className="px-6 py-4 bg-muted/50 dark:bg-slate-900/50 border-t border-border dark:border-white/5 scrollbar-none overflow-x-auto shrink-0">
                <div className="flex space-x-3 min-w-max pb-1">
                  {[
                    "📜 Acte de naissance ?",
                    "🛒 Cycle du marché ?",
                    "🏛️ Qui est le maire ?",
                    "📅 Info stade ?"
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-border dark:border-white/10 rounded-full text-[10px] font-bold text-ink dark:text-white/60 whitespace-nowrap hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Banner */}
              <div className="px-6 py-2 bg-accent/5 flex items-center space-x-2 shrink-0">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">Propulsé par Gemini AI (Beta)</span>
              </div>

              {/* Input Area */}
              <form 
                onSubmit={handleSend}
                className="p-6 bg-white dark:bg-slate-900 border-t border-border dark:border-white/10 shrink-0"
              >
                <div className="relative flex items-center space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-1 bg-muted dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold transition-all dark:text-white"
                    title="Votre question"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                    title="Envoyer"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MunicipalAI;
