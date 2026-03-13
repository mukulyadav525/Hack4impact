"use client";

import { useState, useRef } from "react";
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

  const handleSubmit = async () => {
    setStatus("loading");
    // Get location and submit...
    setTimeout(() => {
        setStatus("success");
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Work Submission</h1>
        <p className="text-gray-500 dark:text-zinc-400">Submit 'Before' and 'After' proof for AI-powered verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center gap-4 bg-white dark:bg-black p-4 rounded-2xl border border-gray-100 dark:border-zinc-900">
             <StepTab active={stage === "before"} label="1. Before Work" />
             <div className="h-px bg-gray-100 dark:bg-zinc-800 flex-1" />
             <StepTab active={stage === "after"} label="2. After Work" />
             <div className="h-px bg-gray-100 dark:bg-zinc-800 flex-1" />
             <StepTab active={stage === "details"} label="3. Task Details" />
          </div>

          <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8 shadow-sm">
            {stage === "before" && (
              <div className="space-y-6">
                 <h2 className="text-xl font-semibold">Step 1: Capture State Before Work</h2>
                 <p className="text-sm text-gray-500">Take a clear photo of the site before starting your task.</p>
                 <Camera onCapture={setBeforeImg} className="aspect-[16/9]" />
                 <div className="flex justify-end mt-6">
                   <button 
                    disabled={!beforeImg}
                    onClick={() => setStage("after")}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-200 transition-all flex items-center gap-2"
                   >
                     Next Step <ArrowRight size={18} />
                   </button>
                 </div>
              </div>
            )}

            {stage === "after" && (
              <div className="space-y-6">
                 <h2 className="text-xl font-semibold">Step 2: Capture State After Work</h2>
                 <p className="text-sm text-gray-500">Take a photo of the completed task from the same angle.</p>
                 <Camera onCapture={setAfterImg} className="aspect-[16/9]" />
                 <div className="flex justify-between mt-6">
                   <button onClick={() => setStage("before")} className="text-gray-500 font-medium hover:text-gray-900">Back</button>
                   <button 
                    disabled={!afterImg}
                    onClick={() => setStage("details")}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-200 transition-all flex items-center gap-2"
                   >
                     Next Step <ArrowRight size={18} />
                   </button>
                 </div>
              </div>
            )}

            {stage === "details" && (
              <div className="space-y-6">
                 <h2 className="text-xl font-semibold">Step 3: Provide Task Context</h2>
                 <div className="space-y-4">
                   <label className="block">
                     <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">What work was performed?</span>
                     <select 
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800 p-4"
                     >
                       <option value="">Select task type...</option>
                       <option value="pothole_repair">Pothole Repair</option>
                       <option value="garbage_collection">Garbage Collection</option>
                       <option value="street_light_fix">Street Light Repair</option>
                       <option value="drainage_clearing">Drainage Clearing</option>
                     </select>
                   </label>

                   <div className="grid grid-cols-2 gap-4">
                     <PreviewBox src={beforeImg} label="Before" />
                     <PreviewBox src={afterImg} label="After" />
                   </div>
                 </div>

                 <div className="flex justify-between mt-8">
                   <button onClick={() => setStage("after")} className="text-gray-500 font-medium hover:text-gray-900">Back</button>
                   <button 
                    onClick={handleSubmit}
                    disabled={!taskType || status === "loading" || status === "success"}
                    className="flex items-center gap-2 px-10 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all"
                   >
                     {status === "loading" ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                     {status === "loading" ? "Submitting..." : status === "success" ? "Submitted!" : "Send for AI Audit"}
                   </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8">
             <div className="flex items-center gap-3 mb-4 text-blue-600">
               <Layers size={20} />
               <h3 className="font-semibold">AI Verification Info</h3>
             </div>
             <p className="text-sm text-gray-500 leading-relaxed">
               Our AI (GPT-4o Vision) will compare both images to verify the work. 
               Ensure consistent lighting and framing for faster approval.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepTab({ active, label }: any) {
  return (
    <div className={cn(
      "text-xs font-bold uppercase tracking-wider",
      active ? "text-blue-600" : "text-gray-300"
    )}>
      {label}
    </div>
  );
}

function PreviewBox({ src, label }: any) {
  return (
    <div className="relative group">
      <img src={src} className="w-full h-32 object-cover rounded-xl border border-gray-100 dark:border-zinc-800" />
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
        {label}
      </div>
    </div>
  );
}

import { ArrowRight } from "lucide-react";
