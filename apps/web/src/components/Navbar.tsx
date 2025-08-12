import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import AkiliLogo from './AkiliLogo';
import { cn } from '@/lib/utils';

interface NavbarProps {
  user?: {
    name: string;
    avatar?: string;
  } | null;
  onSignOut?: () => void;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard', protected: true },
  { name: 'Calls', href: '/calls', protected: true },
  { name: 'Jobs', href: '/jobs', protected: true },
  { name: 'Billing', href: '/billing', protected: true },
];

export default function Navbar({ user, onSignOut }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const visibleNavigation = navigation.filter(item => !item.protected || user);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 tz-glass-card border-b border-[var(--glass-stroke)]">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <AkiliLogo variant="navigation" size="sm" animated={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {visibleNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'nav-link',
                  isActive(item.href) && 'nav-link-active'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-[var(--tz-ink)]">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="text-slate-500 hover:text-[var(--tz-ink)] p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link to="/login" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="space-y-2">
              {visibleNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-base font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              {user ? (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-[var(--tz-ink)]">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut?.();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center btn-secondary text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center btn-primary text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
