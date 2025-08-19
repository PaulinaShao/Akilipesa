import { PropsWithChildren } from "react";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import "../styles/tanzanite.css";

export default function AppShell({children}: PropsWithChildren) {
  return (
    <div className="app-shell">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <main className="app-content">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

/* --- Tabs --- */
function HeaderTabs(){
  const [activeTab, setActiveTab] = useState('For You');
  const location = useLocation();
  
  // Determine active tab based on route
  useEffect(() => {
    if (location.pathname.includes('/following')) {
      setActiveTab('Following');
    } else if (location.pathname.includes('/friends')) {
      setActiveTab('Friends');
    } else {
      setActiveTab('For You');
    }
  }, [location.pathname]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // TODO: wire routing for different tab views
    console.log('Tab clicked:', tab);
  };

  return (
    <div className="tabs">
      <div 
        className={`tab ${activeTab === 'Following' ? 'active' : ''}`}
        onClick={() => handleTabClick('Following')}
      >
        Following
      </div>
      <div 
        className={`tab ${activeTab === 'Friends' ? 'active' : ''}`}
        onClick={() => handleTabClick('Friends')}
      >
        Friends
      </div>
      <div 
        className={`tab ${activeTab === 'For You' ? 'active' : ''}`}
        onClick={() => handleTabClick('For You')}
      >
        For You
      </div>
    </div>
  );
}

/* --- Bottom Nav --- */
function BottomNav(){
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/reels') {
      return location.pathname === '/' || location.pathname === '/reels';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { 
      icon: <Home className="h-6 w-6" />, 
      label: 'Home', 
      path: '/reels',
      active: isActive('/reels')
    },
    { 
      icon: <Search className="h-6 w-6" />, 
      label: 'Explore', 
      path: '/search',
      active: isActive('/search')
    },
    { 
      icon: <Plus className="h-6 w-6" />, 
      label: 'Create', 
      path: '/create',
      active: isActive('/create'),
      isCreate: true
    },
    { 
      icon: <MessageCircle className="h-6 w-6" />, 
      label: 'Inbox', 
      path: '/inbox',
      active: isActive('/inbox'),
      hasNotification: true
    },
    { 
      icon: <User className="h-6 w-6" />, 
      label: 'Me', 
      path: '/profile',
      active: isActive('/profile')
    }
  ];

  return (
    <ul>
      {navItems.map((item) => (
        <li key={item.path}>
          {item.isCreate ? (
            <div style={{display:"grid", placeItems:"center"}}>
              <button
                onClick={() => navigate(item.path)}
                className="tnz-glass"
                style={{
                  width:54,height:36,borderRadius:12,display:"grid",placeItems:"center",
                  fontWeight:800, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(45deg, var(--tnz-accent), var(--tnz-danger))'
                }}
                aria-label={item.label}
              >
                {item.icon}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate(item.path)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                color: item.active ? 'var(--tnz-fg)' : 'rgba(234, 241, 255, 0.6)',
                fontSize: 'clamp(10px, 1.8vw, 12px)',
                padding: '4px'
              }}
              aria-label={item.label}
            >
              <div style={{ position: 'relative' }}>
                {item.icon}
                {item.hasNotification && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--tnz-danger)',
                    borderRadius: '50%'
                  }} />
                )}
              </div>
              <span>{item.label}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
