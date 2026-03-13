/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { MapPin, Clock, ShieldAlert, Radio, TrendingUp, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import { StatCard, ActivityItem, InfoCard } from "./shared";
import Link from "next/link";

export default function PoliceDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldAlert size={12} className="animate-pulse" /> Patrol Unit Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Inspector {user?.name?.split(' ').slice(-1)[0] || "Officer"}
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            {user?.zone?.name || "Beat Zone"} · {user?.department?.name || "Haryana Police"}
          </p>
        </div>
        <Link href="/submissions" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all text-sm">
          <Radio size={16} /> Submit Patrol Report
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Patrol Coverage" value="88" unit="% today" change="+2.1%" icon={MapPin} color="blue" />
        <StatCard title="Response Time" value="4.2" unit="min avg" change="-0.5m faster" icon={Clock} color="indigo" />
        <StatCard title="Beat Checks" value="12" unit="completed" change="+4 today" icon={CheckCircle2} color="green" />
        <StatCard title="Active Alerts" value="2" unit="pending" change="Needs attention" icon={AlertTriangle} color="orange" />
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Today's Beat Patrol Log">
            <div className="space-y-3">
              <ActivityItem icon={<MapPin size={16} className="text-blue-400" />} title="Beat Patrol Check — Sector 14" time="09:30 AM · GPS Verified" status="approved" />
              <ActivityItem icon={<Radio size={16} className="text-green-400" />} title="Traffic Monitoring — NH48" time="11:00 AM · 45 min active" status="approved" />
              <ActivityItem icon={<Users size={16} className="text-indigo-400" />} title="Community Meeting — Ward 7" time="02:00 PM · Pending" status="pending" />
              <ActivityItem icon={<ShieldAlert size={16} className="text-orange-400" />} title="Crime Scene Verification" time="Unassigned" status="review" />
            </div>
          </InfoCard>

          <InfoCard title="Scoring Insight">
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-blue-300">Patrol Multiplier Active</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-bold">+5 pts/check</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every approved &quot;Beat Patrol Check&quot; earns an additional <strong className="text-white">+5 context bonus</strong> on top of base quality score. Focus on high-risk areas to maximize your monthly tier.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[["Attendance", "30%"], ["Patrol Quality", "40%"], ["Beat Count", "30%"]].map(([l, v]) => (
                  <div key={l} className="p-3 rounded-xl bg-black/20 border border-white/5">
                    <p className="text-lg font-bold text-white">{v}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </InfoCard>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-7 text-white relative overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.25)]">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <ShieldAlert size={28} className="mb-3 relative z-10" />
            <h3 className="font-bold text-lg mb-1">Daily Score</h3>
            <div className="text-4xl font-black mb-1">87<span className="text-xl text-blue-200">/100</span></div>
            <p className="text-blue-200 text-sm">3 more patrols to reach Gold tier</p>
          </div>

          <InfoCard title="Zone Info">
            <div className="space-y-3 text-sm">
              {[
                ["Station", user?.zone?.name || "Police Station East"],
                ["District", user?.zone?.district || "Gurugram"],
                ["ID", user?.govt_id || "POL-007"],
                ["Shift", "Morning (06:00 – 14:00)"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400">{k}</span>
                  <span className="font-bold text-white text-right">{v}</span>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
