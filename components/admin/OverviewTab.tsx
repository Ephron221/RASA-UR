
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MessageSquare, UserCheck, Newspaper, 
  TrendingUp, Bell, Briefcase, Database, 
  ArrowUpRight, Clock, ShieldCheck
} from 'lucide-react';
import { User, NewsItem, Leader, Announcement, ContactMessage, Department } from '../../types';

interface OverviewTabProps {
  members: User[];
  news: NewsItem[];
  leaders: Leader[];
  announcements: Announcement[];
  contactMsgs: ContactMessage[];
  depts: Department[];
  logs: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  members, news, leaders, announcements, contactMsgs, depts, logs 
}) => {
  const stats = [
    { 
      label: 'Total Members', 
      value: members.length, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      trend: '+12% growth',
      description: 'Registered campus students'
    },
    { 
      label: 'Unread Messages', 
      value: contactMsgs.filter(m => !m.isRead).length, 
      icon: MessageSquare, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      trend: 'Needs attention',
      description: 'Pending inbox inquiries'
    },
    { 
      label: 'Official Leaders', 
      value: leaders.length, 
      icon: UserCheck, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      trend: 'Term 2024/25',
      description: 'Committee members'
    },
    { 
      label: 'Ministries', 
      value: depts.length, 
      icon: Briefcase, 
      color: 'text-cyan-600', 
      bg: 'bg-cyan-50', 
      trend: 'Active work',
      description: 'RASA Departments'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-7 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-gray-200/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${s.bg} ${s.color}`}>
                  <s.icon size={26} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase">
                  <ArrowUpRight size={12} /> {s.trend}
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-4xl font-black text-gray-900">{s.value}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-2">{s.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Welcome Card */}
        <div className="lg:col-span-8">
          <div className="bg-gray-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <ShieldCheck size={200} />
            </div>
            <h3 className="text-4xl font-black font-serif italic mb-4 relative z-10">Admin Control Center</h3>
            <p className="text-cyan-400 text-sm font-black uppercase tracking-widest relative z-10 mb-6 flex items-center gap-3">
              <Clock size={16} /> Last Login: {new Date().toLocaleTimeString()}
            </p>
            <p className="text-gray-400 text-lg max-w-lg relative z-10 leading-relaxed font-light">
              Welcome back to the RASA Portal management suite. You currently have 
              <span className="text-white font-bold"> {contactMsgs.filter(m => !m.isRead).length} unread messages </span> 
              and <span className="text-white font-bold"> {announcements.length} active announcements </span> on the bulletin.
            </p>
          </div>
        </div>

        {/* Quick Log View */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Database size={16} className="text-cyan-500" /> System Logs
              </h4>
              <span className="text-[10px] font-bold text-gray-400">Recent Activity</span>
            </div>
            
            <div className="space-y-4">
              {logs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-700 leading-tight">{log.action}</p>
                    <p className="text-[9px] text-gray-400 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-center text-gray-300 italic py-10 text-xs">No recent activity logs.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
