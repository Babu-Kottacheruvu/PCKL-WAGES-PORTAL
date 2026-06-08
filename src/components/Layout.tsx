import { useState, useEffect } from 'react';
import type React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, ClipboardList, Factory, LayoutDashboard, LogOut, Menu, Scale, Sprout, Trees, Wallet, X, PanelLeftClose, PanelLeftOpen, UserCheck } from 'lucide-react';

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { to: '/tree-division', label: 'Tree & Division', icon: <Trees className="h-5 w-5" /> },
    { to: '/attendance', label: 'Attendance', icon: <UserCheck className="h-5 w-5" /> },
    { to: '/weighment', label: 'Weighment', icon: <Scale className="h-5 w-5" /> },
    { to: '/slaughter-tapping', label: 'Slaughter Tapping', icon: <Sprout className="h-5 w-5" /> },
    { to: '/tapping-operations', label: 'Tapping', icon: <ClipboardList className="h-5 w-5" /> },
    { to: '/field-operations', label: 'Field Operations', icon: <Factory className="h-5 w-5" /> },
    { to: '/earnings-recoveries', label: 'Earnings & Recoveries', icon: <Wallet className="h-5 w-5" /> },
    { to: '/leave-holiday-management', label: 'Leave & Holiday', icon: <CalendarDays className="h-5 w-5" /> },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      {/* Top Bar - Mobile Only */}
      <div className="md:hidden shrink-0 z-20 bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="/pck-logo.png"
            alt="PCK Logo"
            className="h-8 w-8 rounded-full object-contain"
          />
          <span className="text-lg font-bold text-gray-800">PCK Portal</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Vertical Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0 md:w-72' : '-translate-x-full md:translate-x-0 md:w-20'
        } fixed md:relative z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden shrink-0`}
      >
        {/* Logo - Desktop Only */}
        <div className={`hidden md:flex items-center px-6 py-4 border-b border-gray-200 whitespace-nowrap ${isSidebarOpen ? 'space-x-3' : 'justify-center px-0'}`}>
          <img
            src="/pck-logo.png"
            alt="Plantation Corporation of Kerala logo"
            className="h-10 w-10 rounded-full object-contain shrink-0"
          />
          <div className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
            <div className="text-sm font-bold text-gray-800">PCK</div>
            <div className="text-xs text-gray-600">Wages Portal</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              onClick={handleNavClick}
              isSidebarOpen={isSidebarOpen}
            />
          ))}
        </nav>

        {/* User Section */}
        {user && (
          <div className="border-t border-gray-200 px-3 py-4 space-y-4">
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3 px-1' : 'md:justify-center'}`}>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-gray-200 shrink-0"
              />
              <div className={`min-w-0 transition-all duration-300 ${isSidebarOpen ? 'block' : 'md:hidden'}`}>
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-[#20B2AA] font-medium truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`w-full inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors ${isSidebarOpen ? 'gap-2 px-3' : 'md:px-0 md:justify-center gap-2 px-3'}`}
              title={!isSidebarOpen ? "Logout" : undefined}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className={isSidebarOpen ? 'block' : 'md:hidden block'}>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 w-full md:w-auto overflow-hidden">
        {/* Top Bar - Desktop Only */}
        {user && (
          <div className="hidden md:flex shrink-0 items-center justify-between bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
            <button
              onClick={toggleSidebar}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const NavItem = ({
  to,
  label,
  icon,
  onClick,
  isSidebarOpen,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  isSidebarOpen: boolean;
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        'flex items-center rounded-lg text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-[#E6F7F6] text-[#137f79] border-l-4 border-[#137f79]'
          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent',
        isSidebarOpen ? 'gap-3 px-3 py-3' : 'md:justify-center md:px-0 gap-3 px-3 py-3',
      ].join(' ')
    }
    title={!isSidebarOpen ? label : undefined}
  >
    <div className="shrink-0">{icon}</div>
    <span className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'md:opacity-0 md:w-0 md:hidden opacity-100'}`}>
      {label}
    </span>
  </NavLink>
);
