/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { 
  Users, 
  MapPin, 
  Layers, 
  Navigation,
  Activity,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupervisorMapPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zone Monitoring</h1>
          <p className="text-gray-500 dark:text-zinc-400">Real-time GPS tracking and geofence monitoring for Gurugram North-II.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-100 dark:bg-green-900/20 dark:border-green-800">
           <Activity size={16} className="animate-pulse" />
           Live Updates Active
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Map View Holder */}
        <div className="lg:col-span-3 bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 overflow-hidden relative shadow-sm">
           <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-gray-400 italic">
              Interactive PostGIS Map Component (Leaflet/Mapbox)
           </div>
           
           {/* Map Controls */}
           <div className="absolute top-6 left-6 flex flex-col gap-2">
              <MapControl icon={Layers} active />
              <MapControl icon={Navigation} />
           </div>

           {/* Floating Legend */}
           <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-black/80 backdrop-blur p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Legend</h4>
              <div className="space-y-2">
                 <LegendItem color="bg-green-500" label="Verified Work" />
                 <LegendItem color="bg-blue-500" label="Active Staff" />
                 <LegendItem color="bg-red-500" label="Geofence Breach" />
              </div>
           </div>
        </div>

        {/* Side Panel: Active Staff */}
        <div className="lg:col-span-1 flex flex-col gap-6">
           <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-6 flex-1 flex flex-col shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-6 text-blue-600">
                 <UserCheck size={18} />
                 Active Staff (12)
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                 {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 hover:bg-zinc-800 transition-all cursor-pointer">
                       <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {String.fromCharCode(64 + i)}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">Staff Member {i}</p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1">
                             <MapPin size={8} /> Sector {i + 10}
                          </p>
                       </div>
                       <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 shadow-sm shadow-green-500/50" />
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-1">Zone Capacity</p>
              <div className="flex items-baseline gap-2 mb-4">
                 <span className="text-3xl font-bold">85%</span>
                 <span className="text-xs text-blue-200">Standard Load</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white rounded-full w-[85%]" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function MapControl({ icon: Icon, active }: any) {
  return (
    <button className={cn(
      "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all",
      active ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
    )}>
      <Icon size={20} />
    </button>
  );
}

function LegendItem({ color, label }: any) {
   return (
     <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", color)} />
        <span className="text-[10px] font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-widest">{label}</span>
     </div>
   );
}
