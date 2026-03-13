"use client";

import { 
  User, 
  Mail, 
  Phone, 
  BadgeCheck, 
  Shield, 
  MapPin,
  Building
} from "lucide-react";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/v1/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
        <Shield size={28} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Could not load profile</h2>
        <p className="text-slate-400 text-sm mt-1">Your session may have expired. Please sign out and log in again.</p>
      </div>
      <button
        onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all"
      >
        Back to Login
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight">Your Profile</h1>
        <p className="text-slate-400 font-medium">View and manage your government employee records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-full w-fit uppercase tracking-wider">
                  <BadgeCheck size={12} />
                  Verified Employee
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <InfoItem icon={User} label="Government ID" value={user.govt_id} />
               <InfoItem icon={BadgeCheck} label="Job Role" value={user.job_role || "Employee"} />
               <InfoItem icon={Shield} label="Employee Type" value={user.employee_type || "field_worker"} />
               <InfoItem icon={Mail} label="Email" value={`${user.name?.toLowerCase().replace(' ', '.')}@haryana.gov.in`} />
            </div>
          </div>

          <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl">
            <h3 className="text-lg font-bold mb-6 text-white">Assigned Location</h3>
            <div className="space-y-6">
               <InfoItem icon={Building} label="Department" value={user.department?.name || 'Not Assigned'} />
               <InfoItem icon={MapPin} label="Zone" value={user.zone?.name || 'Universal'} />
               <div className="aspect-video w-full rounded-2xl bg-black/20 border border-white/5 flex items-center justify-center text-slate-500 text-sm">
                  Interactive Zone Boundary Map (Coming Soon)
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security & Settings */}
        <div className="space-y-6">
          <div className="bg-[#1E3A5F]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8">
            <div className="flex items-center gap-3 mb-6 text-blue-400">
               <Shield size={20} />
               <h3 className="font-bold">Security</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-2xl border border-white/5 bg-black/10 hover:bg-black/30 transition-all">
                <p className="text-sm font-bold text-white">Change PIN</p>
                <p className="text-xs text-slate-400 mt-0.5">Update your 4-digit access pin</p>
              </button>
              <button className="w-full text-left p-4 rounded-2xl border border-white/5 bg-black/10 hover:bg-black/30 transition-all">
                <p className="text-sm font-bold text-white">Face ID</p>
                <p className="text-xs text-slate-400 mt-0.5">Recalibrate biometric data</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
        <Icon size={12} />
        {label}
      </div>
      <p className="font-bold text-white">{value || '—'}</p>
    </div>
  );
}
