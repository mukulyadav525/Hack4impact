"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, ShieldAlert, Radio, TrendingUp, CheckCircle2, AlertTriangle, Users, Book } from "lucide-react";
import { StatCard, ActivityItem, InfoCard } from "./shared";
import Link from "next/link";

const API = "http://localhost:8000/api/v1";

export default function PoliceDashboard({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/police/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error("Failed to fetch police data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldAlert size={12} className="animate-pulse" /> Patrol Unit Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Officer {user?.name?.split(' ').slice(-1)[0] || "Officer"}
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            {user?.zone?.name || "Beat Zone"} · {user?.department?.name || "Haryana Police"}
          </p>
        </div>
        <Link href="/submissions" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all text-sm">
          <Radio size={16} /> Submit Patrol Report
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Patrol Coverage" value={data?.patrol_coverage.toString() || "88"} unit="% today" change="+2.1%" icon={MapPin} color="blue" />
        <StatCard title="Response Time" value={data?.avg_response_time.toString() || "4.2"} unit="min avg" change="Optimal" icon={Clock} color="indigo" />
        <StatCard title="Incidents Logged" value={data?.incidents_handled.toString() || "12"} unit="completed" icon={Book} color="green" />
        <StatCard title="Daily Score" value={data?.daily_score.toString() || "0"} unit="/100" change="Latest" icon={TrendingUp} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Quick Actions">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
                   <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">Check-in Beat</h4>
                      <p className="text-xs text-slate-500 mt-1">GPS verified patrol check-in</p>
                   </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
                   <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                      <ShieldAlert size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">PCR Response</h4>
                      <p className="text-xs text-slate-500 mt-1">Log arrival time at incident site</p>
                   </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group" onClick={() => window.location.href='/history'}>
                   <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Radio size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">Report Incident</h4>
                      <p className="text-xs text-slate-500 mt-1">Direct FIR/NCR/Diary entry</p>
                   </div>
                </button>
             </div>
          </InfoCard>

          <InfoCard title="Today's Beat Patrol Log">
            <div className="space-y-3">
              <ActivityItem icon={<MapPin size={16} className="text-blue-400" />} title="Beat Patrol Check — Sector 14" time="09:30 AM · GPS Verified" status="approved" />
              <ActivityItem icon={<Radio size={16} className="text-green-400" />} title="Traffic Monitoring — NH48" time="11:00 AM · 45 min active" status="approved" />
              <ActivityItem icon={<Users size={16} className="text-indigo-400" />} title="Community Meeting — Ward 7" time="02:00 PM · Verified" status="approved" />
            </div>
          </InfoCard>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-7 text-white relative overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.25)]">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <ShieldAlert size={28} className="mb-3 relative z-10" />
            <h3 className="font-bold text-lg mb-1">Daily Score</h3>
            <div className="text-4xl font-black mb-1">{data?.daily_score || 0}<span className="text-xl text-blue-200">/100</span></div>
            <p className="text-blue-200 text-sm">3 more patrols for Gold bonus</p>
          </div>

          <InfoCard title="Rank Normalization">
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-xs text-slate-400 leading-relaxed">
                    You are being compared against other <strong className="text-white">{user?.job_role || "Officers"}</strong> in the <strong className="text-white">{user?.zone?.district || "current"} district</strong>. Points represent role-specific excellence.
                </p>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
