"use client";

import { SupervisorSidebar } from "@/components/SupervisorSidebar";

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0A1628] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <SupervisorSidebar />
      <main className="flex-1 overflow-y-auto p-10 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
