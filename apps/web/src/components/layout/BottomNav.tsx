import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';

export default function BottomNav(){
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
      const contentElement = document.querySelector('.content') || document.querySelector('#feed');
      if (contentElement) {
        contentElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="tiktok-bottomnav">
      <div className="row nav-row">
        <Item
          icon={<Home className="w-6 h-6" />}
          label="Home"
          active={isActive('/reels')}
          onClick={() => handleNavigation('/reels')}
        />
        <Item
          icon={<Search className="w-6 h-6" />}
          label="Explore"
          onClick={() => handleNavigation('/search')}
        />
        <Fab onClick={() => handleNavigation('/create')} />
        <Item
          icon={<MessageCircle className="w-6 h-6" />}
          label="Inbox"
          badge={3}
          onClick={() => handleNavigation('/inbox')}
        />
        <Item
          icon={<User className="w-6 h-6" />}
          label="Me"
          onClick={() => handleNavigation('/profile')}
        />
      </div>
    </nav>
  );
}

function Item({icon,label,active=false,badge,onClick}:{icon:React.ReactNode,label:string,active?:boolean,badge?:number,onClick?:()=>void}){
  return (
    <button
      className="tiktok-nav-item"
      onClick={onClick}
      style={{
        color: active ? 'white' : 'rgba(255, 255, 255, 0.7)'
      }}
    >
      <div className="tiktok-nav-icon">
        {icon}
        {badge ? <span className="absolute -top-1 -right-2 text-[10px] bg-[#ff3b30] text-white rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center text-center leading-none">{badge}</span> : null}
      </div>
      <span>{label}</span>
    </button>
  );
}

function Fab({onClick}:{onClick?:()=>void}){
  return (
    <button
      className="h-12 w-12 rounded-2xl font-bold"
      style={{
        background:`linear-gradient(135deg, var(--tz-accent), var(--tz-gold))`,
        color:'#0b1022',
        boxShadow:'0 8px 20px rgba(106,90,205,.35)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px'
      }}
      aria-label="Create"
      onClick={onClick}
    >
      +
    </button>
  );
}
