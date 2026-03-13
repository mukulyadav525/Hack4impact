"use client";

import { useState, useEffect } from "react";
import { Camera } from "@/components/Camera";
import { 
  MapPin, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_V1 } from "@/lib/api_config";

export default function AttendancePage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Request location on load
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => setMessage("Please enable location access to mark attendance.")
    );
  }, []);

  const handleCheckIn = async () => {
    if (!location || !selfie) return;

    setStatus("loading");
    setMessage("Verifying biometric data and location...");

    try {
      const token = localStorage.getItem("token");
      const govtId = localStorage.getItem("govtId") || "MOCK-123";

      const response = await fetch(`${API_V1}/auth/biometric-checkin`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          govt_id: govtId,
          selfie_base64: selfie.split(',')[1], // Remove header
          latitude: location.lat,
          longitude: location.lon
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Attendance marked successfully! You can now start your work.");
      } else {
        setStatus("error");
        setMessage(data.detail || "Verification failed. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Connection error. Check your internet.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Biometric Attendance</h1>
        <p className="text-gray-500 dark:text-zinc-400">Secure check-in using AI face verification and geo-fencing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Verification Steps */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 overflow-hidden shadow-sm">
            <div className="p-8">
              <Camera onCapture={setSelfie} className="mb-8" />
              
              <div className="space-y-4">
                <StepItem 
                  icon={MapPin} 
                  label="GPS Location" 
                  status={location ? "done" : "pending"} 
                  detail={location ? `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}` : "Detecting location..."}
                />
                <StepItem 
                  icon={ShieldCheck} 
                  label="Bio-Verification" 
                  status={selfie ? "done" : "pending"} 
                  detail={selfie ? "Selfie captured" : "Waiting for camera capture"}
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/50 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {status === "loading" && <Loader2 className="animate-spin text-blue-600" size={20} />}
                {status === "success" && <CheckCircle2 className="text-green-500" size={20} />}
                {status === "error" && <AlertCircle className="text-red-500" size={20} />}
                <span className={cn(
                  "text-sm font-medium",
                  status === "error" ? "text-red-600" : "text-gray-600 dark:text-zinc-400"
                )}>
                  {message || "Ready to verify"}
                </span>
              </div>

              <button
                onClick={handleCheckIn}
                disabled={!location || !selfie || status === "loading" || status === "success"}
                className={cn(
                  "flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all",
                  (!location || !selfie || status === "loading" || status === "success")
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-zinc-800"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                )}
              >
                {status === "loading" ? "Verifying..." : "Verify & Check-in"}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8">
            <h3 className="font-semibold mb-4">Instructions</h3>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-zinc-400">
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                Ensure you are within your assigned work zone.
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                Remove sunglasses or masks for face verification.
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0 text-[10px] font-bold">3</div>
                Keep your camera steady and ensure good lighting.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-xs text-gray-400">Your biometric data is encrypted and deleted immediately after verification matching.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({ icon: Icon, label, status, detail }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          status === "done" ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-gray-100 text-gray-400 dark:bg-zinc-800"
        )}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-gray-500">{detail}</p>
        </div>
      </div>
      {status === "done" && <CheckCircle2 size={16} className="text-green-500" />}
    </div>
  );
}
