 
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  Trash2, 
  Edit3,
  Search,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockUsers = [
  { id: 1, name: "Mukul Kumar", role: "Field Worker", dept: "PWD", status: "Active", govt_id: "HR-9821" },
  { id: 2, name: "Rahul Sharma", role: "Field Worker", dept: "Public Health", status: "Active", govt_id: "HR-1022" },
  { id: 3, name: "Priya Singh", role: "Supervisor", dept: "PWD", status: "Active", govt_id: "HR-5521" },
  { id: 4, name: "Amit Shah", role: "Admin", dept: "State Admin", status: "Active", govt_id: "HR-0001" },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Management</h1>
          <p className="text-slate-500">Add, manage and audit access for all government employees.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all">
           <UserPlus size={18} />
           Provision New User
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, ID or department..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
              />
           </div>
           <div className="flex gap-2">
              <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"><Filter size={18} /></button>
           </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
               <th className="px-8 py-4">Employee</th>
               <th className="px-8 py-4">Govt ID</th>
               <th className="px-8 py-4">Role</th>
               <th className="px-8 py-4">Department</th>
               <th className="px-8 py-4">Status</th>
               <th className="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {mockUsers.map((user) => (
               <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-bold text-slate-900">{user.name}</span>
                     </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500 uppercase">{user.govt_id}</td>
                  <td className="px-8 py-5">
                     <span className={cn(
                       "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                       user.role === 'Admin' ? "bg-red-50 text-red-600" : user.role === 'Supervisor' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                     )}>
                       {user.role}
                     </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600">{user.dept}</td>
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-600">{user.status}</span>
                     </div>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-100 shadow-sm transition-all">
                           <Edit3 size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 border border-transparent hover:border-red-100 shadow-sm transition-all">
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
               </tr>
             ))}
          </tbody>
        </table>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
           <div>Showing 4 of 124 employees</div>
           <div className="flex gap-4">
              <button disabled className="text-slate-300">Previous</button>
              <button className="text-indigo-600 hover:underline">Next Page</button>
           </div>
        </div>
      </div>
    </div>
  );
}
