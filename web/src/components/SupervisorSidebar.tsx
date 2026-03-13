 
/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';
import { 
  LayoutDashboard,
  ClipboardCheck, 
  Map as MapIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/supervisor' },
  { icon: ClipboardCheck, label: 'Review Queue', href: '/supervisor/review' },
  { icon: MapIcon, label: 'Zone Monitoring', href: '/supervisor/map' },
  { icon: BarChart3, label: 'Analytics', href: '/supervisor/reports' },
  { icon: Settings, label: 'Dept Settings', href: '/supervisor/settings' },
];

export function SupervisorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-72 flex-col bg-[#0A1628]/95 border-r border-white/5 backdrop-blur-md text-slate-300 shadow-sm">
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <ShieldCheck size={22} />
           </div>
           <div>
              <div className="text-xl font-bold tracking-tight text-white leading-none">GovTrack AI</div>
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-1">Supervisor</div>
           </div>
        </div>
      </div>
      
      <div className="px-6 mb-6">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500/50 transition-colors"
            />
         </div>
      </div>

      <nav className="flex-1 space-y-2 px-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all group",
                isActive 
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={cn(isActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-[#1E3A5F]/40 border border-white/5 mb-6 group cursor-pointer hover:bg-[#1E3A5F]/60 transition-colors">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">JD</div>
              <div>
                 <p className="text-xs font-bold text-white">John Doe</p>
                 <p className="text-[10px] text-slate-400">Head of Dept</p>
              </div>
           </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
