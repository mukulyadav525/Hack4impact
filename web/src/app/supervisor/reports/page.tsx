/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { 
  BarChart, 
  FileText, 
  Download, 
  Filter,
  Users,
  Award,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupervisorReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Insights</h1>
          <p className="text-gray-500 dark:text-zinc-400">Performance analytics and operational reporting for your department.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all">
             <Download size={16} />
             Export Audit Logs
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <ReportStat 
          title="Avg Team Score" 
          value="78.2" 
          change="+4.5%" 
          color="blue" 
          icon={Users} 
         />
         <ReportStat 
          title="Top Performers" 
          value="8" 
          change="Eligible for Bonus" 
          color="green" 
          icon={Award} 
         />
         <ReportStat 
          title="Fraud Incident Rate" 
          value="1.2%" 
          change="-0.5% vs last mon" 
          color="red" 
          icon={AlertTriangle} 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Charts Placeholder */}
         <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-lg font-bold">Weekly Performance Trend</h3>
               <button className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-900"><Filter size={16} /></button>
            </div>
            <div className="h-[250px] w-full bg-gray-50 dark:bg-zinc-900/50 rounded-2xl flex items-center justify-center text-gray-400 italic">
               Performance Line Chart Placeholder (Recharts)
            </div>
         </div>

         {/* Available Reports List */}
         <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8">
            <h3 className="text-lg font-bold mb-8">Generated Reports</h3>
            <div className="space-y-4">
               <ReportItem title="Monthly Attendance Summary" date="Feb 2024" size="1.2 MB" />
               <ReportItem title="AI Verification Accuracy Audit" date="Feb 2024" size="432 KB" />
               <ReportItem title="Fraud & Risk Analysis Report" date="Jan 2024" size="2.4 MB" />
               <ReportItem title="Departmental Performance Ledger" date="Q1 2024" size="5.6 MB" />
            </div>
         </div>
      </div>
    </div>
  );
}

function ReportStat({ title, value, change, color, icon: Icon }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20",
    red: "text-red-600 bg-red-50 dark:bg-red-900/20",
  };
  return (
    <div className="bg-white dark:bg-black p-8 rounded-3xl border border-gray-100 dark:border-zinc-900">
       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", colors[color])}>
          <Icon size={24} />
       </div>
       <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
       <div className="flex items-baseline gap-2">
         <span className="text-3xl font-bold">{value}</span>
         <span className={cn("text-xs font-bold", color === "red" ? "text-red-500" : "text-green-500")}>
           {change}
         </span>
       </div>
    </div>
  );
}

function ReportItem({ title, date, size }: any) {
   return (
     <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 hover:bg-blue-50/50 transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-all">
              <FileText size={18} />
           </div>
           <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">{date} • {size}</p>
           </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-blue-600 transition-all">
           <Download size={18} />
        </button>
     </div>
   );
}
