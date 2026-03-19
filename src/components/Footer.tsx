import React from 'react';
import { 
  Facebook, Twitter, Instagram, Youtube, 
  MapPin, Phone, Mail, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = ({ ADRESSE_MAIRIE, TEL_CONTACT, EMAIL_CONTACT, NOM_VILLE }: any) => (
  <footer className="bg-[#0F172A] text-white pt-24 pb-12 transition-colors duration-300">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-xl">
              <img
                src="/src/img/logo-mairie.jpg"
                alt="Logo Mairie"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter leading-none">
              Mairie de <br /> {NOM_VILLE}
            </h2>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
            Portail officiel de la mairie de Za-Kpota. <br />
            Bâtir ensemble une commune prospère et solidaire.
          </p>
          <div className="flex space-x-4">
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href="#" title="Facebook" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary transition-all"><Facebook className="w-5 h-5 text-white/70" /></motion.a>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href="#" title="Twitter" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary transition-all"><Twitter className="w-5 h-5 text-white/70" /></motion.a>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href="#" title="Instagram" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary transition-all"><Instagram className="w-5 h-5 text-white/70" /></motion.a>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href="#" title="Youtube" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary transition-all"><Youtube className="w-5 h-5 text-white/70" /></motion.a>
          </div>
        </div>

        <div>
          <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-8">La Mairie</h3>
          <ul className="space-y-4 text-xs font-bold text-white/40">
            <li><Link to="/maire" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Le Maire</Link></li>
            <li><Link to="/conseil" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Le Conseil Municipal</Link></li>
            <li><Link to="/arrondissements" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Les Arrondissements</Link></li>
            <li><Link to="/histoire" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Histoire & Patrimoine</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-8">Services</h3>
          <ul className="space-y-4 text-xs font-bold text-white/40">
            <li><Link to="/services/etat-civil" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> État Civil</Link></li>
            <li><Link to="/services/urbanisme" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Urbanisme</Link></li>
            <li><Link to="/simulateur" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Simulateur Fiscal</Link></li>
            <li><Link to="/signalement" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Signalement</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-8">Infos Pratiques</h3>
          <ul className="space-y-4 text-xs font-bold text-white/40">
            <li><Link to="/actualites" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Actualités</Link></li>
            <li><Link to="/agenda" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Agenda</Link></li>
            <li><Link to="/tourisme" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Tourisme</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors flex items-center group"><ChevronRight className="w-3 h-3 mr-2 text-accent group-hover:translate-x-1 transition-transform" /> Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-8">Contact</h3>
          <ul className="space-y-6 text-xs font-bold text-white/40">
            <li className="flex items-start"><MapPin className="w-4 h-4 mr-3 text-accent shrink-0" /> <span className="leading-relaxed">{ADRESSE_MAIRIE}</span></li>
            <li className="flex items-center"><Phone className="w-4 h-4 mr-3 text-accent shrink-0" /> {TEL_CONTACT}</li>
            <li className="flex items-center"><Mail className="w-4 h-4 mr-3 text-accent shrink-0" /> {EMAIL_CONTACT}</li>
          </ul>
        </div>
      </div>

      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20 gap-6 text-center md:text-left">
        <p>© 2026 Mairie de {NOM_VILLE}. Réalisé pour le développement local.</p>
        <div className="flex space-x-8">
          <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
          <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-white transition-colors">Plan du site</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
