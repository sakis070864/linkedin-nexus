import React from 'react';
import { ProjectData, DevelopmentType } from '../types';
import { MOCK_PROJECTS } from '../constants';
import { 
  Building, 
  Square, 
  Coins, 
  Hammer, 
  FileText, 
  ArrowUpRight, 
  Layers, 
  Home,
  List,
  MapPin,
  Ban
} from 'lucide-react';

interface SidebarProps {
  project: ProjectData;
  setProject: (data: ProjectData) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ project, setProject }) => {
  // Demo restriction message
  const DEMO_MSG = "As this is a DEMO, you cannot input custom data as you would in the real version.";

  // Reusable Tooltip Component
  const DemoTooltip = () => (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 text-white text-[10px] leading-tight font-medium text-center rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 flex flex-col items-center gap-1 border border-slate-700">
      <div className="flex items-center gap-1 text-amber-500 font-bold uppercase tracking-wider text-[9px]">
        <Ban size={10} /> Demo Locked
      </div>
      {DEMO_MSG}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
    </div>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Disabled in Demo Mode
    return; 
    /* 
    const { name, value } = e.target;
    const numericValue = e.target.type === 'number' ? parseFloat(value) || 0 : value;
    setProject({ ...project, [name]: numericValue });
    */
  };

  const InputField = ({ label, name, icon: Icon, type = 'number', prefix = '', suffix = '' }: any) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="relative group">
        <DemoTooltip />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Icon size={16} />
        </div>
        <input
          type={type}
          name={name}
          value={project[name as keyof ProjectData] as any}
          readOnly
          className="block w-full pl-10 pr-12 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 outline-none cursor-not-allowed opacity-80"
          placeholder="0.00"
        />
        {(prefix || suffix) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 font-bold text-[10px]">
            {suffix || prefix}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Dubai Location</label>
        <div className="relative group">
          <DemoTooltip />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Building size={16} />
          </div>
          <input
            type="text"
            name="address"
            value={project.address}
            readOnly
            className="block w-full pl-10 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 outline-none cursor-not-allowed opacity-80"
            placeholder="Area / Plot No..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Plot Size" name="plotSize" icon={Square} suffix="m²" />
        <InputField label="Build Factor" name="buildFactor" icon={Layers} suffix="FAR" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Project Category</label>
        <div className="relative group">
          <DemoTooltip />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Home size={16} />
          </div>
          <select
            name="developmentType"
            value={project.developmentType}
            disabled
            className="block w-full pl-10 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 outline-none appearance-none cursor-not-allowed opacity-80"
          >
            <option value={DevelopmentType.HOUSES}>Villas/Townhouses</option>
            <option value={DevelopmentType.APARTMENTS}>Luxury Apartments</option>
            <option value={DevelopmentType.MIXED_USE}>Commercial/Retail</option>
          </select>
        </div>
      </div>

      <div className="pt-2 space-y-6 border-t border-slate-100">
        <InputField label="Plot Acquisition" name="plotCost" icon={Coins} suffix="AED" />
        <InputField label="Construction / m²" name="constructionCostPerM2" icon={Hammer} suffix="AED" />
        <InputField label="DLD & Consultant Fees" name="additionalExpenses" icon={FileText} suffix="AED" />
        <InputField label="Target Sale / m²" name="expectedSellingPricePerM2" icon={ArrowUpRight} suffix="AED" />
      </div>

      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
        <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
          <Layers size={14} /> GFA Capacity
        </div>
        <div className="text-2xl font-black text-slate-900">
          {(project.plotSize * project.buildFactor).toLocaleString()} <span className="text-xs font-normal text-slate-500 uppercase tracking-widest ml-1">Total m²</span>
        </div>
        <p className="text-[10px] text-amber-600 mt-1 opacity-75 italic">
          Max Gross Floor Area based on Dubai FAR rules
        </p>
      </div>

      {/* --- LIVE SCENARIOS LIST --- */}
      <div className="pt-6 border-t border-slate-100">
         <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <List size={14} className="text-slate-400" />
            <span>Load Live Market Scenarios</span>
         </div>
         
         {/* SCROLLABLE CONTAINER ADDED HERE */}
         <div className="space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
           {MOCK_PROJECTS.map((mock) => {
             const isActive = project.id === mock.id;
             return (
               <button
                 key={mock.id}
                 onClick={() => setProject(mock)}
                 className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                   isActive 
                    ? 'bg-slate-900 border-slate-900 shadow-lg scale-[1.02]' 
                    : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-md'
                 }`}
               >
                 {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />}
                 
                 <div className="flex flex-col gap-1.5 relative z-10">
                   <div className="flex items-start justify-between">
                     <span className={`text-xs font-bold leading-relaxed line-clamp-2 ${isActive ? 'text-white' : 'text-slate-700'}`}>
                        {mock.address}
                     </span>
                     {isActive && <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse shrink-0 mt-1.5" />}
                   </div>
                   
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                         {isActive ? <MapPin size={10} className="text-amber-500" /> : null}
                         <span className={`text-[10px] font-medium uppercase tracking-wide ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                           {mock.developmentType}
                         </span>
                      </div>
                      <span className={`text-[10px] font-mono ${isActive ? 'text-amber-400' : 'text-slate-400'}`}>
                        {mock.plotSize.toLocaleString()} m²
                      </span>
                   </div>
                 </div>
               </button>
             );
           })}
         </div>
      </div>
    </div>
  );
};

export default Sidebar;