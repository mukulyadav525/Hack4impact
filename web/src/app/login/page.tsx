 
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { API_V1 } from "@/lib/api_config";


export default function LoginPage() {
  const [govtId, setGovtId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent, overrideId?: string, overridePin?: string) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    const loginGovtId = overrideId ?? govtId;
    const loginPin    = overridePin ?? pin;

    try {
      const response = await fetch(`${API_V1}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ govt_id: loginGovtId, pin: loginPin }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("govtId", loginGovtId);
        router.push("/dashboard");
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.detail || "Invalid Govt ID or PIN. Check credentials below.");
      }
    } catch {
      setError("Cannot reach server — please check your connection or try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A1628] px-4 py-12 sm:px-6 lg:px-8 relative font-sans text-white overflow-hidden">
      {/* Background pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at center, #3B82F6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[100px] rounded-full z-0 pointer-events-none" />

      <div className="w-full max-w-md space-y-5 relative z-10">

        {/* Login Card */}
        <div className="relative p-10 rounded-3xl bg-[#1E3A5F]/40 border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-white mb-2">
              GovTrack AI Login
            </h2>
            <p className="text-center text-sm text-slate-400 font-medium">
              Secure Employee Authentication Portal
            </p>
          </div>

          <form className="mt-10 space-y-4" onSubmit={handleLogin}>
            <input
              id="govtId"
              type="text"
              required
              className="block w-full rounded-xl border border-white/10 bg-black/20 py-3.5 px-4 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors sm:text-sm"
              placeholder="Government ID  (e.g. EDU-2024-0001)"
              value={govtId}
              onChange={(e) => setGovtId(e.target.value)}
              disabled={isLoading}
            />
            <input
              id="pin"
              type="password"
              required
              className="block w-full rounded-xl border border-white/10 bg-black/20 py-3.5 px-4 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors sm:text-sm tracking-widest"
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              disabled={isLoading}
            />

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-center text-sm font-medium text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-blue-500 focus:outline-none shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Secure Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            <div className="pt-4 border-t border-white/5 text-center flex items-center justify-center gap-2 opacity-50">
              <ShieldCheck size={14} className="text-slate-400" />
              <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Authorized Personnel Only</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
