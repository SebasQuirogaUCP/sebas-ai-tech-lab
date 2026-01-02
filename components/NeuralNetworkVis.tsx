
import React from 'react';
import { cn } from '../utils';

interface NeuralNetworkVisProps {
  isTraining: boolean;
}

export const NeuralNetworkVis: React.FC<NeuralNetworkVisProps> = ({ isTraining }) => {
  const layers = [3, 5, 4, 1]; // Input (D, D2, Sin), Hidden 1, Hidden 2, Output
  const height = 200;
  const width = 360; // Base width para viewBox
  const nodeRadius = 6;
  const layerGap = width / (layers.length - 1);

  return (
    <div className="relative w-full h-[200px] bg-slate-950/50 rounded-2xl border border-slate-800/50 p-4 flex items-center justify-center overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-w-[400px]"
      >
        {/* Conexiones (Sinapsis) */}
        {layers.map((nodeCount, layerIndex) => {
          if (layerIndex === layers.length - 1) return null;
          const nextNodeCount = layers[layerIndex + 1];
          const x1 = layerIndex * layerGap;
          const x2 = (layerIndex + 1) * layerGap;

          return Array.from({ length: nodeCount }).map((_, i) => {
            const y1 = (height / (nodeCount + 1)) * (i + 1);
            return Array.from({ length: nextNodeCount }).map((_, j) => {
              const y2 = (height / (nextNodeCount + 1)) * (j + 1);
              return (
                <line
                  key={`l-${layerIndex}-${i}-${j}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isTraining ? '#10b981' : '#1e293b'}
                  strokeWidth={isTraining ? 1 : 0.5}
                  strokeOpacity={isTraining ? 0.4 : 0.2}
                  className={cn(isTraining && "animate-pulse")}
                />
              );
            });
          });
        })}

        {/* Neuronas */}
        {layers.map((nodeCount, layerIndex) => {
          const x = layerIndex * layerGap;
          return Array.from({ length: nodeCount }).map((_, i) => {
            const y = (height / (nodeCount + 1)) * (i + 1);
            return (
              <g key={`n-${layerIndex}-${i}`}>
                <circle
                  cx={x} cy={y} r={nodeRadius}
                  fill={isTraining ? '#10b981' : '#0f172a'}
                  stroke={isTraining ? '#34d399' : '#334155'}
                  strokeWidth={2}
                  className={cn(
                    "transition-all duration-500",
                    isTraining && "shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  )}
                />
                {isTraining && (
                  <circle
                    cx={x} cy={y} r={nodeRadius + 4}
                    fill="none" stroke="#10b981" strokeWidth={1}
                    className="animate-ping opacity-20"
                  />
                )}
              </g>
            );
          });
        })}
      </svg>
      
      {/* Labels de Capas */}
      <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest pointer-events-none">
        <span>Input</span>
        <span>H1</span>
        <span>H2</span>
        <span>Output</span>
      </div>
    </div>
  );
};
