
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LabPanel } from '../components/LabPanel';
import { NeuralNetworkVis } from '../components/NeuralNetworkVis';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  ShieldAlert, ShieldCheck, Globe, Crosshair, Zap, 
  RefreshCw, Activity, Terminal, AlertTriangle, Fingerprint, PlusCircle, Database
} from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import { cn } from '../utils';

const FRAUD_LOGIC_CODE = `import * as tf from '@tensorflow/tfjs';

// Motor de Inferencia Detective v3.5
// Aprende fronteras no lineales en espacios 2D/3D
export const trainDetective = async (data, onUpdate) => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 24, activation: 'relu', inputShape: [3] }));
  model.add(tf.layers.dense({ units: 12, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({ 
    optimizer: tf.train.adam(0.01),
    loss: 'binaryCrossentropy' 
  });

  await model.fit(xs, ys, { 
    epochs: 100,
    callbacks: { onEpochEnd: onUpdate }
  });
};`;

export const Ep3Page: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [model, setModel] = useState<tf.Sequential | null>(null);
  const [riskScore, setRiskScore] = useState(0.5); // 0.5 is "I don't know"
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Detective en modo pasivo.", "[WARNING] Sin entrenamiento el radar es ciego."]);
  const [currentTx, setCurrentTx] = useState({ monto: 150, hora: 14, esExtranjera: 0 });
  const [dataset, setDataset] = useState<{x: number, y: number, isFraud: boolean}[]>([]);
  const [decisionMap, setDecisionMap] = useState<{x: number, y: number, risk: number}[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Generar datos iniciales
  const generateDataset = useCallback(() => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({ x: 100 + Math.random() * 600, y: 9 + Math.random() * 10, isFraud: false });
    }
    for (let i = 0; i < 10; i++) {
      data.push({ x: 1300 + Math.random() * 500, y: 1 + Math.random() * 4, isFraud: true });
    }
    setDataset(data);
    setDecisionMap([]);
    setModel(null);
    setRiskScore(0.5);
    addLog("Base de datos reiniciada. El detective ha olvidado todo.");
  }, []);

  useEffect(() => { generateDataset(); }, [generateDataset]);

  const addToDataset = (isFraud: boolean) => {
    setDataset(prev => [...prev, { x: currentTx.monto, y: currentTx.hora, isFraud }]);
    addLog(`Transacción ${isFraud ? 'FRAUDULENTA' : 'LEGÍTIMA'} añadida al set.`);
  };

  const trainModel = async () => {
    if (dataset.length < 5) return;
    setIsTraining(true);
    addLog("Iniciando entrenamiento profundo...");

    const newModel = tf.sequential();
    newModel.add(tf.layers.dense({ units: 24, activation: 'relu', inputShape: [3] }));
    newModel.add(tf.layers.dense({ units: 12, activation: 'relu' }));
    newModel.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    newModel.compile({ optimizer: tf.train.adam(0.01), loss: 'binaryCrossentropy' });

    const xs = tf.tensor2d(dataset.map(d => [d.x / 2000, d.y / 24, currentTx.esExtranjera]));
    const ys = tf.tensor2d(dataset.map(d => [d.isFraud ? 1 : 0]));

    await newModel.fit(xs, ys, {
      epochs: 150,
      verbose: 0,
      callbacks: {
        onEpochEnd: (epoch) => {
          if (epoch % 30 === 0) addLog(`Aprendiendo fronteras... Epoch ${epoch}`);
        }
      }
    });

    // Generar el Mapa de Decisión (Fronteras reales)
    const grid = [];
    const stepX = 200;
    const stepY = 3;
    const gridPoints = [];
    for (let x = 0; x <= 2000; x += stepX) {
      for (let y = 0; y <= 24; y += stepY) {
        gridPoints.push([x / 2000, y / 24, currentTx.esExtranjera]);
        grid.push({ x, y, risk: 0 });
      }
    }

    const gridTensor = tf.tensor2d(gridPoints);
    const gridPreds = newModel.predict(gridTensor) as tf.Tensor;
    const gridData = await gridPreds.data();
    
    setDecisionMap(grid.map((g, i) => ({ ...g, risk: gridData[i] })));
    
    setModel(newModel);
    setIsTraining(false);
    addLog("SISTEMA ACTIVO. El detective ahora reconoce patrones.");
    xs.dispose(); ys.dispose(); gridTensor.dispose(); gridPreds.dispose();
  };

  const runLiveInference = async () => {
    if (!model) return;
    const input = tf.tensor2d([[currentTx.monto / 2000, currentTx.hora / 24, currentTx.esExtranjera]]);
    const prediction = model.predict(input) as tf.Tensor;
    const score = (await prediction.data())[0];
    setRiskScore(score);
    input.dispose();
    prediction.dispose();
  };

  useEffect(() => {
    if (model) runLiveInference();
  }, [currentTx, model]);

  const isAlert = riskScore > 0.6;
  const isNeutral = !model;

  return (
    <LabPanel
      title="Ep 3: El Detective (Decision Boundaries)"
      description="Nivel 2: Ya no usamos líneas rectas. La IA crea un mapa mental de seguridad. Entrena al detective y observa cómo la zona roja (fraude) aparece dinámicamente según tus datos."
      codeSnippet={FRAUD_LOGIC_CODE}
    >
      <div className="space-y-6">
        {/* Radar Map */}
        <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className={cn(
            "absolute top-0 left-0 w-full h-1 transition-colors duration-500",
            isNeutral ? "bg-slate-700" : isAlert ? "bg-rose-500" : "bg-emerald-500"
          )} />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl transition-all duration-500",
                isNeutral ? "bg-slate-800 text-slate-500" :
                isAlert ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"
              )}>
                {isNeutral ? <Fingerprint size={20} /> : isAlert ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm tracking-tight">IA Decision Boundary</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Visualizando el 'Cerebro' del Detective</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Predicción de Riesgo</p>
                <p className={cn(
                  "text-xl font-black font-mono transition-colors",
                  isNeutral ? "text-slate-600" : isAlert ? "text-rose-500" : "text-emerald-500"
                )}>{isNeutral ? '---' : `${(riskScore * 100).toFixed(1)}%`}</p>
              </div>
            </div>
          </div>

          <div className="h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.1} />
                <XAxis type="number" dataKey="x" stroke="#475569" fontSize={10} domain={[0, 2000]} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="y" stroke="#475569" fontSize={10} domain={[0, 24]} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                
                {/* Mapa de Decisión (Frontera de Calor) */}
                <Scatter name="Background" data={decisionMap}>
                  {decisionMap.map((entry, index) => (
                    <Cell key={`bg-${index}`} fill={entry.risk > 0.5 ? '#f43f5e' : '#10b981'} fillOpacity={entry.risk > 0.5 ? entry.risk * 0.15 : (1 - entry.risk) * 0.1} />
                  ))}
                </Scatter>

                <Scatter name="Legítimos" data={dataset.filter(d => !d.isFraud)} fill="#3b82f6" fillOpacity={0.6} shape="circle" />
                <Scatter name="Fraude" data={dataset.filter(d => d.isFraud)} fill="#f43f5e" fillOpacity={0.8} shape="cross" />

                {/* Live Scan Target */}
                <Scatter 
                  name="LIVE_SCAN" 
                  data={[{x: currentTx.monto, y: currentTx.hora}]} 
                >
                   <Cell 
                     fill={isNeutral ? '#475569' : isAlert ? '#f43f5e' : '#10b981'} 
                     className={cn("animate-pulse stroke-white stroke-2")}
                     style={{ r: 8 }}
                   />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            
            {isNeutral && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px] pointer-events-none rounded-2xl">
                <div className="bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-full text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2 shadow-2xl">
                  <AlertTriangle size={12} className="text-amber-500" />
                  Mapa No Entrenado
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Learning Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Crosshair size={14} className="text-emerald-500" />
                Manual Training Injector
              </h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase">Gasto ($)</label>
                <input 
                  type="number" value={currentTx.monto}
                  onChange={(e) => setCurrentTx({...currentTx, monto: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase">Hora (0-24)</label>
                <input 
                  type="number" value={currentTx.hora}
                  onChange={(e) => setCurrentTx({...currentTx, hora: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => addToDataset(false)}
                className="flex items-center justify-center gap-2 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-bold uppercase transition-all"
              >
                <PlusCircle size={14} /> Marcar Seguro
              </button>
              <button 
                onClick={() => addToDataset(true)}
                className="flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-[10px] font-bold uppercase transition-all"
              >
                <PlusCircle size={14} /> Marcar Fraude
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-[2rem] h-[140px] p-4 font-mono text-[10px] text-slate-400 overflow-hidden flex flex-col gap-2">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-1">
                <Database size={12} className="text-blue-500" />
                <span className="font-bold text-slate-200">DATASET: {dataset.length} REGISTROS</span>
              </div>
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "border-l-2 pl-2 transition-all",
                  log.includes("FRAUDULENTA") || log.includes("ALERTA") ? "border-rose-500 text-rose-400" : "border-slate-800"
                )}>
                  {log}
                </div>
              ))}
            </div>
            <NeuralNetworkVis isTraining={isTraining} />
          </div>
        </div>

        {/* Command Center */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1 space-y-2 text-center lg:text-left">
            <h4 className="text-xl font-black text-white flex items-center justify-center lg:justify-start gap-2">
              <Zap size={22} className="text-emerald-500 fill-emerald-500" />
              Entrenar Detective
            </h4>
            <p className="text-xs text-slate-400 max-w-md">
              La IA procesará tus etiquetas manuales para crear un mapa de riesgo. A mayor cantidad de datos, más precisa será la frontera de seguridad.
            </p>
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={generateDataset}
              disabled={isTraining}
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 text-slate-300 text-xs font-bold rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"
            >
              <RefreshCw size={14} /> Reset
            </button>
            
            <button
              onClick={trainModel}
              disabled={isTraining || dataset.length < 5}
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-emerald-600 text-white font-black text-sm rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-30"
            >
              {isTraining ? <Activity className="animate-spin" size={18} /> : <Fingerprint size={18} />}
              {isTraining ? 'Computando...' : 'Entrenar Ahora'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0% }
          50% { top: 100% }
          100% { top: 0% }
        }
      `}</style>
    </LabPanel>
  );
};
