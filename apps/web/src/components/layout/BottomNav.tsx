import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  className?: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
  badge?: boolean;
}

function NavItem({ icon, label, isActive, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`nav-item ${isActive ? 'active' : ''}`}
      aria-label={label}
    >
      <div className="relative">
        <div className="nav-icon">
          {icon}
        </div>
        {badge && <div className="nav-badge" />}
      </div>
      <span className="nav-label">{label}</span>
    </button>
  );
}

function CenterFAB({ onClick }: { onClick: () => void }) {
  return (
    <div className="center-fab">
      <button
        onClick={onClick}
        className="fab"
        aria-label="Create content"
      >
        <Plus className="fab-icon" />
      </button>
    </div>
  );
}

export default function BottomNav({ className = '' }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/reels' || path === '/') {
      return location.pathname === '/' || location.pathname === '/reels';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    // If already on the page, scroll to top
    if (isActive(path)) {
      const contentElement = document.querySelector('.app-content');
      if (contentElement) {
        contentElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const navItems = [
    {
      icon: <Home className="w-full h-full" />,
      label: 'Home',
      path: '/reels',
    },
    {
      icon: <Search className="w-full h-full" />,
      label: 'Explore',
      path: '/search',
    },
    {
      icon: null, // Center FAB
      label: 'Create',
      path: '/create',
    },
    {
      icon: <MessageCircle className="w-full h-full" />,
      label: 'Inbox',
      path: '/inbox',
      badge: true, // Show notification badge
    },
    {
      icon: <User className="w-full h-full" />,
      label: 'Me',
      path: '/profile',
    },
  ];

  return (
    <nav className={`bottom-nav ${className}`}>
      <div className="bottom-nav-content">
        {navItems.map((item, index) => {
          // Handle center FAB separately
          if (index === 2) {
            return (
              <CenterFAB
                key={item.path}
                onClick={() => handleNavigation(item.path)}
              />
            );
          }

          return (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              badge={item.badge}
            />
          );
        })}
      </div>
    </nav>
  );
}
