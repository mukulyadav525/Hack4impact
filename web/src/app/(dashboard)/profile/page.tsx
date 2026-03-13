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

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Error loading profile.</div>;

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-gray-500 dark:text-zinc-400">View and manage your government employee records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8 shadow-sm">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/20">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-bold rounded w-fit uppercase tracking-wider">
                  <BadgeCheck size={12} />
                  Verified Employee
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <InfoItem icon={User} label="Government ID" value={user.govt_id} />
               <InfoItem icon={BadgeCheck} label="Job Role" value={user.job_role || "Employee"} />
               <InfoItem icon={Mail} label="Email Address" value={`${user.name.toLowerCase().replace(' ', '.')}@haryana.gov.in`} />
               <InfoItem icon={Phone} label="Mobile Number" value="+91 98765 XXXXX" />
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Assigned Location</h3>
            <div className="space-y-6">
               <InfoItem icon={Building} label="Department" value="Public Works Department (B&R) - Haryana" />
               <InfoItem icon={MapPin} label="Zone" value="Gurugram North-II (Municipal Corp)" />
               <div className="aspect-video w-full rounded-2xl bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-400 text-sm italic">
                  Interactive Zone Boundary Map Placeholder
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security & Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8">
            <div className="flex items-center gap-3 mb-6 text-indigo-600">
               <Shield size={20} />
               <h3 className="font-bold">Security</h3>
            </div>
            <div className="space-y-4">
              <button className="w-full text-left p-4 rounded-2xl border border-gray-100 dark:border-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all">
                <p className="text-sm font-bold">Change PIN</p>
                <p className="text-xs text-gray-400 mt-0.5">Update your 4-digit access pin</p>
              </button>
              <button className="w-full text-left p-4 rounded-2xl border border-gray-100 dark:border-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all">
                <p className="text-sm font-bold">Face ID</p>
                <p className="text-xs text-gray-400 mt-0.5">Recalibrate biometric data</p>
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
    <div className="space-y-1.5 text-black">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
        <Icon size={12} />
        {label}
      </div>
      <p className="font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}
