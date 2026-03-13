"use client";

import { 
  Building2, 
  Plus, 
  Search, 
  Users, 
  MapPin, 
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockDepts = [
  { id: 1, name: "Public Works Dept (B&R)", code: "PWD-BR", employees: 42, zones: 12, state: "Haryana" },
  { id: 2, name: "Public Health Engineering", code: "PHED", employees: 28, zones: 8, state: "Haryana" },
  { id: 3, name: "Urban Local Bodies", code: "ULB", employees: 54, zones: 15, state: "Haryana" },
];

export default function DepartmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Department Config</h1>
          <p className="text-slate-500">Manage government departments and their hierarchy.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all">
           <Plus size={18} />
           Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {mockDepts.map((dept) => (
           <div key={dept.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all flex flex-col gap-6 group">
              <div className="flex justify-between items-start">
                 <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-all">
                    <Building2 size={24} />
                 </div>
                 <button className="p-2 text-slate-300 hover:text-slate-600 transition-all"><MoreHorizontal size={20} /></button>
              </div>

              <div>
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">{dept.code}</div>
                 <h3 className="text-xl font-black text-slate-900 mb-1">{dept.name}</h3>
                 <p className="text-sm text-slate-400 font-medium">{dept.state} Govt</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                       <Users size={10} /> Staff
                    </div>
                    <div className="text-lg font-black">{dept.employees}</div>
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                       <MapPin size={10} /> Zones
                    </div>
                    <div className="text-lg font-black">{dept.zones}</div>
                 </div>
              </div>

              <button className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-indigo-600 hover:text-white transition-all font-bold text-sm">
                 Configure Zones
                 <ChevronRight size={18} />
              </button>
           </div>
         ))}
      </div>
    </div>
  );
}
