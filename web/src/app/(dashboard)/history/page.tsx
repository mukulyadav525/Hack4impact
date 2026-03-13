"use client";

import { useState, useEffect } from "react";
import { 
  History as HistoryIcon, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Filter,
  ArrowUpRight,
  ClipboardList,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_V1 } from "@/lib/api_config";

export default function HistoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };
        
        const [attRes, subRes] = await Promise.all([
          fetch(`${API_V1}/attendance/history`, { headers }),
          fetch(`${API_V1}/submissions/history`, { headers })
        ]);
        
        let allLogs: any[] = [];
        if (attRes.ok) {
          const attData = await attRes.json();
          allLogs = [...allLogs, ...attData.map((a: any) => ({ ...a, type: 'attendance', date: a.checkin_time }))];
        }
        if (subRes.ok) {
          const subData = await subRes.json();
          allLogs = [...allLogs, ...subData.map((s: any) => ({ ...s, type: 'submission', date: s.submitted_at }))];
        }
        
        allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
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
            <div className="flex flex-col">
              <h2 className="font-bold flex items-center gap-2">
                <HistoryIcon size={18} className="text-blue-600" />
                Combined Activity Logs
              </h2>
              <p className="text-[10px] text-gray-500 font-medium md:ml-7">Unified attendance and work submissions</p>
            </div>
            <span className="text-xs text-gray-500 font-medium">Last 30 days</span>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-zinc-900">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading history...</div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No activity recorded yet.</div>
            ) : logs.map((log: any, idx: number) => (
              <div key={log.id || idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                    log.type === "attendance" 
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-800/20 dark:text-blue-400" 
                      : "bg-purple-100 text-purple-600 dark:bg-purple-800/20 dark:text-purple-400"
                  )}>
                    {log.type === "attendance" ? <Clock size={24} /> : <ClipboardList size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                       <p className="font-bold text-lg text-neutral-900 dark:text-white leading-none">
                         {log.type === "attendance" ? "Attendance" : "Work Submission"}
                       </p>
                       <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                         {log.task_type?.replace(/_/g, " ") || log.status}
                       </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(log.date).toLocaleDateString()} at {new Date(log.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-1 shrink-0 mt-2 md:mt-0">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300">
                    <MapPin size={14} className="text-gray-400" />
                    {log.checkin_lat ? `${log.checkin_lat.toFixed(4)}, ${log.checkin_lon.toFixed(4)}` : log.latitude ? `${parseFloat(log.latitude).toFixed(4)}, ${parseFloat(log.longitude).toFixed(4)}` : log.location || "Verified Location"}
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1.5 mt-1",
                    log.status === "present" || log.status === "approved" || log.status.toLowerCase() == "verified"
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20" 
                      : "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                      log.status === "present" || log.status === "approved" || log.status.toLowerCase() == "verified" ? "bg-green-500" : "bg-amber-500"
                    )} />
                    {log.status === "present" ? "VERIFIED LOCATION" : log.status}
                  </div>
                </div>

                <div className="hidden md:block shrink-0">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all text-gray-400 group">
                    <ArrowUpRight size={20} className="group-hover:text-blue-500 transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 text-center border-t border-gray-100 dark:border-zinc-900">
            <button className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors">View Documented Evidence</button>
          </div>
        </div>
      </div>
    </div>
  );
}
