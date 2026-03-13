"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { API_V1 } from "@/lib/api_config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <div className="flex h-screen bg-[#0A1628] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-8 bg-[#0A1628]">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
