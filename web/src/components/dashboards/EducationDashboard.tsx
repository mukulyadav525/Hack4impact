"use client";

import { useState, useEffect } from "react";
import { BookOpen, Users, Star, Calendar, CheckCircle2, TrendingUp, Clipboard, Upload, Video } from "lucide-react";
import { StatCard, ActivityItem, InfoCard } from "./shared";
import Link from "next/link";

import { API_V1 as API } from "@/lib/api_config";

export default function EducationDashboard({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/teachers/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error("Failed to fetch teacher data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>;

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
        <div className="flex gap-3">
          <Link href="/submissions" className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all text-sm">
            <Clipboard size={16} /> Submit Class Report
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Attendance Rate" value={data?.attendance_rate.toString() || "94"} unit="%" change="+1.2%" icon={Users} color="blue" />
        <StatCard title="Daily Score" value={data?.daily_score.toString() || "0"} unit="/100" change="Latest" icon={TrendingUp} color="indigo" />
        <StatCard title="Avg Student Count" value={data?.student_count_avg.toString() || "35"} unit="per class" change="Stable" icon={Users} color="green" />
        <StatCard title="Monthly Progress" value={data?.monthly_score.toString() || "85"} unit="pts" change="On Track" icon={Star} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Quick Actions">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
                   <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">Upload Lesson Plan</h4>
                      <p className="text-xs text-slate-500 mt-1">Submit before 8:00 AM for bonus</p>
                   </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
                   <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Video size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">Verify Class Session</h4>
                      <p className="text-xs text-slate-500 mt-1">Short video with AI student counting</p>
                   </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
                   <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Clipboard size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">Digital Register</h4>
                      <p className="text-xs text-slate-500 mt-1">Mark student presence for today</p>
                   </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group">
                   <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                      <Users size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">PTM Log</h4>
                      <p className="text-xs text-slate-500 mt-1">Record parent-teacher meeting</p>
                   </div>
                </button>
             </div>
          </InfoCard>

          <InfoCard title="Teaching Logs">
            <div className="space-y-3">
              <ActivityItem icon={<BookOpen size={16} className="text-violet-400" />} title="Mathematics — Class X-A" time="08:00 AM · Attendance recorded" status="approved" />
              <ActivityItem icon={<Users size={16} className="text-blue-400" />} title="Physics — Class XI-B" time="10:00 AM · Lab session" status="approved" />
              <ActivityItem icon={<Clipboard size={16} className="text-emerald-400" />} title="Lesson Plan Submission" time="07:45 AM · Verified" status="approved" />
            </div>
          </InfoCard>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-7 text-white relative overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.25)]">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <BookOpen size={28} className="mb-3 relative z-10" />
            <h3 className="font-bold text-lg mb-1">Daily Score</h3>
            <div className="text-4xl font-black mb-1">{data?.daily_score || 0}<span className="text-xl text-violet-200">/100</span></div>
            <p className="text-violet-200 text-sm">Reach 90 for Platinum tier</p>
          </div>

          <InfoCard title="Scoring Insight">
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                    <span className="text-xs text-slate-400">Streak Bonus</span>
                    <span className="text-xs font-bold text-emerald-400">+5 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                    <span className="text-xs text-slate-400">Early Upload</span>
                    <span className="text-xs font-bold text-emerald-400">+10 pts</span>
                </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
