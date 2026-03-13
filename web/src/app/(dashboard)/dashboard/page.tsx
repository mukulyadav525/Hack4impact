"use client";

import { 
  TrendingUp, 
  Calendar, 
  MapPin,
  CheckCircle2, 
  AlertTriangle,
  User,
  Clock,
  ShieldCheck,
  Star
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

  const roleStats: any = {
    "Police": [
      { title: "Patrol Coverage", value: "88", unit: "% Today", change: "+2.1%", icon: MapPin, color: "blue" },
      { title: "Avg Response Time", value: "4.2", unit: "mins", change: "-0.5m", icon: Clock, color: "indigo" },
      { title: "Case Closure", value: "12", unit: "this week", change: "+4", icon: CheckCircle2, color: "green" },
      { title: "Area Checked", value: "24", unit: "km²", change: "On target", icon: TrendingUp, color: "orange" },
    ],
    "Healthcare": [
      { title: "Patients Seen", value: "42", unit: "today", change: "+12%", icon: User, color: "blue" },
      { title: "Immunizations", value: "18", unit: "verified", change: "Keep going", icon: ShieldCheck, color: "indigo" },
      { title: "Pending Reviews", value: "3", unit: "tasks", change: "-2 from am", icon: Clock, color: "green" },
      { title: "Compliance Score", value: "98", unit: "%", change: "Excellent", icon: CheckCircle2, color: "orange" },
    ],
    "Education": [
      { title: "Attendance Rate", value: "94", unit: "%", change: "+1.2%", icon: User, color: "blue" },
      { title: "Classes Taken", value: "6", unit: "/6 today", change: "Complete", icon: Calendar, color: "indigo" },
      { title: "Curriculum Progress", value: "72", unit: "%", change: "+5% week", icon: TrendingUp, color: "green" },
      { title: "Student Feedback", value: "4.8", unit: "/5.0", change: "Very High", icon: Star, color: "orange" },
    ],
    "Public": [
      { title: "Civic Reports", value: "3", unit: "approved", change: "+1", icon: CheckCircle2, color: "blue" },
      { title: "Impact Points", value: "150", unit: "pts", change: "+45 today", icon: Star, color: "indigo" },
      { title: "Community Rank", value: "12", unit: "/150", change: "Top 10%", icon: TrendingUp, color: "green" },
      { title: "Next Reward", value: "100", unit: "pts left", change: "Keep reporting", icon: AlertTriangle, color: "orange" },
    ],
    "Default": [
      { title: "Daily Score", value: "92", unit: "/100", change: "+5.2%", icon: TrendingUp, color: "blue" },
      { title: "Attendance Streak", value: "12", unit: "days", change: "Keep it up!", icon: Calendar, color: "indigo" },
      { title: "Tasks Completed", value: "8", unit: "today", change: "+2 from yesterday", icon: CheckCircle2, color: "green" },
      { title: "Tier Status", value: "Gold", unit: "", change: "Top 5% in Dept", icon: AlertTriangle, color: "orange" },
    ]
  };

  const getRoleKey = (role: string, employeeType: string) => {
    if (employeeType === "public") return "Public";
    if (role?.toLowerCase().includes("inspector") || role?.toLowerCase().includes("police")) return "Police";
    if (role?.toLowerCase().includes("doc") || role?.toLowerCase().includes("resident") || role?.toLowerCase().includes("asha")) return "Healthcare";
    if (role?.toLowerCase().includes("teacher") || role?.toLowerCase().includes("professor")) return "Education";
    return "Default";
  };

  const currentStats = roleStats[getRoleKey(user?.job_role, user?.employee_type)] || roleStats["Default"];
  const currentInsight = roleInsights[getRoleKey(user?.job_role, user?.employee_type)] || roleInsights["Default"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "Employee"}</h1>
        <p className="text-gray-500 dark:text-zinc-400">
          Role: <span className="text-blue-600 font-semibold">{user?.job_role}</span> • 
          Dept: <span className="text-blue-600 font-semibold">{user?.department?.name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat: any, idx: number) => (
          <StatCard 
            key={idx}
            title={stat.title} 
            value={stat.value} 
            unit={stat.unit} 
            change={stat.change} 
            icon={stat.icon}
            color={stat.color}
          />
        ))}
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
                <span className="font-medium">{user?.department?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Zone</span>
                <span className="font-medium">{user?.zone?.name || "Universal"}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 p-8">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Star size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider">Role Insight</h2>
            </div>
            <h3 className="font-bold text-lg mb-2">{currentInsight.highlight}</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
              {currentInsight.description}
            </p>
            <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
              {currentInsight.impact}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const roleInsights: any = {
  "Police": {
    highlight: "Patrol Multiplier Active",
    description: "Every 'Beat Patrol Check' submission currently grants a +5 points context bonus. Focus on high-risk areas for maximum impact.",
    impact: "Priority: Public Safety"
  },
  "Healthcare": {
    highlight: "Health Outreach Bonus",
    description: "Immunization drives and patient consultations are prioritized. Complete these tasks to earn up to 20 bonus points daily.",
    impact: "Priority: Public Health"
  },
  "Education": {
    highlight: "Class Consistency",
    description: "Daily Class Attendance Records contribute directly to your quality index. Maintain consistency for higher rewards eligibility.",
    impact: "Priority: Education Quality"
  },
  "Public": {
    highlight: "Civic Champion Program",
    description: "Your reports help clean and fix our city. Every approved report earns you Impact Points that contribute to community rewards.",
    impact: "Priority: Civic Duty"
  },
  "Default": {
    highlight: "Performance Boost",
    description: "Your daily tasks contribute to the department's overall efficiency. Maintain high AI quality scores for Platinum tier.",
    impact: "Overall Productivity"
  }
};

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
