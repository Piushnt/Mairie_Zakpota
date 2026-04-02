import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Info } from 'lucide-react';

const MunicipalAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'bot', text: "Bienvenue sur Za-Kpota GPT ! Je suis votre assistant municipal. Comment puis-je vous aider aujourd'hui ?" }
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

    // Simulation de l'IA (À lier à l'API Gemini en production)
    setTimeout(() => {
      let botResponse = "Je n'ai pas encore toutes les informations sur ce sujet. Je vous invite à contacter le secrétariat de la mairie au +229 97 00 00 00.";
      
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('naissance')) {
        botResponse = "Pour un acte de naissance à Za-Kpota, vous devez fournir la fiche de déclaration de l'hôpital et les pièces d'identité des parents. Le coût est de 500 FCFA.";
      } else if (lowerMsg.includes('marché')) {
        botResponse = "Le marché de Za-Kpota suit un cycle de 5 jours. Vous pouvez consulter le calendrier exact sur notre page 'Économie'.";
      } else if (lowerMsg.includes('maire')) {
        botResponse = "Le Maire actuel de Za-Kpota est engagé pour le développement de la commune. Vous pouvez prendre rendez-vous avec son secrétariat via l'onglet 'Services'.";
      } else if (lowerMsg.includes('dossier')) {
        botResponse = "Vous pouvez suivre l'avancement de vos dossiers en direct sur la page 'Services' grâce à votre code d'identifiant.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1500);
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
              initial={{ opacity: 0, y: 100, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, y: 100, scale: 0.8, x: 50 }}
              className="fixed bottom-8 right-8 z-[120] w-full max-w-[400px] h-[600px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-border dark:border-white/10"
            >
              {/* Header */}
              <div className="p-6 bg-primary text-white flex items-center justify-between relative overflow-hidden">
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
                    <div className={`max-w-[85%] flex space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
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

              {/* Info Banner */}
              <div className="px-6 py-2 bg-accent/5 flex items-center space-x-2">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">Propulsé par Gemini AI (Beta)</span>
              </div>

              {/* Input Area */}
              <form 
                onSubmit={handleSend}
                className="p-6 bg-white dark:bg-slate-900 border-t border-border dark:border-white/10"
              >
                <div className="relative flex items-center space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-1 bg-muted dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold transition-all dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-accent hover:text-primary transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
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
