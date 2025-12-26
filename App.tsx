import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Calculator as CalcIcon, 
  TrendingUp, 
  Linkedin, 
  Mail,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  MousePointerClick,
  Sliders,
  Bot,
  Save,
  Database
} from 'lucide-react';
import { ProjectData, FinancialResults, DevelopmentType, UnitScenario } from './types';
import { MOCK_PROJECTS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [project, setProject] = useState<ProjectData>(MOCK_PROJECTS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Financial Engine
  const results = useMemo((): FinancialResults => {
    const buildableArea = project.plotSize * project.buildFactor;
    const totalConstructionCost = buildableArea * project.constructionCostPerM2;
    const totalProjectCost = project.plotCost + totalConstructionCost + project.additionalExpenses;
    const totalRevenue = buildableArea * project.expectedSellingPricePerM2;
    const totalProfit = totalRevenue - totalProjectCost;
    const profitPerM2 = buildableArea > 0 ? totalProfit / buildableArea : 0;
    const roi = totalProjectCost > 0 ? (totalProfit / totalProjectCost) * 100 : 0;

    return {
      totalLandCost: project.plotCost,
      totalConstructionCost,
      totalAdditionalExpenses: project.additionalExpenses,
      totalProjectCost,
      buildableArea,
      totalRevenue,
      totalProfit,
      profitPerM2,
      roi
    };
  }, [project]);

  // Housing Scenario Logic adjusted for Dubai sizes
  const scenarios = useMemo((): UnitScenario[] => {
    const { buildableArea } = results;
    if (project.developmentType === DevelopmentType.HOUSES) {
      return [
        { type: 'Signature Villa', unitCount: 1, avgUnitSize: buildableArea, revenuePerUnit: results.totalRevenue },
        { type: 'Standard Townhouse', unitCount: Math.floor(buildableArea / 300), avgUnitSize: 300, revenuePerUnit: 300 * project.expectedSellingPricePerM2 }
      ];
    } else if (project.developmentType === DevelopmentType.APARTMENTS) {
      return [
        { type: 'Luxury 1BR', unitCount: Math.floor(buildableArea / 85), avgUnitSize: 85, revenuePerUnit: 85 * project.expectedSellingPricePerM2 },
        { type: 'Spacious 3BR', unitCount: Math.floor(buildableArea / 180), avgUnitSize: 180, revenuePerUnit: 180 * project.expectedSellingPricePerM2 },
        { type: 'Full Floor Penthouse', unitCount: Math.floor(buildableArea / 450), avgUnitSize: 450, revenuePerUnit: 450 * project.expectedSellingPricePerM2 }
      ];
    } else {
      return [
        { type: 'Prime Retail', unitCount: 1, avgUnitSize: buildableArea * 0.2, revenuePerUnit: (buildableArea * 0.2) * project.expectedSellingPricePerM2 * 1.5 },
        { type: 'Office Suites', unitCount: Math.floor((buildableArea * 0.8) / 120), avgUnitSize: 120, revenuePerUnit: 120 * project.expectedSellingPricePerM2 }
      ];
    }
  }, [results, project]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 relative">
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-xl lg:shadow-none flex flex-col`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="text-amber-600" size={28} />
            <h1 className="text-xl font-black tracking-tighter text-slate-800">ESTATE<span className="text-amber-600">NEXUS</span></h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Sidebar project={project} setProject={setProject} />
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
          <button 
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Save size={18} /> Save Data
          </button>

          <a 
            href="https://www.linkedin.com/in/sakis-athan/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0077b5] text-white rounded-lg font-bold text-sm hover:bg-[#006399] transition-colors shadow-sm"
          >
            <Linkedin size={18} /> Contact Sakis
          </a>
          
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-amber-700 border-2 border-amber-400/60 rounded-lg font-bold text-sm hover:bg-amber-50 transition-all shadow-md animate-pulse"
          >
            <HelpCircle size={18} /> How to Use Demo
          </button>

          <a 
            href="mailto:sakissystems@gmail.com?subject=Request%20Feasibility%20Study%20-%20EstateNexus&body=Hello%20Sakis,%0A%0AI%20am%20interested%20in%20discussing%20a%20potential%20real%20estate%20project%20simulation.%0A%0APlease%20contact%20me."
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors shadow-sm"
          >
            <Mail size={18} /> Request Feasibility
          </a>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={12} className="text-amber-400" /> AI Analyst Ready
            </div>
            <div className="hidden md:flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <MapPin size={14} className="text-amber-500" /> 
              <span className="truncate max-w-[300px]">{project.address}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs border border-emerald-100 font-bold uppercase tracking-tighter">
                <TrendingUp size={14} />
                Yield: {results.roi.toFixed(1)}%
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dubai Plots</span>
                <select 
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2 outline-none"
                  onChange={(e) => {
                    const selected = MOCK_PROJECTS.find(p => p.id === e.target.value);
                    if (selected) setProject(selected);
                  }}
                  value={project.id}
                >
                  {MOCK_PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>{p.address.split(',')[0]}</option>
                  ))}
                </select>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Dashboard 
            project={project} 
            results={results} 
            scenarios={scenarios}
          />
        </main>
      </div>

      {/* --- SAVE DATA MODAL --- */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
                  <Database size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Database Integration</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  In a real-world application, this button would save user-generated plots to the database, automatically updating the dashboard list in real-time.
                </p>
             </div>
             <div className="bg-slate-50 p-4 flex justify-center border-t border-slate-100">
               <button 
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg text-sm hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- HELP MODAL POPUP --- */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-lg text-white">
                   <Building2 size={20} />
                </div>
                <div>
                   <h2 className="text-xl font-black text-white tracking-tight">How to Use EstateNexus</h2>
                   <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Interactive Investment Simulator</p>
                </div>
              </div>
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8 overflow-y-auto">
              
              <div className="flex gap-4 group">
                 <div className="shrink-0 w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                   <MousePointerClick size={22} />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-800 mb-1">1. Select a Scenario</h3>
                   <p className="text-slate-500 text-sm leading-relaxed">
                     Start by choosing a pre-loaded Dubai market scenario from the <strong>Sidebar</strong> list (e.g., Palm Jumeirah Villa, Downtown Apartment).
                   </p>
                 </div>
              </div>

              <div className="flex gap-4 group">
                 <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                   <Sliders size={22} />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-800 mb-1">2. Review Parameters</h3>
                   <p className="text-slate-500 text-sm leading-relaxed">
                     Observe the configured <strong>Plot Size</strong>, <strong>Acquisition Cost</strong>, and <strong>Target Sale Price</strong> for the selected scenario. <span className="italic text-emerald-600 font-medium">Note: In this Demo version, manual input fields are read-only.</span>
                   </p>
                 </div>
              </div>

              <div className="flex gap-4 group">
                 <div className="shrink-0 w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                   <Bot size={22} />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-800 mb-1">3. AI Analysis</h3>
                   <p className="text-slate-500 text-sm leading-relaxed">
                     Click the <strong>Generate Feasibility Study</strong> button. The AI will analyze your specific numbers against real-time Dubai market trends to give a verdict.
                   </p>
                 </div>
              </div>

              {/* Developer Note */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                 <div className="p-4 bg-amber-200 rounded-xl border border-amber-300 text-xs text-black leading-relaxed text-justify shadow-sm">
                   <p>
                     <strong>Developer Note:</strong> This app was created as a demo by <strong>Athanasios (Sakis) Athanasopoulos</strong>, who holds all rights. 
                     Additional features can be added according to client requirements. 
                     <br /><br />
                     For communication with the engineer, please email: <a href="mailto:sakissystems@gmail.com" className="text-blue-900 font-bold hover:underline">sakissystems@gmail.com</a>
                   </p>
                 </div>
                 <div className="flex justify-end">
                  <button 
                    onClick={() => setIsHelpOpen(false)}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                  >
                    Got it, Let's Build
                  </button>
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default App;