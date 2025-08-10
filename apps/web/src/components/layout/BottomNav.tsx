import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Plus, 
  MessageCircle, 
  User,
  Play,
  Compass,
  PlusCircle,
  Mail,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/reels',
    icon: Home,
    activeIcon: Play,
  },
  {
    id: 'search',
    label: 'Search', 
    path: '/search',
    icon: Search,
    activeIcon: Compass,
  },
  {
    id: 'create',
    label: 'Create',
    path: '/create',
    icon: Plus,
    activeIcon: PlusCircle,
    special: true, // This will be the FAB
  },
  {
    id: 'inbox',
    label: 'Inbox',
    path: '/inbox',
    icon: MessageCircle,
    activeIcon: Mail,
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: User,
    activeIcon: UserCircle,
  },
];

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/reels') {
      return location.pathname === '/' || location.pathname === '/reels';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-fixed safe-bottom">
      {/* Blurred background */}
      <div className="absolute inset-0 glass-heavy border-t border-white/10" />
      
      {/* Navigation content */}
      <div className="relative flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const IconComponent = active ? item.activeIcon : item.icon;
          
          if (item.special) {
            // Center FAB (TikTok-style create button)
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex flex-col items-center justify-center relative"
              >
                {/* FAB with special styling */}
                <div className={cn(
                  "relative btn-fab transform transition-all duration-200",
                  active ? "scale-110" : "hover:scale-105 active:scale-95"
                )}>
                  <IconComponent className="w-7 h-7 text-white" />
                  
                  {/* Glow effect when active */}
                  {active && (
                    <div className="absolute inset-0 bg-primary rounded-full animate-pulse opacity-30" />
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-xs mt-1 font-medium transition-colors duration-200",
                  active ? "text-primary" : "text-white/60"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          }

          // Regular nav items
          return (
            <Link
              key={item.id}
              to={item.path}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 group touch-target"
            >
              <div className="relative flex flex-col items-center">
                {/* Active indicator dot */}
                {active && (
                  <div className="absolute -top-2 w-1 h-1 bg-primary rounded-full opacity-80" />
                )}
                
                {/* Icon */}
                <div className={cn(
                  "relative transition-all duration-200",
                  active ? "transform scale-110" : "group-hover:scale-105"
                )}>
                  <IconComponent className={cn(
                    "w-6 h-6 transition-all duration-200",
                    active 
                      ? "text-primary drop-shadow-lg" 
                      : "text-white/60 group-hover:text-white"
                  )} />
                  
                  {/* Glow effect for active state */}
                  {active && (
                    <IconComponent className="absolute inset-0 w-6 h-6 text-primary opacity-30 blur-sm" />
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-xs mt-1 font-medium transition-colors duration-200 text-center",
                  active ? "text-primary" : "text-white/60 group-hover:text-white"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
