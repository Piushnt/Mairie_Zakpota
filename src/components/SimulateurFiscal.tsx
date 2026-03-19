import React from 'react';
import { Calculator } from 'lucide-react';

const SimulateurFiscal = () => (
  <main className="py-20 bg-surface min-h-[60vh]">
    <div className="container mx-auto px-4 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <Calculator className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-4xl font-black text-ink mb-6 uppercase tracking-tight">Simulateur Fiscal</h2>
      <p className="text-ink-muted text-lg max-w-2xl mx-auto font-medium">
        Cet outil vous permettra bientôt de simuler vos taxes de voirie, contributions foncières et autres taxes locales en quelques clics.
      </p>
      <div className="mt-12 p-8 bg-card border border-border rounded-3xl inline-block">
        <p className="text-xs font-black uppercase tracking-widest text-primary/40">Statut : En cours de développement</p>
      </div>
    </div>
  </main>
);

export default SimulateurFiscal;
