"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare, Plus, Clock, CheckCircle2, AlertTriangle,
  XCircle, ChevronRight, FileText, X
} from "lucide-react";

import { API_V1 as API } from "@/lib/api_config";

const STATUS_CONFIG: Record<string, {color: string; label: string; icon: any}> = {
  open:          { color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", label: "Open", icon: Clock },
  under_review:  { color: "text-blue-400 bg-blue-500/10 border-blue-500/20", label: "Under Review", icon: AlertTriangle },
  resolved:      { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "Resolved", icon: CheckCircle2 },
  rejected:      { color: "text-red-400 bg-red-500/10 border-red-500/20", label: "Rejected", icon: XCircle },
};

const CATEGORIES = ["scoring", "rejection", "disciplinary", "other"];

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ category: "scoring", description: "" });
  const [selected, setSelected] = useState<any>(null);

  const fetchGrievances = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/grievances/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setGrievances(await res.json());
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGrievances(); }, [fetchGrievances]);

  const handleSubmit = async () => {
    if (!form.description.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/grievances/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ category: "scoring", description: "" });
        fetchGrievances();
      }
    } catch {}
    finally { setSubmitting(false); }
  };

  const openCount = grievances.filter(g => g.status === "open").length;
  const resolvedCount = grievances.filter(g => g.status === "resolved").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare size={12} /> Dispute Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Grievances</h1>
          <p className="text-slate-400 font-medium mt-1">
            Dispute scores, rejections, or disciplinary actions within 7 days.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all text-sm"
        >
          <Plus size={16} /> File Grievance
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Filed", value: grievances.length, color: "text-white" },
          { label: "Open", value: openCount, color: "text-yellow-400" },
          { label: "Resolved", value: resolvedCount, color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Policy note */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
        <FileText size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-300">
          <strong>Dispute Policy:</strong> You may file a grievance within <strong>7 days</strong> of a score being published or a submission being rejected. Once filed, the disputed score is frozen pending independent review. You will be notified of the final decision.
        </div>
      </div>

      {/* Grievances List */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : grievances.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-slate-400 bg-[#1E3A5F]/20 rounded-3xl border border-white/5">
          <CheckCircle2 size={40} className="text-emerald-500/40" />
          <div className="text-center">
            <p className="font-semibold">No grievances filed</p>
            <p className="text-xs mt-1">If you believe your score was computed incorrectly, file a dispute above</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {grievances.map((g: any) => {
            const cfg = STATUS_CONFIG[g.status] || STATUS_CONFIG.open;
            const StatusIcon = cfg.icon;
            return (
              <button
                key={g.id}
                onClick={() => setSelected(g)}
                className="w-full text-left bg-[#1E3A5F]/40 backdrop-blur-xl rounded-2xl border border-white/5 p-5 hover:bg-[#1E3A5F]/60 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${cfg.color}`}>
                        <StatusIcon size={10} /> {cfg.label}
                      </span>
                      <span className="text-xs text-slate-500 capitalize font-semibold">{g.category}</span>
                    </div>
                    <p className="text-sm text-white font-medium line-clamp-2">{g.description}</p>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Filed {new Date(g.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 shrink-0 mt-1" />
                </div>
                {g.resolution && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-emerald-400 font-semibold">Resolution:</p>
                    <p className="text-xs text-slate-300 mt-1">{g.resolution}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* File Grievance Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F2240] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">File a Grievance</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-amber-500/50 outline-none capitalize"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0F2240]">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe your grievance clearly. Include dates, submission IDs, and the reason you believe an error occurred..."
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-amber-500/50 outline-none resize-none placeholder:text-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-1">Min. 20 characters. Be specific to help the reviewer.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white font-bold text-sm transition-colors cursor-pointer relative z-10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (form.description.length >= 20) {
                      handleSubmit();
                    }
                  }}
                  disabled={submitting || form.description.length < 20}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative z-10"
                >
                  {submitting ? "Filing..." : "Submit Grievance"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F2240] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Grievance Details</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                {(() => { const cfg = STATUS_CONFIG[selected.status] || STATUS_CONFIG.open; return (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${cfg.color}`}>
                    {cfg.label}
                  </span>
                ); })()}
                <span className="text-xs text-slate-400 font-semibold capitalize self-center">{selected.category}</span>
              </div>
              <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-white">{selected.description}</p>
              </div>
              {selected.resolution && (
                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">Resolution</p>
                  <p className="text-sm text-white">{selected.resolution}</p>
                </div>
              )}
              <p className="text-xs text-slate-500">
                Filed: {new Date(selected.created_at).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
