"use client";

import { useState, useEffect } from "react";
import { 
  History as HistoryIcon, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Filter,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };
        
        const [attRes, subRes] = await Promise.all([
          fetch("http://localhost:8000/api/v1/attendance/history", { headers }),
          fetch("http://localhost:8000/api/v1/submissions/history", { headers })
        ]);
        
        let allLogs: any[] = [];
        if (attRes.ok) {
          const attData = await attRes.json();
          allLogs = [...allLogs, ...attData.map((a: any) => ({ ...a, record_type: 'attendance' }))];
        }
        if (subRes.ok) {
          const subData = await subRes.json();
          allLogs = [...allLogs, ...subData.map((s: any) => ({ ...s, record_type: 'submission' }))];
        }
        
        allLogs.sort((a, b) => {
          const dateA = new Date(a.checkin_time || a.submitted_at || a.created_at || 0).getTime();
          const dateB = new Date(b.checkin_time || b.submitted_at || b.created_at || 0).getTime();
          return dateB - dateA;
        });
        
        setLogs(allLogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);
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
              Activity Logs
            </h2>
            <span className="text-xs text-gray-500 font-medium">Recorded History</span>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-zinc-900">
            {logs.map((log: any) => (
              <div key={log.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    log.status === "present" || log.status === "Verified" || log.status === "approved" || log.status === "processing" ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-red-100 text-red-600 dark:bg-red-900/20"
                  )}>
                    {log.status === "present" || log.status === "Verified" || log.status === "approved" ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {log.record_type === 'submission' 
                        ? log.task_type || "Work Submission" 
                        : "Attendance Check-in"}
                    </p>
                    <p className="text-sm text-gray-500">{new Date(log.checkin_time || log.submitted_at || log.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300">
                    <MapPin size={14} className="text-gray-400" />
                    {log.checkin_lat ? `${log.checkin_lat}, ${log.checkin_lon}` : log.latitude ? `${log.latitude}, ${log.longitude}` : log.location || "Verified Location"}
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                    log.status === "Verified" || log.status === "approved" || log.status === "present" ? "text-green-600 bg-green-50 dark:bg-green-900/10" : 
                    log.status === "processing" ? "text-amber-600 bg-amber-50 dark:bg-amber-900/10" : "text-red-600 bg-red-50 dark:bg-red-900/10"
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
