"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ClipboardList, CheckCircle2, XCircle, AlertTriangle, Eye,
  User, MapPin, Clock, Shield, TrendingUp, BarChart2
} from "lucide-react";
import { StatCard, InfoCard } from "./shared";

import { API_V1 as API } from "@/lib/api_config";

type Submission = {
  id: string;
  task_type: string;
  status: string;
  before_image_url: string;
  after_image_url: string;
  latitude: number;
  longitude: number;
  created_at: string;
  fraud_risk_score: number;
  ai_quality_score: number;
  ai_confidence: number;
  employee_id: string;
};

export default function SupervisorDashboard({ user }: { user: any }) {
  const [reviewQueue, setReviewQueue] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "flagged">("all");

  const fetchQueue = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/submissions/review-queue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setReviewQueue(await res.json());
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const handleReview = async (submissionId: string, approved: boolean) => {
    setProcessing(submissionId);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/submissions/${submissionId}/review?approved=${approved}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviewQueue(q => q.filter(s => s.id !== submissionId));
      if (selected?.id === submissionId) setSelected(null);
    } catch { alert("Review failed. Please try again."); }
    finally { setProcessing(null); }
  };

  const displayed = filter === "flagged"
    ? reviewQueue.filter(s => s.fraud_risk_score > 0.5)
    : reviewQueue;

  const riskColor = (score: number) => {
    if (score > 0.8) return "text-red-400 bg-red-500/10 border-red-500/20";
    if (score > 0.5) return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  };

  const riskLabel = (score: number) => {
    if (score > 0.8) return "High Risk";
    if (score > 0.5) return "Medium Risk";
    return "Low Risk";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield size={12} className="animate-pulse" /> Supervisor Command
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Review Portal
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            {user?.name || "Supervisor"} · {user?.zone?.name || "All Zones"}
          </p>
        </div>
        <button
          onClick={fetchQueue}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-xl font-bold border border-violet-500/20 transition-all text-sm"
        >
          <ClipboardList size={15} /> Refresh Queue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="In Review" value={reviewQueue.length.toString()} unit="submissions" change="Awaiting action" icon={ClipboardList} color="violet" />
        <StatCard
          title="Fraud Flagged"
          value={reviewQueue.filter(s => s.fraud_risk_score > 0.5).length.toString()}
          unit="high-risk"
          change="Needs priority"
          icon={AlertTriangle}
          color="orange"
        />
        <StatCard title="Quality Avg" value={
          reviewQueue.length
            ? (reviewQueue.reduce((a, s) => a + (s.ai_quality_score || 0), 0) / reviewQueue.length).toFixed(1)
            : "N/A"
        } unit="/ 10" change="AI Score" icon={TrendingUp} color="green" />
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "flagged"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize border transition-all ${
              filter === f
                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {f === "flagged" ? "🚨 Flagged Only" : "All Submissions"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-1">
          <InfoCard title={`Review Queue (${displayed.length})`}>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              </div>
            ) : displayed.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-slate-400">
                <CheckCircle2 size={32} className="text-emerald-500/50" />
                <p className="font-semibold text-sm">Queue is clear!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {displayed.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSelected(sub)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selected?.id === sub.id
                        ? "bg-violet-500/20 border-violet-500/40"
                        : "bg-black/20 border-white/5 hover:bg-black/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-white truncate">{sub.task_type}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(sub.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${riskColor(sub.fraud_risk_score || 0)}`}>
                        {riskLabel(sub.fraud_risk_score || 0)}
                      </span>
                    </div>
                    {sub.latitude && (
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin size={10} /> {Number(sub.latitude).toFixed(4)}, {Number(sub.longitude).toFixed(4)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </InfoCard>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selected ? (
            <InfoCard title="Submission Review">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Task Type</p>
                    <p className="text-white font-bold">{selected.task_type}</p>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-slate-500 font-semibold mb-1">AI Quality Score</p>
                    <p className="text-white font-bold">{selected.ai_quality_score ?? "Pending"} / 10</p>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Fraud Risk</p>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full border ${riskColor(selected.fraud_risk_score || 0)}`}>
                      {((selected.fraud_risk_score || 0) * 100).toFixed(0)}% — {riskLabel(selected.fraud_risk_score || 0)}
                    </span>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-slate-500 font-semibold mb-1">AI Confidence</p>
                    <p className="text-white font-bold">{((selected.ai_confidence || 0) * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {/* Before/After Images */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Before", url: selected.before_image_url },
                    { label: "After", url: selected.after_image_url },
                  ].map(({ label, url }) => (
                    <div key={label} className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                      <div className="aspect-video bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                        {url ? (
                          <img src={url} alt={label} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                        ) : (
                          <span className="text-xs text-slate-500">No image</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selected.latitude && (
                  <div className="flex items-center gap-2 text-sm text-slate-400 bg-black/20 p-3 rounded-xl border border-white/5">
                    <MapPin size={14} className="text-violet-400" />
                    GPS: {Number(selected.latitude).toFixed(6)}, {Number(selected.longitude).toFixed(6)}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleReview(selected.id, true)}
                    disabled={processing === selected.id}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all disabled:opacity-50 text-sm"
                  >
                    {processing === selected.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(selected.id, false)}
                    disabled={processing === selected.id}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold border border-red-500/20 transition-all disabled:opacity-50 text-sm"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            </InfoCard>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-20 text-slate-500 bg-[#1E3A5F]/20 rounded-3xl border border-white/5">
              <Eye size={40} className="opacity-30" />
              <p className="font-semibold text-sm">Select a submission to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
