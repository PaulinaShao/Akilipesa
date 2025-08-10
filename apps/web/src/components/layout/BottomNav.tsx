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
    path: '/',
    icon: Home,
    activeIcon: Play,
  },
  {
    id: 'discover',
    label: 'Discover', 
    path: '/discover',
    icon: Search,
    activeIcon: Compass,
  },
  {
    id: 'create',
    label: 'Create',
    path: '/create',
    icon: Plus,
    activeIcon: PlusCircle,
    special: true, // Special styling for create button
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
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-fixed safe-bottom">
      {/* Glass background */}
      <div className="glass-heavy border-t border-white/10">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const IconComponent = active ? item.activeIcon : item.icon;
            
            if (item.special) {
              // Special create button with gem styling
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="relative">
                    {/* Glow effect when active */}
                    {active && (
                      <div className="absolute inset-0 bg-accent-500 rounded-full animate-glow-pulse opacity-30" />
                    )}
                    
                    {/* Button */}
                    <div className={cn(
                      "w-12 h-12 rounded-full flex-center transition-all duration-300",
                      "bg-gradient-to-r from-accent-600 to-glow-500",
                      "border border-accent-400/30 shadow-glow",
                      active ? "scale-110 shadow-glow-lg" : "hover:scale-105"
                    )}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-xs mt-1 transition-colors duration-200",
                    active ? "text-accent-400 font-medium" : "text-white/60"
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
                className="nav-tab group"
              >
                <div className="relative">
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent-400 rounded-full" />
                  )}
                  
                  {/* Icon */}
                  <IconComponent className={cn(
                    "nav-tab-icon transition-all duration-200",
                    active ? "text-accent-400" : "text-white/60 group-hover:text-white"
                  )} />
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-xs transition-colors duration-200",
                  active ? "text-accent-400 font-medium" : "text-white/60 group-hover:text-white"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
