import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { useAuthStatus } from "@/auth/useAuthStatus";
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const { isAuthed } = useAuthStatus();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('BottomNav rendering at:', location.pathname, { isAuthed });

  const isActive = (path: string) => {
    if (path === '/reels') {
      return location.pathname === '/' || location.pathname === '/reels';
    }
    return location.pathname.startsWith(path);
  };

  const handlePress = (path: string) => {
    if (isActive(path)) {
      // Re-tap to top: scroll the active screen container
      const el = document.querySelector<HTMLElement>('.scroll-screen');
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <nav
      className="bottom-nav"
      style={{
        backgroundColor: 'black',
        zIndex: 9999,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px'
      }}
    >
      <div 
        className="mx-auto max-w-screen-sm grid grid-cols-5 gap-1 items-center justify-items-center h-full px-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
      >
        <NavItem
          icon={<Home className="h-7 w-7" />}
          label="Home"
          active={isActive('/reels')}
          onClick={() => handlePress('/reels')}
        />
        <NavItem
          icon={<Search className="h-7 w-7" />}
          label="Explore"
          active={isActive('/search')}
          onClick={() => handlePress('/search')}
        />
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/create')}
            className="h-11 w-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg grid place-items-center transition-transform hover:scale-105 active:scale-95"
            aria-label="Create"
          >
            <Plus className="h-6 w-6 text-white font-bold" />
          </button>
        </div>
        <NavItem
          icon={
            <div className="relative">
              <MessageCircle className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
          }
          label="Inbox"
          active={isActive('/inbox')}
          onClick={() => handlePress('/inbox')}
        />
        <NavItem
          icon={<User className="h-7 w-7" />}
          label="Me"
          active={isActive('/profile')}
          onClick={() => handlePress('/profile')}
        />
      </div>
    </nav>
  );
}

function NavItem({ icon, label, active = false, showDot = false, onClick }: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  showDot?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 p-1 transition-all duration-200 min-h-[50px] min-w-[50px] ${
        active
          ? 'text-white'
          : 'text-gray-400 hover:text-white'
      }`}
      aria-label={label}
    >
      <div className="relative flex items-center justify-center">
        {icon}
        {showDot && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-black" />}
      </div>
      <span className={`text-[10px] font-medium leading-tight ${
        active ? 'text-white' : 'text-gray-400'
      }`}>{label}</span>
    </button>
  );
}
