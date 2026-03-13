/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use client";

import { TrendingUp, Calendar, CheckCircle2, AlertTriangle } from "lucide-react";
import { StatCard, InfoCard, ActivityItem } from "@/components/dashboards/shared";
import Link from "next/link";

export default function DefaultDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Welcome back, {user?.name || "Employee"}
        </h1>
        <p className="text-slate-400 font-medium mt-1">
          {user?.job_role || "Employee"} · {user?.department?.name || "Government of Haryana"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Daily Score" value="92" unit="/100" change="+5.2%" icon={TrendingUp} color="blue" />
        <StatCard title="Attendance Streak" value="12" unit="days" change="Keep it up!" icon={Calendar} color="indigo" />
        <StatCard title="Tasks Completed" value="8" unit="today" change="+2 from yesterday" icon={CheckCircle2} color="green" />
        <StatCard title="Tier Status" value="Gold" unit="" change="Top 5% in Dept" icon={AlertTriangle} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <InfoCard title="Recent Activity">
            <div className="space-y-3">
              <ActivityItem icon={<CheckCircle2 size={16} className="text-blue-400" />} title="Attendance Verified" time="2 hours ago · Zone 12-B" status="approved" />
              <ActivityItem icon={<CheckCircle2 size={16} className="text-emerald-400" />} title="Work Submission Approved" time="Yesterday · AI Verified" status="approved" />
              <ActivityItem icon={<AlertTriangle size={16} className="text-yellow-400" />} title="Submission Under Review" time="2 days ago" status="review" />
            </div>
          </InfoCard>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-7 text-white relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h2 className="text-lg font-bold mb-2">Check-in Required</h2>
            <p className="text-blue-100 text-sm mb-5 font-medium">Complete biometric check-in to begin.</p>
            <Link href="/attendance" className="block w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all text-center text-sm">
              Start Check-in
            </Link>
          </div>
          <InfoCard title="Department Info">
            <div className="space-y-3 text-sm">
              {[
                ["Department", user?.department?.name || "N/A"],
                ["Zone", user?.zone?.name || "Universal"],
                ["Role", user?.employee_type || "field_worker"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400">{k}</span>
                  <span className="font-bold text-white">{v}</span>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
