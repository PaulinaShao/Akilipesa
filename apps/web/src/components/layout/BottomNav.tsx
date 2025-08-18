import { Home, Compass, Bell, User2, Gem } from "lucide-react";
import { useAuthStatus } from "@/auth/useAuthStatus";
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const { isAuthed } = useAuthStatus();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/reels') {
      return location.pathname === '/' || location.pathname === '/reels';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 h-14 grid grid-cols-5 items-center px-3 bg-black/55 backdrop-blur">
      <Item icon={<Home />} label="Home" to="/reels" active={isActive('/reels')} />
      <Item icon={<Compass />} label="Discover" to="/search" active={isActive('/search')} />
      <div className="grid place-items-center">
        <Link to="/create">
          <button className="h-12 w-12 rounded-2xl tz-gem-border grid place-items-center">
            <Gem className="h-6 w-6 text-white" />
          </button>
        </Link>
      </div>
      <Item icon={<Bell />} label="Inbox" to="/inbox" active={isActive('/inbox')} />
      <Item icon={<User2 />} label="Profile" to="/profile" active={isActive('/profile')} showDot={!isAuthed} />
    </nav>
  );
}

function Item({ icon, label, to, active = false, showDot = false }: {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  showDot?: boolean;
}) {
  return (
    <Link to={to}>
      <button className={`relative grid place-items-center gap-0.5 transition-colors ${active ? 'text-white' : 'text-white/80'}`}>
        <div className="relative">
          {icon}
          {showDot && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-black/70" />}
        </div>
        <span className="text-[11px]">{label}</span>
      </button>
    </Link>
  );
}
