import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-zinc-900">
        <div className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">
          GOVTRACK.AI
        </div>
        <Link href="/login" className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:scale-105 transition-all">
          Sign In
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
            <ShieldCheck size={14} />
            Government Trust & Performance
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight max-w-4xl text-black">
            Rewarding Government <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Excellence.</span>
          </h1>
          
          <p className="text-xl text-gray-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            The first AI-powered performance & credit system for public servants. 
            Automated verification, transparent scoring, and instant rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Link href="/login" className="px-12 py-5 bg-blue-600 text-white rounded-2xl text-lg font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2">
              Access Employee Portal
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-40">
           <Feature 
            title="Biometric Trust" 
            desc="Liveness-verified selfie check-ins ensuring 100% presence accuracy." 
            icon={ShieldCheck} 
           />
           <Feature 
            title="AI Work Audit" 
            desc="GPT-4o Vision verifies task completion via before/after photo audits." 
            icon={TrendingUp} 
           />
           <Feature 
            title="Instant Credits" 
            desc="Earn credit points and unlock government benefits based on real performance." 
            icon={Users} 
           />
        </div>
      </main>
    </div>
  );
}

function Feature({ title, desc, icon: Icon }: any) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-blue-600">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}
