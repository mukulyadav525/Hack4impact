"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, Shield, Zap, Star, Calendar, AlertTriangle,
  CheckCircle2, ChevronDown, ChevronUp, Award, Flame
} from "lucide-react";

const API = "http://localhost:8000/api/v1";

const TIER_COLORS: Record<string, string> = {
  Platinum: "from-cyan-400 to-blue-500",
  Gold: "from-yellow-400 to-orange-500",
  Silver: "from-slate-300 to-slate-400",
  Bronze: "from-orange-700 to-orange-600",
  Diamond: "from-purple-400 to-pink-500",
};

const TIER_BG: Record<string, string> = {
  Platinum: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  Gold: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  Silver: "bg-slate-500/10 border-slate-500/20 text-slate-300",
  Bronze: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  Diamond: "bg-purple-500/10 border-purple-500/20 text-purple-400",
};

type DayScore = {
  date: string;
  total_score: number;
  attendance_score: number;
  work_score: number;
  quality_score: number;
  fraud_penalty: number;
  tier: string;
};

export default function ScoresPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/stats/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setStats(await res.json());
      } catch {}
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  const history: DayScore[] = stats?.daily_score_history || [];
  const monthly = stats?.monthly_summary || [];
  const tier = stats?.current_tier || "Bronze";
  const tierGradient = TIER_COLORS[tier] || TIER_COLORS.Bronze;
  const tierBg = TIER_BG[tier] || TIER_BG.Bronze;

  // Mini bar chart max
  const maxScore = Math.max(...history.map((d) => d.total_score), 1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-3 ${tierBg}`}>
          <Award size={12} /> {tier} Tier
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Score Breakdown</h1>
        <p className="text-slate-400 font-medium mt-1">Full transparency into how every point is calculated.</p>
      </div>

      {/* Tier + Progress */}
      <div className={`bg-gradient-to-br ${tierGradient} rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl`}>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Current Performance Tier</p>
              <h2 className="text-5xl font-black mt-1">{tier}</h2>
              <p className="text-white/80 mt-2 text-sm">{stats?.total_points?.toLocaleString() || 0} total points earned</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-black">{stats?.streak_count || 0}</div>
                <div className="text-white/70 text-xs font-semibold mt-1 flex items-center gap-1"><Flame size={10} /> Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black">{stats?.rewards_claimed || 0}</div>
                <div className="text-white/70 text-xs font-semibold mt-1">Gold Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black">{stats?.reports_submitted || 0}</div>
                <div className="text-white/70 text-xs font-semibold mt-1">Verified Tasks</div>
              </div>
            </div>
          </div>

          {/* Progress to next tier */}
          {stats?.next_tier && stats?.next_tier !== "Maxed" && (
            <div className="mt-8">
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>{tier}</span>
                <span>{stats?.next_tier} ({stats?.points_to_next} pts away)</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(stats?.progress_percent || 0, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score Explanation */}
      <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8">
        <h2 className="text-lg font-bold text-white mb-2">How Your Score is Calculated</h2>
        <p className="text-slate-400 text-sm mb-6">Every daily score is composed of the following components. All calculations are transparent and auditable.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Attendance", icon: CheckCircle2, color: "text-emerald-400", desc: "30% weight — geo-verified check-in", example: "100 pts if present" },
            { label: "Work Quality", icon: Star, color: "text-yellow-400", desc: "40% weight — AI-verified submission quality", example: "0–100 pts based on AI score" },
            { label: "Task Count", icon: Zap, color: "text-blue-400", desc: "30% weight — submission completion", example: "100 pts for completing tasks" },
            { label: "Fraud Penalty", icon: AlertTriangle, color: "text-red-400", desc: "Deducted for flagged submissions", example: "−50 pts per flag > 0.5 risk" },
          ].map((item) => (
            <div key={item.label} className="bg-black/20 rounded-2xl p-5 border border-white/5">
              <div className={`flex items-center gap-2 mb-3 ${item.color}`}>
                <item.icon size={18} />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
              <p className="text-xs font-bold text-white">{item.example}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
          <p className="text-xs text-blue-300">
            <strong>Climate Adjustment:</strong> During NDMA alerts or heatwaves, scores are multiplied by a <code className="bg-white/10 px-1 rounded">weight_multiplier</code> set by your District Admin. This appears in your score breakdown below.
          </p>
        </div>
      </div>

      {/* Daily Score History */}
      <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Daily Score History (Last 30 Days)</h2>
          <span className="text-xs text-slate-400">{history.length} records</span>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
            <Calendar size={32} className="opacity-30" />
            <p className="text-sm font-semibold">No score history yet</p>
            <p className="text-xs">Submit work proofs to start earning scores</p>
          </div>
        ) : (
          <>
            {/* Mini Bar Chart */}
            <div className="flex items-end gap-1 h-20 mb-6">
              {[...history].reverse().map((day, i) => {
                const height = Math.max((day.total_score / maxScore) * 80, 4);
                const tierC = day.tier === "Platinum" ? "bg-cyan-500" : day.tier === "Gold" ? "bg-yellow-500" : day.tier === "Silver" ? "bg-slate-400" : "bg-orange-600";
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title={`${day.date}: ${day.total_score}`}>
                    <div className={`w-full rounded-t ${tierC} opacity-80 group-hover:opacity-100 transition-all`} style={{ height: `${height}px` }} />
                  </div>
                );
              })}
            </div>

            {/* Table */}
            <div className="space-y-2">
              {history.map((day) => {
                const isExpanded = expanded === day.date;
                return (
                  <div key={day.date} className="rounded-2xl border border-white/5 bg-black/10 overflow-hidden">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : day.date)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-white w-24 text-left">{new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${TIER_BG[day.tier] || TIER_BG.Bronze}`}>{day.tier}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-white">{day.total_score}</span>
                        <span className="text-slate-500 text-xs">/100</span>
                        {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-white/5 pt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <ScoreComp label="Attendance" value={day.attendance_score} max={100} color="emerald" />
                          <ScoreComp label="Work" value={day.work_score} max={100} color="blue" />
                          <ScoreComp label="Quality" value={day.quality_score} max={100} color="yellow" />
                          <ScoreComp label="Fraud Penalty" value={-day.fraud_penalty} max={0} color="red" />
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                          Formula: (Attendance × 0.3) + (Quality × 0.4) + (Work × 0.3) + Bonus − Penalty × Climate Multiplier
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Monthly Summary */}
      {monthly.length > 0 && (
        <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8">
          <h2 className="text-lg font-bold text-white mb-6">Monthly Summaries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthly.map((m: any) => (
              <div key={`${m.year}-${m.month}`} className="bg-black/20 rounded-2xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">
                    {new Date(m.year, m.month - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </span>
                  {m.reward_eligible && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Reward Eligible</span>
                  )}
                </div>
                <div className="text-3xl font-black text-white mb-1">{m.total_score.toFixed(1)}</div>
                <div className="text-xs text-slate-400">Avg Quality: {m.avg_quality.toFixed(1)}/10 · Flags: {m.fraud_flags}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreComp({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  };
  return (
    <div className="bg-black/10 rounded-xl p-3 border border-white/5">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-black ${colorMap[color] || "text-white"}`}>
        {value >= 0 ? value.toFixed(1) : `−${Math.abs(value).toFixed(1)}`}
      </p>
    </div>
  );
}
