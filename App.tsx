import { Menu, Zap } from "lucide-react";
import React, { useState } from "react";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Ep1Page } from "./pages/Ep1Page";
import { Ep2Page } from "./pages/Ep2Page";
import { Ep3Page } from "./pages/Ep3Page";
import { Ep4Page } from "./pages/Ep4Page";
import { Ep5Page } from "./pages/Ep5Page";
import { Ep6Page } from "./pages/Ep6Page";
import { Intro } from "./pages/Intro";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex bg-slate-950 text-slate-50 min-h-screen font-sans selection:bg-emerald-500 selection:text-slate-950">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Mobile Header - Glassmorphism */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="text-slate-950 fill-slate-950" size={18} />
            </div>
            <span className="font-black text-white text-sm tracking-tighter uppercase">
              Sebas Tech Lab
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-emerald-500 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <main className="flex-1 w-full lg:ml-72 p-4 md:p-8 lg:p-10 pt-20 lg:pt-10 min-h-screen overflow-x-hidden transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Intro />} />
              <Route path="/ep1" element={<Ep1Page />} />
              <Route path="/ep2" element={<Ep2Page />} />
              <Route path="/ep3" element={<Ep3Page />} />
              <Route path="/ep4" element={<Ep4Page />} />
              <Route path="/ep5" element={<Ep5Page />} />
              <Route path="/ep6" element={<Ep6Page />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
