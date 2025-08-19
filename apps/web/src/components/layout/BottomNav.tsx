import { Home, Compass, Bell, User2, Gem } from "lucide-react";
import { useAuthStatus } from "@/auth/useAuthStatus";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const { isAuthed } = useAuthStatus();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('BottomNav rendering at:', location.pathname, { isAuthed });
  console.log('BottomNav component is rendering with DOM element');

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
      className="bottom-nav fixed bottom-0 inset-x-0 z-[9999] tnz-glass
                 h-[var(--nav-h)]
                 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]
                 backdrop-saturate-150"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'block',
        visibility: 'visible',
        opacity: 1
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
      className={`relative flex flex-col items-center gap-1 p-2 transition-all duration-200 min-h-[50px] min-w-[50px] ${
        active
          ? 'text-white'
          : 'text-gray-300 hover:text-white'
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
