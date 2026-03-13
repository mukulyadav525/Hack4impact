"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Filter, Calendar, Users, BarChart } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState([
    { id: 1, title: "Monthly Performance Audit - Feb 2026", type: "Audit", date: "2026-03-01", status: "Ready" },
    { id: 2, title: "Departmental Efficiency Summary", type: "Summary", date: "2026-03-05", status: "Ready" },
    { id: 3, title: "Fraud & Integrity Incident Log", type: "Security", date: "2026-03-10", status: "Generating" },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Reports & Audits</h1>
          <p className="text-slate-500 font-medium">Generate and export departmental performance documents.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2">
           <FileText size={18} /> Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6">
                <div className="flex items-center gap-2 text-white font-bold mb-4">
                    <Filter size={18} className="text-blue-400" /> Filter Criteria
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2 block">Department</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                            <option>All Departments</option>
                            <option>Education</option>
                            <option>Health</option>
                            <option>Police</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2 block">Timeframe</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                            <option>Last 30 Days</option>
                            <option>Last Quarter</option>
                            <option>FY 2025-26</option>
                        </select>
                    </div>

                    <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                        Apply Filters
                    </button>
                </div>
            </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Report Title</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Type</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Generated</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-white/[0.02] transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <FileText size={20} />
                                        </div>
                                        <span className="font-bold text-white text-sm">{report.title}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 font-medium">
                                        {report.type}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Calendar size={14} /> {report.date}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-all transition-colors">
                                        <Download size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Quick Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20">
                    <BarChart className="text-blue-400 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Quarterly Projection</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Workforce efficiency is projected to increase by 5.2% in the next quarter based on current attendance trends.
                    </p>
                </div>
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20">
                    <Users className="text-emerald-400 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Compliance Rating</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        98.2% of all departments are currently meeting their verification thresholds for March 2026.
                    </p>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
