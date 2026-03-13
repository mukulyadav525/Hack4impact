"use client";

import { 
  History as HistoryIcon, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Filter,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockAttendance = [
  { id: 1, date: "12 Mar 2024", time: "09:12 AM", status: "Verified", location: "Sector 14, Gurugram" },
  { id: 2, date: "11 Mar 2024", time: "08:55 AM", status: "Verified", location: "Sector 14, Gurugram" },
  { id: 3, date: "10 Mar 2024", time: "09:05 AM", status: "Flagged", location: "Unknown Location" },
  { id: 4, date: "09 Mar 2024", time: "08:50 AM", status: "Verified", location: "Sector 14, Gurugram" },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Record History</h1>
          <p className="text-zinc-400">View your detailed check-in and task history.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all">
          <Filter size={16} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/20">
            <h2 className="font-bold flex items-center gap-2">
              <HistoryIcon size={18} className="text-blue-600" />
              Attendance Logs
            </h2>
            <span className="text-xs text-gray-500 font-medium">Last 30 days</span>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-zinc-900">
            {mockAttendance.map((log) => (
              <div key={log.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    log.status === "Verified" ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-red-100 text-red-600 dark:bg-red-900/20"
                  )}>
                    {log.status === "Verified" ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{log.date}</p>
                    <p className="text-sm text-gray-500">{log.time}</p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300">
                    <MapPin size={14} className="text-gray-400" />
                    {log.location}
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                    log.status === "Verified" ? "text-green-600 bg-green-50 dark:bg-green-900/10" : "text-red-600 bg-red-50 dark:bg-red-900/10"
                  )}>
                    {log.status}
                  </div>
                </div>

                <div className="hidden md:block">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all text-gray-400">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 text-center">
            <button className="text-sm font-bold text-blue-600 hover:underline">View All History</button>
          </div>
        </div>
      </div>
    </div>
  );
}
