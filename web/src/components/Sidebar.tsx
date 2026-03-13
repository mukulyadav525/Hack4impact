import Link from 'next/link';
import { 
  Home, 
  Camera, 
  History, 
  User, 
  Settings, 
  LogOut,
  BarChart2,
  Award
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
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-100 dark:bg-black dark:border-zinc-900">
      <div className="flex h-20 items-center px-8">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-zinc-900">
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all dark:hover:bg-red-900/10"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
