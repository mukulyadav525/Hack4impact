"use client";

import { useState, useEffect, useRef } from "react";
import { Camera } from "@/components/Camera";
import { 
  FileUp, 
  MapPin, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Info,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubmissionsPage() {
  const [stage, setStage] = useState<"before" | "after" | "details">("before");
  const [beforeImg, setBeforeImg] = useState<string | null>(null);
  const [afterImg, setAfterImg] = useState<string | null>(null);
  const [taskType, setTaskType] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/v1/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!beforeImg || !afterImg || !taskType) return;
    
    setStatus("loading");
    
    try {
      // Get location
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const token = localStorage.getItem("token");
      const govtId = localStorage.getItem("govtId") || "MOCK-123";

      const response = await fetch("http://127.0.0.1:8000/api/v1/submissions/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          govt_id: govtId,
          task_type: taskType,
          before_image_base64: beforeImg.split(',')[1],
          after_image_base64: afterImg.split(',')[1],
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Work Submission</h1>
        <p className="text-gray-500 dark:text-zinc-400">Submit 'Before' and 'After' proof for AI-powered verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Progress Steps */}
          <div className="bg-white/50 dark:bg-black/50 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-zinc-900 shadow-sm">
            <div className="flex items-center justify-between px-4">
               <StepIndicator active={stage === "before"} completed={stage !== "before"} step="1" label="Before" />
               <div className={cn("h-0.5 flex-1 mx-4 transition-colors duration-500", stage !== "before" ? "bg-blue-600" : "bg-gray-100 dark:bg-zinc-800")} />
               <StepIndicator active={stage === "after"} completed={stage === "details"} step="2" label="After" />
               <div className={cn("h-0.5 flex-1 mx-4 transition-colors duration-500", stage === "details" ? "bg-blue-600" : "bg-gray-100 dark:bg-zinc-800")} />
               <StepIndicator active={stage === "details"} completed={false} step="3" label="Details" />
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-[2.5rem] border border-gray-100 dark:border-zinc-900 overflow-hidden shadow-xl shadow-blue-500/5 transition-all duration-500">
            {stage === "before" && (
              <div className="p-8 space-y-6">
                 <div>
                   <h2 className="text-2xl font-bold mb-1">Capture Initial State</h2>
                   <p className="text-gray-500 text-sm">Take a clear photo of the site before starting your task.</p>
                 </div>
                 <div className="relative group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                   <Camera onCapture={setBeforeImg} showOverlay={false} className="relative aspect-video rounded-[2rem]" />
                 </div>
                 <div className="flex justify-end pt-4">
                   <button 
                    disabled={!beforeImg}
                    onClick={() => setStage("after")}
                    className="group px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-600 transition-all flex items-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95"
                   >
                     Next Step 
                     <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                 </div>
              </div>
            )}

            {stage === "after" && (
              <div className="p-8 space-y-6">
                 <div>
                   <h2 className="text-2xl font-bold mb-1">Verify Completion</h2>
                   <p className="text-gray-500 text-sm">Capture the finished result from the same perspective.</p>
                 </div>
                 <div className="relative group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                   <Camera onCapture={setAfterImg} showOverlay={false} className="relative aspect-video rounded-[2rem]" />
                 </div>
                 <div className="flex justify-between items-center pt-4">
                   <button 
                    onClick={() => setStage("before")} 
                    className="px-6 py-3 text-gray-400 hover:text-blue-600 font-semibold transition-colors flex items-center gap-2"
                   >
                     Back to Step 1
                   </button>
                   <button 
                    disabled={!afterImg}
                    onClick={() => setStage("details")}
                    className="group px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-600 transition-all flex items-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95"
                   >
                     Next Step 
                     <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                 </div>
              </div>
            )}

            {stage === "details" && (
              <div className="p-8 space-y-8">
                 <div>
                   <h2 className="text-2xl font-bold mb-1">Final Submission</h2>
                   <p className="text-gray-500 text-sm">Categorize your work for AI-driven credit assessment.</p>
                 </div>
                 
                 <div className="space-y-6">
                   <div className="bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800">
                     <label className="block space-y-2">
                       <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Select Task Category</span>
                       <select 
                          value={taskType}
                          onChange={(e) => setTaskType(e.target.value)}
                          className="block w-full rounded-2xl border-2 border-transparent bg-white dark:bg-zinc-900 focus:border-blue-600 focus:ring-0 p-4 font-medium transition-all"
                       >
                         <option value="">Choose task type...</option>
                          {user?.employee_type === "public" && (
                            <>
                              <option value="Garbage Dump Report">Garbage Dump Report</option>
                              <option value="Pothole Report">Pothole Report</option>
                              <option value="Public Infrastructure Feedback">Public Infrastructure Feedback</option>
                              <option value="Street Light Issue">Street Light Issue</option>
                            </>
                          )}
                          {/* ... other options same ... */}
                          {user?.employee_type !== "public" && user?.department?.name === "Health & Family Welfare" && (
                            <>
                              <option value="patient_consultation">Patient Consultation</option>
                              <option value="immunization_drive">Immunization Drive</option>
                              <option value="sanitation_check">Hospital Sanitation Check</option>
                            </>
                          )}
                          {user?.employee_type !== "public" && user?.department?.name === "Haryana Police" && (
                            <>
                              <option value="beat_patrol">Beat Patrol Check</option>
                              <option value="traffic_management">Traffic Management</option>
                              <option value="security_audit">Site Security Audit</option>
                            </>
                          )}
                          {user?.employee_type !== "public" && user?.department?.name === "Higher Education" && (
                            <>
                              <option value="attendance_verification">Class Attendance Verification</option>
                              <option value="exam_invigilation">Exam Invigilation</option>
                              <option value="lab_session">Lab Session Verification</option>
                            </>
                          )}
                          {user?.employee_type !== "public" && (!user?.department?.name || user?.department?.name === "Public Works Department") && (
                            <>
                              <option value="pothole_repair">Pothole Repair</option>
                              <option value="garbage_collection">Garbage Collection</option>
                              <option value="street_light_fix">Street Light Repair</option>
                              <option value="drainage_clearing">Drainage Clearing</option>
                            </>
                          )}
                       </select>
                     </label>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                     <PreviewCard src={beforeImg} label="Initial State" type="before" />
                     <PreviewCard src={afterImg} label="Final Result" type="after" />
                   </div>
                 </div>

                 <div className="flex justify-between items-center pt-4">
                   <button onClick={() => setStage("after")} className="px-6 py-3 text-gray-400 hover:text-blue-600 font-semibold transition-colors">Back</button>
                   <button 
                    onClick={handleSubmit}
                    disabled={!taskType || status === "loading" || status === "success"}
                    className={cn(
                      "flex items-center gap-3 px-12 py-5 rounded-[1.25rem] font-black tracking-wide shadow-2xl transition-all active:scale-95",
                      status === "success" 
                        ? "bg-green-500 text-white shadow-green-500/40"
                        : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/40"
                    )}
                   >
                     {status === "loading" ? <Loader2 className="animate-spin" /> : status === "success" ? <CheckCircle2 /> : <Send size={20} />}
                     {status === "loading" ? "UPLOADING TO AI CLUSTER..." : status === "success" ? "WORK VERIFIED!" : "SUBMIT FOR APPROVAL"}
                   </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700"></div>
             <div className="relative z-10 space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                 <Layers size={24} className="text-white" />
               </div>
               <div>
                 <h3 className="text-xl font-bold mb-3">AI Vision Verification</h3>
                 <p className="text-blue-100 text-sm leading-relaxed mb-6">
                   Our multi-modal GPT-4o Vision system analyzes your 'Before' and 'After' photos in real-time to identify:
                 </p>
                 <ul className="space-y-3">
                   <VerificationBadge text="Object Detection" />
                   <VerificationBadge text="Visual Difference Δ" />
                   <VerificationBadge text="GPS Spoof Analysis" />
                   <VerificationBadge text="Time-Consistency" />
                 </ul>
               </div>
               <div className="pt-4 border-t border-white/20">
                 <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-tighter">
                   <Info size={14} />
                   Guaranteed response within 60s
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-gray-100 dark:border-zinc-800 p-8">
            <h4 className="font-bold text-sm mb-4">Submission Tips</h4>
            <div className="space-y-4">
              <TipItem num="01" text="Ensure both photos are taken from the exact same angle." />
              <TipItem num="02" text="Avoid blurry images; use the retake option if needed." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ active, completed, step, label }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
        active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110 ring-4 ring-blue-500/10" : 
        completed ? "bg-green-100 text-green-600 dark:bg-green-900/20" : 
        "bg-gray-100 text-gray-400 dark:bg-zinc-800"
      )}>
        {completed ? <CheckCircle2 size={18} /> : step}
      </div>
      <span className={cn(
        "text-[10px] font-black uppercase tracking-widest",
        active ? "text-blue-600" : "text-gray-400 dark:text-zinc-600"
      )}>{label}</span>
    </div>
  );
}

function PreviewCard({ src, label, type }: any) {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-black shadow-inner">
      <img src={src} className="w-full h-40 object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">{label}</p>
      </div>
      <div className={cn(
        "absolute top-3 left-3 w-2 h-2 rounded-full",
        type === "before" ? "bg-amber-400" : "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"
      )} />
    </div>
  );
}

function VerificationBadge({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
      <CheckCircle2 size={14} className="text-blue-200" />
      {text}
    </li>
  );
}

function TipItem({ num, text }: any) {
  return (
    <div className="flex gap-4">
      <span className="text-[10px] font-black text-blue-600 opacity-30 mt-1">{num}</span>
      <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">{text}</p>
    </div>
  );
}


import { ArrowRight } from "lucide-react";
