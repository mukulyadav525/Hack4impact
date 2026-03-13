/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use client";

import { cn } from "@/lib/utils";

// Shared StatCard
export function StatCard({ title, value, unit, change, icon: Icon, color, onClick }: any) {
  const colors: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  };
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-[#1E3A5F]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4 hover:bg-[#1E3A5F]/60 transition-colors",
        onClick && "cursor-pointer active:scale-[0.98]"
      )}
    >
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-2xl border", colors[color])}>
          <Icon size={22} />
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          {change}
        </span>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-semibold mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-white">{value}</span>
          <span className="text-slate-500 text-sm font-medium">{unit}</span>
        </div>
      </div>
    </div>
  );
}

// Shared InfoCard
export function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <h2 className="text-lg font-bold text-white mb-5">{title}</h2>
      {children}
    </div>
  );
}

// Shared ActivityItem
const statusStyles: any = {
  approved: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  review:   "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  pending:  "bg-slate-500/10 border-slate-500/20 text-slate-400",
  rejected: "bg-red-500/10 border-red-500/20 text-red-400",
};
const statusLabel: any = { approved: "Approved", review: "In Review", pending: "Pending", rejected: "Rejected" };

export function ActivityItem({ icon, title, time, status }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-black/30 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-white truncate">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{time}</p>
      </div>
      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 uppercase tracking-wider", statusStyles[status])}>
        {statusLabel[status]}
      </span>
    </div>
  );
}
