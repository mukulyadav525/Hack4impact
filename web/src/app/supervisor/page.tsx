/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { 
  Users, 
  ClipboardList, 
  ShieldCheck, 
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupervisorDashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Operational Overview</h1>
        <p className="text-gray-500 dark:text-zinc-400">Gurugram North-II Department Status & Performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatsCard title="Total Staff" value="124" icon={Users} trend="+3 this month" color="blue" />
         <StatsCard title="Pending Review" value="42" icon={ClipboardList} trend="12 high priority" color="orange" />
         <StatsCard title="Attendance Rate" value="94.2%" icon={ShieldCheck} trend="+1.5% weekly" color="green" />
         <StatsCard title="Fraud Alerts" value="3" icon={AlertTriangle} trend="Critical issues" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Activity Feed */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-black rounded-3xl p-8 border border-gray-100 dark:border-zinc-900 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Real-time Activity</h3>
                  <button className="text-sm font-bold text-blue-600">View Map View</button>
               </div>
               
               <div className="space-y-6">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-bold italic">
                            {i}
                         </div>
                         <div>
                            <p className="font-bold text-sm">Staff Member #{i} Checked-in</p>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                               <MapPin size={10} /> Sector 1{i} Gurugram • 2m ago
                            </p>
                         </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all">
                         <ArrowUpRight size={18} className="text-gray-300" />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         {/* Dept Performance */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
               <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={20} className="text-blue-100" />
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Efficiency Index</p>
               </div>
               <p className="text-5xl font-black mb-2">A<span className="text-2xl opacity-60">+</span></p>
               <p className="text-sm text-blue-100 leading-relaxed mb-8">Your department is performing 12% above the state average this quarter.</p>
               <button className="w-full py-4 bg-white/10 backdrop-blur rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10">
                  Full Performance Ledger
               </button>
            </div>
            
            <div className="bg-white dark:bg-black rounded-3xl p-8 border border-gray-100 dark:border-zinc-900 shadow-sm">
               <h3 className="font-bold mb-4">Urgent Tasks</h3>
               <div className="space-y-3">
                  <UrgentItem icon={AlertTriangle} label="Geofence breach detected" time="1h ago" color="red" />
                  <UrgentItem icon={ClipboardList} label="4 AI audits failed" time="2h ago" color="orange" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, trend, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20",
    red: "text-red-600 bg-red-50 dark:bg-red-900/20",
  };
  return (
    <div className="bg-white dark:bg-black p-8 rounded-3xl border border-gray-100 dark:border-zinc-900 shadow-sm">
       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", colors[color])}>
          <Icon size={24} />
       </div>
       <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{title}</p>
       <p className="text-3xl font-black mb-2">{value}</p>
       <p className={cn("text-[10px] font-bold uppercase", color === 'red' ? 'text-red-500' : 'text-green-500')}>{trend}</p>
    </div>
  );
}

function UrgentItem({ icon: Icon, label, time, color }: any) {
   const colors: any = {
      red: "bg-red-50 text-red-600",
      orange: "bg-orange-50 text-orange-600"
   };
   return (
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
         <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors[color])}>
            <Icon size={16} />
         </div>
         <div className="min-w-0">
            <p className="text-xs font-bold truncate">{label}</p>
            <p className="text-[10px] text-gray-400">{time}</p>
         </div>
      </div>
   );
}
