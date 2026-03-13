"use client";

import { useState, useEffect } from "react";
import { Globe, TrendingUp, Users, Shield, BarChart2, CheckCircle2 } from "lucide-react";

const API = "http://localhost:8000/api/v1";

const DEPT_COLORS: Record<string, string> = {
  EDU:   "from-blue-500 to-indigo-600",
  HFW:   "from-emerald-500 to-teal-600",
  POL:   "from-violet-500 to-purple-600",
  ADMIN: "from-amber-500 to-orange-600",
  PUBLIC:"from-pink-500 to-rose-600",
};

export default function TransparencyPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/stats/public`);
        if (res.ok) {
          setStats(await res.json());
        }
      } catch {
        // Fallback mock data for demo
        setStats({
          last_updated: new Date().toISOString(),
          departments: [
            { name: "Education", code: "EDU", employees: 1240, avg_score: 78.4, verification_rate: 92, fraud_caught: 3 },
            { name: "Healthcare", code: "HFW", employees: 870, avg_score: 82.1, verification_rate: 95, fraud_caught: 1 },
            { name: "Police", code: "POL", employees: 1650, avg_score: 74.6, verification_rate: 88, fraud_caught: 7 },
            { name: "Administration", code: "ADMIN", employees: 430, avg_score: 71.2, verification_rate: 85, fraud_caught: 2 },
          ],
          platform_summary: {
            total_verifications: 48293,
            fraud_detected_rate: 0.8,
            avg_state_score: 76.6,
            active_employees: 4190,
          }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  const ps = stats?.platform_summary;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Globe size={12} /> Public Portal
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Transparency Dashboard</h1>
        <p className="text-slate-400 font-medium mt-1">
          Aggregate government workforce performance data — open to all citizens.
          Last updated: {stats?.last_updated ? new Date(stats.last_updated).toLocaleString("en-IN") : "Today"}
        </p>
      </div>

      {/* RTI Notice */}
      <div className="flex items-start gap-3 p-5 rounded-2xl bg-teal-500/5 border border-teal-500/15">
        <CheckCircle2 size={18} className="text-teal-400 shrink-0 mt-0.5" />
        <div className="text-sm text-teal-200">
          <strong>Right to Information Notice:</strong> This data is published in accordance with the RTI Act, 2005. Department-level averages are published monthly. No personally identifiable information of individual employees is disclosed here.
        </div>
      </div>

      {/* Platform Summary */}
      {ps && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Work Verifications", value: ps.total_verifications?.toLocaleString(), icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Active Employees", value: ps.active_employees?.toLocaleString(), icon: Users, color: "text-blue-400" },
            { label: "State Avg Score", value: `${ps.avg_state_score}/100`, icon: TrendingUp, color: "text-yellow-400" },
            { label: "Fraud Detection Rate", value: `${ps.fraud_detected_rate}%`, icon: Shield, color: "text-red-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-2xl border border-white/5 p-5">
              <s.icon size={20} className={`${s.color} mb-3`} />
              <div className={`text-2xl font-black text-white`}>{s.value}</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Department Cards */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 size={18} className="text-white" />
          <h2 className="text-lg font-bold text-white">Department Performance Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {(stats?.departments || []).map((dept: any) => {
            const gradient = DEPT_COLORS[dept.code] || "from-slate-500 to-slate-600";
            const barWidth = Math.min(dept.avg_score, 100);
            return (
              <div key={dept.code} className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-6 overflow-hidden relative">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient}`} />
                <div className="pl-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                      <p className="text-xs text-slate-400">{dept.employees?.toLocaleString()} employees · {dept.code}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{dept.avg_score?.toFixed(1)}</div>
                      <div className="text-[10px] text-slate-400">avg score</div>
                    </div>
                  </div>

                  {/* Score Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Performance</span>
                      <span>{dept.avg_score?.toFixed(1)}/100</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${gradient} rounded-full`} style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/10 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Verification Rate</p>
                      <p className="text-sm font-bold text-emerald-400">{dept.verification_rate}%</p>
                    </div>
                    <div className="bg-black/10 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Fraud Cases</p>
                      <p className="text-sm font-bold text-red-400">{dept.fraud_caught} caught</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-[#1E3A5F]/20 rounded-3xl border border-white/5 p-6">
        <h3 className="text-sm font-bold text-white mb-3">Scoring Methodology (Public)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div>
            <p className="font-bold text-slate-300 mb-1">Data Source</p>
            <p>Daily scores are computed nightly by the GovTrack AI engine from geo-verified attendance and AI-reviewed work proofs.</p>
          </div>
          <div>
            <p className="font-bold text-slate-300 mb-1">Role Normalization</p>
            <p>Scores are normalized within the same role band and grade band. A constable is never compared to an inspector.</p>
          </div>
          <div>
            <p className="font-bold text-slate-300 mb-1">Fraud Detection</p>
            <p>An AI model checks for duplicate submissions, GPS anomalies, and low-confidence image uploads. All flags undergo human review.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
