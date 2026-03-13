import Link from 'next/link';
import { 
  Shield, 
  Users, 
  Map as MapIcon, 
  Building2, 
  BarChart4, 
  Key, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

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

  return (
    <div className="flex h-screen w-72 flex-col bg-slate-950 text-slate-300 border-r border-slate-800 shadow-2xl">
      <div className="flex h-24 items-center px-10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-500/20">
              <Shield size={22} />
           </div>
           <div>
              <div className="text-xl font-black tracking-tight text-white leading-none">GOVTRACK</div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mt-1">Super Admin</div>
           </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1.5 px-6 py-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all group",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon size={18} className={cn(isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-slate-900">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
