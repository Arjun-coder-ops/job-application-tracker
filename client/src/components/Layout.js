import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutGrid, Briefcase, CalendarClock, Settings, LogOut, Plus } from 'lucide-react';

const Layout = ({ children }) => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'My Jobs', path: '/dashboard', icon: Briefcase },
    { name: 'Interviews', path: '/dashboard?status=Interview', icon: CalendarClock },
    { name: 'Settings', path: '/profile', icon: Settings },
  ];

  return (
    <div className="bg-background min-h-[max(884px,100dvh)] pb-24 md:pb-0 text-on-surface font-manrope">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0c0e12]/60 backdrop-blur-xl flex justify-between items-center px-8 py-4 bg-[#111318]/50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <LayoutGrid className="text-primary" size={24} />
          <span className="text-xl font-extrabold tracking-tighter bg-gradient-to-r from-primary-dim to-secondary bg-clip-text text-transparent">
            CAREER ARCHITECT
          </span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`${isActive ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary font-medium'} text-sm tracking-wide transition-colors duration-300`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/job/new" className="hidden md:flex items-center gap-2 kinetic-gradient text-on-primary-fixed font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform text-sm">
            <Plus size={16} /> Add Job
          </Link>
          <div className="relative group cursor-pointer w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden active:scale-95 duration-200">
            <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-primary font-bold">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            {/* Simple dropdown for logout */}
            <div className="absolute right-0 top-12 mt-2 w-48 bg-surface-container-high rounded-xl border border-outline-variant/20 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-error hover:bg-surface-variant flex items-center gap-2">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        {children}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-[1.5rem] bg-[#111318]/80 backdrop-blur-2xl flex justify-around items-center h-20 px-6 pb-safe bg-[#23262c]/40 shadow-[0_-10px_40px_rgba(126,81,255,0.1)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.name} to={item.path} className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 ${isActive ? 'text-secondary drop-shadow-[0_0_8px_rgba(0,227,253,0.5)]' : 'text-on-surface-variant hover:text-on-surface'}`}>
              <Icon size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
