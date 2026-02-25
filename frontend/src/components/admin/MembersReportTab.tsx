import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, FileText, User as UserIcon, Calendar, GraduationCap, MapPin, Layers, Briefcase } from 'lucide-react';
import { API } from '../../services/api';
import { User } from '../../types';

const MembersReportTab: React.FC = () => {
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
      setMembers(data || []);
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

  const exportToExcel = () => {
    // Logic for Excel export would go here
    alert("Exporting to Excel is being prepared...");
  };

  const exportToPDF = () => {
    // Logic for PDF export would go here
    alert("Exporting to PDF is being prepared...");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Members Archive & Reports</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Stewardship Data Repository</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-green-600 transition-all">
            <Download size={16} /> Excel Report
          </button>
          <button onClick={exportToPDF} className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-red-600 transition-all">
            <FileText size={16} /> PDF Archive
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Search Name</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" name="name" placeholder="Search..." value={filters.name} onChange={handleFilterChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-cyan-500 transition-all" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Academic Year</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-cyan-500 appearance-none transition-all">
              <option value="">All Years</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Level</label>
          <div className="relative">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select name="level" value={filters.level} onChange={handleFilterChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-cyan-500 appearance-none transition-all">
              <option value="">All Levels</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
              <option value="Post-Graduate">Post-Graduate</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Gender</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-cyan-500 appearance-none transition-all">
              <option value="">All Gender</option>
              <option value="Male">Boy</option>
              <option value="Female">Girl</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Diocese</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select name="diocese" value={filters.diocese} onChange={handleFilterChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-cyan-500 appearance-none transition-all">
              <option value="">All Diocese</option>
              <option value="Kigali">Kigali</option>
              <option value="Butare">Butare</option>
              <option value="Shyira">Shyira</option>
              <option value="Byumba">Byumba</option>
              <option value="Cyangugu">Cyangugu</option>
              <option value="Kibungo">Kibungo</option>
              <option value="Kigeme">Kigeme</option>
              <option value="Muhoza">Muhoza</option>
              <option value="Gahini">Gahini</option>
              <option value="Shyogwe">Shyogwe</option>
              <option value="Nyutare">Nyutare</option>
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <button onClick={() => setFilters({name: '', year: '', level: '', program: '', gender: '', diocese: ''})} className="w-full py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
            <Filter size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Member</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Year</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Level & Program</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Diocese</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Layers className="text-cyan-500" size={32} />
                      </motion.div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Querying Divine Archives...</p>
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching sequences found in repository</p>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                          {member.profileImage ? (
                            <img src={member.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-lg">
                              {member.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-sm text-gray-900">{member.fullName}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{member.gender || 'Unknown'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-300" />
                        <span className="text-xs font-bold text-gray-600">{member.academicYear || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-cyan-500" />
                          <span className="text-xs font-black text-gray-900 uppercase">{member.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap size={14} className="text-gray-300" />
                          <span className="text-[10px] font-bold text-gray-400">{member.program}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-red-400" />
                        <span className="text-xs font-bold text-gray-600">{member.diocese}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-900">{member.email}</p>
                        <p className="text-[10px] font-bold text-gray-400">{member.phone}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default MembersReportTab;
