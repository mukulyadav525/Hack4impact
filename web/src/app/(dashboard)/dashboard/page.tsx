import { 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";

export default function DashboardPage() {
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

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "Employee"}</h1>
        <p className="text-gray-500 dark:text-zinc-400">Here's an overview of your performance today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Score" 
          value="92" 
          unit="/100" 
          change="+5.2%" 
          icon={TrendingUp}
          color="blue"
        />
        <StatCard 
          title="Attendance Streak" 
          value="12" 
          unit="days" 
          change="Keep it up!" 
          icon={Calendar}
          color="indigo"
        />
        <StatCard 
          title="Tasks Completed" 
          value="8" 
          unit="today" 
          change="+2 from yesterday" 
          icon={CheckCircle2}
          color="green"
        />
        <StatCard 
          title="Tier Status" 
          value="Gold" 
          unit="" 
          change="Top 5% in Dept" 
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-zinc-900 p-8">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            {/* Activity List Placeholder */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Attendance Verified</p>
                    <p className="text-sm text-gray-500">2 hours ago • Zone 12-B</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/10">
            <h2 className="text-lg font-semibold mb-2">Check-in Required</h2>
            <p className="text-blue-100 text-sm mb-6">Please complete your biometric check-in to begin your daily tasks.</p>
            <button className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all">
              Start Check-in
            </button>
          </div>
          
          <div className="bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-zinc-900 p-8">
            <h2 className="text-lg font-semibold mb-4">Department Info</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span className="font-medium">PWD Haryana</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Zone</span>
                <span className="font-medium">Gurugram-II</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, change, icon: Icon, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
  };

  return (
    <div className="bg-white dark:bg-black p-6 rounded-2xl border border-gray-100 dark:border-zinc-900 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-xl", colors[color])}>
          <Icon size={24} />
        </div>
        <span className="text-xs font-semibold text-green-500">{change}</span>
      </div>
      <div>
        <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-gray-400 text-sm">{unit}</span>
        </div>
      </div>
    </div>
  );
}
