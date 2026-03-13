/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { User, ShieldCheck, Heart, Clock, CheckCircle2, AlertTriangle, TrendingUp, Clipboard } from "lucide-react";
import { StatCard, ActivityItem, InfoCard } from "./shared";
import Link from "next/link";

export default function HealthcareDashboard({ user }: { user: any }) {
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
        <StatCard title="Patients Seen" value="42" unit="today" change="+12%" icon={User} color="green" />
        <StatCard title="Immunizations" value="18" unit="verified" change="Keep going!" icon={ShieldCheck} color="blue" />
        <StatCard title="Pending Reviews" value="3" unit="tasks" change="-2 from AM" icon={Clock} color="indigo" />
        <StatCard title="Compliance Score" value="98" unit="%" change="Excellent" icon={CheckCircle2} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Today's Clinical Log">
            <div className="space-y-3">
              <ActivityItem icon={<User size={16} className="text-emerald-400" />} title="Patient Consultation — Ward 3B" time="08:30 AM · 22 patients" status="approved" />
              <ActivityItem icon={<ShieldCheck size={16} className="text-blue-400" />} title="Immunization Drive — Village Outhouse" time="11:00 AM · 18 doses" status="approved" />
              <ActivityItem icon={<Heart size={16} className="text-red-400" />} title="Emergency Case — OPD" time="01:30 PM · Critical" status="review" />
              <ActivityItem icon={<Clipboard size={16} className="text-slate-400" />} title="Medicine Stock Verification" time="Pending" status="pending" />
            </div>
          </InfoCard>

          <InfoCard title="Scoring Insight">
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-emerald-300">Health Outreach Bonus Active</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-bold">+10 pts/drive</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Immunization drives and patient consultations are prioritized. Complete these tasks to earn up to <strong className="text-white">+20 bonus points</strong> daily.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[["Attendance", "30%"], ["Patient Quality", "40%"], ["Task Count", "30%"]].map(([l, v]) => (
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
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-7 text-white relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <Heart size={28} className="mb-3 relative z-10" />
            <h3 className="font-bold text-lg mb-1">Daily Score</h3>
            <div className="text-4xl font-black mb-1">94<span className="text-xl text-emerald-200">/100</span></div>
            <p className="text-emerald-200 text-sm">Top 3% in Health department</p>
          </div>

          <InfoCard title="Facility Info">
            <div className="space-y-3 text-sm">
              {[
                ["Hospital", user?.zone?.name || "Civil Hospital"],
                ["Dept", user?.department?.name || "Health & Family Welfare"],
                ["ID", user?.govt_id || "DOC-999"],
                ["Shift", "Morning OPD (08:00 – 16:00)"],
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
