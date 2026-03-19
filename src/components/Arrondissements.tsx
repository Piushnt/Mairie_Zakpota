import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, Users, ChevronRight } from 'lucide-react';

interface Arrondissement {
  id: string;
  nom: string;
  ca: string;
  contact: string;
  localisation: string;
  quartiers: string[];
  image: string;
}

interface ArrondissementsProps {
  data: Arrondissement[];
}

const Arrondissements: React.FC<ArrondissementsProps> = ({ data }) => {
  return (
    <div className="py-12 bg-surface min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-ink mb-4">
            Annuaire des 8 Arrondissements
          </h1>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            Retrouvez les informations de contact et la composition de chaque zone administrative de la commune de Za-Kpota.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data.map((arr, index) => (
            <motion.div
              key={arr.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row"
            >
              {/* Image Section */}
              <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                <img 
                  src={arr.image} 
                  alt={arr.nom}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                <div className="absolute bottom-4 left-4 md:hidden">
                  <h2 className="text-2xl font-bold text-white">
                    {arr.nom}
                  </h2>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1">
                <div className="hidden md:flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-primary">
                    {arr.nom}
                  </h2>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-ink/40 mt-1" />
                    <div>
                      <p className="text-[10px] text-ink/60 uppercase tracking-wider font-bold">Chef d'Arrondissement</p>
                      <p className="text-sm text-ink font-medium">{arr.ca}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-ink/40 mt-1" />
                    <div>
                      <p className="text-[10px] text-ink/60 uppercase tracking-wider font-bold">Contact</p>
                      <p className="text-sm text-ink font-medium">{arr.contact}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:col-span-2">
                    <MapPin className="w-5 h-5 text-ink/40 mt-1" />
                    <div>
                      <p className="text-[10px] text-ink/60 uppercase tracking-wider font-bold">Localisation</p>
                      <p className="text-sm text-ink font-medium">{arr.localisation}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="w-4 h-4 text-primary" />
                    <h3 className="text-[10px] font-bold text-ink uppercase tracking-wider">
                      Quartiers ({arr.quartiers.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {arr.quartiers.map((q, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 bg-muted text-ink/70 text-[10px] rounded-md border border-border"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Arrondissements;
