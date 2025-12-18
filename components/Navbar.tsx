
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS, DEPARTMENTS } from '../constants';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
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

  // Determine if we are on a dark-themed page or section
  const isHomePage = location.pathname === '/';
  const navTextColor = (scrolled || !isHomePage) ? 'text-gray-900' : 'text-white';

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-gray-100 py-3' 
        : (isHomePage ? 'bg-transparent py-6' : 'bg-white border-b border-gray-100 py-4')
    }`}>
      <div className="max-container flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="w-11 h-11 bg-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-200"
          >
            R
          </motion.div>
          <span className={`font-black text-2xl tracking-tighter ${navTextColor}`}>
            RASA <span className="text-cyan-500">NYG</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              className={`font-bold text-sm uppercase tracking-widest transition-all hover:text-cyan-500 relative ${
                location.pathname === link.href ? 'text-cyan-500' : navTextColor
              }`}
            >
              {link.name}
              {location.pathname === link.href && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 w-full h-1 bg-cyan-500 rounded-full"
                />
              )}
            </Link>
          ))}
          
          <div className="relative" onMouseEnter={() => setShowDepts(true)} onMouseLeave={() => setShowDepts(false)}>
            <Link 
              to="/departments"
              className={`flex items-center gap-1 font-bold text-sm uppercase tracking-widest transition-all hover:text-cyan-500 ${
                location.pathname.startsWith('/departments') ? 'text-cyan-500' : navTextColor
              }`}
            >
              Departments <ChevronDown size={14} className={`transition-transform duration-300 ${showDepts ? 'rotate-180' : ''}`} />
            </Link>
            <AnimatePresence>
              {showDepts && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 p-3"
                >
                  <div className="grid grid-cols-1 gap-1">
                    {DEPARTMENTS.map((dept) => (
                      <Link 
                        key={dept.id} 
                        to={`/departments/${dept.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-50 rounded-2xl text-sm font-bold text-gray-700 transition-all hover:translate-x-1"
                      >
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        {dept.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Auth Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-gray-50 p-1.5 pl-4 rounded-full border border-gray-100">
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 group">
                <span className="font-bold text-sm text-gray-700">
                  {user.fullName.split(' ')[0]}
                </span>
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-md">
                  <UserIcon size={16} />
                </div>
              </Link>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button 
                onClick={onLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link 
              to="/portal" 
              className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all transform hover:scale-105 shadow-xl ${
                scrolled || !isHomePage 
                  ? 'bg-cyan-500 text-white shadow-cyan-100 hover:bg-cyan-600' 
                  : 'bg-white text-cyan-600 hover:bg-gray-100 shadow-white/20'
              }`}
            >
              Portal
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className={navTextColor} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-white z-[60] lg:hidden flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-black text-3xl tracking-tighter">RASA <span className="text-cyan-500">NYG</span></span>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={28} /></button>
            </div>
            <div className="flex flex-col gap-6 text-2xl font-black">
              {NAV_LINKS.map(link => (
                <Link key={link.name} to={link.href} className="hover:text-cyan-500 flex items-center justify-between">
                  {link.name} <ChevronDown size={20} className="-rotate-90 text-gray-300" />
                </Link>
              ))}
              <Link to="/departments" className="hover:text-cyan-500 flex items-center justify-between">
                Departments <ChevronDown size={20} className="-rotate-90 text-gray-300" />
              </Link>
              <div className="h-px bg-gray-100 my-4"></div>
              <div className="flex flex-col gap-6">
                 {user ? (
                   <>
                     <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-cyan-600 flex items-center justify-between">
                       My Dashboard <UserIcon size={24} />
                     </Link>
                     <button onClick={onLogout} className="text-red-500 text-left flex items-center justify-between">
                       Logout <LogOut size={24} />
                     </button>
                   </>
                 ) : (
                   <Link to="/portal" className="bg-cyan-500 text-white py-5 px-8 rounded-3xl text-center shadow-2xl shadow-cyan-100">Member Portal</Link>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
