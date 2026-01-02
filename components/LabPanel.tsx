import { Code2, Eye, Play } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../utils";

interface LabPanelProps {
  children: React.ReactNode;
  codeSnippet: string;
  title: string;
  description: string;
}

export const LabPanel: React.FC<LabPanelProps> = ({
  children,
  codeSnippet,
  title,
  description,
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-6 md:mb-8 px-1">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      <div className="lg:hidden flex p-1 bg-slate-900 border border-slate-800 rounded-2xl mb-6">
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === "preview"
              ? "bg-slate-800 text-emerald-500 shadow-lg"
              : "text-slate-500"
          )}
        >
          <Eye size={14} /> Vista Previa
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === "code"
              ? "bg-slate-800 text-blue-400 shadow-lg"
              : "text-slate-500"
          )}
        >
          <Code2 size={14} /> Código
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-1 gap-6 pb-8">
        <div
          className={cn(
            "flex flex-col bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden min-h-[450px]",
            activeTab !== "preview" && "hidden lg:flex"
          )}
        >
          <div className="bg-slate-800/30 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Laboratorio Interactivo
              </span>
            </div>
          </div>
          <div className="flex-1 p-5 md:p-8 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
