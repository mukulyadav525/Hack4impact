"use client";

import { 
  Award, 
  TrendingUp, 
  Trophy, 
  Gift,
  CheckCircle2,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RewardsPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Rewards & Recognition</h1>
        <p className="text-gray-500 dark:text-zinc-400">Track your performance milestones and unlock government benefits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tier Status Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
           <div className="flex justify-between items-start mb-12">
             <div>
               <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Current Status</p>
               <h2 className="text-4xl font-bold mt-1">Gold Tier</h2>
             </div>
             <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
               <Trophy size={32} />
             </div>
           </div>

           <div className="space-y-6">
             <div className="flex justify-between text-sm">
               <span>Progress to Platinum</span>
               <span>820 / 1000 pts</span>
             </div>
             <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
               <div className="h-full bg-white rounded-full w-[82%]" />
             </div>
             <p className="text-indigo-100 text-sm">You need 180 more points to reach Platinum status and unlock full health benefits.</p>
           </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/20">
                 <TrendingUp size={24} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Total Points</p>
                 <p className="text-2xl font-bold">4,250</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/20">
                 <Award size={24} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Rewards Claimed</p>
                 <p className="text-2xl font-bold">12</p>
               </div>
            </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Eligible Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RewardCard 
            title="Health Insurance Subsidy" 
            desc="50% off monthly premiums for Haryana Govt Health Scheme."
            points="Gold Status"
            icon={ShieldCheck}
            unlocked={true}
          />
          <RewardCard 
            title="Performance Bonus" 
            desc="One-time cash incentive of ₹2,500 based on monthly score."
            points="Score > 900"
            icon={Gift}
            unlocked={false}
          />
          <RewardCard 
            title="Priority Leave Approval" 
            desc="Instant approval for CASUAL leave requests during lean season."
            points="Silver Status"
            icon={CheckCircle2}
            unlocked={true}
          />
        </div>
      </div>
    </div>
  );
}

function RewardCard({ title, desc, points, icon: Icon, unlocked }: any) {
  return (
    <div className={cn(
      "p-6 rounded-3xl border transition-all flex flex-col gap-4",
      unlocked 
        ? "bg-white dark:bg-black border-gray-100 dark:border-zinc-900 shadow-sm hover:shadow-md" 
        : "bg-gray-50 dark:bg-zinc-900/30 border-dashed border-gray-200 dark:border-zinc-800 grayscale"
    )}>
      <div className="flex justify-between items-start">
        <div className={cn(
          "p-3 rounded-2xl",
          unlocked ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "bg-gray-200 text-gray-400 dark:bg-zinc-800"
        )}>
          <Icon size={24} />
        </div>
        {!unlocked && <Lock size={16} className="text-gray-400" />}
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{desc}</p>
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{points}</span>
        {unlocked && (
          <button className="text-sm font-bold text-gray-900 dark:text-white hover:underline underline-offset-4">
            Claim Reward
          </button>
        )}
      </div>
    </div>
  );
}

import { ShieldCheck } from "lucide-react";
