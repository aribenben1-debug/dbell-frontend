import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import { Avatar } from './AvatarUpload.jsx';

function NavLink({ to, children, onClick }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${
        active ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'
      }`}
    >
      {children}
    </Link>
  );
}

// Bottom tab bar for mobile
function BottomNav({ user }) {
  const { pathname } = useLocation();

  const customerTabs = [
    { to: '/',         icon: '🏠', label: 'Home' },
    { to: '/book',     icon: '➕', label: 'Book' },
    { to: '/bookings', icon: '📋', label: 'Bookings' },
    { to: '/profile',  icon: '👤', label: 'Profile' },
  ];

  const providerTabs = [
    { to: '/',                  icon: '🏠', label: 'Home' },
    { to: '/provider/dashboard',icon: '📋', label: 'Jobs' },
    { to: '/provider/profile',  icon: '👤', label: 'Profile' },
    { to: '/support',           icon: '💬', label: 'Support' },
  ];

  const adminTabs = [
    { to: '/admin',           icon: '📊', label: 'Stats' },
    { to: '/admin/providers', icon: '🛠️', label: 'Providers' },
    { to: '/admin/bookings',  icon: '📋', label: 'Bookings' },
  ];

  const tabs = !user ? [] : user.role === 'PROVIDER' ? providerTabs : user.role === 'ADMIN' ? adminTabs : customerTabs;
  if (!user || tabs.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex md:hidden safe-bottom">
      {tabs.map((t) => {
        const active = pathname === t.to || (t.to !== '/' && pathname.startsWith(t.to));
        return (
          <Link
            key={t.to}
            to={t.to}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
              active ? 'text-brand-600' : 'text-gray-400'
            }`}
          >
            <span className="text-xl leading-none">{t.icon}</span>
            <span className="text-[10px] font-semibold">{t.label}</span>
            {active && <span className="absolute bottom-1 w-1 h-1 bg-brand-600 rounded-full" />}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-lg md:text-xl font-extrabold text-brand-700">
            <span className="text-2xl">🔔</span>
            D-Bell
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            {!user && (
              <>
                <Link to="/login" className="text-gray-600 hover:text-brand-600 px-3 py-2 transition-colors">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get started</Link>
              </>
            )}
            {user?.role === 'CUSTOMER' && (
              <>
                <Link to="/book" className="text-gray-600 hover:text-brand-600 px-3 py-2">Book a Service</Link>
                <Link to="/bookings" className="text-gray-600 hover:text-brand-600 px-3 py-2">My Bookings</Link>
                <Link to="/support" className="text-gray-600 hover:text-brand-600 px-3 py-2">Support</Link>
              </>
            )}
            {user?.role === 'PROVIDER' && (
              <>
                <Link to="/provider/dashboard" className="text-gray-600 hover:text-brand-600 px-3 py-2">Dashboard</Link>
                <Link to="/provider/profile" className="text-gray-600 hover:text-brand-600 px-3 py-2">Profile</Link>
                <Link to="/support" className="text-gray-600 hover:text-brand-600 px-3 py-2">Support</Link>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <>
                <Link to="/admin" className="text-gray-600 hover:text-brand-600 px-3 py-2">Dashboard</Link>
                <Link to="/admin/providers" className="text-gray-600 hover:text-brand-600 px-3 py-2">Providers</Link>
                <Link to="/admin/bookings" className="text-gray-600 hover:text-brand-600 px-3 py-2">Bookings</Link>
              </>
            )}
            {user && (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                <Avatar avatarUrl={user.avatarUrl} firstName={user.firstName} lastName={user.lastName} size="xs" />
                <span className="text-gray-500 text-sm">Hi, {user.firstName}</span>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 transition-colors">Sign out</button>
              </div>
            )}
          </nav>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            {!user && (
              <Link to="/login" className="text-sm font-semibold text-brand-600">Sign in</Link>
            )}
            {user && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <span className={`w-5 h-0.5 bg-gray-600 rounded transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-5 h-0.5 bg-gray-600 rounded transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-5 h-0.5 bg-gray-600 rounded transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && user && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
            <div className="pb-3 mb-3 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            {user.role === 'CUSTOMER' && (
              <>
                <NavLink to="/book" onClick={() => setMenuOpen(false)}>📋 Book a Service</NavLink>
                <NavLink to="/bookings" onClick={() => setMenuOpen(false)}>📅 My Bookings</NavLink>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)}>👤 My Profile</NavLink>
                <NavLink to="/support" onClick={() => setMenuOpen(false)}>💬 Support</NavLink>
              </>
            )}
            {user.role === 'PROVIDER' && (
              <>
                <NavLink to="/provider/dashboard" onClick={() => setMenuOpen(false)}>📋 Dashboard</NavLink>
                <NavLink to="/provider/profile" onClick={() => setMenuOpen(false)}>👤 Profile</NavLink>
                <NavLink to="/support" onClick={() => setMenuOpen(false)}>💬 Support</NavLink>
              </>
            )}
            {user.role === 'ADMIN' && (
              <>
                <NavLink to="/admin" onClick={() => setMenuOpen(false)}>📊 Dashboard</NavLink>
                <NavLink to="/admin/providers" onClick={() => setMenuOpen(false)}>🛠️ Providers</NavLink>
                <NavLink to="/admin/bookings" onClick={() => setMenuOpen(false)}>📋 Bookings</NavLink>
              </>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
            >
              🚪 Sign out
            </button>
          </div>
        )}
      </header>

      {/* Main content — add bottom padding on mobile for the tab bar */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      <footer className="hidden md:block bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} D-Bell — Home services you can trust.
        </div>
      </footer>

      {/* Mobile bottom tab bar */}
      <BottomNav user={user} />
    </div>
  );
}
