
import React, { useState, useEffect, useCallback } from 'react';
import { LabPanel } from '../components/LabPanel';
import { 
  BookOpen, Tag, Loader2, Info, Plus, X, 
  Sparkles, AlignLeft, BarChart2, MessageSquareQuote, CheckCircle2,
  Ticket
} from 'lucide-react';
import { cn } from '../utils';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip 
} from 'recharts';

const NLP_CODE = `import { pipeline } from '@xenova/transformers';

/**
 * Motor Zero-Shot: Entiende conceptos sin ejemplos previos.
 * Compara el 'vector semántico' del texto con las etiquetas.
 */
export const classify = async (text, labels) => {
  const model = await pipeline('zero-shot-classification', 'Xenova/mobilebert');
  return await model(text, labels);
};`;

const INITIAL_LABELS = ["Comida", "Transporte", "Suscripciones", "Salud"];
const MOCK_TICKETS = [
  "UBER * TRIP 88472 SAN FRANCISCO",
  "WHOLEFOODS MARKET - ORGANIC PURCHASE",
  "NETFLIX PREMIUM FAMILY PLAN",
  "PHARMACY CVS - MEDICINE",
  "TESLA SUPERCHARGER - ENERGY",
  "APPLE.COM/BILL - ICLOUD STORAGE"
];

export const Ep4Page: React.FC = () => {
  const [text, setText] = useState(MOCK_TICKETS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [labels, setLabels] = useState(INITIAL_LABELS);
  const [newLabel, setNewLabel] = useState("");
  const [scores, setScores] = useState<{name: string, value: number}[]>([]);

  const handleAddLabel = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newLabel.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels(prev => [...prev, trimmed]);
      setNewLabel("");
    }
  };

  const removeLabel = (l: string) => {
    setLabels(prev => prev.filter(label => label !== l));
    setScores(prev => prev.filter(s => s.name !== l));
  };

  const analyze = async () => {
    if (labels.length === 0) return;
    setIsAnalyzing(true);
    
    // Simulación del procesamiento del Transformer
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const lowerText = text.toLowerCase();
    
    const result = labels.map(l => {
      let boost = 0;
      const lowerL = l.toLowerCase();
      
      // Lógica de "Entendimiento" Simulado para el demo
      if (lowerText.includes("uber") && (lowerL.includes("transp") || lowerL.includes("viaje"))) boost = 0.8;
      if (lowerText.includes("foods") && (lowerL.includes("comid") || lowerL.includes("super"))) boost = 0.75;
      if (lowerText.includes("netflix") && (lowerL.includes("suscr") || lowerL.includes("ocio"))) boost = 0.9;
      if (lowerText.includes("tesla") && (lowerL.includes("energ") || lowerL.includes("transp") || lowerL.includes("lujo"))) boost = 0.7;
      if (lowerText.includes("apple") && (lowerL.includes("tecn") || lowerL.includes("suscr"))) boost = 0.6;
      
      return {
        name: l,
        value: Math.min(0.99, (Math.random() * 0.2) + boost)
      };
    });
    
    setScores(result.sort((a, b) => b.value - a.value));
    setIsAnalyzing(false);
  };

  const bestMatch = scores[0];

  return (
    <LabPanel
      title="Ep 4: El Lector (Zero-Shot NLP)"
      description="Experimenta con el procesamiento de lenguaje natural. Define tus propias categorías y mira cómo la IA 'lee' y clasifica gastos bancarios sin entrenamiento previo."
      codeSnippet={NLP_CODE}
    >
      <div className="space-y-8">
        {/* Ticket Scanner UI */}
        <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Ticket size={12} className="text-emerald-500" />
                Digital Receipt Scanner
              </span>
              <div className="flex gap-1.5">
                {MOCK_TICKETS.map((t, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setText(t); setScores([]); }}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all duration-300",
                      text === t ? "bg-emerald-500 scale-125" : "bg-slate-800 hover:bg-slate-700"
                    )}
                    title={t}
                  />
                ))}
              </div>
            </div>

            <div className="relative group">
              <input 
                type="text"
                value={text}
                onChange={(e) => { setText(e.target.value); setScores([]); }}
                className="w-full bg-transparent border-none text-2xl font-mono font-bold text-white focus:ring-0 p-0 placeholder:text-slate-800"
                placeholder="Escribe una descripción de gasto..."
              />
              <div className="absolute -bottom-2 left-0 w-full h-px bg-slate-800 group-focus-within:bg-emerald-500/50 transition-colors" />
            </div>

            {/* Tags Manager */}
            <div className="flex flex-wrap gap-2 pt-2">
              {labels.map(l => (
                <div key={l} className="animate-in zoom-in-95 duration-300 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-300 transition-colors group/tag">
                  {l}
                  <button 
                    type="button"
                    onClick={() => removeLabel(l)} 
                    className="text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    <X size={12}/>
                  </button>
                </div>
              ))}
              
              <form onSubmit={handleAddLabel} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl focus-within:border-emerald-500/50 transition-all">
                <input 
                  type="text" 
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Nueva etiqueta..."
                  className="bg-transparent border-none p-0 text-[10px] font-bold text-emerald-500 focus:ring-0 w-24 placeholder:text-emerald-500/40"
                />
                <button 
                  type="submit"
                  className="text-emerald-500 hover:scale-125 transition-transform"
                  disabled={!newLabel.trim()}
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <button 
          onClick={analyze}
          disabled={isAnalyzing || !text || labels.length === 0}
          className="w-full group bg-emerald-500 text-slate-950 font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/10 disabled:opacity-30"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>DESCODIFICANDO CONTEXTO...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              <span>ANALIZAR SEMÁNTICA</span>
            </>
          )}
        </button>

        {/* Results Section */}
        {scores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BarChart2 size={14} className="text-blue-500" />
                Semantic Confidence
              </h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scores} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide domain={[0, 1]} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={100} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                      {scores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#1e293b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-emerald-500 p-8 rounded-[2rem] flex flex-col justify-center items-center text-slate-950 text-center relative overflow-hidden shadow-2xl shadow-emerald-500/20">
               <div className="absolute -bottom-8 -right-8 opacity-10 rotate-12">
                  <MessageSquareQuote size={160} />
               </div>
               <div className="w-16 h-16 bg-slate-950/10 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 size={32} />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">IA Decision</p>
               <h3 className="text-5xl font-black tracking-tighter mb-3 leading-none">{bestMatch.name}</h3>
               <div className="bg-slate-950/10 px-4 py-1.5 rounded-full text-xs font-bold">
                 Confianza: {(bestMatch.value * 100).toFixed(1)}%
               </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-[2rem]">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Info size={24} className="text-blue-500" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-black text-white uppercase tracking-widest">IA Sin Fronteras</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Lo que acabas de hacer es "Zero-Shot Learning". Al añadir una nueva etiqueta, no tuviste que entrenar a la IA con ejemplos de esa categoría. El modelo simplemente utiliza su <strong>comprensión global del lenguaje</strong> para encontrar la relación más lógica.
            </p>
          </div>
        </div>
      </div>
    </LabPanel>
  );
};
