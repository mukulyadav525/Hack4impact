"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Filter, BarChart2, Users, TrendingUp, AlertTriangle } from "lucide-react";

const API = "http://localhost:8000/api/v1";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function ReportsPage() {
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState({ dept: "all", month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/stats/admin`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setAdminStats(await res.json());
      } catch {}
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    setGenerating(true);
    setTimeout(() => {
      const reportData = {
        generated_at: new Date().toISOString(),
        filter,
        overview: adminStats?.overview,
        departments: adminStats?.department_performance,
      };
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `govtrack_report_${filter.year}_${filter.month}.json`;
      a.click();
      setGenerating(false);
    }, 1500);
  };

  const handlePrint = () => window.print();

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  const overview = adminStats?.overview || {};
  const deptPerf = (adminStats?.department_performance || []).filter(
    (d: any) => filter.dept === "all" || d.code === filter.dept
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 print:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            <FileText size={12} /> Admin Reports
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Reports & Export</h1>
          <p className="text-slate-400 font-medium mt-1">Generate RTI-style reports and export performance data</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 transition-all text-sm"
          >
            <FileText size={15} /> Print Report
          </button>
          <button
            onClick={handleExport}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold transition-all text-sm disabled:opacity-50"
          >
            {generating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Download size={15} />}
            {generating ? "Generating..." : "Export JSON"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <div className="flex items-center gap-2 bg-[#1E3A5F]/40 border border-white/5 rounded-xl px-4 py-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={filter.dept}
            onChange={e => setFilter(f => ({ ...f, dept: e.target.value }))}
            className="bg-transparent text-white text-sm font-semibold outline-none"
          >
            <option value="all" className="bg-[#0F2240]">All Departments</option>
            {(adminStats?.department_performance || []).map((d: any) => (
              <option key={d.code} value={d.code} className="bg-[#0F2240]">{d.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-[#1E3A5F]/40 border border-white/5 rounded-xl px-4 py-2">
          <select
            value={filter.month}
            onChange={e => setFilter(f => ({ ...f, month: Number(e.target.value) }))}
            className="bg-transparent text-white text-sm font-semibold outline-none"
          >
            {MONTHS.map((m, i) => <option key={i} value={i + 1} className="bg-[#0F2240]">{m}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-[#1E3A5F]/40 border border-white/5 rounded-xl px-4 py-2">
          <select
            value={filter.year}
            onChange={e => setFilter(f => ({ ...f, year: Number(e.target.value) }))}
            className="bg-transparent text-white text-sm font-semibold outline-none"
          >
            {[2024, 2025, 2026].map(y => <option key={y} value={y} className="bg-[#0F2240]">{y}</option>)}
          </select>
        </div>
      </div>

      {/* Report Header (printable) */}
      <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 print:border-0 print:bg-white print:rounded-none">
        <div className="flex items-center justify-between mb-6 print:border-b print:border-gray-200 print:pb-4">
          <div>
            <h2 className="text-xl font-bold text-white print:text-black">GovTrack AI — Performance Report</h2>
            <p className="text-sm text-slate-400 print:text-gray-600">
              {MONTHS[filter.month - 1]} {filter.year} ·{" "}
              {filter.dept === "all" ? "All Departments" : filter.dept}
            </p>
          </div>
          <p className="text-xs text-slate-500 print:text-gray-500">Generated: {new Date().toLocaleDateString("en-IN")}</p>
        </div>

        {/* Summary Stats Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Employees", value: overview.total_employees || 0, icon: Users, color: "text-blue-400" },
            { label: "Submissions", value: overview.submissions_today || 0, icon: BarChart2, color: "text-emerald-400" },
            { label: "Pending Review", value: overview.pending_review || 0, icon: TrendingUp, color: "text-yellow-400" },
            { label: "Fraud Alerts", value: (adminStats?.system_activity?.flagged_for_review || 0), icon: AlertTriangle, color: "text-red-400" },
          ].map(s => (
            <div key={s.label} className="bg-black/10 rounded-2xl p-4 border border-white/5 print:border print:border-gray-200 print:rounded">
              <s.icon size={16} className={`${s.color} mb-2 print:hidden`} />
              <div className="text-2xl font-black text-white print:text-black">{s.value.toLocaleString()}</div>
              <div className="text-xs text-slate-400 print:text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Department Table */}
        <h3 className="text-sm font-bold text-white print:text-black mb-4 uppercase tracking-wider">Department Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 print:border-gray-300">
                {["Department", "Employees", "Avg Score", "Zone", "Code"].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs text-slate-400 print:text-gray-600 font-bold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deptPerf.map((d: any, i: number) => (
                <tr key={i} className="border-b border-white/5 print:border-gray-200 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-white print:text-black">{d.name}</td>
                  <td className="py-3 px-3 text-slate-300 print:text-gray-700">{d.employees?.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${d.score >= 80 ? "text-emerald-400 print:text-green-600" : d.score >= 60 ? "text-yellow-400 print:text-yellow-600" : "text-red-400 print:text-red-600"}`}>
                      {d.score?.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 print:text-gray-600">{d.zone}</td>
                  <td className="py-3 px-3 text-slate-500 print:text-gray-500 text-xs font-mono">{d.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RTI Notice */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-400 print:border print:border-gray-300">
        <strong className="text-white print:text-black">RTI Disclosure Note:</strong> This report has been generated by the GovTrack AI system in compliance with the Right to Information Act, 2005. All data is aggregated at department level. Individual employee data requires a formal RTI application to the State Public Information Officer.
      </div>
    </div>
  );
}
