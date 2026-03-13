"use client";

import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0A1628] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-[#0A1628]">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
