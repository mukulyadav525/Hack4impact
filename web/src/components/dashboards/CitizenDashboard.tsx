/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { useState, useEffect } from "react";
import { MapPin, Star, TrendingUp, Award, CheckCircle2, Camera, AlertCircle } from "lucide-react";
import { StatCard, ActivityItem, InfoCard } from "./shared";
import Link from "next/link";

const API = "http://localhost:8000/api/v1";

export default function CitizenDashboard({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Star size={12} className="animate-pulse" /> Civic Champion
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome, {user?.name?.split(' ')[0] || "Citizen"}!
          </h1>
          <p className="text-slate-400 font-medium mt-1">Gurugram Community · Civic Participation Program</p>
        </div>
        <Link href="/submissions" className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all text-sm">
          <Camera size={16} /> Report an Issue
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Civic Reports" value={stats?.reports_submitted?.toString() || "3"} unit="approved" change="+1 this week" icon={CheckCircle2} color="blue" />
        <StatCard title="Impact Points" value={stats?.total_points?.toString() || "150"} unit="pts" change="+45 today" icon={Star} color="orange" />
        <StatCard title="Community Rank" value="12" unit="/150" change="Top 10%" icon={TrendingUp} color="green" />
        <StatCard title="Next Reward" value={stats?.points_to_next?.toString() || "100"} unit="pts needed" change="Keep reporting!" icon={Award} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Your Report History">
            <div className="space-y-3">
              <ActivityItem icon={<MapPin size={16} className="text-orange-400" />} title="Garbage Dump Report — Sector 14" time="2 days ago · AI Verified" status="approved" />
              <ActivityItem icon={<MapPin size={16} className="text-orange-400" />} title="Pothole Report — NH-48 Service Road" time="5 days ago · AI Verified" status="approved" />
              <ActivityItem icon={<AlertCircle size={16} className="text-yellow-400" />} title="Street Light Issue — Block-C" time="1 week ago · Under Review" status="review" />
            </div>
          </InfoCard>

          <InfoCard title="How to Earn More Points">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { type: "Garbage Dump", pts: "+20 pts", color: "orange" },
                { type: "Pothole Report", pts: "+20 pts", color: "orange" },
                { type: "Street Light Issue", pts: "+15 pts", color: "yellow" },
                { type: "Infrastructure Feedback", pts: "+10 pts", color: "blue" },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Camera size={14} className="text-orange-400" />
                    </div>
                    <span className="text-sm font-semibold text-white">{item.type}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{item.pts}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Points are awarded after AI verification (usually within 2 hours). Fake or duplicate reports are auto-rejected.
            </p>
          </InfoCard>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-7 text-white relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.25)]">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <Award size={28} className="mb-3 relative z-10" />
            <h3 className="font-bold text-lg mb-1">Impact Points</h3>
            <div className="text-4xl font-black mb-1">{stats?.total_points || 150}<span className="text-xl text-orange-200"> pts</span></div>
            <p className="text-orange-100 text-sm">{stats?.points_to_next || 100} more for Digital Certificate!</p>
            {/* Progress bar */}
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${stats?.progress_percent || 60}%` }} />
            </div>
            <p className="text-xs text-orange-200 mt-1">{stats?.progress_percent || 60}% to next reward</p>
          </div>

          <InfoCard title="Reward Milestones">
            <div className="space-y-3">
              {[
                { pts: "100 pts", reward: "Community Badge", done: true },
                { pts: "250 pts", reward: "Digital Certificate", done: false },
                { pts: "500 pts", reward: "Jan Dhan Bonus", done: false },
              ].map((m) => (
                <div key={m.pts} className={`flex items-center gap-3 p-3 rounded-xl border ${m.done ? "bg-emerald-500/10 border-emerald-500/20" : "bg-black/10 border-white/5"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${m.done ? "bg-emerald-500/30 text-emerald-400" : "bg-white/10 text-slate-400"}`}>
                    {m.done ? "✓" : "·"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{m.reward}</p>
                    <p className="text-[10px] text-slate-400">{m.pts}</p>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
