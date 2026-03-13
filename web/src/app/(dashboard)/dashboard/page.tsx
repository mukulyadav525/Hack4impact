"use client";

import { 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/v1/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || "Employee"}</h1>
        <p className="text-slate-400 font-medium">Here's an overview of your performance today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Score" 
          value="92" 
          unit="/100" 
          change="+5.2%" 
          icon={TrendingUp}
          color="blue"
        />
        <StatCard 
          title="Attendance Streak" 
          value="12" 
          unit="days" 
          change="Keep it up!" 
          icon={Calendar}
          color="indigo"
        />
        <StatCard 
          title="Tasks Completed" 
          value="8" 
          unit="today" 
          change="+2 from yesterday" 
          icon={CheckCircle2}
          color="green"
        />
        <StatCard 
          title="Tier Status" 
          value="Gold" 
          unit="" 
          change="Top 5% in Dept" 
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HistoryIcon /> Recent Activity
            </h2>
            
            {/* Activity List Placeholder */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-black/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Attendance Verified</p>
                    <p className="text-xs text-slate-400 font-medium">2 hours ago • Zone 12-B</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-[0_0_30px_rgba(59,130,246,0.2)] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <CameraIcon /> Check-in Required
            </h2>
            <p className="text-blue-100 text-sm mb-6 font-medium">Please complete your biometric check-in to begin your daily tasks.</p>
            <button className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2">
              Start Check-in
            </button>
          </div>
          
          <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 text-slate-200">Department Info</h2>
            <div className="space-y-4 text-sm bg-black/20 p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-slate-400 font-medium">Department</span>
                <span className="font-bold">PWD Haryana</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 font-medium">Zone</span>
                <span className="font-bold">Gurugram-II</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, change, icon: Icon, color }: any) {
  const colors: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(251,146,60,0.1)]",
  };

  return (
    <div className="bg-[#1E3A5F]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-4 relative overflow-hidden group hover:bg-[#1E3A5F]/60 transition-colors">
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-2xl border", colors[color])}>
          <Icon size={24} />
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

// Simple icon helpers for the redesign
function HistoryIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;
}

function CameraIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
}
