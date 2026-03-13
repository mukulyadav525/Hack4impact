import Link from 'next/link';
import { 
  Shield, 
  Users, 
  Map as MapIcon, 
  Building2, 
  BarChart4, 
  Key, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { icon: Shield, label: 'System Overview', href: '/admin' },
  { icon: Users, label: 'User Management', href: '/admin/users' },
  { icon: Building2, label: 'Departments', href: '/admin/departments' },
  { icon: MapIcon, label: 'Zone Configuration', href: '/admin/zones' },
  { icon: BarChart4, label: 'Global Analytics', href: '/admin/stats' },
  { icon: Key, label: 'Audit Logs', href: '/admin/audit' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-72 flex-col bg-[#0A1628]/95 border-r border-white/5 backdrop-blur-md text-slate-300 shadow-2xl">
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <ShieldCheck size={22} />
           </div>
           <div>
              <div className="text-xl font-bold tracking-tight text-white leading-none">GovTrack AI</div>
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-1">Super Admin</div>
           </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1.5 px-6 py-4">
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
