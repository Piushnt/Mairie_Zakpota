import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, FileText, Send, ChevronRight, X, Loader2, Wand2 } from 'lucide-react';
import { askMunicipalAI } from '../lib/gemini';
import { supabase } from '../lib/supabase';

const AdminAI_Assistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  React.useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    const { data } = await supabase.from('reports').select('*').order('date', { ascending: false }).limit(3);
    if (data) setRecentReports(data);
  };

  const handleGenerateContent = async (type: 'news' | 'summary') => {
    if (!selectedReport && type === 'summary') return;
    
    setIsLoading(true);
    setResponse('');
    
    const prompt = type === 'news' 
      ? `Génère 3 idées de 'Flash News' percutantes basées sur l'actualité municipale de Za-Kpota pour les notifications push.`
      : `Résume en 5 points clés le rapport suivant : "${selectedReport.title}". Souligne les décisions importantes pour les citoyens.`;

    try {
      const res = await askMunicipalAI(prompt);
      setResponse(res);
    } catch (e) {
      setResponse("Erreur lors de la génération. Vérifiez votre clé API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await askMunicipalAI(query);
      setResponse(res);
    } catch (e) {
      setResponse("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  return (
    <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm flex flex-col h-[700px]">
      <div className="p-8 bg-primary/5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-ink uppercase tracking-tight">Assistant Décisionnel IA</h3>
            <p className="text-ink-muted text-xs font-medium">Za-Kpota Admin Intelligence</p>
          </div>
        </div>
        <Sparkles className="w-6 h-6 text-accent animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleGenerateContent('news')}
            className="p-6 bg-muted rounded-[2rem] border border-border hover:border-primary/30 transition-all text-left group"
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wand2 className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-black text-ink text-sm mb-1 uppercase tracking-tight">Générer Flash News</h4>
            <p className="text-[10px] text-ink-muted font-medium">Propose des notifications basées sur l'actu.</p>
          </button>

          <div className="p-6 bg-muted rounded-[2rem] border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-black text-ink text-sm mb-3 uppercase tracking-tight">Résumer un Rapport</h4>
            <select 
              className="w-full bg-card border border-border rounded-lg text-[10px] py-1 px-2 outline-none"
              title="Sélectionner un rapport à analyser"
              onChange={(e) => setSelectedReport(recentReports.find(r => r.id === e.target.value))}
            >
              <option value="">Choisir un rapport...</option>
              {recentReports.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
            {selectedReport && (
              <button 
                onClick={() => handleGenerateContent('summary')}
                className="mt-4 text-primary font-bold text-[10px] flex items-center uppercase"
              >
                Lancer l'analyse <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* AI Output Area */}
        <div className="relative">
          <div className={`min-h-[200px] p-8 bg-card rounded-[2rem] border-2 border-dashed border-border flex flex-col ${isLoading ? 'opacity-50' : ''}`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-card/40 rounded-[2rem]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            
            {response ? (
              <div className="prose prose-sm max-w-none text-ink font-medium leading-relaxed whitespace-pre-wrap">
                {response}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <Bot className="w-16 h-16 mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">En attente de vos instructions...</p>
              </div>
            )}
          </div>
          {response && (
             <button 
                onClick={() => setResponse('')}
                title="Effacer la réponse"
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
             >
                <X className="w-4 h-4 text-ink-muted" />
             </button>
          )}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-8 border-t border-border bg-muted/30">
        <div className="relative flex items-center space-x-4">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Posez une question spécifique sur les données..."
            className="flex-1 bg-card border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none shadow-sm transition-all"
          />
          <button 
            onClick={handleAsk}
            disabled={isLoading || !query.trim()}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAI_Assistant;
