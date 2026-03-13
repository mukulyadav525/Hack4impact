 
/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';
import { 
  Home, 
  Camera, 
  History, 
  User, 
  Settings, 
  LogOut,
  BarChart2,
  Award,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Camera, label: 'Attendance', href: '/attendance' },
  { icon: BarChart2, label: 'Submissions', href: '/submissions' },
  { icon: Award, label: 'Rewards', href: '/rewards' },
  { icon: History, label: 'History', href: '/history' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-[#0A1628]/95 border-r border-white/5 backdrop-blur-md text-slate-300">
      <div className="flex h-20 items-center px-6 gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
           <ShieldCheck size={20} className="text-white" />
        </div>
        <div className="text-xl font-bold tracking-tight text-white">
          GovTrack AI
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isActive 
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
