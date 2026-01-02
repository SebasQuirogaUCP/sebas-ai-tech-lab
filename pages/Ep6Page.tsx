
import React, { useState, useEffect, useRef } from 'react';
import { LabPanel } from '../components/LabPanel';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Target, Zap, RotateCcw, 
  Coins, BarChart3, ShieldCheck, AlertCircle, PlayCircle, StopCircle
} from 'lucide-react';
import { cn } from '../utils';
import { STRATEGIST_CODE } from '../lib/ai/strategist';

export const Ep6Page: React.FC = () => {
  const [marketData, setMarketData] = useState<{time: number, price: number, action?: string}[]>([]);
  const [balance, setBalance] = useState(1000);
  const [isTraining, setIsTraining] = useState(false);
  const [rewardConfig, setRewardConfig] = useState({ ambition: 0.5, caution: 0.5 });
  const [inventory, setInventory] = useState(0);
  const [iteration, setIteration] = useState(0);
  
  const timerRef = useRef<number | null>(null);

  // Simulación de mercado y decisión de la IA
  const step = () => {
    setMarketData(prev => {
      const lastPrice = prev.length > 0 ? prev[prev.length - 1].price : 100;
      const change = (Math.random() - 0.5) * 10;
      const newPrice = Math.max(10, lastPrice + change);
      
      const nextTime = prev.length;
      
      // Lógica de decisión de la IA (Simulando Q-Learning)
      let action = 'HOLD';
      const shouldBuy = Math.random() < 0.2 + (rewardConfig.ambition * 0.3);
      const shouldSell = Math.random() < 0.2 + (rewardConfig.caution * 0.3);

      if (shouldBuy && balance > newPrice) {
        action = 'BUY';
        setBalance(b => b - newPrice);
        setInventory(i => i + 1);
      } else if (shouldSell && inventory > 0) {
        action = 'SELL';
        setBalance(b => b + newPrice);
        setInventory(i => i - 1);
      }

      const newData = [...prev, { time: nextTime, price: newPrice, action }];
      return newData.slice(-30); // Mantener últimos 30 puntos
    });
    setIteration(i => i + 1);
  };

  const toggleTraining = () => {
    if (isTraining) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsTraining(false);
    } else {
      setIsTraining(true);
      timerRef.current = window.setInterval(step, 400);
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTraining(false);
    setMarketData([{time: 0, price: 100}]);
    setBalance(1000);
    setInventory(0);
    setIteration(0);
  };

  const totalValue = balance + (inventory * (marketData[marketData.length - 1]?.price || 0));
  const profit = totalValue - 1000;

  return (
    <LabPanel
      title="Ep 6: El Estratega (Reinforcement Learning)"
      description="El nivel más alto de autonomía. Aquí no hay etiquetas ni tendencias fijas. La IA aprende mediante un bucle de recompensas: si gana dinero, refuerza su estrategia; si pierde, la descarta. Ajusta su 'personalidad' y observa cómo opera."
      codeSnippet={STRATEGIST_CODE}
    >
      <div className="space-y-8">
        {/* Trading Terminal */}
        <div className="bg-[#020617] p-8 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
             <Target size={120} />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Live Trading Floor</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Agent ID: FINNEURA-RL-06</p>
            </div>

            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-[9px] text-slate-500 font-black uppercase">Capital Total</p>
                <p className="text-2xl font-black text-white font-mono">${totalValue.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-500 font-black uppercase">Profit/Loss</p>
                <p className={cn("text-2xl font-black font-mono", profit >= 0 ? "text-emerald-500" : "text-rose-500")}>
                  {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.2} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#475569" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.action === 'BUY') return <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="white" strokeWidth={2} />;
                    if (payload.action === 'SELL') return <circle cx={cx} cy={cy} r={6} fill="#f43f5e" stroke="white" strokeWidth={2} />;
                    return null;
                  }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reward Function Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-8">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Coins size={14} className="text-emerald-500" />
              Reward Engine Config
            </h4>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-400">Ambición (Premio por ganar)</span>
                  <span className="text-emerald-500">{(rewardConfig.ambition * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" value={rewardConfig.ambition}
                  onChange={(e) => setRewardConfig({...rewardConfig, ambition: Number(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-400">Cautela (Castigo por riesgo)</span>
                  <span className="text-rose-500">{(rewardConfig.caution * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" value={rewardConfig.caution}
                  onChange={(e) => setRewardConfig({...rewardConfig, caution: Number(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <BarChart3 size={24} />
              </div>
              <div>
                <h5 className="font-black text-white text-sm uppercase">Estado del Agente</h5>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Iteraciones: {iteration}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Inventario</p>
                <p className="text-xl font-black text-white">{inventory} UNIDADES</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Personalidad</p>
                <p className="text-xl font-black text-blue-500">
                  {rewardConfig.ambition > rewardConfig.caution ? 'AGGRESSIVE' : 'DEFENSIVE'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={toggleTraining}
            className={cn(
              "flex-1 py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
              isTraining ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            )}
          >
            {isTraining ? <StopCircle size={24} /> : <PlayCircle size={24} />}
            {isTraining ? 'Detener Operación' : 'Iniciar Estratega'}
          </button>
          
          <button 
            onClick={reset}
            className="px-10 py-6 bg-slate-900 text-slate-300 border border-slate-800 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        <div className="flex items-start gap-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem]">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} className="text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-black text-emerald-500 uppercase tracking-widest">¿Qué es el Reinforcement Learning?</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              A diferencia del Perceptrón o la Regresión, aquí no le decimos a la IA qué precio es "bueno". El agente toma acciones al azar al principio (exploración) y, si su <strong>Balance Total</strong> sube, guarda esa decisión como exitosa. Con el tiempo, crea una "Política" de actuación que maximiza sus beneficios en cualquier mercado.
            </p>
          </div>
        </div>
      </div>
    </LabPanel>
  );
};
