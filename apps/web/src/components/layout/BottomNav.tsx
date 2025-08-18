import { Home, Compass, Bell, User2, Gem } from "lucide-react";
import { useAuthStatus } from "@/auth/useAuthStatus";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const { isAuthed } = useAuthStatus();
  const location = useLocation();
  const navigate = useNavigate();

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
      className="
        fixed bottom-0 left-0 right-0
        bg-black/90
        border-t border-gray-800
        px-4 py-2
        backdrop-blur-md
        bottom-nav
      "
      style={{
        zIndex: 9999,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)'
      }}
    >
      <div className="mx-auto max-w-screen-sm grid grid-cols-5 gap-1 items-center justify-items-center min-h-[52px]">
        <Item
          icon={<Home className="h-6 w-6" />}
          label="Home"
          active={isActive('/reels')}
          onClick={() => handlePress('/reels')}
        />
        <Item
          icon={<Compass className="h-6 w-6" />}
          label="Discover"
          active={isActive('/search')}
          onClick={() => handlePress('/search')}
        />
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/create')}
            className="h-12 w-12 bg-white rounded-2xl grid place-items-center relative -top-1 transition-transform hover:scale-105 active:scale-95"
            aria-label="Create"
          >
            <Gem className="h-6 w-6 text-black" />
          </button>
        </div>
        <Item
          icon={<Bell className="h-6 w-6" />}
          label="Inbox"
          active={isActive('/inbox')}
          onClick={() => handlePress('/inbox')}
        />
        <Item
          icon={<User2 className="h-6 w-6" />}
          label="Profile"
          active={isActive('/profile')}
          onClick={() => handlePress('/profile')}
          showDot={!isAuthed}
        />
      </div>
    </nav>
  );
}

function Item({ icon, label, active = false, showDot = false, onClick }: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  showDot?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-0.5 p-1 transition-colors tz-action-button min-h-[48px] min-w-[48px] ${active ? 'text-white' : 'text-white/70'}`}
      aria-label={label}
    >
      <div className="relative flex items-center justify-center h-6 w-6">
        {icon}
        {showDot && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-1 ring-black/70" />}
      </div>
      <span className="text-[10px] opacity-80 leading-tight">{label}</span>
    </button>
  );
}
