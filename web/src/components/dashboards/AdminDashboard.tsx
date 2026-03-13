/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Users, Building2, MapPin, BarChart2, Search, Plus, Edit2, Trash2,
  CheckCircle2, Clock, ShieldCheck, TrendingUp, AlertTriangle, Settings2, Activity
} from "lucide-react";
import { StatCard, InfoCard } from "./shared";
import Link from "next/link";

import { API_V1 as API } from "@/lib/api_config";

function authHeaders() {
  return { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" };
}

export default function AdminDashboard({ user }: { user: any }) {
  const [tab, setTab] = useState<"overview" | "users" | "departments" | "zones" | "submissions" | "scoring" | "grievances">("overview");
  const [employees, setEmployees] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
  const [scoringRules, setScoringRules] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<any>(null);
  const [editRule, setEditRule] = useState<any>(null);
  const [editGrievance, setEditGrievance] = useState<any>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRules, setLoadingRules] = useState(false);
  const [loadingGrievances, setLoadingGrievances] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    govt_id: "", name: "", pin: "", employee_type: "field_worker", job_role: "", dept_id: 1, zone_id: 1
  });

  const fetchEmployees = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API}/employees/`, { headers: authHeaders() });
      if (res.ok) setEmployees(await res.json());
    } catch {}
    setLoadingUsers(false);
  };

  const fetchZones = async () => {
    try {
      const res = await fetch(`${API}/zones/`, { headers: authHeaders() });
      if (res.ok) setZones(await res.json());
    } catch {}
  };

  const fetchAllSubmissions = async () => {
    try {
      const res = await fetch(`${API}/submissions/list/`, { headers: authHeaders() });
      if (res.ok) setAllSubmissions(await res.json());
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/stats/admin/`, { headers: authHeaders() });
      if (res.ok) setStats(await res.json());
    } catch {}
  };
  
  const fetchScoringRules = async () => {
    setLoadingRules(true);
    try {
      const res = await fetch(`${API}/scoring/rules/`, { headers: authHeaders() });
      if (res.ok) setScoringRules(await res.json());
    } catch {}
    setLoadingRules(false);
  };

  const fetchGrievances = async () => {
    setLoadingGrievances(true);
    try {
      const res = await fetch(`${API}/grievances/`, { headers: authHeaders() });
      if (res.ok) setGrievances(await res.json());
    } catch {}
    setLoadingGrievances(false);
  };

  useEffect(() => {
    fetchEmployees();
    fetchZones();
    fetchAllSubmissions();
    fetchStats();
    fetchScoringRules();
    fetchGrievances();
  }, []);

  const handleSaveRule = async () => {
    if (!editRule) return;
    try {
      const res = await fetch(`${API}/scoring/rules/${editRule.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(editRule),
      });
      if (res.ok) {
        setEditRule(null);
        fetchScoringRules();
      }
    } catch {}
  };

  const handleResolveGrievance = async (resolution: string, status: string = "resolved") => {
    if (!editGrievance) return;
    try {
      const res = await fetch(`${API}/grievances/${editGrievance.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ resolution, status }),
      });
      if (res.ok) {
        setEditGrievance(null);
        fetchGrievances();
      }
    } catch {}
  };

  const handleSaveUser = async () => {
    if (!editUser) return;
    try {
      await fetch(`${API}/employees/${editUser.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ name: editUser.name, job_role: editUser.job_role, is_active: editUser.is_active }),
      });
      setEditUser(null);
      fetchEmployees();
    } catch {}
  };

  const handleAddUser = async () => {
    try {
      await fetch(`${API}/employees`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          govt_id: newUser.govt_id,
          name: newUser.name,
          pin: newUser.pin,
          employee_type: newUser.employee_type,
          job_role: newUser.job_role || undefined,
          dept_id: Number(newUser.dept_id) || undefined,
          zone_id: Number(newUser.zone_id) || undefined
        }),
      });
      setIsAdding(false);
      setNewUser({ govt_id: "", name: "", pin: "", employee_type: "field_worker", job_role: "", dept_id: 1, zone_id: 1 });
      setTab("users");
      fetchEmployees();
    } catch {}
  };

  const filtered = employees.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.govt_id?.toLowerCase().includes(search.toLowerCase()) ||
    e.job_role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={12} /> Super Admin
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Admin Control Panel</h1>
          <p className="text-slate-400 font-medium mt-1">Welcome, {user?.name || "Administrator"}</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-6 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-bold transition-all text-sm border border-red-500/30">
          <Plus size={16} /> Add New Employee
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-black/20 rounded-2xl border border-white/5 w-fit overflow-x-auto max-w-full">
        {(["overview", "users", "departments", "zones", "submissions", "scoring", "grievances"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${tab === t ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "text-slate-400 hover:text-white"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard onClick={() => setTab("users")} title="Total Employees" value={stats?.overview.total_employees.toString() || employees.length.toString() || "..."} unit="users" change="View All" icon={Users} color="blue" />
            <StatCard onClick={() => setTab("departments")} title="Departments" value={stats?.overview.departments.toString() || "..."} unit="operational" change="View Details" icon={Building2} color="indigo" />
            <StatCard onClick={() => setTab("zones")} title="Zones" value={stats?.overview.zones.toString() || zones.length.toString() || "..."} unit="mapped" change="Active Regions" icon={MapPin} color="green" />
            <StatCard onClick={() => setTab("submissions")} title="Submissions Today" value={stats?.overview.submissions_today.toString() || "0"} unit="reports" change={`${stats?.overview.pending_review || 0} pending`} icon={BarChart2} color="orange" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard title="Lesson Plans" value={stats?.overview.total_lesson_plans?.toString() || "0"} unit="verified" change="Across Education" icon={TrendingUp} color="emerald" />
            <StatCard title="OPD Sessions" value={stats?.overview.total_opd_logs?.toString() || "0"} unit="logged" change="Healthcare Activity" icon={Activity} color="rose" />
            <StatCard title="Patrol Logs" value={stats?.overview.total_patrol_logs?.toString() || "0"} unit="check-ins" change="Police Presence" icon={ShieldCheck} color="indigo" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoCard title="System Activity">
              <div className="space-y-3">
                {[
                  { label: "New citizen reports submitted", count: stats?.system_activity.new_citizen_reports || 0, color: "orange" },
                  { label: "AI Verified work submissions", count: stats?.system_activity.ai_verified || 0, color: "green" },
                  { label: "Flagged for manual review", count: stats?.system_activity.flagged_for_review || 0, color: "yellow" },
                  { label: "Accounts locked (security)", count: stats?.system_activity.locked_accounts || 0, color: "red" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                    <span className="text-sm text-slate-300">{item.label}</span>
                    <span className={`text-sm font-bold text-${item.color}-400 bg-${item.color}-500/10 px-3 py-1 rounded-full`}>{item.count}</span>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Department Performance">
              <div className="space-y-4">
                {(stats?.department_performance || []).map((dept: any, idx: number) => (
                  <div key={`${dept.name}-${idx}`} className="cursor-pointer group" onClick={() => { setTab("users"); setSearch(dept.name); }}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{dept.name}</span>
                      <span className="text-sm font-bold text-white">{dept.score}%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-${dept.color}-600 to-${dept.color}-400 transition-all duration-1000`}
                        style={{ width: `${Math.min(dept.score, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <InfoCard title="Employee Management">
          <div className="mb-5 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or role..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-blue-500/50 outline-none transition-colors"
            />
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filtered.length === 0 && <p className="text-slate-400 text-center py-8 text-sm">No employees found.</p>}
              {filtered.map((emp) => (
                <div key={emp.id} className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-black/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">
                    {emp.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white">{emp.name}</p>
                    <p className="text-xs text-slate-400">{emp.govt_id} · {emp.job_role || "Employee"} · <span className={`font-semibold ${emp.employee_type === 'public' ? 'text-orange-400' : emp.employee_type === 'supervisor' ? 'text-blue-400' : emp.employee_type === 'admin' ? 'text-red-400' : 'text-slate-400'}`}>{emp.employee_type}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${emp.is_active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                      {emp.is_active ? "Active" : "Inactive"}
                    </span>
                    <button
                      onClick={() => setEditUser({ ...emp })}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit Modal */}
          {editUser && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#0F2240] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Edit Employee</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
                    <input
                      value={editUser.name}
                      onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Job Role</label>
                    <input
                      value={editUser.job_role || ""}
                      onChange={(e) => setEditUser({ ...editUser, job_role: e.target.value })}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500/50 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/10">
                    <span className="text-sm text-slate-300">Account Active</span>
                    <button
                      onClick={() => setEditUser({ ...editUser, is_active: !editUser.is_active })}
                      className={`w-10 h-5 rounded-full transition-colors ${editUser.is_active ? "bg-blue-500" : "bg-white/10"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform m-0.5 ${editUser.is_active ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setEditUser(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white font-bold text-sm transition-colors">Cancel</button>
                  <button onClick={handleSaveUser} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors">Save Changes</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Add Modal */}
          {isAdding && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#0F2240] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Add New Employee</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Govt ID</label>
                      <input
                        value={newUser.govt_id}
                        onChange={(e) => setNewUser({ ...newUser, govt_id: e.target.value })}
                        className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500/50 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">PIN (Login)</label>
                      <input
                        type="password"
                        value={newUser.pin}
                        onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })}
                        className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500/50 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
                    <input
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500/50 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Role Type</label>
                      <select
                        value={newUser.employee_type}
                        onChange={(e) => setNewUser({ ...newUser, employee_type: e.target.value })}
                        className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500/50 outline-none appearance-none"
                      >
                        <option value="field_worker">Field Worker</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Admin</option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Job Title</label>
                      <input
                        value={newUser.job_role}
                        onChange={(e) => setNewUser({ ...newUser, job_role: e.target.value })}
                        placeholder="e.g. Constable"
                        className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500/50 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Department</label>
                    <select
                      value={newUser.dept_id}
                      onChange={(e) => setNewUser({ ...newUser, dept_id: parseInt(e.target.value) })}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500/50 outline-none appearance-none"
                    >
                      <option value={1}>Public Works Department</option>
                      <option value={2}>Health & Family Welfare</option>
                      <option value={3}>Haryana Police</option>
                      <option value={4}>Higher Education</option>
                      <option value={5}>Public Participation</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setIsAdding(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white font-bold text-sm transition-colors">Cancel</button>
                  <button onClick={handleAddUser} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors">Create User</button>
                </div>
              </div>
            </div>
          )}
        </InfoCard>
      )}

      {/* Departments Tab */}
      {tab === "departments" && (
        <InfoCard title="Department Overview">
          {!stats || !stats.department_performance || !Array.isArray(stats.department_performance) || stats.department_performance.length === 0 ? (
            <p className="text-slate-400 text-center py-8 text-sm">No department data available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.department_performance.map((dept: any, idx: number) => (
                <div key={`${dept.code || dept.name}-${idx}`} className={`p-6 rounded-2xl bg-${dept.color}-500/5 border border-${dept.color}-500/20 space-y-3 cursor-pointer hover:bg-${dept.color}-500/10 transition-colors`} onClick={() => { setTab("users"); setSearch(dept.name); }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white">{dept.name}</p>
                      <p className={`text-xs font-bold text-${dept.color}-400 mt-0.5`}>{dept.code}</p>
                    </div>
                    <span className={`text-xs bg-${dept.color}-500/10 text-${dept.color}-400 px-2 py-1 rounded-full border border-${dept.color}-500/20 font-bold`}>
                      {dept.employees} staff
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Zone: {dept.zone}</p>
                </div>
              ))}
            </div>
          )}
        </InfoCard>
      )}

      {/* Zones Tab */}
      {tab === "zones" && (
        <InfoCard title="Regional Zones">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map((z: any) => (
              <div key={z.id} className="p-5 rounded-2xl bg-black/20 border border-white/5 space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-white">{z.name}</p>
                  <MapPin size={14} className="text-blue-400" />
                </div>
                <p className="text-xs text-slate-400">{z.city}, {z.district}</p>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-slate-500">ID: {z.id}</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {/* Submissions Tab */}
      {tab === "submissions" && (
        <InfoCard title="Global Submission Feed">
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {allSubmissions.map((s: any) => (
              <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                  {s.after_image_url ? (
                    <img src={s.after_image_url} alt="Work" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600"><BarChart2 size={16} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white">{s.task_type}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(s.submitted_at).toLocaleString()} · Lat: {s.latitude.toFixed(4)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider ${
                    s.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    s.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {s.status}
                  </span>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">AI: {Math.round(s.ai_confidence * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {/* Scoring Rules Tab */}
      {tab === "scoring" && (
        <InfoCard title="Reward & Scoring Configuration">
          <div className="space-y-4">
            {loadingRules ? (
              <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>
            ) : !scoringRules || !Array.isArray(scoringRules) || scoringRules.length === 0 ? (
              <p className="text-slate-400 text-center py-8 text-sm">No scoring rules configured yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {scoringRules.map((rule) => (
                  <div key={rule.id} className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-tight">{rule.dept_code}</h4>
                        <p className="text-xs text-slate-500 font-medium">Department Scoring Weights</p>
                      </div>
                      <button 
                        onClick={() => setEditRule({ ...rule })}
                        className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all border border-blue-500/20"
                      >
                        <Settings2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Attendance</p>
                        <p className="text-xl font-black text-white">{Math.round(rule.attendance_weight * 100)}%</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Quality</p>
                        <p className="text-xl font-black text-white">{Math.round(rule.quality_weight * 100)}%</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Quantity</p>
                        <p className="text-xl font-black text-white">{Math.round(rule.count_weight * 100)}%</p>
                      </div>
                    </div>

                    {rule.context_bonus_formula && Array.isArray(rule.context_bonus_formula) && rule.context_bonus_formula.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Context Bonuses</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.context_bonus_formula.map((f: any, idx: number) => (
                            <div key={idx} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                              {f.task_type}: +{f.points} pts (Max {f.max})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Rule Modal */}
          {editRule && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#0F2240] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase">{editRule.dept_code}</h3>
                    <p className="text-sm text-slate-400">Configure point calculation rules</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Settings2 size={24} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Attendance Wt</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={editRule.attendance_weight}
                        onChange={(e) => setEditRule({ ...editRule, attendance_weight: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white font-bold focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Quality Wt</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={editRule.quality_weight}
                        onChange={(e) => setEditRule({ ...editRule, quality_weight: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white font-bold focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Quantity Wt</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={editRule.count_weight}
                        onChange={(e) => setEditRule({ ...editRule, count_weight: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white font-bold focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-xs font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <TrendingUp size={14} /> Context-Based Bonus Formulas
                    </p>
                    <div className="space-y-3">
                      {(editRule.context_bonus_formula || []).map((f: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label className="text-[9px] text-slate-500 font-bold uppercase mb-1">Task Type</label>
                            <input
                              value={f.task_type}
                              onChange={(e) => {
                                const newFormula = [...editRule.context_bonus_formula];
                                newFormula[idx].task_type = e.target.value;
                                setEditRule({ ...editRule, context_bonus_formula: newFormula });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-white text-xs outline-none"
                            />
                          </div>
                          <div className="w-16">
                            <label className="text-[9px] text-slate-500 font-bold uppercase mb-1">Pts</label>
                            <input
                              type="number"
                              value={f.points}
                              onChange={(e) => {
                                const newFormula = [...editRule.context_bonus_formula];
                                newFormula[idx].points = parseInt(e.target.value);
                                setEditRule({ ...editRule, context_bonus_formula: newFormula });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-white text-xs outline-none"
                            />
                          </div>
                          <div className="w-16">
                            <label className="text-[9px] text-slate-500 font-bold uppercase mb-1">Max</label>
                            <input
                              type="number"
                              value={f.max}
                              onChange={(e) => {
                                const newFormula = [...editRule.context_bonus_formula];
                                newFormula[idx].max = parseInt(e.target.value);
                                setEditRule({ ...editRule, context_bonus_formula: newFormula });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-white text-xs outline-none"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const newFormula = editRule.context_bonus_formula.filter((_:any, i:number) => i !== idx);
                              setEditRule({ ...editRule, context_bonus_formula: newFormula });
                            }}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newFormula = [...(editRule.context_bonus_formula || []), { task_type: "", points: 0, max: 0 }];
                          setEditRule({ ...editRule, context_bonus_formula: newFormula });
                        }}
                        className="w-full py-2 rounded-lg border border-dashed border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-xs font-bold transition-all mt-2"
                      >
                        + Add Bonus Formula
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
                  <button onClick={() => setEditRule(null)} className="flex-1 py-4 rounded-2xl border border-white/10 text-slate-400 hover:text-white font-bold text-sm transition-all">Discard</button>
                  <button onClick={handleSaveRule} className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-900/20 transition-all">Save Formula</button>
                </div>
              </div>
            </div>
          )}
        </InfoCard>
      )}

      {/* Grievances Tab */}
      {tab === "grievances" && (
        <InfoCard title="Employee Grievance & Disputes">
          <div className="space-y-4">
            {loadingGrievances ? (
              <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" /></div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {grievances.length === 0 && <p className="text-slate-400 text-center py-8 text-sm">No grievances reported.</p>}
                {grievances.map((g: any) => (
                  <div key={g.id} className="p-5 rounded-2xl bg-black/20 border border-white/5 space-y-3 hover:bg-black/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                           <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${g.status === 'open' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                             {g.status}
                           </span>
                           <span className="text-xs text-slate-500 font-bold">{g.category}</span>
                         </div>
                         <h4 className="font-bold text-white text-sm">{g.description}</h4>
                         <p className="text-[10px] text-slate-500 mt-1">
                           Submitted by ID: {g.employee_id.slice(0, 8)}... · {new Date(g.created_at).toLocaleString()}
                         </p>
                      </div>
                      <button 
                        onClick={() => setEditGrievance(g)}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 text-xs font-bold rounded-lg transition-all border border-blue-500/20"
                      >
                        Action
                      </button>
                    </div>
                    {g.resolution && (
                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Resolution:</p>
                        <p className="text-xs text-slate-300">{g.resolution}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resolve Modal */}
          {editGrievance && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-[#0F2240] border border-white/10 rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">Resolve Grievance</h3>
                      <p className="text-xs text-slate-400 mt-1">ID: {editGrievance.id}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                      <AlertTriangle size={20} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Employee Issue</p>
                      <p className="text-sm text-white italic">"{editGrievance.description}"</p>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Resolution Note</label>
                      <textarea 
                        className="w-full h-32 px-4 py-3 rounded-2xl bg-black/20 border border-white/10 text-white text-sm focus:border-blue-500/50 outline-none resize-none"
                        placeholder="Detail the resolution or why it was rejected..."
                        onChange={(e) => setEditGrievance({...editGrievance, resolution: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button onClick={() => setEditGrievance(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white font-bold text-sm transition-all">Cancel</button>
                    <button 
                      onClick={() => handleResolveGrievance(editGrievance.resolution || "No note provided")}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all"
                    >
                      Mark Resolved
                    </button>
                  </div>
               </div>
            </div>
          )}
        </InfoCard>
      )}
    </div>
  );
}
