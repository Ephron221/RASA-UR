import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, User as UserIcon, LogOut, LayoutDashboard, Shield,
  Home, Info, Newspaper, Bell, Heart, Phone, LayoutGrid
} from 'lucide-react';
import { motion as motionLib, AnimatePresence } from 'framer-motion';
const motion = motionLib as any;
import { NAV_LINKS } from '../../constants';
import { Department } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  departments: Department[];
  isAdmin?: boolean;
  roleLabel?: string;
}

// Map each nav link name to an icon
const NAV_ICONS: Record<string, React.ReactNode> = {
  'Home':          <Home       size={13} strokeWidth={2.2} />,
  'About Us':      <Info       size={13} strokeWidth={2.2} />,
  'News':          <Newspaper  size={13} strokeWidth={2.2} />,
  'Announcements': <Bell       size={13} strokeWidth={2.2} />,
  'Support Us':    <Heart      size={13} strokeWidth={2.2} />,
  'Contact Us':    <Phone      size={13} strokeWidth={2.2} />,
  'Ministries':    <LayoutGrid size={13} strokeWidth={2.2} />,
};

const Navbar: React.FC<NavbarProps> = ({ departments, isAdmin = false, roleLabel = '' }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [showDepts, setShowDepts] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const isHomePage   = location.pathname === '/';
  const navTextColor = 'text-black';

  const dashboardPath = useMemo(() => {
    if (!user) return '/portal';
    return isAdmin ? '/admin' : '/dashboard';
  }, [user, isAdmin]);

  const LOGO_SRC = '/RASA-logo.png';

  // Whether we're in "transparent-on-hero" mode
  const isTransparent = isHomePage && !scrolled;

  // Shared pill-group container style
  const pillGroupClass = `
    flex items-center gap-1 p-1 rounded-full border
    ${isTransparent
      ? 'bg-white/10 border-white/20 backdrop-blur-md'
      : 'bg-gray-100/80 border-gray-200/60 backdrop-blur-sm'}
  `;

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100 py-2'
          : isHomePage
            ? 'bg-transparent py-6'
            : 'bg-primary border-b border-gray-100 py-3'
      }`}
    >
      <div className="max-container flex items-center justify-between px-4">

        {/* ── Logo ─────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} className="relative h-12 w-auto flex items-center justify-center">
            <img
              src={LOGO_SRC}
              alt="RASA Logo"
              className="h-full w-auto object-contain relative z-10 transition-opacity duration-500"
              onLoad={(e)  => { (e.target as HTMLImageElement).style.opacity = '1'; }}
              onError={(e) => { (e.target as any).style.display = 'none'; }}
            />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className={`font-black text-xl tracking-tight ${isTransparent ? 'text-white' : navTextColor}`}>
              RASA <span className="text-secondary">UR</span>
            </span>
            <span className={`text-[7px] font-black uppercase tracking-[0.25em] mt-1 ${isTransparent ? 'text-white/70' : 'text-black/50'}`}>
              RWANDA
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ──────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-3">

          {/* Pill group that wraps all nav links */}
          <div className={pillGroupClass}>

            {/* Standard nav links */}
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`
                    relative flex items-center gap-1.5 px-4 py-2 rounded-full
                    text-[11px] font-black uppercase tracking-widest
                    whitespace-nowrap transition-all duration-200
                    ${isActive
                      ? 'bg-white text-black shadow-md shadow-black/10'
                      : isTransparent
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-black/60 hover:text-black hover:bg-white/70'}
                  `}
                >
                  <span className={isActive ? 'text-secondary' : 'opacity-70'}>
                    {NAV_ICONS[link.name]}
                  </span>
                  {link.name}
                </Link>
              );
            })}

            {/* Ministries dropdown inside pill group */}
            <div
              className="relative"
              onMouseEnter={() => setShowDepts(true)}
              onMouseLeave={() => setShowDepts(false)}
            >
              <Link
                to="/departments"
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full
                  text-[11px] font-black uppercase tracking-widest
                  whitespace-nowrap transition-all duration-200
                  ${location.pathname.startsWith('/departments')
                    ? 'bg-white text-black shadow-md shadow-black/10'
                    : isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-black/60 hover:text-black hover:bg-white/70'}
                `}
              >
                <span className={`opacity-70 ${location.pathname.startsWith('/departments') ? 'text-secondary opacity-100' : ''}`}>
                  {NAV_ICONS['Ministries']}
                </span>
                Ministries
                <ChevronDown
                  size={11}
                  strokeWidth={2.5}
                  className={`ml-0.5 transition-transform duration-300 ${showDepts ? 'rotate-180' : ''}`}
                />
              </Link>

              <AnimatePresence>
                {showDepts && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0,  scale: 1    }}
                    exit={{   opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72
                               bg-white shadow-2xl rounded-3xl overflow-hidden
                               border border-gray-100 p-3"
                  >
                    <div className="grid grid-cols-1 gap-1">
                      {departments.map((dept) => (
                        <Link
                          key={dept.id}
                          to={`/departments/${dept.id}`}
                          className="flex items-center gap-3 px-4 py-3
                                     hover:bg-secondary/10 rounded-2xl
                                     text-sm font-bold text-black
                                     transition-all hover:translate-x-1 whitespace-nowrap"
                        >
                          <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                          {dept.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Auth section (outside pill group) */}
          {user ? (
            <div className={`
              flex items-center gap-3 p-1.5 pl-5 rounded-full border backdrop-blur-md
              ${isTransparent ? 'bg-white/10 border-white/20' : 'bg-gray-50/50 border-gray-200/60'}
            `}>
              <Link to={dashboardPath} className="flex items-center gap-3 group">
                <div className="text-right">
                  <p className={`font-black text-[11px] leading-none whitespace-nowrap ${isTransparent ? 'text-white' : 'text-black'}`}>
                    {user.fullName.split(' ')[0]}
                  </p>
                  <p className="text-[8px] font-black text-secondary uppercase tracking-widest mt-0.5 whitespace-nowrap">
                    {roleLabel}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center
                                text-white shadow-lg group-hover:scale-105 transition-all
                                overflow-hidden border-2 border-white/50 relative shrink-0">
                  {user.profileImage
                    ? <img src={user.profileImage} className="w-full h-full object-cover" alt="Profile" />
                    : user.role === 'it' ? <Shield size={16} /> : <UserIcon size={16} />
                  }
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full" />
                </div>
              </Link>
              <div className={`w-px h-5 mx-0.5 ${isTransparent ? 'bg-white/20' : 'bg-gray-200'}`} />
              <button
                onClick={logout}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/portal"
              className={`
                px-7 py-2.5 rounded-full font-black text-[11px] uppercase tracking-[0.2em]
                transition-all transform hover:scale-105 shadow-md whitespace-nowrap
                ${scrolled || !isHomePage
                  ? 'bg-secondary text-white hover:bg-accent'
                  : 'bg-white text-secondary hover:bg-secondary hover:text-white shadow-white/20'}
              `}
            >
              Access Portal
            </Link>
          )}
        </div>

        {/* ── Hamburger ────────────────────────────────────── */}
        <button
          className={`p-2 rounded-xl lg:hidden ${isTransparent ? 'text-white' : navTextColor}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{   opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] lg:hidden flex flex-col p-8 overflow-y-auto"
          >
            {/* Mobile header */}
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <img src={LOGO_SRC} alt="Logo" className="h-10 w-auto" />
                <span className="font-black text-3xl tracking-tight text-black">
                  RASA <span className="text-secondary">UR</span>
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-2xl">
                <X size={26} />
              </button>
            </div>

            {/* Mobile user card */}
            {user && (
              <div className="mb-10 flex items-center gap-5 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-secondary overflow-hidden shadow-xl border-2 border-white shrink-0">
                  {user.profileImage
                    ? <img src={user.profileImage} className="w-full h-full object-cover" alt="" />
                    : <div className="w-full h-full flex items-center justify-center text-white">
                        {user.role === 'it' ? <Shield size={22} /> : <UserIcon size={22} />}
                      </div>
                  }
                </div>
                <div>
                  <p className="font-black text-xl text-black leading-tight">{user.fullName}</p>
                  <p className="text-xs font-black text-secondary uppercase tracking-widest">{roleLabel} clearance</p>
                </div>
              </div>
            )}

            {/* Mobile links */}
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-4 px-6 py-4 rounded-2xl
                      font-black text-xl transition-all whitespace-nowrap
                      ${isActive
                        ? 'bg-secondary/10 text-secondary'
                        : 'text-black hover:bg-gray-50 hover:text-secondary'}
                    `}
                  >
                    <span className={isActive ? 'text-secondary' : 'text-black/40'}>
                      {React.cloneElement(NAV_ICONS[link.name] as React.ReactElement, { size: 22 })}
                    </span>
                    {link.name}
                  </Link>
                );
              })}

              <Link
                to="/departments"
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-4 px-6 py-4 rounded-2xl
                  font-black text-xl transition-all whitespace-nowrap
                  ${location.pathname.startsWith('/departments')
                    ? 'bg-secondary/10 text-secondary'
                    : 'text-black hover:bg-gray-50 hover:text-secondary'}
                `}
              >
                <span className={location.pathname.startsWith('/departments') ? 'text-secondary' : 'text-black/40'}>
                  {React.cloneElement(NAV_ICONS['Ministries'] as React.ReactElement, { size: 22 })}
                </span>
                Ministries
              </Link>

              <div className="h-px bg-gray-100 my-4" />

              {user ? (
                <div className="space-y-2">
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl
                               font-black text-xl text-secondary hover:bg-secondary/10 transition-all whitespace-nowrap"
                  >
                    <LayoutDashboard size={22} /> Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl w-full text-left
                               font-black text-xl text-red-500 hover:bg-red-50 transition-all whitespace-nowrap"
                  >
                    <LogOut size={22} /> Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/portal"
                  onClick={() => setIsOpen(false)}
                  className="bg-secondary text-white py-5 rounded-3xl text-center
                             font-black text-xl shadow-2xl hover:bg-accent transition-all
                             active:scale-95 whitespace-nowrap"
                >
                  Member Portal
                </Link>
              )}
            </div>

            <div className="mt-auto pt-10 text-center">
              <p className="text-[8px] font-black text-black/20 uppercase tracking-[0.4em]">
                Agakiza • Urukundo • Umurimo
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
