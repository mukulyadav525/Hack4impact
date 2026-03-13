import Link from 'next/link';
import { 
  LayoutDashboard,
  ClipboardCheck, 
  Map as MapIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search
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
    <div className="flex h-screen w-72 flex-col bg-white border-r border-gray-100 dark:bg-black dark:border-zinc-900 shadow-sm">
      <div className="flex h-24 items-center px-10">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold italic">GT</div>
           <div className="text-xl font-black tracking-tighter uppercase italic">
              Supervisor
           </div>
        </div>
      </div>
      
      <div className="px-6 mb-6">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border-none text-xs outline-none"
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
                "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-gray-400 hover:text-zinc-900 dark:hover:text-zinc-50"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 mb-6 group cursor-pointer">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">JD</div>
              <div>
                 <p className="text-xs font-bold">John Doe</p>
                 <p className="text-[10px] text-gray-400">Head of Dept</p>
              </div>
           </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all dark:hover:bg-red-900/10"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
