
import React, { useState, useMemo, useEffect } from 'react';
import { LabPanel } from '../components/LabPanel';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  Eye, History, Info, Layers, RefreshCcw, TrendingDown, TrendingUp, 
  BrainCircuit, Zap, Workflow, Timer, Sparkles
} from 'lucide-react';
import { cn } from '../utils';

const LSTM_CODE = `import * as tf from '@tensorflow/tfjs';

/**
 * Oráculo Financiero v5.0 (LSTM)
 * Memoria a largo plazo para detectar ciclos y tendencias.
 */
export const buildOracle = () => {
  const model = tf.sequential();
  
  // Puertas de Olvido y Entrada: Deciden qué recordar del historial
  model.add(tf.layers.lstm({ 
    units: 128, 
    inputShape: [6, 1],
    returnSequences: false 
  }));
  
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  return model;
};`;

const SCENARIOS = {
  estable: [4000, 4100, 3950, 4050, 4200, 4150],
  crisis: [5000, 4800, 4200, 3500, 2800, 2100],
  crecimiento: [2000, 2500, 3100, 3800, 4600, 5500],
  ciclico: [3000, 4500, 3000, 4500, 3000, 4500]
};

export const Ep5Page: React.FC = () => {
  const [history, setHistory] = useState(SCENARIOS.crecimiento);
  const [isPredicting, setIsPredicting] = useState(false);
  const [forecast, setForecast] = useState<{val: number, upper: number, lower: number}[]>([]);
  const [memoryIndex, setMemoryIndex] = useState(-1);

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const chartData = useMemo(() => {
    const base = history.map((balance, i) => ({
      month: months[i],
      balance,
      type: 'Historial',
      upper: balance,
      lower: balance
    }));

    if (forecast.length > 0) {
      return [
        ...base,
        ...forecast.map((f, i) => ({
          month: months[history.length + i],
          balance: f.val,
          type: 'Predicción IA',
          upper: f.upper,
          lower: f.lower
        }))
      ];
    }
    return base;
  }, [history, forecast]);

  const handleForecast = async () => {
    setIsPredicting(true);
    setForecast([]);
    
    // Simulación visual de "paso de ventana"
    for(let i=0; i<6; i++) {
      setMemoryIndex(i);
      await new Promise(r => setTimeout(r, 250));
    }
    
    const last = history[history.length - 1];
    const trend = last - history[0];
    const step = trend / history.length;
    const isCrisis = trend < 0;

    const newForecast = Array.from({ length: 4 }, (_, i) => {
      const val = last + (step * (i + 1)) + (Math.random() - 0.5) * 500;
      // En crisis la incertidumbre es mayor
      const uncertaintyFactor = isCrisis ? 500 : 300;
      const uncertainty = (i + 1) * uncertaintyFactor;
      return {
        val: Math.max(0, Math.round(val)),
        upper: Math.max(0, Math.round(val + uncertainty)),
        lower: Math.max(0, Math.round(val - uncertainty))
      };
    });
    
    setForecast(newForecast);
    setIsPredicting(false);
    setMemoryIndex(-1);
  };

  const setScenario = (s: keyof typeof SCENARIOS) => {
    setHistory(SCENARIOS[s]);
    setForecast([]);
    setMemoryIndex(-1);
  };

  return (
    <LabPanel
      title="Ep 5: El Oráculo (LSTM Memoria)"
      description="El gran final. Las redes LSTM no solo ven números, ven el tiempo. Descubre cómo la IA decide qué datos del pasado 'olvidar' y qué patrones cíclicos mantener para predecir tu futuro financiero."
      codeSnippet={LSTM_CODE}
    >
      <div className="space-y-8">
        {/* Main Oracle Display */}
        <div className="bg-slate-950 p-8 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5">
                <BrainCircuit size={28} />
              </div>
              <div>
                <h3 className="font-black text-slate-100 text-xl tracking-tight">Cerebro Predictivo</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Sincronización LSTM</span>
                  <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" style={{animationDelay: `${i*200}ms`}} />)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-sm">
              {Object.keys(SCENARIOS).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s as any)}
                  className={cn(
                    "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    history === SCENARIOS[s as keyof typeof SCENARIOS] ? "bg-slate-800 text-emerald-400 shadow-xl border border-slate-700" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncert" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.2} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '12px' }}
                />
                
                <Area 
                  type="monotone" 
                  dataKey="upper" 
                  stroke="none" 
                  fill="url(#colorIncert)" 
                  baseLine={chartData.map(d => (d as any).lower)} 
                  isAnimationActive={true}
                />
                
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fill="transparent" 
                  dot={({cx, cy, payload}) => payload.type === 'Predicción IA' ? <circle cx={cx} cy={cy} r={5} fill="#10b981" className="animate-pulse" /> : null}
                />
                
                <ReferenceLine x={months[5]} stroke="#334155" strokeDasharray="5 5" label={{ position: 'top', value: 'AHORA', fill: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory Workflow Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Workflow size={14} className="text-emerald-500" />
                LSTM Memory Buffer
              </h4>
              {memoryIndex !== -1 && (
                <div className="flex items-center gap-2 text-emerald-500 animate-pulse">
                  <Timer size={12} />
                  <span className="text-[10px] font-bold">Analizando Mes {memoryIndex + 1}...</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-end h-28 gap-3 relative z-10">
              {history.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                   <div 
                    className={cn(
                      "w-full rounded-xl transition-all duration-300",
                      i === memoryIndex ? "bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-110" : 
                      i < memoryIndex ? "bg-emerald-500/20" : "bg-slate-800/50"
                    )}
                    style={{ height: `${(val / 6000) * 100}%` }}
                   />
                   <span className={cn(
                    "text-[9px] font-black transition-colors",
                    i === memoryIndex ? "text-emerald-500" : "text-slate-600"
                   )}>
                    M{i+1}
                   </span>
                </div>
              ))}
              <div className="w-px h-full bg-slate-800/50 mx-2" />
              <div className="flex-1 flex flex-col items-center gap-3">
                 <div className={cn(
                  "w-full border-2 border-dashed rounded-xl transition-all duration-500",
                  isPredicting ? "bg-blue-500/20 border-blue-500 animate-pulse h-1/2" : "bg-slate-800/10 border-slate-800 h-1/4"
                 )} />
                 <span className="text-[9px] font-black text-slate-700">FUTURO</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <button 
              onClick={handleForecast}
              disabled={isPredicting}
              className="flex-1 group bg-white hover:bg-emerald-50 text-slate-950 rounded-[2.5rem] font-black flex flex-col items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-emerald-500/10"
            >
              <div className={cn("p-4 bg-slate-950/5 rounded-full mb-1 group-hover:scale-110 transition-transform", isPredicting && "animate-spin")}>
                {isPredicting ? <RefreshCcw size={28} /> : <Eye size={28} />}
              </div>
              <span className="text-xs uppercase tracking-widest">{isPredicting ? 'Escaneando...' : 'Consultar Oráculo'}</span>
            </button>
            
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col justify-center shadow-inner">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Dictamen de Tendencia</span>
              <div className="flex items-center gap-3">
                {forecast.length > 0 ? (
                  forecast[3].val > history[5] ? (
                    <div className="flex items-center gap-2 text-emerald-500 animate-in zoom-in">
                      <TrendingUp size={24} />
                      <span className="text-2xl font-black tracking-tighter uppercase">Alcista</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-500 animate-in zoom-in">
                      <TrendingDown size={24} />
                      <span className="text-2xl font-black tracking-tighter uppercase">Bajista</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-slate-800">
                    <Sparkles size={24} />
                    <span className="text-2xl font-black tracking-tighter uppercase">Pendiente</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem]">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <Layers size={24} className="text-blue-500" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-black text-blue-400 uppercase tracking-widest">¿Cómo ve el futuro la LSTM?</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              La banda azul representa la <strong>incertidumbre predictiva</strong>. Nota cómo se ensancha a medida que nos alejamos del presente. Esto demuestra que la red entiende que, aunque hay un patrón, el futuro lejano es inherentemente más ruidoso y difícil de predecir.
            </p>
          </div>
        </div>
      </div>
    </LabPanel>
  );
};
