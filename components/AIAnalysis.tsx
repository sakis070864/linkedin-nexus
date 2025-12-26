import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ProjectData, FinancialResults } from '../types';
import { 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3,
  Target,
  X,
  FileText,
  Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar
} from 'recharts';

interface AIAnalysisProps {
  project: ProjectData;
  results: FinancialResults;
}

interface AIResponseData {
  executive_summary: string;
  project_score: number;
  projection_data: Array<{ year: string; value: number }>;
  market_sentiment: Array<{ name: string; value: number }>;
  competitor_comparison: Array<{ metric: string; project: number; market: number }>;
  verdict: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ project, results }) => {
  const [data, setData] = useState<AIResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to render text with bold highlights (e.g. **15%**)
  const renderRichText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className="text-amber-400 font-bold px-1 bg-amber-500/10 rounded mx-0.5 border border-amber-500/20">
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={index} className="text-slate-300">{part}</span>;
    });
  };

  const generateAnalysis = async () => {
    const apiKey = (window as any).process?.env?.API_KEY;
    
    if (!apiKey) {
      setError("AI Service Unavailable: Missing API configuration.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const prompt = `
        You are a high-end Real Estate Investment Analyst for Dubai.
        Analyze this project:
        - Address: ${project.address}
        - Type: ${project.developmentType}
        - Total Cost: AED ${results.totalProjectCost}
        - Total Profit: AED ${results.totalProfit}
        - ROI: ${results.roi.toFixed(2)}%
        - Sale Price Target: AED ${project.expectedSellingPricePerM2}/m2

        Return a JSON object strictly with this structure:
        {
          "executive_summary": "Short paragraph (max 40 words). Highlight key numbers using **bold** syntax.",
          "project_score": 85, // An integer 0-100 representing feasibility strength.
          "projection_data": [
            {"year": "Y1", "value": 100}, 
            {"year": "Y2", "value": 110}, 
            {"year": "Y3", "value": 130}, 
            {"year": "Y4", "value": 145}, 
            {"year": "Y5", "value": 160}
          ],
          "market_sentiment": [
            {"name": "Demand", "value": 70},
            {"name": "Supply", "value": 30}
          ],
          "competitor_comparison": [
            {"metric": "Yield (%)", "project": ${results.roi.toFixed(1)}, "market": 10.5},
            {"metric": "Price (AED/m²)", "project": ${project.expectedSellingPricePerM2}, "market": ${Math.round(project.expectedSellingPricePerM2 * 0.9)}}
          ],
          "verdict": "One distinct strategic advice sentence."
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedData = JSON.parse(cleanJson);
          setData(parsedData);
        } catch (e) {
          throw new Error("Failed to parse AI financial models.");
        }
      } else {
        throw new Error("Empty response from AI");
      }
      
    } catch (err: any) {
      console.error("AI Error:", err);
      setError(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const CHART_COLORS = ['#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl border border-slate-800 overflow-hidden relative group">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="p-6 sm:p-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white">Dubai Strategic AI</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Generative Market Intelligence</p>
            </div>
          </div>
          
          {!data && !loading && (
            <button
              onClick={generateAnalysis}
              className="px-6 py-3 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2"
            >
              <Sparkles size={16} className="text-amber-600" />
              Generate Feasibility Study
            </button>
          )}

          {data && (
            <button
              onClick={() => setData(null)}
              className="px-4 py-2 bg-slate-800 text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2 border border-slate-700"
            >
              <X size={14} /> Close Report
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-amber-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={20} className="text-amber-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-white text-sm font-bold tracking-wide">Synthesizing Market Data</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest">Crunching DLD Transactions & Trends...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium mb-4">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Results View */}
        {data && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Project Context Header */}
            <div className="flex flex-col gap-1 pb-4 border-b border-slate-700/50">
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest">
                <FileText size={14} /> Investment Memo
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                {project.address}
              </h2>
            </div>

            {/* 1. Executive Summary & Strength Circle */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-center">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-700 rounded-lg shrink-0">
                    <Target size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Executive Summary</h4>
                    <p className="text-base leading-relaxed text-slate-200 font-light">
                      {renderRichText(data.executive_summary)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strength Circle */}
              <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/5 blur-2xl"></div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 z-10">Feasibility Score</h4>
                <div className="w-[140px] h-[140px] relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="80%" 
                      outerRadius="100%" 
                      barSize={10} 
                      data={[{ name: 'score', value: data.project_score, fill: '#10b981' }]} 
                      startAngle={180} 
                      endAngle={0}
                    >
                      <RadialBar background={{ fill: '#334155' }} dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                     <span className="text-3xl font-black text-white">{data.project_score}</span>
                     <span className="text-[9px] text-emerald-400 font-bold uppercase">Strong</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: 5-Year Projection */}
              <div className="lg:col-span-2 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <TrendingUp size={16} className="text-amber-500" /> 
                    5-Year Capital Appreciation
                  </h4>
                  <span className="text-[10px] text-slate-500 bg-slate-900/80 px-2 py-1 rounded border border-slate-700">Index Base: 100</span>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.projection_data}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 10', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Sentiment */}
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50 flex flex-col">
                 <div className="flex items-center gap-2 mb-4">
                    <PieIcon size={16} className="text-emerald-500" />
                    <h4 className="text-sm font-bold text-slate-300">Market Drivers</h4>
                 </div>
                 <div className="flex-1 min-h-[160px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.market_sentiment}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {data.market_sentiment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }} 
                          itemStyle={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-slate-500">RATIO</span>
                    </div>
                 </div>
                 <div className="flex justify-center gap-4 mt-2">
                    {data.market_sentiment.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                        <span className="text-[10px] text-slate-400 font-medium">{entry.name}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

             {/* Chart 3: Benchmark (Custom Progress Bars) & Verdict */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={16} className="text-blue-500" />
                    <h4 className="text-sm font-bold text-slate-300">Performance vs Market</h4>
                  </div>
                  
                  {/* Custom Comparison Rows - Solves the scale issue */}
                  <div className="space-y-5">
                    {data.competitor_comparison.map((item, idx) => {
                      const maxVal = Math.max(item.project, item.market) * 1.1; // Add 10% buffer
                      const projPct = (item.project / maxVal) * 100;
                      const mktPct = (item.market / maxVal) * 100;
                      
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <span>{item.metric}</span>
                            <div className="flex gap-3">
                               <span className="text-emerald-400">{item.project.toLocaleString()}</span>
                               <span className="text-slate-500">{item.market.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="relative h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                            {/* Market Bar (Gray) */}
                            <div 
                              className="absolute top-0 left-0 h-full bg-slate-500 rounded-full opacity-40" 
                              style={{ width: `${mktPct}%` }}
                            />
                            {/* Project Bar (Green) */}
                            <div 
                              className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                              style={{ width: `${projPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-end gap-4 mt-4">
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500"></div><span className="text-[10px] text-slate-400">Project</span></div>
                     <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-slate-500 opacity-50"></div><span className="text-[10px] text-slate-400">Market Avg</span></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 flex flex-col justify-center relative overflow-hidden">
                   <Activity className="absolute right-[-10px] bottom-[-10px] text-amber-500/10 rotate-12" size={120} />
                   <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 z-10">Strategic Verdict</h4>
                   <p className="text-sm font-medium text-slate-200 italic leading-relaxed z-10">
                     "{data.verdict}"
                   </p>
                </div>
             </div>

          </div>
        )}

        {!data && !loading && !error && (
          <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-800/20">
            <p className="text-slate-500 text-sm font-medium">AI Engine Standing By. Ready to ingest plot metrics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;