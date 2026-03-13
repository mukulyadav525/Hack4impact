"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle, Eye, CheckCircle2, XCircle, ShieldAlert,
  BarChart2, Filter, RefreshCw
} from "lucide-react";

import { API_V1 as API } from "@/lib/api_config";

const RISK_CONFIG = (score: number) => {
  if (score > 0.8) return { label: "High Risk", color: "text-red-400 bg-red-500/10 border-red-500/20" };
  if (score > 0.5) return { label: "Medium Risk", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
  return { label: "Low Risk", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
};

const FLAG_TYPE_LABELS: Record<string, string> = {
  duplicate_image: "Duplicate Image",
  gps_velocity: "GPS Velocity Anomaly",
  low_confidence_spoof: "Low Confidence / Spoof",
};

export default function FraudReviewPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "confirmed" | "dismissed">("all");
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [subRes] = await Promise.all([
        fetch(`${API}/submissions/list/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (subRes.ok) {
        const subs = await subRes.json();
        setSubmissions(subs);
        // Extract flagged ones
        setFlags(subs.filter((s: any) => s.fraud_risk_score && s.fraud_risk_score > 0));
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleReview = async (submissionId: string, approved: boolean) => {
    setProcessing(submissionId);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/submissions/${submissionId}/review?approved=${approved}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch {}
    finally { setProcessing(null); }
  };

  const displayed = filter === "all" ? flags :
    filter === "open" ? flags.filter(f => f.status === "review") :
    filter === "confirmed" ? flags.filter(f => f.status === "rejected") :
    flags.filter(f => f.status === "approved");

  const highRiskCount = flags.filter(f => f.fraud_risk_score > 0.8).length;
  const mediumRiskCount = flags.filter(f => f.fraud_risk_score > 0.5 && f.fraud_risk_score <= 0.8).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldAlert size={12} /> Fraud Intelligence
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Fraud Review Center</h1>
          <p className="text-slate-400 font-medium mt-1">AI-flagged submissions requiring human review</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-bold border border-red-500/20 transition-all text-sm"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Flagged", value: flags.length, color: "text-white", bg: "" },
          { label: "High Risk (>80%)", value: highRiskCount, color: "text-red-400", bg: "bg-red-500/5 border-red-500/10" },
          { label: "Medium Risk", value: mediumRiskCount, color: "text-orange-400", bg: "bg-orange-500/5 border-orange-500/10" },
          { label: "Total Submissions", value: submissions.length, color: "text-slate-300", bg: "" },
        ].map(s => (
          <div key={s.label} className={`bg-[#1E3A5F]/40 backdrop-blur-xl rounded-2xl border border-white/5 p-5 text-center ${s.bg}`}>
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fraud Type Explanation */}
      <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-6">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><BarChart2 size={16} /> Fraud Detection Methods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { type: "Duplicate Image", desc: "Detects when the same image URL is reused across submissions from the same employee.", risk: "95%" },
            { type: "GPS Velocity", desc: "Flags impossibly fast movement between consecutive geo-tagged submissions.", risk: "85%" },
            { type: "Low Confidence", desc: "AI confidence below 20% may indicate image spoofing or a non-genuine submission.", risk: "70%" },
          ].map(m => (
            <div key={m.type} className="bg-black/20 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{m.type}</span>
                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">{m.risk} risk</span>
              </div>
              <p className="text-xs text-slate-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "open", "confirmed", "dismissed"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize border transition-all ${
              filter === f
                ? "bg-red-500/20 border-red-500/40 text-red-300"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {f === "open" ? "🔴 Pending" : f === "confirmed" ? "✅ Rejected" : f === "dismissed" ? "✓ Cleared" : "All Flags"}
          </button>
        ))}
      </div>

      {/* Flags Table */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-slate-400 bg-[#1E3A5F]/20 rounded-3xl border border-white/5">
          <CheckCircle2 size={40} className="text-emerald-500/40" />
          <p className="font-semibold">No flagged submissions in this category</p>
        </div>
      ) : (
        <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <th className="text-left p-4">Task Type</th>
                <th className="text-left p-4">Fraud Risk</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Submitted</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((sub: any) => {
                const risk = sub.fraud_risk_score || 0;
                const riskCfg = RISK_CONFIG(risk);
                const isProcessing = processing === sub.id;
                return (
                  <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold text-white">{sub.task_type}</p>
                      {sub.latitude && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          GPS: {Number(sub.latitude).toFixed(4)}, {Number(sub.longitude).toFixed(4)}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${riskCfg.color}`}>
                        {riskCfg.label} ({(risk * 100).toFixed(0)}%)
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold capitalize ${
                        sub.status === "approved" ? "text-emerald-400" :
                        sub.status === "rejected" ? "text-red-400" :
                        sub.status === "review" ? "text-yellow-400" :
                        "text-slate-400"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(sub.created_at || sub.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="p-4">
                      {sub.status === "review" && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleReview(sub.id, true)}
                            disabled={isProcessing}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20 transition-all disabled:opacity-50"
                          >
                            {isProcessing ? "..." : <><CheckCircle2 size={12} /> Approve</>}
                          </button>
                          <button
                            onClick={() => handleReview(sub.id, false)}
                            disabled={isProcessing}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/20 transition-all disabled:opacity-50"
                          >
                            {isProcessing ? "..." : <><XCircle size={12} /> Reject</>}
                          </button>
                        </div>
                      )}
                      {sub.status !== "review" && (
                        <span className="text-xs text-slate-500 text-right block">Reviewed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
