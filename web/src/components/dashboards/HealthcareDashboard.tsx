"use client";

import { useState, useEffect } from "react";
import { User, ShieldCheck, Heart, Clock, CheckCircle2, AlertTriangle, TrendingUp, Clipboard, Activity, Stethoscope, Star } from "lucide-react";
import { StatCard, ActivityItem, InfoCard } from "./shared";
import Link from "next/link";

const API = "http://localhost:8000/api/v1";

export default function HealthcareDashboard({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/doctors/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error("Failed to fetch doctor data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart size={12} className="animate-pulse" /> Health Worker
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dr. {user?.name?.split(' ').slice(-1)[0] || "Doctor"}</h1>
          <p className="text-slate-400 font-medium mt-1">{user?.job_role || "Senior Resident"} · {user?.zone?.name || "Civil Hospital"}</p>
        </div>
        <Link href="/submissions" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all text-sm">
          <Clipboard size={16} /> Submit Patient Report
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Patients Seen" value={data?.patients_seen_today.toString() || "42"} unit="today" icon={User} color="green" />
        <StatCard title="Response Time" value={data?.avg_response_time.toString() || "4.5"} unit="mins" change="Target: <5m" icon={Clock} color="blue" />
        <StatCard title="Feedback" value={data?.feedback_score.toString() || "4.8"} unit="/5.0" change="Verified" icon={Star} color="orange" />
        <StatCard title="Daily Score" value={data?.daily_score.toString() || "0"} unit="/100" change="Latest" icon={TrendingUp} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Quick Actions">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
                   <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Stethoscope size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">Log OPD Session</h4>
                      <p className="text-xs text-slate-500 mt-1">Record patient count and timings</p>
                   </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
                   <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Activity size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">Verify Ward Rounds</h4>
                      <p className="text-xs text-slate-500 mt-1">Submit visual proof of visits</p>
                   </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
                   <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Clipboard size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">Prescription Scan</h4>
                      <p className="text-xs text-slate-500 mt-1">AI verified prescription logging</p>
                   </div>
                </button>
             </div>
          </InfoCard>

          <InfoCard title="Today's Clinical Log">
            <div className="space-y-3">
              <ActivityItem icon={<User size={16} className="text-emerald-400" />} title="Patient Consultation — Ward 3B" time="08:30 AM · 22 patients" status="approved" />
              <ActivityItem icon={<ShieldCheck size={16} className="text-blue-400" />} title="Immunization Drive — Village" time="11:00 AM · 18 doses" status="approved" />
              <ActivityItem icon={<Heart size={16} className="text-red-400" />} title="Emergency Case — OPD" time="01:30 PM · Verified" status="approved" />
            </div>
          </InfoCard>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-7 text-white relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <Heart size={28} className="mb-3 relative z-10" />
            <h3 className="font-bold text-lg mb-1">Daily Score</h3>
            <div className="text-4xl font-black mb-1">{data?.daily_score || 0}<span className="text-xl text-emerald-200">/100</span></div>
            <p className="text-emerald-200 text-sm">Top 3% in Health department</p>
          </div>

          <InfoCard title="Scoring Multipliers">
            <div className="space-y-3">
                <div className="flex justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                    <span className="text-xs text-slate-400">Emergency Response</span>
                    <span className="text-xs font-bold text-emerald-400">1.5x</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                    <span className="text-xs text-slate-400">Night Shift</span>
                    <span className="text-xs font-bold text-emerald-400">1.2x</span>
                </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
