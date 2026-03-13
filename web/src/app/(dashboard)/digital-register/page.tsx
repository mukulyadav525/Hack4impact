"use client";

import { useState } from "react";
import { Camera } from "@/components/Camera";
import { Send, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_V1 } from "@/lib/api_config";

export default function DigitalRegisterPage() {
  const [stage, setStage] = useState<"before" | "after" | "details">("before");
  const [beforeImg, setBeforeImg] = useState<string | null>(null);
  const [afterImg, setAfterImg] = useState<string | null>(null);
  const [details, setDetails] = useState<any>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!beforeImg || !afterImg) return;
    setStatus("loading");
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_V1}/submissions/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ 
          task_type: "digital_register",
          before_image_base64: beforeImg.split(',')[1],
          after_image_base64: afterImg.split(',')[1],
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          details
        }),
      });
      if (response.ok) setStatus("success");
      else setStatus("error");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Digital Register Entry</h1>
        <p className="text-gray-500 dark:text-zinc-400">Digitize and record today's student attendance.</p>
      </div>

      <div className="bg-white dark:bg-black rounded-[2.5rem] border border-gray-100 dark:border-zinc-900 overflow-hidden shadow-xl shadow-emerald-500/5">
        {stage === "before" && (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">1. Capture First Page</h2>
            <Camera onCapture={setBeforeImg} showOverlay={false} className="rounded-[2rem]" />
            <div className="flex justify-end pt-4">
              <button disabled={!beforeImg} onClick={() => setStage("after")} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-50 flex gap-2">Next <ArrowRight size={20} /></button>
            </div>
          </div>
        )}
        {stage === "after" && (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">2. Capture Second Page</h2>
            <Camera onCapture={setAfterImg} showOverlay={false} className="rounded-[2rem]" />
            <div className="flex justify-between pt-4">
              <button onClick={() => setStage("before")} className="px-6 py-3 text-gray-400 font-semibold">Back</button>
              <button disabled={!afterImg} onClick={() => setStage("details")} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-50 flex gap-2">Next <ArrowRight size={20} /></button>
            </div>
          </div>
        )}
        {stage === "details" && (
          <div className="p-8 space-y-8">
            <h2 className="text-2xl font-bold">3. Register Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Class/Grade" className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setDetails({ ...details, class_code: e.target.value })} />
              <input type="number" placeholder="Total Present Students" className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setDetails({ ...details, student_count: e.target.value })} />
            </div>
            <div className="flex justify-between pt-4">
               <button onClick={() => setStage("after")} className="px-6 py-3 text-gray-400 font-semibold">Back</button>
               <button onClick={handleSubmit} disabled={status === "loading" || status === "success"} className={cn("px-12 py-5 rounded-[1.25rem] font-bold text-white flex gap-2", status === "success" ? "bg-green-500" : "bg-emerald-600 hover:bg-emerald-500")}>
                {status === "loading" ? <Loader2 className="animate-spin" /> : status === "success" ? <CheckCircle2 /> : <Send size={20} />}
                {status === "loading" ? "DIGITIZING..." : status === "success" ? "RECORDED!" : "SAVE REGISTER"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
