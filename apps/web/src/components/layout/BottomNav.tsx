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
    <nav className="bottom-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 items-center px-3 bg-black/55 backdrop-blur">
      <Item
        icon={<Home />}
        label="Home"
        active={isActive('/reels')}
        onClick={() => handlePress('/reels')}
      />
      <Item
        icon={<Compass />}
        label="Discover"
        active={isActive('/search')}
        onClick={() => handlePress('/search')}
      />
      <div className="grid place-items-center">
        <button
          onClick={() => navigate('/create')}
          className="h-12 w-12 rounded-2xl tz-gem-border tz-action-button grid place-items-center"
        >
          <Gem className="h-6 w-6 text-white" />
        </button>
      </div>
      <Item
        icon={<Bell />}
        label="Inbox"
        active={isActive('/inbox')}
        onClick={() => handlePress('/inbox')}
      />
      <Item
        icon={<User2 />}
        label="Profile"
        active={isActive('/profile')}
        onClick={() => handlePress('/profile')}
        showDot={!isAuthed}
      />
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
      className={`relative grid place-items-center gap-0.5 transition-colors tz-action-button ${active ? 'text-white' : 'text-white/80'}`}
    >
      <div className="relative">
        {icon}
        {showDot && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-black/70" />}
      </div>
      <span className="text-[11px]">{label}</span>
    </button>
  );
}
