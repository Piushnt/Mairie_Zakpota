import React, { useState, useRef } from 'react';
import { Calculator, Download, Landmark, FileText, CheckCircle, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SimulateurFiscal = ({ settings = {} }: { settings?: any }) => {
  const [taxType, setTaxType] = useState<'TFU' | 'PATENTE'>('TFU');
  const [tfuType, setTfuType] = useState<'BATI' | 'NON_BATI'>('BATI');
  const [valeurLocative, setValeurLocative] = useState('');
  const [chiffreAffaires, setChiffreAffaires] = useState('');
  const [resultat, setResultat] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const receiptRef = useRef<HTMLDivElement>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (taxType === 'TFU') {
      const val = parseFloat(valeurLocative) || 0;
      const tfuRates = settings?.tfu_rates || { taux_bati: 6, taux_non_bati: 5 };
      const rate = tfuType === 'BATI' ? tfuRates.taux_bati : tfuRates.taux_non_bati;
      setResultat(val * (rate / 100));
    } else {
      const valLocProf = parseFloat(valeurLocative) || 0;
      const patenteRates = settings?.patente_rates || { droit_fixe_base: 10000, droit_proportionnel: 10 };
      const base = patenteRates.droit_fixe_base;
      const proportionnel = valLocProf * (patenteRates.droit_proportionnel / 100);
      setResultat(base + proportionnel);
    }
  };

  const exportPDF = async () => {
    if (!receiptRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Simulation_Fiscale_${taxType}_ZaKpota.pdf`);
    } catch (err) {
      console.error('Erreur lors de l\'export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const currentTfuRates = settings?.tfu_rates || { taux_bati: 6, taux_non_bati: 5 };
  const currentPatenteRates = settings?.patente_rates || { droit_fixe_base: 10000, droit_proportionnel: 10 };

  return (
    <main className="py-20 bg-surface min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Simulateur Fiscal Bénin-Pro - Mairie de Za-Kpota</title>
        <meta name="description" content="Simulateur officiel de taxes et impôts de la Mairie de Za-Kpota. Calculez votre TFU et Contribution des Patentes en ligne." />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-ink mb-6 uppercase tracking-tight">
            Simulateur Fiscal <span className="text-primary">Bénin-Pro</span>
          </h1>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto font-medium">
            Outil certifié conforme aux dispositions du Code Général des Impôts de la République du Bénin pour le calcul de vos obligations fiscales locales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de calcul */}
          <div className="bg-card rounded-3xl p-8 shadow-2xl shadow-primary/5 border border-border">
            <h2 className="text-2xl font-black text-ink mb-8 flex items-center gap-3">
              <Landmark className="w-6 h-6 text-primary" />
              Paramètres
            </h2>

            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-ink/50">Type d'impôt</label>
                <div className="flex bg-muted p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setTaxType('TFU'); setResultat(null); }}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${taxType === 'TFU' ? 'bg-card text-primary shadow-sm' : 'text-ink-muted hover:text-ink'}`}
                  >
                    TFU
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTaxType('PATENTE'); setResultat(null); }}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${taxType === 'PATENTE' ? 'bg-card text-primary shadow-sm' : 'text-ink-muted hover:text-ink'}`}
                  >
                    Patentes
                  </button>
                </div>
              </div>

              {taxType === 'TFU' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <label className="text-xs font-black uppercase tracking-widest text-ink/50">Type de Propriété</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTfuType('BATI')}
                      className={`p-4 rounded-xl border-2 transition-all ${tfuType === 'BATI' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-transparent text-ink hover:border-ink/20'}`}
                    >
                      <h4 className="font-bold mb-1">Bâti</h4>
                      <p className="text-xs opacity-70">Taux: {currentTfuRates.taux_bati}%</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTfuType('NON_BATI')}
                      className={`p-4 rounded-xl border-2 transition-all ${tfuType === 'NON_BATI' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-transparent text-ink hover:border-ink/20'}`}
                    >
                      <h4 className="font-bold mb-1">Non Bâti</h4>
                      <p className="text-xs opacity-70">Taux: {currentTfuRates.taux_non_bati}%</p>
                    </button>
                  </div>
                </div>
              )}

              {taxType === 'PATENTE' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-ink/50">Chiffre d'Affaires Estimé (FCFA)</label>
                    <input
                      type="number"
                      required
                      value={chiffreAffaires}
                      onChange={(e) => setChiffreAffaires(e.target.value)}
                      className="w-full bg-muted border-none rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/50 text-ink font-bold"
                      placeholder="Ex: 5000000"
                    />
                  </div>
                  <div className="p-4 bg-accent/5 rounded-xl flex gap-3 text-sm text-ink-muted">
                    <Info className="w-5 h-5 flex-shrink-0 text-accent" />
                    <p>Droit fixe de base applicable : <strong className="text-ink">{currentPatenteRates.droit_fixe_base.toLocaleString()} FCFA</strong></p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-ink/50">
                  {taxType === 'TFU' ? 'Valeur Locative Annuelle (FCFA)' : 'Valeur Locative Professionnelle (FCFA)'}
                </label>
                <input
                  type="number"
                  required
                  value={valeurLocative}
                  onChange={(e) => setValeurLocative(e.target.value)}
                  className="w-full bg-muted border-none rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/50 text-ink font-bold text-lg"
                  placeholder="Ex: 1200000"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-5 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                <Calculator className="w-5 h-5" />
                Lancer la Simulation
              </button>
            </form>
          </div>

          {/* Résultat et Export */}
          <div className="flex flex-col gap-6">
            <div 
              ref={receiptRef}
              className={`bg-white rounded-3xl p-8 shadow-2xl transition-all duration-500 ${resultat !== null ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}
            >
              {/* En-tête officiel pour PDF */}
              <div className="border-b-2 border-primary/20 pb-6 mb-6 text-center">
                <img src="/logo.jpg" alt="Logo" className="w-16 h-16 mx-auto mb-4 rounded-full" />
                <h3 className="font-black text-ink uppercase tracking-widest text-sm">République du Bénin</h3>
                <p className="text-xs text-ink/60 font-medium mt-1">Mairie de Za-Kpota - Service des Impôts Locaux</p>
                <h2 className="text-xl font-bold text-primary mt-4">Simulation {taxType === 'TFU' ? 'Taxe Foncière Unique' : 'Contribution des Patentes'}</h2>
              </div>

              <div className="space-y-6">
                {resultat !== null && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">Valeur Locative</span>
                      <span className="font-bold text-gray-900">{parseFloat(valeurLocative).toLocaleString()} FCFA</span>
                    </div>
                    {taxType === 'TFU' ? (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">Taux Appliqué ({tfuType === 'BATI' ? 'Bâti' : 'Non Bâti'})</span>
                        <span className="font-bold text-gray-900">{tfuType === 'BATI' ? currentTfuRates.taux_bati : currentTfuRates.taux_non_bati}%</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-500 text-sm">Droit Fixe</span>
                          <span className="font-bold text-gray-900">{currentPatenteRates.droit_fixe_base.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-500 text-sm">Proportionnel ({currentPatenteRates.droit_proportionnel}%)</span>
                          <span className="font-bold text-gray-900">{(parseFloat(valeurLocative) * (currentPatenteRates.droit_proportionnel / 100)).toLocaleString()} FCFA</span>
                        </div>
                      </>
                    )}
                    
                    <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Montant Estimé à Payer</p>
                      <p className="text-4xl font-black text-primary">{Math.round(resultat).toLocaleString()} <span className="text-xl">FCFA</span></p>
                    </div>

                    <p className="text-[10px] text-gray-400 text-center leading-relaxed mt-4 italic">
                      Attention: Ce document est une simulation à titre indicatif basée sur les données saisies et les barèmes actuels. Il ne constitue en aucun cas un avis d'imposition officiel.
                    </p>
                  </>
                )}
                {resultat === null && (
                  <div className="py-20 text-center flex flex-col items-center opacity-40">
                    <FileText className="w-12 h-12 text-ink-muted mb-4" />
                    <p className="font-medium text-ink">Saisissez vos données pour voir l'estimation</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={exportPDF}
              disabled={resultat === null || isExporting}
              className={`w-full px-8 py-5 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
                resultat === null 
                  ? 'bg-muted text-ink-muted cursor-not-allowed' 
                  : 'bg-ink text-white hover:bg-ink/90 shadow-xl shadow-ink/20'
              }`}
            >
              {isExporting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isExporting ? 'Génération...' : 'Télécharger le PDF Officiel'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SimulateurFiscal;
