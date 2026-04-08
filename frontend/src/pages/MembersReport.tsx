import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Search, Download, Filter, 
  User as UserIcon, Calendar, GraduationCap, 
  MapPin, Briefcase, ChevronRight, Loader2
} from 'lucide-react';
import { API } from '../services/api';
import { User } from '../types';

const MembersReport: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    year: '',
    level: '',
    program: '',
    gender: '',
    diocese: ''
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const data = await API.members.getReport(params);
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const exportToExcel = () => console.log("Exporting to Excel...");
  const exportToPDF = () => console.log("Exporting to PDF...");

  return (
    <div className="min-h-screen pt-32 pb-20 bg-primary">
      <div className="max-container px-4">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/5 border border-secondary/10 rounded-full text-secondary font-black text-[9px] uppercase tracking-[0.3em]">
              <FileText size={14} /> Statistical Analysis
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-serif italic text-black leading-none">
              Members <span className="text-secondary">Report</span>
            </h1>
            <p className="text-black/50 font-medium text-lg italic">"Comprehensive registry of the RASA UR fellowship."</p>
          </div>

          <div className="flex gap-4">
            <button onClick={exportToExcel} className="px-6 py-3.5 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-black/60 hover:text-secondary hover:border-secondary/20 transition-all flex items-center gap-2 shadow-sm">
              <Download size={16} /> Excel
            </button>
            <button onClick={exportToPDF} className="px-6 py-3.5 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-secondary/90 transition-all flex items-center gap-2">
              <FileText size={16} /> PDF Report
            </button>
          </div>
        </header>

        {/* Filter Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
            <Filter size={18} className="text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Refine Search Sequence</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-black/30 uppercase ml-2">Member Name</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                <input
                  type="text"
                  name="name"
                  placeholder="Search pulse..."
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl outline-none font-bold text-sm focus:bg-white focus:border-secondary/20 transition-all text-black"
                />
              </div>
            </div>
            
            {/* Additional filters can be added here with same styling */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-black/30 uppercase ml-2">Academic Year</label>
              <input
                type="text"
                name="year"
                placeholder="e.g. 2024-2025"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl outline-none font-bold text-sm focus:bg-white focus:border-secondary/20 transition-all text-black"
              />
            </div>
          </div>
        </div>

        {/* Table/List View */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-secondary" size={48} />
              <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.4em]">Querying Kernel...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest">Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest">Academic Info</th>
                    <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest">Home Diocese</th>
                    <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary font-black">
                            {member.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-black">{member.fullName}</p>
                            <p className="text-[10px] font-black text-black/30 uppercase tracking-tighter">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-black/70 flex items-center gap-2">
                            <GraduationCap size={14} className="text-secondary" /> {member.level} - {member.program}
                          </p>
                          <p className="text-[10px] font-black text-black/30 uppercase">{member.academicYear}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-black/70">
                          <MapPin size={14} className="text-secondary" /> {member.diocese}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-black/70">{member.phone}</p>
                          <p className="text-[10px] font-black text-black/30 lowercase">{member.email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-black/20 group-hover:text-secondary transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {members.length === 0 && (
                <div className="py-32 text-center space-y-4">
                  <UserIcon className="mx-auto text-black/10" size={48} />
                  <p className="text-black/30 font-bold italic font-serif text-xl">No member signatures detected.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersReport;
