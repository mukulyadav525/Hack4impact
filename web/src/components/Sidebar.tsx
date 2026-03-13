"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';
import { 
  Home, 
  Camera, 
  History, 
  User, 
  LogOut,
  BarChart2,
  Award,
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Globe,
  FileText,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

export function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { icon: Home,       label: 'Dashboard',   href: '/dashboard' },
    { icon: Camera,     label: 'Attendance',  href: '/attendance' },
    { icon: BarChart2,  label: 'Submissions', href: '/submissions' },
    { icon: TrendingUp, label: 'My Scores',   href: '/scores' },
    { icon: Award,      label: 'Rewards',     href: '/rewards' },
    { icon: History,    label: 'History',     href: '/history' },
    { icon: User,       label: 'Profile',     href: '/profile' },
  ];

  // If user is specialized role, add a direct link to their primary work dashboard if they are on a different page
  const hasDashboard = user?.employee_type === 'field_worker' || user?.employee_type === 'supervisor' || user?.employee_type === 'admin';

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
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-white/5",
                isActive && "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}

        {/* Grievances link for all logged-in users */}
        {user && (
          <Link
            href="/grievances"
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-white/5",
              pathname === '/grievances' && "bg-amber-600/20 text-amber-400 border border-amber-500/30"
            )}
          >
            <MessageSquare size={20} />
            Grievances
          </Link>
        )}

        {/* Supervisor Section */}
        {(user?.employee_type === 'supervisor') && (
           <div className="pt-4 mt-4 border-t border-white/5">
             <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Supervisor Tools</p>
             {[
               { href: '/dashboard', label: 'Review Portal', icon: LayoutDashboard, color: 'violet' },
               { href: '/fraud', label: 'Fraud Review', icon: AlertTriangle, color: 'red' },
             ].map(item => (
               <Link key={item.href} href={item.href}
                 className={cn(
                   "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-white/5",
                   pathname === item.href && `bg-${item.color}-600/20 text-${item.color}-400 border border-${item.color}-500/30`
                 )}
               >
                 <item.icon size={20} /> {item.label}
               </Link>
             ))}
           </div>
        )}

        {/* Admin Section */}
        {user?.employee_type === 'admin' && (
           <div className="pt-4 mt-4 border-t border-white/5">
             <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Global Admin</p>
             {[
               { href: '/dashboard',     label: 'Control Center', icon: LayoutDashboard },
               { href: '/fraud',         label: 'Fraud Center',   icon: AlertTriangle },
               { href: '/reports',       label: 'Reports',        icon: FileText },
               { href: '/compliance',    label: 'Compliance',     icon: Scale },
               { href: '/transparency',  label: 'Transparency',   icon: Globe },
             ].map(item => (
               <Link key={item.href} href={item.href}
                 className={cn(
                   "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-white/5",
                   pathname === item.href && "bg-red-600/20 text-red-400 border border-red-500/30"
                 )}
               >
                 <item.icon size={20} /> {item.label}
               </Link>
             ))}
           </div>
        )}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
           <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs uppercase shrink-0">
             {user?.name?.[0] || 'U'}
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
             <p className="text-[10px] text-slate-500 truncate capitalize">{user?.job_role || user?.employee_type || 'Civilian'}</p>
           </div>
        </div>
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
