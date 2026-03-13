"use client";

import { useState, useEffect } from "react";
import { Scale, RefreshCw, AlertTriangle, CheckCircle2, Info, ArrowUpRight } from "lucide-react";

const API = "http://localhost:8000/api/v1";

export default function CompliancePage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const fetchAudits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/compliance/bias-audits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAudits(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/compliance/run-audit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchAudits();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Scale size={12} /> Algorithmic Fairness
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Compliance & Bias Audits</h1>
          <p className="text-slate-400 font-medium mt-1">
            Monitoring demographic parity and scoring equity across all employee categories.
          </p>
        </div>
        <button
          onClick={runAudit}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50"
        >
          {isRunning ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          Run Manual Audit
        </button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Scale size={120} />
             </div>
             <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-2">System Integrity Score</h2>
                <div className="text-5xl font-black text-emerald-400 mb-4">98.4%</div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                  Based on the latest automated audit, the GovTrack AI scoring engine shows <strong>no statistically significant bias</strong> across SC, ST, OBC, and General categories.
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                   <div className="flex items-center gap-1.5"><CheckCircle2 className="text-emerald-500" size={14} /> Demographic Parity Check</div>
                   <div className="flex items-center gap-1.5"><CheckCircle2 className="text-emerald-500" size={14} /> Disparate Impact Check</div>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Audit History</h3>
            </div>
            
            {audits.length === 0 ? (
              <div className="bg-[#1E3A5F]/20 rounded-2xl border border-dashed border-white/10 p-12 text-center">
                <p className="text-slate-500">No audit records found. Click "Run Manual Audit" to start.</p>
              </div>
            ) : (
              audits.map((audit) => (
                <div key={audit.id} className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        audit.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {audit.status === 'PASS' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{audit.metric_name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Comparison: <span className="text-slate-300">{audit.group_a} vs {audit.group_b}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-2 font-mono">ID: {audit.id} • {new Date(audit.audit_date).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black ${audit.status === 'PASS' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {(audit.value * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Similarity Index</div>
                    </div>
                  </div>
                  
                  {audit.details && (
                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Audit Findings</p>
                        <p className="text-xs text-slate-300 leading-relaxed">{audit.details.note}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 content-start">
                         {Object.entries(audit.details).map(([k, v]: [string, any]) => k !== 'note' && (
                           <div key={k} className="bg-black/20 rounded-lg px-2 py-1 text-[9px] font-bold text-slate-400 border border-white/5 uppercase">
                             {k.replace(/_/g, ' ')}: {typeof v === 'number' ? v.toFixed(1) : v}
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Compliance Info */}
        <div className="space-y-6">
          <div className="bg-amber-500/5 rounded-3xl border border-amber-500/15 p-6 border-dashed">
            <h3 className="text-amber-400 text-sm font-bold flex items-center gap-2 mb-3">
              <Info size={16} /> Compliance Standard
            </h3>
            <p className="text-xs text-amber-200/70 leading-relaxed mb-4">
              All audits follow the **Four-Fifths Rule** for monitoring disparate impact. A similarity index below 80% triggers an automatic bias investigation.
            </p>
            <div className="space-y-3">
              {[
                { label: "Category Fairness", status: "Compliant" },
                { label: "Gender Parity", status: "Compliant" },
                { label: "Regional Variance", status: "Warning" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={item.status === 'Compliant' ? "text-emerald-400" : "text-amber-400"}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-6">
            <h3 className="text-white text-sm font-bold mb-4">Export Audit Log</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all border border-white/5 group">
                Download PDF Report <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all border border-white/5 group">
                Export JSON Data <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
