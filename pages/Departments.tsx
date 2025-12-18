
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Music, Shield, MessageSquare, 
  Users, Handshake, Globe, Info, Mail, 
  Activity, Star, Flame, Zap, Mic, Cross, CheckCircle, ArrowRight, Sparkles
} from 'lucide-react';
import { DEPARTMENTS } from '../constants';

const IconMap: Record<string, any> = {
  Flame: Flame,
  Music: Music,
  Globe: Globe,
  Activity: Activity,
  Shield: Shield,
  Heart: Heart,
  Star: Star,
  Zap: Zap,
  Mic: Mic,
  Handshake: Handshake
};

const Departments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the selected department or default to first one if on main listing
  const activeDept = DEPARTMENTS.find(d => d.id === id) || null;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-container px-4">
        
        {/* Navigation / Filter */}
        <div className="flex flex-wrap gap-2 mb-16 justify-center">
          <Link 
            to="/departments" 
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              !id ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-100' : 'bg-gray-50 text-gray-400 hover:bg-cyan-50 hover:text-cyan-600'
            }`}
          >
            All Departments
          </Link>
          {DEPARTMENTS.map(dept => (
            <Link 
              key={dept.id}
              to={`/departments/${dept.id}`}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                id === dept.id ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-100' : 'bg-gray-50 text-gray-400 hover:bg-cyan-50 hover:text-cyan-600'
              }`}
            >
              {dept.name}
            </Link>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!activeDept ? (
            <motion.div 
              key="listing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-3 mb-8 text-center space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold font-serif italic text-gray-900">RASA <span className="text-cyan-500">Ministries</span></h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">Discover your place of service within our diverse range of campus departments.</p>
              </div>
              {DEPARTMENTS.map((dept, i) => {
                const Icon = IconMap[dept.icon] || Info;
                return (
                  <motion.div 
                    key={dept.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500 flex flex-col items-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-cyan-50 text-cyan-500 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                      <Icon size={32} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-gray-900">{dept.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{dept.description}</p>
                    </div>
                    <Link 
                      to={`/departments/${dept.id}`} 
                      className="inline-flex items-center gap-2 text-cyan-600 font-black text-[10px] uppercase tracking-widest pt-4 group-hover:gap-4 transition-all"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
            >
              {/* Content Area */}
              <div className="lg:col-span-7 space-y-12">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-cyan-50 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-[0.4em]">
                    <Sparkles size={14} /> Official RASA Department
                  </div>
                  <h2 className="text-6xl font-bold font-serif italic text-gray-900 leading-tight">
                    {activeDept.name}
                  </h2>
                  <p className="text-xl text-gray-500 leading-relaxed font-light italic border-l-4 border-cyan-500 pl-8 py-2">
                    {activeDept.details}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-6">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <Zap size={18} className="text-cyan-500" /> Core Activities
                    </h4>
                    <ul className="space-y-4">
                      {activeDept.activities.map((act, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="text-cyan-500 shrink-0 mt-1" size={16} />
                          <span className="font-bold text-gray-700 text-sm">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 bg-cyan-900 text-white rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-4">
                    <Heart className="text-cyan-400" size={40} />
                    <h4 className="text-lg font-bold font-serif">A Place for You</h4>
                    <p className="text-xs opacity-70 leading-relaxed">God has gifted you with talents that our ministry needs. Step out in faith and join our family.</p>
                    <button className="px-8 py-3 bg-cyan-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-cyan-900 transition-all">
                      Express Interest
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-5 space-y-8">
                <div className="relative aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl group border-8 border-white">
                  <img 
                    src={`https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2064&auto=format&fit=crop`} 
                    alt={activeDept.name} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-10 left-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
                      {React.createElement(IconMap[activeDept.icon] || Info, { size: 40, className: "text-white" })}
                    </div>
                  </div>
                </div>
                
                <div className="p-10 bg-white rounded-[3rem] border border-gray-100 space-y-6">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Leadership Note</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 font-bold">L</div>
                    <div>
                      <p className="font-bold text-gray-900">Head of Department</p>
                      <p className="text-xs text-gray-500">Appointed for 2024/2025</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">"Our vision in this department is to ensure that every student discovers their divine purpose while excelling in their academics."</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Departments;
