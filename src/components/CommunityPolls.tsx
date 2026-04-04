import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, CheckCircle2, ListFilter, Calendar, BarChart3, HelpingHand, ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CommunityPolls = () => {
  const [sondages, setSondages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchSondages();
    const storedVotes = localStorage.getItem('zakpota_votes');
    if (storedVotes) setVotedIds(JSON.parse(storedVotes));
  }, []);

  const fetchSondages = async () => {
    const { data, error } = await supabase
      .from('sondages')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (!error && data) setSondages(data);
    setLoading(false);
  };

  const handleVote = async (sondageId: string, optionIndex: number) => {
    if (votedIds.includes(sondageId)) return;

    const sondage = sondages.find(s => s.id === sondageId);
    if (!sondage) return;

    const newOptions = [...sondage.options];
    newOptions[optionIndex].votes = (newOptions[optionIndex].votes || 0) + 1;

    const { error } = await supabase
      .from('sondages')
      .update({ options: newOptions })
      .eq('id', sondageId);

    if (!error) {
      const newVotedIds = [...votedIds, sondageId];
      setVotedIds(newVotedIds);
      localStorage.setItem('zakpota_votes', JSON.stringify(newVotedIds));
      
      // Update local state
      setSondages(prev => prev.map(s => s.id === sondageId ? { ...s, options: newOptions } : s));
    }
  };

  if (loading) return null;

  return (
    <section className="container mx-auto px-4 mt-24 mb-32 relative z-10">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Démocratie Participative</h4>
        <h2 className="text-3xl md:text-5xl font-black text-ink tracking-tight uppercase">Voix des Citoyens</h2>
        <div className="h-1.5 w-16 bg-accent mt-6 mx-auto rounded-full mb-6" />
        <p className="text-ink-muted text-lg font-medium leading-relaxed">
          Participez aux décisions de la commune. Votre avis compte pour l'orientation du budget et des projets locaux.
        </p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {sondages.map((poll) => {
            const hasVoted = votedIds.includes(poll.id);
            const totalVotes = poll.options.reduce((acc: number, curr: any) => acc + (curr.votes || 0), 0);

            return (
              <motion.div 
                key={poll.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card p-10 rounded-[24px] shadow-sm border border-border/50 hover:shadow-2xl hover:border-primary/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Vote className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Poll #{poll.id.slice(0,4)}</span>
                  </div>
                  {poll.end_date && (
                    <div className="flex items-center space-x-2 text-[9px] font-bold text-ink-muted uppercase">
                      <Calendar className="w-3 h-3" />
                      <span>Fin : {new Date(poll.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black text-ink uppercase tracking-tight mb-4 leading-tight relative z-10">{poll.titre}</h3>
                <p className="text-sm font-medium text-ink-muted mb-8 relative z-10">{poll.description}</p>

                <div className="space-y-4">
                  {poll.options.map((option: any, index: number) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes || 0) / totalVotes * 100) : 0;
                    
                    return (
                      <div key={index} className="relative">
                        <button
                          onClick={() => handleVote(poll.id, index)}
                          disabled={hasVoted}
                          className={`w-full relative z-10 flex items-center justify-between px-6 py-4 rounded-xl border transition-all text-left ${
                            hasVoted 
                              ? 'border-border/50 cursor-default' 
                              : 'border-border/50 hover:border-primary bg-muted/50 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <span className="text-xs font-black text-ink uppercase relative z-10">{option.label}</span>
                          </div>
                          {hasVoted && (
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-black text-primary">{percentage}%</span>
                              <BarChart3 className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </button>
                        
                        {hasVoted && (
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="absolute top-0 left-0 h-full bg-primary/5 dark:bg-primary/20 rounded-2xl z-0 transition-all border border-primary/10"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {hasVoted && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 flex items-center justify-center space-x-2 text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/5 py-3 rounded-xl border border-green-500/10"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Merci pour votre participation !</span>
                  </motion.div>
                )}
                
                {!hasVoted && (
                  <p className="mt-6 text-center text-[9px] font-black text-ink-muted uppercase tracking-widest relative z-10">
                    Cliquez sur une option pour voter anonymement
                  </p>
                )}
              </motion.div>
            );
          })}

          <div className="flex flex-col justify-center space-y-8">
            <div className="p-10 bg-primary text-white rounded-[24px] shadow-2xl border border-white/10 hover:shadow-primary/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-white/20 transition-colors pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                  <HelpingHand className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">Budget Participatif</h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed mb-6">
                  Chaque année, la Mairie alloue 5% du budget d'investissement aux projets choisis directement par vous. Proposez vos idées ou votez pour celles de vos voisins !
                </p>
                <button className="w-fit min-h-[44px] text-[10px] font-black uppercase tracking-widest text-accent flex items-center hover:text-white transition-colors relative z-10 outline-none">
                  S'impliquer <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="bg-card p-10 border border-border/50 rounded-[24px] shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Résultats Précédents</h4>
              <p className="text-ink-muted text-sm leading-relaxed font-medium">
                Dernier projet validé : **Éclairage Solaire de l'Arrondissement de Za-Tanta** (64% des votes). Travaux prévus pour Juin 2024.
              </p>
            </div>
          </div>
        </div>
    </section>
  );
};

export default CommunityPolls;
