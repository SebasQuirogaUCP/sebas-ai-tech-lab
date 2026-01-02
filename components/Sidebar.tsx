import {
  BookOpen,
  Eye,
  Gavel,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Panel Principal", path: "/", icon: LayoutDashboard },
  { name: "Ep 1: Perceptrón", path: "/ep1", icon: Gavel, subtitle: "El Juez" },
  {
    name: "Ep 2: Regresión",
    path: "/ep2",
    icon: Sparkles,
    subtitle: "El Adivino",
  },
  {
    name: "Ep 3: Clasificación",
    path: "/ep3",
    icon: ShieldAlert,
    subtitle: "El Detective",
  },
  { name: "Ep 4: NLP", path: "/ep4", icon: BookOpen, subtitle: "El Lector" },
  {
    name: "Ep 5: Series Temporales",
    path: "/ep5",
    icon: Eye,
    subtitle: "El Oráculo",
  },
  {
    name: "Ep 6: Refuerzo",
    path: "/ep6",
    icon: Target,
    subtitle: "El Estratega",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-72 bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="text-slate-950 fill-slate-950" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                Sebas <span className="text-emerald-500">Tech Lab</span>
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Serie de Labs AI
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                )
              }
            >
              {/* Fix: NavLink children as a function to access 'isActive' property */}
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    className={cn(
                      "shrink-0",
                      isActive
                        ? "text-emerald-500"
                        : "group-hover:text-emerald-400"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight">
                      {item.name}
                    </span>
                    {item.subtitle && (
                      <span className="text-[9px] opacity-60 font-mono tracking-wider">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">
                SISTEMA LISTO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Modelos optimizados para ejecución local en navegador.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
