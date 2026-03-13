import Link from 'next/link';
import { ArrowRight, Play, ShieldCheck, CheckCircle, TrendingUp, Award, Activity, Search, Shield, Fingerprint } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      
      {/* Background Dot Matrix Pattern */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #3B82F6 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A1628]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
               <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">GovTrack AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="#" className="text-white hover:text-blue-400 transition-colors">Home</Link>
            <Link href="#" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="#" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="#" className="hover:text-white transition-colors">About</Link>
          </div>

          <Link 
            href="/login" 
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all flex items-center gap-2 border border-blue-400/20"
          >
            Login <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="relative z-10 pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8 relative">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Next-Gen Civic Infrastructure
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.05]">
              Making Honest Work <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Visible & Rewarded
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed font-light">
              The AI-powered performance and credit system built for modern government field employees. 
              Verifiable, tamper-proof, and seamless.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/login" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2"
              >
                Get Started
              </Link>
              <button className="px-8 py-4 bg-[#1E3A5F]/50 hover:bg-[#1E3A5F] border border-white/10 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <Play size={18} /> Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Mockup */}
          <div className="lg:w-1/2 relative w-full aspect-[4/3]">
            {/* Glow behind mockup */}
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
            
            <div className="absolute inset-0 border border-white/10 bg-[#1E3A5F]/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col transform lg:rotate-2 lg:scale-105 transition-transform hover:rotate-0 duration-500">
              {/* Fake UI Header */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-black/20">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <div className="mx-auto h-6 w-3/5 bg-white/5 rounded" />
              </div>
              {/* Fake UI Body */}
              <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                     <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Credits Earned</div>
                     <div className="text-4xl font-bold text-white flex items-center gap-2">1,240 <span className="text-sm text-green-400 flex items-center"><TrendingUp size={16}/> +12%</span></div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
                    <Award className="text-blue-400 w-6 h-6" />
                  </div>
                </div>
                {/* Fake chart/list */}
                <div className="flex-1 border border-white/5 bg-black/20 rounded-lg p-4 space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-12 border border-white/5 rounded-md flex items-center px-3 justify-between bg-white/[0.02]">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                            <CheckCircle size={14} className="text-blue-400"/>
                         </div>
                         <div className="space-y-1">
                           <div className="w-24 h-2 bg-white/20 rounded-full" />
                           <div className="w-16 h-1.5 bg-white/10 rounded-full" />
                         </div>
                       </div>
                       <div className="w-8 h-3 bg-green-400/20 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-y border-white/5 bg-[#0A1628]/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {[
              { val: "18M+", label: "Employees" },
              { val: "40%", label: "Fraud Reduction" },
              { val: "60s", label: "Avg Verification" },
              { val: "100%", label: "Tamper-Proof" },
            ].map((stat, i) => (
              <div key={i} className="p-8 text-center space-y-1">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">{stat.val}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works (Stepper) */}
        <section className="max-w-7xl mx-auto px-6 py-32 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em]">The Process</h2>
            <h3 className="text-4xl font-bold text-white">How GovTrack AI Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[44px] left-[10%] w-[80%] h-0.5 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 z-0" />
            
            {[
              { icon: Fingerprint, title: "Check In", desc: "Biometric liveness auth" },
              { icon: Activity, title: "Submit Work", desc: "Upload verifiable proof" },
              { icon: Search, title: "AI Verifies", desc: "Automated standard checks" },
              { icon: Award, title: "Earn Points", desc: "Instant ledger updates" },
              { icon: Shield, title: "Get Rewarded", desc: "Unlock state benefits" },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-2xl bg-[#1E3A5F] border border-blue-500/30 flex items-center justify-center shadow-xl relative group">
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-md" />
                  <step.icon size={32} className="text-blue-400" />
                  <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#0A1628] border border-blue-500/50 flex items-center justify-center text-[10px] font-bold text-blue-400">
                    {i+1}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{step.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
           <div className="space-y-4 max-w-2xl">
            <h2 className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em]">Platform Capabilities</h2>
            <h3 className="text-4xl font-bold text-white">Built for Scale & Security</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              badge="AI-Powered"
              icon={Search}
              title="Automated Auditing"
              desc="GPT-4 Vision models process photographic evidence instantly, removing human bias and bottlenecks."
            />
            <FeatureCard 
              badge="Real-Time"
              icon={Activity}
              title="Performance Ledger"
              desc="A transparent, immutable ledger tracks every completed task and assigns credit scores to employees."
            />
            <FeatureCard 
              badge="Tamper-Proof"
              icon={ShieldCheck}
              title="Biometric Security"
              desc="Bank-grade liveness detection ensures the right person is at the right place at the right time."
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A1628] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck size={18} />
            <span className="font-bold tracking-tight">GovTrack AI</span>
          </div>
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} GovTrack Ecosystem. Built for India.
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ title, desc, icon: Icon, badge }: any) {
  return (
    <div className="group relative p-8 rounded-2xl bg-[#1E3A5F]/40 border border-white/5 overflow-hidden transition-all duration-300 hover:bg-[#1E3A5F]/80 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col gap-6">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
          {badge}
        </div>
      </div>
      
      <div>
        <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
        <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  );
}
