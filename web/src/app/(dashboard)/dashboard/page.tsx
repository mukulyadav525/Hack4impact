"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy load each dashboard to keep bundles small
const PoliceDashboard     = dynamic(() => import("@/components/dashboards/PoliceDashboard"), { ssr: false });
const HealthcareDashboard = dynamic(() => import("@/components/dashboards/HealthcareDashboard"), { ssr: false });
const EducationDashboard  = dynamic(() => import("@/components/dashboards/EducationDashboard"), { ssr: false });
const CitizenDashboard    = dynamic(() => import("@/components/dashboards/CitizenDashboard"), { ssr: false });
const AdminDashboard      = dynamic(() => import("@/components/dashboards/AdminDashboard"), { ssr: false });
const DefaultDashboard    = dynamic(() => import("@/components/dashboards/DefaultDashboard"), { ssr: false });
const SupervisorDashboard = dynamic(() => import("@/components/dashboards/SupervisorDashboard"), { ssr: false });

function getDashboardType(user: any): string {
  const type = user?.employee_type?.toLowerCase();
  const role = user?.job_role?.toLowerCase() || "";
  const dept = user?.department?.dept_code?.toLowerCase() || "";

  if (type === "admin") return "admin";
  if (type === "public") return "citizen";
  if (dept === "pol-hr" || role.includes("police") || role.includes("inspector") || role.includes("constable")) return "police";
  if (dept === "hfw-hr" || role.includes("doc") || role.includes("resident") || role.includes("asha") || role.includes("nurse") || role.includes("health")) return "healthcare";
  if (dept === "edu-hr" || role.includes("teacher") || role.includes("professor") || role.includes("lecturer")) return "education";
  if (type === "supervisor") return "supervisor";
  return "default";
}

import { API_V1 } from "@/lib/api_config";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_V1}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setUser(await res.json());
      } catch {}
      finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  const dashboardType = getDashboardType(user);

  switch (dashboardType) {
    case "police":      return <PoliceDashboard user={user} />;
    case "healthcare":  return <HealthcareDashboard user={user} />;
    case "education":   return <EducationDashboard user={user} />;
    case "citizen":     return <CitizenDashboard user={user} />;
    case "admin":       return <AdminDashboard user={user} />;
    case "supervisor":  return <SupervisorDashboard user={user} />;
    default:            return <DefaultDashboard user={user} />;
  }
}
