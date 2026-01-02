import {
  ArrowRight,
  BrainCircuit,
  Crosshair,
  Info,
  Scale,
  ShoppingCart,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
import { LabPanel } from "../components/LabPanel";
import { PERCEPTRON_CODE, runPerceptron } from "../lib/ai/perceptron";
import { cn } from "../utils";

export const Ep1Page: React.FC = () => {
  const [precio, setPrecio] = useState(500);
  const [necesidad, setNecesidad] = useState(50);
  const [weights, setWeights] = useState({ w1: 0.1, w2: 0.5, bias: 20 });

  const result = useMemo(() => {
    return runPerceptron(precio, necesidad, weights);
  }, [precio, necesidad, weights]);

  const isApproved = result.decision === 1;

  const decisionLineData = useMemo(() => {
    const points = [];
    for (let p = 0; p <= 1000; p += 100) {
      const n = (p * weights.w1 - weights.bias) / weights.w2;
      points.push({ x: p, y: Math.max(-20, Math.min(120, n)) });
    }
    return points;
  }, [weights]);

  return (
    <LabPanel
      title="Ep 1: Perceptrón (El Juez)"
      description="Visualiza el espacio de decisión 2D. El perceptrón separa tus compras mediante una frontera lineal que tú puedes manipular ajustando los pesos neuronales."
      codeSnippet={PERCEPTRON_CODE}
    >
      <div className="space-y-6 md:space-y-8">
        <div className="bg-slate-950 p-4 md:p-6 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none hidden md:block">
            <Scale size={120} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500",
                  isApproved
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-rose-500 text-slate-950 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                )}
              >
                <ShoppingCart size={20} className="md:size-6" />
              </div>
              <div>
                <h4 className="font-black text-white text-base md:text-lg leading-none mb-1 uppercase tracking-tighter">
                  {isApproved ? "APROBADA" : "RECHAZADA"}
                </h4>
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                  Act: {result.activation.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-sm">
              <p className="text-[9px] font-mono text-slate-400 truncate">
                ({precio} * -{weights.w1}) + ({necesidad} * {weights.w2}) +{" "}
                {weights.bias}
              </p>
            </div>
          </div>

          <div className="h-[250px] md:h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                margin={{ top: 10, right: 10, bottom: 10, left: -25 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                  opacity={0.1}
                />
                <XAxis
                  type="number"
                  dataKey="x"
                  stroke="#475569"
                  fontSize={9}
                  domain={[0, 1000]}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  stroke="#475569"
                  fontSize={9}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                />
                <ReferenceLine
                  x={precio}
                  stroke="#334155"
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  y={necesidad}
                  stroke="#334155"
                  strokeDasharray="3 3"
                />
                <Line
                  data={decisionLineData}
                  type="monotone"
                  dataKey="y"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                  opacity={0.4}
                />
                <Scatter
                  name="Punto Actual"
                  data={[{ x: precio, y: necesidad }]}
                >
                  <Cell
                    fill={isApproved ? "#10b981" : "#f43f5e"}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="animate-pulse"
                    style={{ r: 8 }}
                  />
                </Scatter>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="space-y-6 bg-slate-900/50 p-6 rounded-[1.5rem] border border-slate-800">
            <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Zap size={12} className="text-emerald-500" /> Entradas (Inputs)
            </h5>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Precio</span>
                  <span className="text-white">${precio}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={precio}
                  onChange={(e) => setPrecio(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none accent-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Necesidad</span>
                  <span className="text-white">{necesidad}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={necesidad}
                  onChange={(e) => setNecesidad(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none accent-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-slate-950 border border-slate-800 p-6 rounded-[1.5rem]">
            <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <BrainCircuit size={12} className="text-blue-500" /> Pesos de la
              Neurona
            </h5>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  label: "Peso Precio",
                  key: "w1",
                  step: 0.01,
                  icon: ArrowRight,
                },
                {
                  label: "Peso Necesidad",
                  key: "w2",
                  step: 0.01,
                  icon: ArrowRight,
                },
                {
                  label: "Sesgo (Bias)",
                  key: "bias",
                  step: 1,
                  icon: Crosshair,
                },
              ].map((w) => (
                <div
                  key={w.key}
                  className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-xl border border-slate-800"
                >
                  <span className="text-[10px] font-bold text-slate-400">
                    {w.label}
                  </span>
                  <input
                    type="number"
                    step={w.step}
                    value={(weights as any)[w.key]}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        [w.key]: Number(e.target.value),
                      })
                    }
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono text-xs w-20 text-right focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-blue-500/5 border border-blue-500/10 rounded-[2rem]">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Info size={24} className="text-blue-500" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-black text-white uppercase tracking-widest">
              Aprende sobre la Frontera
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              La línea azul punteada es la <strong>Frontera de Decisión</strong>
              . Al mover los pesos, cambias el ángulo y la posición de esta
              frontera. El perceptrón simplemente calcula si el punto actual
              está por encima o por debajo de esta línea.
            </p>
          </div>
        </div>
      </div>
    </LabPanel>
  );
};
