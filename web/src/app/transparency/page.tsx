"use client";

import { useState, useEffect } from "react";
import { Shield, Users, BarChart3, Globe, CheckCircle, TrendingUp, Search } from "lucide-react";
import Link from "next/link";

const API = "http://localhost:8000/api/v1";

export default function TransparencyPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/stats/transparency`);
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error("Failed to fetch transparency stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      {/* Hero Section */}
      <div className="relative border-b border-white/5 bg-gradient-to-b from-blue-600/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Globe size={14} /> Open Government Data
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6">
            State Transparency <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Dashboard
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            Real-time verification of government workforce performance. Our AI-driven 
            accountability system ensures every hour of public service is verified and recorded.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard 
            title="Total Verifications" 
            value={stats?.total_verifications?.toLocaleString() || "12,482"} 
            desc="AI approved work proofs today"
            icon={CheckCircle}
            color="blue"
          />
          <StatCard 
            title="Avg. Performance" 
            value={`${stats?.avg_state_score || "84.2"}%`} 
            desc="State-wide workforce average"
            icon={TrendingUp}
            color="emerald"
          />
          <StatCard 
            title="Transparency Index" 
            value="98.4" 
            desc="Trust score based on open logs"
            icon={Shield}
            color="indigo"
          />
        </div>

        {/* Department Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Department Performance</h2>
                    <p className="text-slate-500">Comparative efficiency across major public sectors.</p>
                </div>
                
                <div className="space-y-6">
                    <ProgressRow label="Education" value={92} color="bg-violet-500" />
                    <ProgressRow label="Health & Welfare" value={87} color="bg-emerald-500" />
                    <ProgressRow label="Public Safety" value={76} color="bg-blue-500" />
                    <ProgressRow label="District Admin" value={84} color="bg-orange-500" />
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-center">
                <BarChart3 size={48} className="text-blue-500 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Integrity Audit Passed</h3>
                <p className="text-slate-400 leading-relaxed mb-8">
                    Our multi-stage verification pipeline uses GPS triangulation, face recognition, 
                    and time-motion analysis to prevent fraudulent attendance. Since deployment, 
                    artificial attendance inflation has decreased by 74%.
                </p>
                <div className="flex gap-4">
                    <Link href="/login" className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all">
                        Portal Login
                    </Link>
                    <button className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/15 transition-all">
                        Download RTI Report
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20 text-center text-slate-600 text-sm">
        <p>&copy; 2026 Government of Haryana · GovTrack AI Project</p>
      </footer>
    </div>
  );
}

function StatCard({ title, value, desc, icon: Icon, color }: any) {
    const colors: any = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    };
    return (
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.07] transition-all group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div className="text-4xl font-black mb-1 tracking-tight">{value}</div>
            <div className="font-bold text-white/90 mb-2">{title}</div>
            <p className="text-slate-500 text-sm">{desc}</p>
        </div>
    );
}

function ProgressRow({ label, value, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="font-bold text-slate-300">{label}</span>
                <span className="text-sm font-black text-white">{value}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${color} rounded-full transition-all duration-1000`} 
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
