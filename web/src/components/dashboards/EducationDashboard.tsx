/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { BookOpen, Users, Star, Calendar, CheckCircle2, TrendingUp, Clipboard } from "lucide-react";
import { StatCard, ActivityItem, InfoCard } from "./shared";
import Link from "next/link";

export default function EducationDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen size={12} /> Education Staff
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{user?.name || "Teacher"}</h1>
          <p className="text-slate-400 font-medium mt-1">{user?.job_role || "PGT Teacher"} · {user?.zone?.name || "Govt. School"}</p>
        </div>
        <Link href="/submissions" className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all text-sm">
          <Clipboard size={16} /> Submit Class Report
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Attendance Rate" value="94" unit="%" change="+1.2%" icon={Users} color="blue" />
        <StatCard title="Classes Taken" value="6" unit="/6 today" change="Complete!" icon={Calendar} color="indigo" />
        <StatCard title="Curriculum Progress" value="72" unit="%" change="+5% this week" icon={TrendingUp} color="green" />
        <StatCard title="Student Feedback" value="4.8" unit="/5.0" change="Very High" icon={Star} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Today's Class Log">
            <div className="space-y-3">
              <ActivityItem icon={<BookOpen size={16} className="text-violet-400" />} title="Mathematics — Class X-A (40 students)" time="08:00 AM · Attendance recorded" status="approved" />
              <ActivityItem icon={<Users size={16} className="text-blue-400" />} title="Physics — Class XI-B (35 students)" time="10:00 AM · Lab session" status="approved" />
              <ActivityItem icon={<Clipboard size={16} className="text-emerald-400" />} title="Mid-day Meal Check" time="12:30 PM · Verified" status="approved" />
              <ActivityItem icon={<Star size={16} className="text-orange-400" />} title="Resource Verification — Library" time="03:00 PM · Pending" status="pending" />
            </div>
          </InfoCard>

          <InfoCard title="Scoring Insight">
            <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-violet-300">Class Consistency Bonus</span>
                <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-1 rounded-full font-bold">+8 pts/record</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Daily Class Attendance Records contribute directly to your quality index. Maintain consistency for <strong className="text-white">higher rewards eligibility</strong>.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[["Attendance", "30%"], ["Class Quality", "40%"], ["Record Count", "30%"]].map(([l, v]) => (
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
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-7 text-white relative overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.25)]">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <BookOpen size={28} className="mb-3 relative z-10" />
            <h3 className="font-bold text-lg mb-1">Daily Score</h3>
            <div className="text-4xl font-black mb-1">91<span className="text-xl text-violet-200">/100</span></div>
            <p className="text-violet-200 text-sm">Top 8% in Education dept</p>
          </div>

          <InfoCard title="School Info">
            <div className="space-y-3 text-sm">
              {[
                ["School", user?.zone?.name || "Govt. Sr. Sec. School"],
                ["Dept", user?.department?.name || "Higher Education"],
                ["ID", user?.govt_id || "TEACH-456"],
                ["Shift", "Morning (07:30 – 13:30)"],
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
