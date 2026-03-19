import { useParams } from 'react-router-dom';
import { ExternalLink, FileText, Clock, CreditCard, ChevronRight } from 'lucide-react';

interface PageServiceProps {
  services: any;
}

const PageService = ({ services }: PageServiceProps) => {
  const { type } = useParams<{ type: 'etat-civil' | 'urbanisme' }>();
  const currentType = type || 'etat-civil';
  
  const data = services[currentType];
  const title = currentType === 'etat-civil' ? 'État Civil' : 'Urbanisme & Foncier';
  const subtitle = currentType === 'etat-civil' 
    ? "Bénéficiez de démarches simplifiées pour vos actes officiels." 
    : "Gérez vos projets de construction et vos titres de propriété.";

  return (
    <main className="pt-12 pb-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Services Publics</h4>
          <h2 className="text-5xl font-black text-ink tracking-tight mb-8">{title}</h2>
          <p className="text-ink-muted text-lg font-medium leading-relaxed">
            {subtitle}
          </p>
          <div className="h-1.5 w-16 bg-accent mx-auto mt-10 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-12">
          {data.map((service, i) => (
            <div key={service.id} className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm group hover:border-primary/30 transition-all flex flex-col md:flex-row">
              <div className="p-10 md:p-12 md:w-2/3">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-ink tracking-tight uppercase">{service.name}</h3>
                </div>
                <p className="text-ink-muted text-lg font-medium leading-relaxed mb-10">
                  {service.description}
                </p>
                
                <div className="space-y-4 mb-10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/40">Pièces à fournir :</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.pieces.map((piece, idx) => (
                      <span key={idx} className="px-4 py-2 bg-muted rounded-xl text-xs font-bold text-ink-muted border border-border/50">
                        {piece}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-8 items-center border-t border-border pt-8">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-ink/30">Coût</p>
                      <p className="font-black text-ink text-sm">{service.cost} FCFA</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-ink/30">Délai</p>
                      <p className="font-black text-ink text-sm">{service.delay}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 md:p-12 md:w-1/3 bg-muted flex flex-col justify-center items-center text-center border-t md:border-t-0 md:border-l border-border">
                {service.link ? (
                  <>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Service Digitalisé</p>
                    <a 
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-accent transition-all shadow-xl shadow-primary/20 flex items-center justify-center space-x-3 group"
                    >
                      <span>Faire la demande</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-black text-ink-muted uppercase tracking-[0.2em] mb-6">Présence physique requise</p>
                    <button className="w-full py-5 bg-card border border-border text-ink font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-muted transition-all flex items-center justify-center space-x-3">
                      <span>Prise de RDV</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                <p className="mt-8 text-[10px] font-bold text-ink/40 leading-relaxed italic">
                  * Les tarifs peuvent être mis à jour selon la loi de finances en vigueur.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PageService;
