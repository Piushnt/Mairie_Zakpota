import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight, X, Info, ArrowRight } from 'lucide-react';

import { getOptimizedNetworkUrl } from '../utils/imageParser';

export default function PageAgenda({ agenda }: { agenda: any }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const prev = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else if (view === 'day') {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
    }
  };

  const next = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else if (view === 'day') {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const getEventsForDay = (day: number, m: number = month, y: number = year) => {
    return agenda.filter((event: any) => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && eventDate.getMonth() === m && eventDate.getFullYear() === y;
    });
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  return (
    <main className="bg-surface transition-colors duration-300 min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
            <div>
              <h1 className="text-5xl font-black text-primary mb-4">Agenda Municipal</h1>
              <p className="text-ink-muted text-lg">Ne manquez aucun événement de la vie citoyenne à Za-Kpota.</p>
            </div>
            <div className="flex flex-wrap items-center bg-card p-2 rounded-2xl shadow-sm border border-border">
              {(['month', 'week', 'day', 'list'] as const).map((v) => (
                <button 
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all capitalize ${view === v ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-ink-muted hover:text-primary'}`}
                >
                  {v === 'month' ? 'Mois' : v === 'week' ? 'Semaine' : v === 'day' ? 'Jour' : 'Liste'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-[2.5rem] shadow-2xl border border-border overflow-hidden">
            <div className="p-8 border-b border-border flex items-center justify-between bg-primary/5">
              <h2 className="text-2xl font-black text-primary">
                {view === 'month' && `${monthNames[month]} ${year}`}
                {view === 'week' && `Semaine du ${getWeekDays()[0].getDate()} ${monthNames[getWeekDays()[0].getMonth()]}`}
                {view === 'day' && `${currentDate.getDate()} ${monthNames[month]} ${year}`}
                {view === 'list' && 'Tous les événements'}
              </h2>
              {view !== 'list' && (
                <div className="flex space-x-4">
                  <button onClick={prev} title="Précédent" className="p-3 bg-surface rounded-xl border border-border hover:text-primary transition-all shadow-sm">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={() => setCurrentDate(new Date())} className="px-6 py-3 bg-surface rounded-xl border border-border hover:text-primary transition-all shadow-sm font-bold text-sm">
                    Aujourd'hui
                  </button>
                  <button onClick={next} title="Suivant" className="p-3 bg-surface rounded-xl border border-border hover:text-primary transition-all shadow-sm">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {view === 'month' && (
              <>
                <div className="grid grid-cols-7 border-b border-border">
                  {dayNames.map(day => (
                    <div key={day} className="py-4 text-center text-xs font-black uppercase tracking-widest text-ink-muted border-r border-border last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {[...Array(startDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="h-32 md:h-48 bg-muted/50 border-r border-b border-border last:border-r-0"></div>
                  ))}
                  {[...Array(totalDays)].map((_, i) => {
                    const day = i + 1;
                    const dayEvents = getEventsForDay(day);
                    const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                    return (
                      <div key={day} className={`h-32 md:h-48 p-4 border-r border-b border-border last:border-r-0 relative group hover:bg-primary/5 transition-colors ${isToday ? 'bg-primary/5' : ''}`}>
                        <span className={`text-lg font-black ${isToday ? 'text-primary' : 'text-ink-muted/30'}`}>
                          {day}
                        </span>
                        <div className="mt-2 space-y-1 overflow-y-auto max-h-[calc(100%-2rem)] no-scrollbar">
                          {dayEvents.map(event => (
                            <div 
                              key={event.id} 
                              onClick={() => setSelectedEvent(event)}
                              className="bg-primary text-white text-[10px] md:text-xs p-2 rounded-lg font-bold truncate shadow-sm cursor-pointer hover:scale-105 transition-transform"
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {view === 'week' && (
              <div className="grid grid-cols-7">
                {getWeekDays().map((date, i) => {
                  const dayEvents = getEventsForDay(date.getDate(), date.getMonth(), date.getFullYear());
                  const isToday = new Date().toDateString() === date.toDateString();
                  return (
                    <div key={i} className={`min-h-[500px] p-6 border-r border-border last:border-r-0 ${isToday ? 'bg-primary/5' : ''}`}>
                      <div className="text-center mb-8">
                        <div className="text-xs font-black uppercase tracking-widest text-ink-muted mb-2">{dayNames[date.getDay()]}</div>
                        <div className={`text-3xl font-black ${isToday ? 'text-primary' : 'text-ink'}`}>{date.getDate()}</div>
                      </div>
                      <div className="space-y-4">
                        {dayEvents.map(event => (
                          <div 
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="bg-card p-4 rounded-2xl shadow-sm border border-border cursor-pointer hover:shadow-md transition-all group"
                          >
                            <div className="text-xs font-bold text-primary mb-2">{event.location}</div>
                            <div className="text-sm font-black text-ink group-hover:text-primary transition-colors">{event.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {view === 'day' && (
              <div className="p-12">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-primary text-white rounded-3xl flex flex-col items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-3xl font-black">{currentDate.getDate()}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{monthNames[month].slice(0, 3)}</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-ink">{dayNames[currentDate.getDay()]}</h3>
                        <p className="text-ink-muted font-bold">{monthNames[month]} {year}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-primary">{getEventsForDay(currentDate.getDate()).length}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">Événements</div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {getEventsForDay(currentDate.getDate()).map(event => (
                      <div 
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="bg-muted p-8 rounded-3xl border border-border flex items-center justify-between group cursor-pointer hover:bg-primary/5 transition-all"
                      >
                        <div>
                          <div className="flex items-center text-accent font-bold text-xs mb-2 uppercase tracking-widest">
                            <MapPin className="w-4 h-4 mr-2" /> {event.location}
                          </div>
                          <h4 className="text-2xl font-bold text-ink group-hover:text-primary transition-colors">{event.title}</h4>
                        </div>
                        <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-2 transition-transform" />
                      </div>
                    ))}
                    {getEventsForDay(currentDate.getDate()).length === 0 && (
                      <div className="text-center py-20 bg-muted rounded-3xl border border-dashed border-border">
                        <Calendar className="w-12 h-12 text-ink-muted/30 mx-auto mb-4" />
                        <p className="text-ink-muted font-bold">Aucun événement prévu pour ce jour.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {view === 'list' && (
              <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                {agenda.map((event: any) => (
                  <div 
                    key={event.id} 
                    onClick={() => setSelectedEvent(event)}
                    className="bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-border cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={getOptimizedNetworkUrl(event.img, 800)} 
                        alt={event.title} 
                        width={800}
                        height={450}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 left-6 bg-card/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
                        <div className="text-primary font-black text-xl leading-none">{event.date.split(' ')[0]}</div>
                        <div className="text-ink-muted text-[10px] font-bold uppercase tracking-widest">{event.date.split(' ')[1]}</div>
                      </div>
                    </div>
                    <div className="p-10">
                      <div className="flex items-center text-accent font-bold text-xs mb-4 uppercase tracking-widest">
                        <Calendar className="w-4 h-4 mr-2" /> {event.date}
                      </div>
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors text-ink">{event.title}</h3>
                      <p className="text-ink-muted mb-8 leading-relaxed line-clamp-2">{event.description}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-border">
                        <div className="flex items-center text-ink-muted text-sm font-medium">
                          <MapPin className="w-4 h-4 mr-2 text-primary" /> {event.location}
                        </div>
                        <button className="text-primary font-bold text-sm flex items-center group/btn">
                          Détails <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedEvent(null)}
                title="Fermer"
                className="absolute top-6 right-6 z-20 p-3 bg-card/90 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <X className="w-6 h-6 text-primary" />
              </button>
              
              <div className="relative h-80">
                <img 
                  src={getOptimizedNetworkUrl(selectedEvent.img, 1200)} 
                  alt={selectedEvent.title} 
                  width={1200}
                  height={400}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex items-center text-accent font-bold text-xs mb-4 uppercase tracking-widest">
                    <Calendar className="w-4 h-4 mr-2" /> {selectedEvent.date}
                  </div>
                  <h2 className="text-4xl font-black text-white">{selectedEvent.title}</h2>
                </div>
              </div>
              
              <div className="p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="bg-muted p-6 rounded-2xl">
                    <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">Lieu</div>
                    <div className="flex items-center text-ink font-bold">
                      <MapPin className="w-4 h-4 mr-2 text-primary" /> {selectedEvent.location}
                    </div>
                  </div>
                  <div className="bg-muted p-6 rounded-2xl">
                    <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">Date</div>
                    <div className="flex items-center text-ink font-bold">
                      <Calendar className="w-4 h-4 mr-2 text-primary" /> {selectedEvent.date}
                    </div>
                  </div>
                  <div className="bg-muted p-6 rounded-2xl">
                    <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">Catégorie</div>
                    <div className="flex items-center text-ink font-bold">
                      <Info className="w-4 h-4 mr-2 text-primary" /> Municipal
                    </div>
                  </div>
                </div>
                
                <p className="text-xl text-ink-muted leading-relaxed mb-10">
                  {selectedEvent.description}
                </p>
                
                <div className="flex gap-4">
                  <button className="flex-1 bg-primary text-white font-black py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-sm">
                    Ajouter au calendrier
                  </button>
                  <button className="px-8 py-5 bg-muted text-ink font-bold rounded-2xl hover:bg-muted/80 transition-all">
                    Partager
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
