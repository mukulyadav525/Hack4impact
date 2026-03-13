"use client";

import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  ShieldAlert, 
  ArrowUpRight,
  ChevronRight,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminStatsPage() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">System Dashboard</h1>
          <p className="text-slate-500">Global performance metrics for all connected departments.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
           <Activity size={14} />
           All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <AdminStatCard title="Total Audits" value="12,452" icon={BarChart3} trend="+12% wk" color="indigo" />
         <AdminStatCard title="Avg Accuracy" value="98.4%" icon={Globe} trend="Stable" color="emerald" />
         <AdminStatCard title="Total Rewards" value="₹12.4L" icon={TrendingUp} trend="+4.2L mon" color="blue" />
         <AdminStatCard title="Critical Risks" value="5" icon={ShieldAlert} trend="Needs Attention" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-xl font-black tracking-tight">Performance Ledger</h3>
                  <p className="text-sm text-slate-400 font-medium">Monthly scoring distribution across departments</p>
               </div>
               <button className="px-4 py-2 rounded-xl bg-slate-50 text-xs font-bold hover:bg-slate-100 transition-all">Q1 2024</button>
            </div>
            <div className="h-[300px] w-full bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 italic border-2 border-dashed border-slate-100">
               Global Comparison Bar Chart Placeholder
            </div>
         </div>

         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/10">
            <h3 className="text-lg font-black mb-8 flex items-center gap-2 text-indigo-400">
               <ShieldAlert size={18} />
               High-Risk Alerts
            </h3>
            <div className="space-y-6">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                       <ShieldAlert size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold leading-tight">Geofence Outlier Detected</p>
                       <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">PWD Dept • 2h ago</p>
                    </div>
                    <ArrowUpRight size={14} className="ml-auto text-slate-600" />
                 </div>
               ))}
            </div>
            <button className="w-full mt-8 py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
               View All Audit Logs
            </button>
         </div>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon: Icon, trend, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", colors[color])}>
          <Icon size={24} />
       </div>
       <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title}</p>
       <p className="text-4xl font-black text-slate-900 mb-2">{value}</p>
       <div className={cn("inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider", colors[color])}>
         {trend}
       </div>
    </div>
  );
}
