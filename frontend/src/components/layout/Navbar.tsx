import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User as UserIcon, LogOut, LayoutDashboard, Shield } from 'lucide-react';
// Fix framer-motion prop errors by casting motion to any
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

const Navbar: React.FC<NavbarProps> = ({ departments, isAdmin = false, roleLabel = '' }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDepts, setShowDepts] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const isHomePage = location.pathname === '/';
  const navTextColor = 'text-black';

  const dashboardPath = useMemo(() => {
    if (!user) return '/portal';
    return isAdmin ? '/admin' : '/dashboard';
  }, [user, isAdmin]);

  const LOGO_SRC = "/RASA-logo.png";

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled
        ? 'bg-primary/95 backdrop-blur-xl shadow-sm border-b border-gray-100 py-2'
        : (isHomePage ? 'bg-transparent py-6' : 'bg-primary border-b border-gray-100 py-3')
      }`}>
      <div className="max-container flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-4 group">
          <motion.div whileHover={{ scale: 1.05 }} className="relative h-14 w-auto flex items-center justify-center">
            <img
              src={LOGO_SRC}
              alt="RASA Logo"
              className="h-full w-auto object-contain relative z-10 transition-opacity duration-500"
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.opacity = '1';
              }}
              onError={(e) => (e.target as any).style.display = 'none'}
            />
          </motion.div>
          <div className="flex flex-col">
            <span className={`font-black text-2xl tracking-tighter leading-none ${navTextColor}`}>RASA <span className="text-secondary">UR</span></span>
            <span className={`text-[7px] font-black uppercase tracking-[0.3em] mt-1 ${navTextColor} opacity-60`}>Agakiza • Urukundo • Umurimo</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`font-bold text-sm uppercase tracking-widest transition-all hover:text-accent relative ${location.pathname === link.href ? 'text-secondary' : navTextColor}`}>
              {link.name}
              {location.pathname === link.href && <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 w-full h-1 bg-secondary rounded-full" />}
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setShowDepts(true)} onMouseLeave={() => setShowDepts(false)}>
            <Link to="/departments" className={`flex items-center gap-1 font-bold text-sm uppercase tracking-widest transition-all hover:text-accent ${location.pathname.startsWith('/departments') ? 'text-secondary' : navTextColor}`}>
              Ministries <ChevronDown size={14} className={`transition-transform duration-300 ${showDepts ? 'rotate-180' : ''}`} />
            </Link>
            <AnimatePresence>
              {showDepts && (
                <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-primary shadow-2xl rounded-3xl overflow-hidden border border-gray-100 p-3">
                  <div className="grid grid-cols-1 gap-1">
                    {departments.map((dept) => (
                      <Link key={dept.id} to={`/departments/${dept.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/10 rounded-2xl text-sm font-bold text-black transition-all hover:translate-x-1">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>{dept.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-gray-50/50 p-1.5 pl-5 rounded-full border border-gray-100 backdrop-blur-md">
              <Link to={dashboardPath} className="flex items-center gap-3 group">
                <div className="text-right">
                  <p className="font-black text-[11px] text-black leading-none">{user.fullName.split(' ')[0]}</p>
                  <p className="text-[8px] font-black text-secondary uppercase tracking-widest mt-0.5">{roleLabel}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all overflow-hidden border-2 border-white/50 relative">
                  {user.profileImage ? (
                    <img src={user.profileImage} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    user.role === 'it' ? <Shield size={18} /> : <UserIcon size={18} />
                  )}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </Link>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Logout"><LogOut size={18} /></button>
            </div>
          ) : (
            <Link to="/portal" className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all transform hover:scale-105 shadow-md ${scrolled || !isHomePage ? 'bg-secondary text-white hover:bg-accent' : 'bg-primary text-secondary hover:bg-accent hover:text-white shadow-white/20'}`}>Access Portal</Link>
          )}
        </div>

        <button className={`p-2 rounded-xl lg:hidden ${navTextColor}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 bg-primary z-[60] lg:hidden flex flex-col p-8">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <img src={LOGO_SRC} alt="Logo" className="h-10 w-auto" />
                <span className="font-black text-3xl tracking-tighter text-black">RASA <span className="text-secondary">UR</span></span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-2xl"><X size={28} /></button>
            </div>

            {user && (
              <div className="mb-10 flex items-center gap-5 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-secondary overflow-hidden shadow-xl border-2 border-white shrink-0">
                  {user.profileImage ? <img src={user.profileImage} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-white">{user.role === 'it' ? <Shield size={24} /> : <UserIcon size={24} />}</div>}
                </div>
                <div>
                  <p className="font-black text-xl text-black leading-tight">{user.fullName}</p>
                  <p className="text-xs font-black text-secondary uppercase tracking-widest">{roleLabel} clearance</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6 text-2xl font-black text-black">
              {NAV_LINKS.map(link => <Link key={link.name} to={link.href} className="hover:text-accent">{link.name}</Link>)}
              <div className="h-px bg-gray-100 my-4"></div>
              {user ? (
                <div className="space-y-6">
                  <Link to={dashboardPath} className="flex items-center gap-4 text-secondary"><LayoutDashboard size={28} /> Dashboard</Link>
                  <button onClick={logout} className="flex items-center gap-4 text-red-500"><LogOut size={28} /> Sign Out</button>
                </div>
              ) : <Link to="/portal" className="bg-secondary text-white py-6 rounded-3xl text-center shadow-2xl hover:bg-accent transition-colors">Member Portal</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
