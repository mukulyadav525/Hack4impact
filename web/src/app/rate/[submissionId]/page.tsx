"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, AlertTriangle, Send, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingPage() {
  const { submissionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [complaintFiled, setComplaintFiled] = useState(false);
  const [comment, setComment] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/public/rate-doctor/${submissionId}`);
        if (!res.ok) throw new Error("Consultation not found or invalid link.");
        const info = await res.json();
        setData(info);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (submissionId) fetchInfo();
  }, [submissionId]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    
    try {
      const res = await fetch(`http://localhost:8000/api/v1/public/rate-doctor/${submissionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          complaint_filed: complaintFiled,
          comment
        })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to submit rating.");
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center text-white p-6">
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl max-w-md w-full text-center">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Link Invalid</h2>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (data?.reviewed) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center text-white p-6">
        <div className="bg-green-500/10 border border-green-500/30 p-8 rounded-3xl max-w-md w-full text-center">
          <CheckCircle2 className="text-green-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Already Reviewed</h2>
          <p className="text-green-200">You have already submitted feedback for this consultation.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center text-white p-6">
        <div className="bg-blue-600/10 border border-blue-500/30 p-8 rounded-3xl max-w-md w-full text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
            <CheckCircle2 className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-blue-200">Your feedback helps us maintain transparency and quality of care.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center text-white p-6 font-sans">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
             GovTrack AI
           </h1>
           <p className="text-slate-400 font-medium tracking-wide text-sm uppercase">Patient Feedback Portal</p>
        </div>

        <div className="bg-[#1E3A5F]/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md shadow-2xl space-y-8">
           <div className="text-center">
             <h2 className="text-2xl font-semibold mb-1">Rate your consultation</h2>
             <p className="text-slate-400 text-sm">with <span className="text-blue-400 font-bold">{data.doctor_name}</span></p>
           </div>
           
           <div className="flex justify-center gap-2">
             {[1, 2, 3, 4, 5].map((star) => (
               <button
                 key={star}
                 className="p-1 transition-all hover:scale-110 active:scale-95 text-slate-600"
                 onMouseEnter={() => setHoveredRating(star)}
                 onMouseLeave={() => setHoveredRating(0)}
                 onClick={() => setRating(star)}
               >
                 <Star 
                   size={48} 
                   className={cn(
                     "transition-colors duration-200",
                     (hoveredRating || rating) >= star ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" : ""
                   )} 
                 />
               </button>
             ))}
           </div>

           <div className="space-y-4 pt-4 border-t border-white/5">
             <label className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
               <input 
                 type="checkbox" 
                 checked={complaintFiled} 
                 onChange={(e) => setComplaintFiled(e.target.checked)}
                 className="w-5 h-5 rounded bg-black/50 border-slate-600 checked:bg-red-500 checked:border-red-500 focus:ring-0 focus:ring-offset-0"
               />
               <div className="flex-1">
                 <p className="font-bold text-sm text-red-400 flex items-center gap-2">
                   <AlertTriangle size={16} /> File a Formal Complaint
                 </p>
                 <p className="text-xs text-slate-400 mt-1">If the doctor was absent or requested a bribe.</p>
               </div>
             </label>

             {(complaintFiled || rating <= 3) && rating > 0 && (
               <div className="animate-in fade-in slide-in-from-top-2">
                 <textarea 
                   placeholder="Please provide details (optional)..."
                   value={comment}
                   onChange={(e) => setComment(e.target.value)}
                   className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-0 resize-none h-32 placeholder:text-slate-600"
                 />
               </div>
             )}
           </div>

           {error && <p className="text-red-400 text-sm text-center font-medium bg-red-500/10 py-3 rounded-xl border border-red-500/20">{error}</p>}

           <button 
             onClick={handleSubmit}
             disabled={rating === 0 || submitting}
             className="w-full py-4 px-6 rounded-2xl bg-blue-600 font-bold text-white hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 active:scale-95 text-lg"
           >
             {submitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
             {submitting ? "Submitting..." : "Submit Feedback"}
           </button>
        </div>
      </div>
    </div>
  );
}
