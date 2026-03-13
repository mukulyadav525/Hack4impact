"use client";

import { SupervisorSidebar } from "@/components/SupervisorSidebar";

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white dark:bg-black overflow-hidden font-sans">
      <SupervisorSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-zinc-950 p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
