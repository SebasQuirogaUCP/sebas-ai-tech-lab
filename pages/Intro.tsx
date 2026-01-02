import {
  Bell,
  BookOpen,
  BrainCircuit,
  Eye,
  MessageSquare,
  Play,
  Sparkles,
  Target,
  ThumbsUp,
  TrendingUp,
  Youtube,
} from "lucide-react";
import React from "react";

const episodes = [
  {
    number: 1,
    title: "Perceptrón (El Juez)",
    description:
      "Aprende cómo una neurona simple toma decisiones binarias usando fronteras lineales.",
    icon: Target,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    youtubeUrl: "https://www.youtube.com/watch?v=SEXrAwr-k58",
  },
  {
    number: 2,
    title: "El Adivino (Neural Engine)",
    description:
      "Observa el entrenamiento en tiempo real y cómo la red aprende patrones cíclicos.",
    icon: TrendingUp,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    youtubeUrl: "https://www.youtube.com/watch?v=SEXrAwr-k58",
  },
  {
    number: 3,
    title: "El Detective (Decision Boundaries)",
    description:
      "Descubre fronteras no lineales y mapas de decisión para detectar fraudes.",
    icon: Eye,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    youtubeUrl: "https://www.youtube.com/watch?v=SEXrAwr-k58",
  },
  {
    number: 4,
    title: "El Lector (Zero-Shot NLP)",
    description:
      "Experimenta con procesamiento de lenguaje natural sin entrenamiento previo.",
    icon: BookOpen,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    youtubeUrl: "https://www.youtube.com/watch?v=SEXrAwr-k58",
  },
  {
    number: 5,
    title: "El Oráculo (LSTM Memoria)",
    description:
      "Redes con memoria a largo plazo que predicen tendencias financieras futuras.",
    icon: Sparkles,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    youtubeUrl: "https://www.youtube.com/watch?v=SEXrAwr-k58",
  },
  {
    number: 6,
    title: "El Estratega (Reinforcement Learning)",
    description:
      "La IA aprende por sí misma mediante recompensas y castigos en mercados volátiles.",
    icon: BrainCircuit,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    youtubeUrl: "https://www.youtube.com/watch?v=SEXrAwr-k58",
  },
];

export const Intro: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-xl shadow-emerald-500/20 shrink-0">
              <Youtube size={32} className="text-white md:size-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none mb-2">
                Bienvenido al Laboratorio Visual
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
                Sebas Tech Lab - Recursos Interactivos del Canal
              </p>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
            <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
              Este proyecto es el{" "}
              <strong className="text-white">
                recurso complementario oficial
              </strong>{" "}
              de mi canal de YouTube. Aquí podrás{" "}
              <span className="text-emerald-500 font-bold">
                interactuar visualmente
              </span>{" "}
              con todos los conceptos que explico en los videos, experimentar
              con parámetros en tiempo real, y profundizar tu comprensión de
              Inteligencia Artificial de forma práctica.
            </p>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Cada episodio corresponde a un video del canal. Usa los controles
              interactivos para ver cómo funcionan los algoritmos por dentro.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <a
          href="https://www.youtube.com/watch?v=SEXrAwr-k58"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-rose-500 hover:bg-rose-400 text-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-xl shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Bell size={20} className="group-hover:animate-bounce" />
            <span className="text-xs font-black uppercase tracking-widest">
              Suscríbete
            </span>
          </div>
          <p className="text-[10px] opacity-90">
            Activa la campana para no perderte ningún video
          </p>
        </a>

        <a
          href="https://www.youtube.com/watch?v=SEXrAwr-k58"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <ThumbsUp size={20} className="group-hover:animate-bounce" />
            <span className="text-xs font-black uppercase tracking-widest">
              Dale Like
            </span>
          </div>
          <p className="text-[10px] opacity-90">
            Si te gusta el contenido, apóyame con tu like
          </p>
        </a>

        <a
          href="https://www.youtube.com/watch?v=SEXrAwr-k58"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-400 text-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare size={20} className="group-hover:animate-bounce" />
            <span className="text-xs font-black uppercase tracking-widest">
              Comenta
            </span>
          </div>
          <p className="text-[10px] opacity-90">
            Comparte tus dudas y sugerencias en los comentarios
          </p>
        </a>
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <Play size={20} className="text-emerald-500" />
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Lista de Episodios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {episodes.map((ep) => (
            <a
              key={ep.number}
              href={ep.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-slate-900 border ${ep.borderColor} hover:border-slate-700 p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-lg transition-all hover:scale-[1.02] group cursor-pointer block`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${ep.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <ep.icon size={24} className={ep.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${ep.color}`}
                    >
                      Episodio {ep.number}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-black text-white tracking-tight leading-tight">
                    {ep.title}
                  </h3>
                </div>
              </div>
              <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed">
                {ep.description}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 md:p-6 text-center">
        <p className="text-xs text-slate-500 leading-relaxed">
          💡 <strong className="text-slate-400">Tip:</strong> Navega por el menú
          lateral para acceder a cada episodio interactivo. Cada laboratorio
          incluye controles que puedes ajustar en tiempo real.
        </p>
      </div>
    </div>
  );
};
