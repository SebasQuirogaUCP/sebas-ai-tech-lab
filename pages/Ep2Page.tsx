
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { LabPanel } from '../components/LabPanel';
import { NeuralNetworkVis } from '../components/NeuralNetworkVis';
import { 
  ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Area
} from 'recharts';
import { Sparkles, TrendingUp, Brain, Activity, Zap, Database, BarChart3, RefreshCw, AlertCircle, Terminal, Cpu } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
// Added missing import for 'cn' utility
import { cn } from '../utils';

const REGRESSION_CODE = `import * as tf from '@tensorflow/tfjs';

// Motor de Inferencia Finneura v2.0
export const trainWithVisualFeedback = async (samples, onUpdate) => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [3] }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ 
    loss: 'meanSquaredError', 
    optimizer: tf.train.adam(0.015) 
  });

  await model.fit(xs, ys, {
    epochs: 200,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        // Reportar progreso al visualizador
        onUpdate(epoch, logs.loss);
      }
    }
  });
};`;

export const Ep2Page: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState<number | null>(null);
  const [predictions, setPredictions] = useState<{day: number, forecast: number}[]>([]);
  const [syntheticData, setSyntheticData] = useState<{day: number, spent: number, isAnomaly: boolean}[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Motor inicializado. Esperando datos..."]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const generateData = useCallback(() => {
    const newData = [];
    const startingBalance = 40 + Math.random() * 20;
    const slope = 0.4;

    for (let i = 0; i < 50; i++) {
      const day = i + 1;
      const trend = startingBalance + (slope * day);
      const seasonality = 15 * Math.sin(day * (Math.PI / 3.5));
      const noise = (Math.random() - 0.5) * 12;
      let spike = 0;
      let isAnomaly = false;
      if (Math.random() > 0.92) {
        spike = (Math.random() > 0.5 ? 45 : -35);
        isAnomaly = true;
      }

      newData.push({ 
        day, 
        spent: Math.max(0, Number((trend + seasonality + noise + spike).toFixed(2))),
        isAnomaly
      });
    }
    setSyntheticData(newData);
    setPredictions([]);
    setLoss(null);
    setEpoch(0);
    setLogs(["[DATA] Nuevo escenario generado (50 puntos).", "[READY] Esperando comando de entrenamiento..."]);
  }, []);

  useEffect(() => {
    generateData();
  }, [generateData]);

  const trainAndPredict = async () => {
    if (syntheticData.length === 0) return;
    setIsTraining(true);
    setPredictions([]);
    addLog("Iniciando compilación del modelo...");

    const maxDay = 60;
    const maxYVal = Math.max(...syntheticData.map(d => d.spent)) * 1.5;

    const normTrain = syntheticData.map(d => ({
      d: d.day / maxDay,
      d2: Math.pow(d.day / maxDay, 2),
      sin: Math.sin(d.day * (Math.PI / 3.5)),
      s: d.spent / maxYVal
    }));

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [3] }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(0.015) });

    const xs = tf.tensor2d(normTrain.map(d => [d.d, d.d2, d.sin]));
    const ys = tf.tensor2d(normTrain.map(d => [d.s]));

    const futureDays = Array.from({ length: 10 }, (_, i) => 51 + i);
    const futureInput = tf.tensor2d(futureDays.map(d => [
      d / maxDay,
      Math.pow(d / maxDay, 2),
      Math.sin(d * (Math.PI / 3.5))
    ]));

    try {
      await model.fit(xs, ys, { 
        epochs: 200, 
        batchSize: 16,
        verbose: 0,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            setEpoch(epoch + 1);
            setLoss(logs?.loss || 0);
            
            // Cada 20 épocas, actualizamos la gráfica en vivo para ver el "aprendizaje"
            if (epoch % 20 === 0) {
              const currentPreds = model.predict(futureInput) as tf.Tensor;
              const data = await currentPreds.data();
              setPredictions(Array.from(data).map((p, i) => ({
                day: 51 + i,
                forecast: Number(((p as number) * maxYVal).toFixed(2))
              })));
              currentPreds.dispose();
              addLog(`Epoch ${epoch+1}: Error reducido a ${logs?.loss.toFixed(6)}`);
            }
          }
        }
      });

      addLog("Entrenamiento finalizado exitosamente.");
    } catch (e) {
      addLog("ERROR en el entrenamiento.");
    } finally {
      setIsTraining(false);
      xs.dispose();
      ys.dispose();
      futureInput.dispose();
      model.dispose();
    }
  };

  return (
    <LabPanel
      title="Ep 2: El Adivino (Neural Engine)"
      description="Observa cómo la red neuronal ajusta sus conexiones en tiempo real para predecir tus finanzas. Verás la línea de predicción 'aprender' y ajustarse a medida que el entrenamiento avanza."
      codeSnippet={REGRESSION_CODE}
    >
      <div className="space-y-6">
        {/* Gráfico Principal */}
        <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Activity size={18} className={cn("text-emerald-500", isTraining && "animate-pulse")} />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm tracking-tight">Evolución de Aprendizaje</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Epoch {epoch}/200</span>
                </div>
              </div>
            </div>
            
            {loss !== null && (
              <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full flex items-center gap-3">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Current Loss</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{loss.toFixed(6)}</span>
              </div>
            )}
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} type="number" domain={[0, 60]} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }} />
                
                <Scatter name="Datos Históricos" data={syntheticData} dataKey="spent" fill="#3b82f6" fillOpacity={0.4} stroke="none" />
                <Line 
                  name="IA Aprendiendo..." 
                  data={predictions} 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 3, fill: '#10b981' }}
                  isAnimationActive={false} // Desactivamos para ver el update instantáneo
                />
                <ReferenceLine x={50} stroke="#334155" strokeDasharray="3 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Neural Monitoring Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Cpu size={14} className="text-emerald-500" />
                Neural Architecture
              </h4>
              <span className="text-[10px] text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                {isTraining ? 'ACTIVE_PROCESSING' : 'IDLE'}
              </span>
            </div>
            <NeuralNetworkVis isTraining={isTraining} />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={14} className="text-blue-500" />
              Engine Telemetry
            </h4>
            <div ref={terminalRef} className="bg-slate-950 border border-slate-800 rounded-2xl h-[200px] p-4 font-mono text-[10px] text-slate-400 overflow-hidden flex flex-col gap-2">
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "border-l-2 pl-2 transition-all",
                  log.includes("ERROR") ? "border-rose-500 text-rose-400" : 
                  log.includes("Epoch") ? "border-emerald-500/50" : "border-slate-800"
                )}>
                  {log}
                </div>
              ))}
              {isTraining && (
                <div className="flex items-center gap-2 animate-pulse text-emerald-500">
                  <span className="w-1 h-3 bg-emerald-500" />
                  Sincronizando pesos sinápticos...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-2">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-500" />
              Control Central
            </h4>
            <p className="text-xs text-slate-400">
              Pulsa 'Entrenar' para ver cómo la red ajusta sus neuronas para seguir el patrón cíclico de gastos.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={generateData}
              disabled={isTraining}
              className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700 disabled:opacity-50 group"
            >
              <RefreshCw size={14} className={isTraining ? "" : "group-hover:rotate-180 transition-transform duration-500"} /> 
              Nuevo Escenario
            </button>
            
            <button
              onClick={trainAndPredict}
              disabled={isTraining}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white font-black text-sm rounded-xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50"
            >
              {isTraining ? <Activity className="animate-spin" size={18} /> : <Zap size={18} />}
              {isTraining ? 'Entrenando Red...' : 'Iniciar Entrenamiento'}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <AlertCircle size={20} className="text-blue-400" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-blue-400 uppercase mb-1">Mecánica del Aprendizaje</h5>
            <p className="text-[11px] text-blue-200/60 leading-relaxed">
              En cada <strong>Epoch</strong>, el visualizador muestra cómo los pesos (líneas) se iluminan. Esto representa el proceso de <em>Backpropagation</em>: la red calcula el error entre su predicción y el dato real, y viaja hacia atrás para corregir las conexiones.
            </p>
          </div>
        </div>
      </div>
    </LabPanel>
  );
};
