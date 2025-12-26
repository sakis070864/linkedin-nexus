
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  ProjectData, 
  FinancialResults, 
  UnitScenario 
} from '../types';
import { 
  TrendingUp, 
  Activity, 
  Box, 
  LayoutGrid, 
  Maximize2,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import MapsView from './MapsView';
import AIAnalysis from './AIAnalysis';

interface DashboardProps {
  project: ProjectData;
  results: FinancialResults;
  scenarios: UnitScenario[];
}

const Dashboard: React.FC<DashboardProps> = ({ project, results, scenarios }) => {
  const COST_COLORS = ['#d4af37', '#10b981', '#6366f1', '#ef4444'];
  
  // Nice colors for the Yield Pie
  // Slate-700 for Cost, Emerald-500 for Profit
  const YIELD_COLORS = ['#334155', '#10b981']; 

  const costBreakdownData = [
    { name: 'Land Cost', value: results.totalLandCost },
    { name: 'Construction', value: results.totalConstructionCost },
    { name: 'Soft Costs', value: results.totalAdditionalExpenses },
  ];

  // Transformed data for the Pie Chart (Revenue Breakdown)
  const yieldPieData = [
    { name: 'Total Investment', value: results.totalProjectCost },
    { name: 'Net Profit', value: results.totalProfit },
  ];

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `AED ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `AED ${(val / 1000).toFixed(0)}k`;
    return `AED ${val}`;
  };

  const fullCurrency = (val: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={fullCurrency(results.totalRevenue)} 
          subValue={`Target: ${formatCurrency(project.expectedSellingPricePerM2)}/m²`}
          icon={<DollarSign className="text-blue-600" />}
          trend="+5.8%"
        />
        <StatCard 
          title="Total Profit" 
          value={fullCurrency(results.totalProfit)} 
          subValue={`${fullCurrency(results.profitPerM2)} per buildable m²`}
          icon={<TrendingUp className="text-emerald-600" />}
          trend="+15.2%"
          isSuccess
        />
        <StatCard 
          title="Project ROI" 
          value={`${results.roi.toFixed(2)}%`} 
          subValue={`Project Cost: ${formatCurrency(results.totalProjectCost)}`}
          icon={<Activity className="text-amber-600" />}
          trend="Dubai High"
        />
        <StatCard 
          title="Buildable Area" 
          value={`${results.buildableArea.toLocaleString()} m²`} 
          subValue={`Plot: ${project.plotSize} m²`}
          icon={<Maximize2 className="text-indigo-600" />}
        />
      </div>

      <AIAnalysis project={project} results={results} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Box className="text-blue-500" size={18} /> Cost Composition
            </h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COST_COLORS[index % COST_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => fullCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {costBreakdownData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{item.name}</span>
                <span className="font-bold text-slate-900">{((item.value / (results.totalProjectCost || 1)) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <LayoutGrid className="text-emerald-500" size={18} /> Financial Yield Structure
            </h3>
            <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Model</span>
          </div>
          <div className="flex-1 w-full min-h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={yieldPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {yieldPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={YIELD_COLORS[index % YIELD_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => fullCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value, entry: any) => <span className="text-slate-600 font-bold ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Revenue</span>
              <span className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(results.totalRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Dubai Parcel Location</h3>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-bold uppercase tracking-widest">GIS Integration</span>
          </div>
          <MapsView address={project.address} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Unit Distribution Scenarios</h3>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{results.buildableArea.toLocaleString()} m² GFA</div>
          </div>
          <div className="space-y-3">
            {scenarios.map((scenario, idx) => (
              <div key={idx} className="group flex items-center p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-amber-100">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-amber-600 group-hover:scale-110 transition-transform">
                  <Maximize2 size={18} />
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-bold text-slate-800">{scenario.type}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{scenario.unitCount} Units • ~{scenario.avgUnitSize}m²</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{formatCurrency(scenario.revenuePerUnit)}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Est. Value</div>
                </div>
                <ArrowRight className="ml-4 text-slate-300 group-hover:text-amber-500 transition-colors" size={16} />
              </div>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <span>* DLD Regulatory Projection</span>
              <button className="text-blue-600 hover:text-blue-800 transition-colors">Adjust Rules</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subValue, icon, trend, isSuccess }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-200 transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-amber-50 transition-colors">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{title}</h4>
      <div className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{value}</div>
      <p className="text-[11px] text-slate-500 font-medium">{subValue}</p>
    </div>
  </div>
);

export default Dashboard;
