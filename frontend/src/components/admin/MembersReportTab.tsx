import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, FileText, User as UserIcon, 
  Calendar, GraduationCap, MapPin, Layers, 
  X, RefreshCw, ChevronDown, Binary,
  Edit, Trash2, ShieldAlert, Zap, Plus,
  Mail, Phone
} from 'lucide-react';
import { API } from '../../services/api';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { DIOCESES } from '../../constants';

interface MembersReportTabProps {
  onEditMember: (member: User) => void;
  onDeleteMember: (id: string) => void;
  onNewMember: () => void;
}

const MembersReportTab: React.FC<MembersReportTabProps> = ({ onEditMember, onDeleteMember, onNewMember }) => {
  const { user: currentUser } = useAuth();
  const { notify } = useNotification();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    year: '',
    level: '',
    program: '',
    gender: '',
    diocese: ''
  });

  const isIT = currentUser?.role === 'it';

  // Generate years from 2003 to 2050
  const academicYears = useMemo(() => {
    const years = [];
    for (let i = 2050; i >= 2003; i--) {
      years.push(`${i}-${i + 1}`);
    }
    return years;
  }, []);

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

  const quickFilter = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const exportToExcel = () => {
    if (members.length === 0) return alert("No data available for sequence export.");
    setIsExporting('excel');

    setTimeout(() => {
      try {
        const headers = ["Full Name", "Gender", "Academic Year", "Level", "Program", "Diocese", "Email", "Phone"];
        const xmlRows = members.map(m => `
          <Row>
            <Cell><Data ss:Type="String">${m.fullName || ''}</Data></Cell>
            <Cell><Data ss:Type="String">${m.gender || 'N/A'}</Data></Cell>
            <Cell><Data ss:Type="String">${m.academicYear || 'N/A'}</Data></Cell>
            <Cell><Data ss:Type="String">${m.level || ''}</Data></Cell>
            <Cell><Data ss:Type="String">${m.program || ''}</Data></Cell>
            <Cell><Data ss:Type="String">${m.diocese || ''}</Data></Cell>
            <Cell><Data ss:Type="String">${m.email || ''}</Data></Cell>
            <Cell><Data ss:Type="String">${m.phone || ''}</Data></Cell>
          </Row>
        `).join('');

        const excelTemplate = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#3B6B1F" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="RASA Members">
  <Table>
   <Row ss:StyleID="header">
    ${headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')}
   </Row>
   ${xmlRows}
  </Table>
 </Worksheet>
</Workbook>`;

        const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `RASA_Members_Report_${new Date().toISOString().split('T')[0]}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        notify("Excel Export", "Member archive downloaded successfully.", "success");
      } catch (err) {
        notify("Export Error", "Failed to generate Excel file.", "error");
      } finally {
        setIsExporting(null);
      }
    }, 1200);
  };

  const exportToPDF = () => {
    if (members.length === 0) return alert("No data available for archival.");
    setIsExporting('pdf');

    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        notify("Popup Blocked", "Please allow popups for PDF generation.", "error");
        setIsExporting(null);
        return;
      }

      const html = `
        <html>
          <head>
            <title>RASA Members Report</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1a1a1a; line-height: 1.4; }
              .header { text-align: center; border-bottom: 3px solid #3B6B1F; padding-bottom: 15px; margin-bottom: 25px; }
              .header h1 { margin: 0; font-size: 24px; color: #3B6B1F; text-transform: uppercase; letter-spacing: 1px; }
              .header p { margin: 5px 0 0; font-weight: bold; color: #555; }
              .meta { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 10px; color: #888; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th { background: #f1f5f9; text-align: left; padding: 10px; font-size: 9px; border: 1px solid #e2e8f0; text-transform: uppercase; }
              td { padding: 8px; font-size: 10px; border: 1px solid #e2e8f0; vertical-align: middle; }
              .photo-cell { width: 50px; text-align: center; }
              .photo-container { width: 45px; height: 45px; overflow: hidden; border-radius: 6px; border: 1px solid #ddd; margin: 0 auto; }
              .photo { width: 100%; height: 100%; object-fit: cover; }
              .footer { margin-top: 30px; font-size: 9px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>RASA-UR Nyarugenge</h1>
              <p>Official Stewardship Registry - Members Report</p>
            </div>
            <div class="meta">
              <span>Timeline: ${filters.year || 'Global Registry'}</span>
              <span>Extraction Date: ${new Date().toLocaleString()}</span>
              <span>Sequences: ${members.length}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th class="photo-cell">Photo</th>
                  <th>Full Name</th>
                  <th>Level</th>
                  <th>Program</th>
                  <th>Diocese</th>
                  <th>Academic Year</th>
                  <th>Contact Information</th>
                </tr>
              </thead>
              <tbody>
                ${members.map(m => `
                  <tr>
                    <td class="photo-cell">
                      <div class="photo-container">
                        ${m.profileImage ? `<img src="${m.profileImage}" class="photo" />` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f8fafc;color:#cbd5e1;font-weight:bold;font-size:16px;">${m.fullName.charAt(0)}</div>`}
                      </div>
                    </td>
                    <td><strong>${m.fullName}</strong><br/><span style="color:#64748b;font-size:8px;text-transform:uppercase;">${m.gender || 'N/A'}</span></td>
                    <td>${m.level}</td>
                    <td style="max-width: 150px;">${m.program}</td>
                    <td>${m.diocese}</td>
                    <td style="white-space: nowrap;">${m.academicYear || 'N/A'}</td>
                    <td><span style="color:#3B6B1F;">${m.email}</span><br/>${m.phone}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">This document is an official extract from the Divine Registry of RASA UR-Nyarugenge.</div>
            <script>window.print();</script>
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
      setIsExporting(null);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">Members Archive & Reports</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <p className="text-xs text-black/40 font-bold uppercase tracking-widest">Stewardship Data Repository</p>
          </div>
        </div>
        <div className="flex gap-3">
          {isIT && (
            <button onClick={onNewMember} className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95">
              <Plus size={16} /> New Entry
            </button>
          )}
          <button onClick={exportToExcel} disabled={!!isExporting} className="flex items-center gap-3 px-8 py-4 bg-[#107C41] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50">
            {isExporting === 'excel' ? <RefreshCw className="animate-spin" size={16}/> : <Binary size={16} />} Excel Report
          </button>
          <button onClick={exportToPDF} disabled={!!isExporting} className="flex items-center gap-3 px-8 py-4 bg-[#E11D48] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50">
            {isExporting === 'pdf' ? <RefreshCw className="animate-spin" size={16}/> : <FileText size={16} />} PDF Archive
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-white/50 p-4 rounded-[2rem] border border-gray-100">
        <span className="text-[10px] font-black uppercase text-black/30 flex items-center gap-2 mr-2"><Zap size={14} className="text-secondary" /> Quick Access:</span>
        <button onClick={() => quickFilter('gender', 'Male')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.gender === 'Male' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-black/60 hover:bg-gray-100 shadow-sm'}`}>Boys</button>
        <button onClick={() => quickFilter('gender', 'Female')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.gender === 'Female' ? 'bg-pink-500 text-white shadow-lg' : 'bg-white text-black/60 hover:bg-gray-100 shadow-sm'}`}>Girls</button>
        <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>
        {['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'].map(lvl => (
          <button key={lvl} onClick={() => quickFilter('level', lvl)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.level === lvl ? 'bg-secondary text-white shadow-lg' : 'bg-white text-black/60 hover:bg-gray-100 shadow-sm'}`}>{lvl}</button>
        ))}
        <button onClick={() => setFilters({name: '', year: '', level: '', program: '', gender: '', diocese: ''})} className="ml-auto flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg"><X size={12} /> Reset Protocols</button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-secondary/5 border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full -mr-24 -mt-24 blur-3xl" />

        <div className="space-y-2 relative">
          <label className="text-[9px] font-black uppercase text-secondary/60 ml-1 tracking-widest">Search Identity</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-secondary transition-colors" size={16} />
            <input type="text" name="name" value={filters.name} onChange={handleFilterChange} placeholder="Filter name..." className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-secondary outline-none transition-all shadow-inner" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-secondary/60 ml-1 tracking-widest">Academic Year</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" size={16} />
            <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full pl-11 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-secondary outline-none appearance-none cursor-pointer">
              <option value="">Global Timeline</option>
              {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-secondary/60 ml-1 tracking-widest">Clearance Level</label>
          <div className="relative">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" size={16} />
            <select name="level" value={filters.level} onChange={handleFilterChange} className="w-full pl-11 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-secondary outline-none appearance-none cursor-pointer">
              <option value="">All Tiers</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
              <option value="Level 5">Level 5</option>
              <option value="Post-RASA">Post-RASA</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-secondary/60 ml-1 tracking-widest">Territory (Diocese)</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" size={16} />
            <select name="diocese" value={filters.diocese} onChange={handleFilterChange} className="w-full pl-11 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-secondary outline-none appearance-none cursor-pointer">
              <option value="">All Territory</option>
              {DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="flex items-end">
          <button onClick={fetchMembers} className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 group active:scale-95">
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" /> Apply Protocols
          </button>
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest">Steward / Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest">Temporal Context</th>
                <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest">Clearance & Protocol</th>
                <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest">Territory</th>
                <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-black/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full" />
                      <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Archives...</p>
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="bg-gray-50 inline-flex p-8 rounded-full mb-6 shadow-inner"><Layers className="text-gray-200" size={48}/></div>
                    <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">No matching sequences found in repository</p>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-secondary/5 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0 relative group-hover:scale-110 transition-transform">
                          {member.profileImage ? (
                            <img src={member.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-xl bg-gray-50">{member.fullName.charAt(0)}</div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-[13px] text-black uppercase tracking-tight">{member.fullName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${member.gender === 'Male' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                            <p className="text-[9px] font-black text-black/40 uppercase tracking-widest">{member.gender || 'UNDEFINED'}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-secondary group-hover:scale-110 transition-transform"><Calendar size={14} /></div>
                        <span className="text-[11px] font-black text-black/60 uppercase">{member.academicYear || 'Eternal'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-lg">
                          <Layers size={10} strokeWidth={3} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">{member.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap size={12} className="text-gray-300" />
                          <span className="text-[10px] font-bold text-black/40 line-clamp-1">{member.program}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/5 rounded-lg text-secondary"><MapPin size={14} /></div>
                        <span className="text-[11px] font-black text-black/60 uppercase">{member.diocese}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 group/contact">
                          <Mail size={12} className="text-black/30 group-hover/contact:text-secondary transition-colors" />
                          <p className="text-[11px] font-black text-black lowercase">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2 group/contact">
                          <Phone size={12} className="text-black/30 group-hover/contact:text-secondary transition-colors" />
                          <p className="text-[10px] font-bold text-black/40">{member.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {isIT ? (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => onEditMember(member)} className="p-3 bg-white border border-gray-100 text-black/40 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm" title="Refine Identity"><Edit size={16} /></button>
                          <button onClick={() => onDeleteMember(member.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Purge Record"><Trash2 size={16} /></button>
                        </div>
                      ) : (
                        <div className="text-black/10 flex justify-end" title="IT Architect Clearance Required"><ShieldAlert size={20} /></div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Status Bar */}
        <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-6">
             <p className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em]">Divine Registry Status: <span className="text-secondary">Connected</span></p>
             <div className="w-px h-3 bg-gray-200"></div>
             <p className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em]">Identity Sequences: {members.length}</p>
          </div>
          <p className="text-[8px] font-black text-black/30 uppercase tracking-[0.4em]">Stewardship Management Systems v3.0</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MembersReportTab;
