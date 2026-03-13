"use client";

import { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, ShieldAlert, Award, Clock, ArrowLeft, Info, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API = "http://localhost:8000/api/v1";

export default function ScoreBreakdownPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/stats/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const stats = await res.json();
            // Find the specific score by ID or date (using first one for demo)
            setData(stats.daily_score_history[0]);
        }
      } catch (err) {
        console.error("Failed to fetch score breakdown", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-20 text-center text-slate-500">Calculating breakdown...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Score Breakdown</h1>
          <p className="text-slate-500 text-sm">Performance analysis for {data?.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Score Card */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            
            <div className="flex items-end gap-6 mb-10 relative z-10">
              <div className="text-8xl font-black tracking-tighter text-white">
                {data?.total_score || 0}
              </div>
              <div className="pb-4">
                <div className="text-blue-400 font-bold mb-1 uppercase tracking-widest text-xs">Final Performance</div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
                  {data?.tier} Status
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <ComponentScore label="Attendance" value={data?.attendance_score} weight="30%" icon={CheckCircle} color="emerald" />
              <ComponentScore label="Work Volume" value={data?.work_score} weight="30%" icon={TrendingUp} color="blue" />
              <ComponentScore label="AI Quality" value={data?.quality_score} weight="40%" icon={Award} color="violet" />
              <ComponentScore label="Fraud Deductions" value={data?.fraud_penalty} weight="Penalty" icon={ShieldAlert} color="red" negative />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Info size={18} className="text-blue-400" /> Explainable AI Insights
            </h3>
            <div className="space-y-4">
               <InsightBox 
                title="Context Awareness" 
                text="Your score was adjusted for the current Red Alert weather condition (+15% resilience bonus applied)." 
               />
               <InsightBox 
                title="Quality Consistency" 
                text="AI verified 4/4 submissions with high confidence (avg. 0.92). Image clarity contributed to full quality points." 
               />
               <InsightBox 
                title="Early Bird Bonus" 
                text="Lesson plan was uploaded at 07:42 AM, qualifying for the pre-8AM bonus multiplier." 
               />
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white shadow-xl">
             <Award size={32} className="mb-4" />
             <h3 className="text-xl font-bold mb-2 tracking-tight">Reward Eligibility</h3>
             <p className="text-white/70 text-sm mb-6 leading-relaxed">
               You need an average of 85+ for the next 4 days to qualify for the Monthly Service Award.
             </p>
             <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white w-3/4 rounded-full" />
             </div>
             <div className="flex justify-between text-xs font-bold">
                <span>75% Progress</span>
                <span>Tier: Gold</span>
             </div>
           </div>

           <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> Improvement Tips
              </h4>
              <ul className="space-y-3">
                <li className="text-xs text-slate-400 leading-relaxed">
                   • Upload morning reports before 08:30 for maximum points.
                </li>
                <li className="text-xs text-slate-400 leading-relaxed">
                   • Ensure GPS is active for 5 mins before submitting patrol logs.
                </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

function ComponentScore({ label, value, weight, icon: Icon, color, negative = false }: any) {
    const colors: any = {
        emerald: "text-emerald-400 hover:bg-emerald-500/10",
        blue: "text-blue-400 hover:bg-blue-500/10",
        violet: "text-violet-400 hover:bg-violet-500/10",
        red: "text-red-400 hover:bg-red-500/10",
    };
    return (
        <div className={`flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-white/5 transition-all ${colors[color]}`}>
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5">
                    <Icon size={18} />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">{label}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">{weight} Weight</div>
                </div>
            </div>
            <div className={`text-xl font-black ${negative && value > 0 ? 'text-red-500' : ''}`}>
                {negative && value > 0 ? '-' : ''}{value || 0}
            </div>
        </div>
    );
}

function InsightBox({ title, text }: any) {
    return (
        <div className="p-5 rounded-2xl bg-black/20 border-l-2 border-blue-500/50">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">{title}</div>
            <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
        </div>
    );
}
