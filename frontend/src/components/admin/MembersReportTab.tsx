import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileText, User as UserIcon, 
  Calendar, GraduationCap, MapPin, Layers, Briefcase, 
  X, RefreshCw, CheckCircle2, ChevronDown, Binary
} from 'lucide-react';
import { API } from '../../services/api';
import { User } from '../../types';

const MembersReportTab: React.FC = () => {
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

  const exportToExcel = () => {
    if (members.length === 0) return alert("No data available for sequence export.");
    setIsExporting('excel');
    
    // Simulate processing for UX
    setTimeout(() => {
      try {
        const headers = ["Full Name", "Gender", "Academic Year", "Level", "Program", "Diocese", "Email", "Phone"];
        
        // We use the XML Spreadsheet 2003 format for perfect Excel compatibility
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
   <Interior ss:Color="#06b6d4" ss:Pattern="Solid"/>
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
        link.setAttribute("download", `RASA_Members_Report_${filters.year || 'AllYears'}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Excel Export Error:", err);
        alert("Failed to generate Excel file.");
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
      if (!printWindow) return alert("Please allow popups for PDF generation.");

      const html = `
        <html>
          <head>
            <title>RASA Members Report - ${filters.year || 'All Years'}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a1a; }
              .header { text-align: center; border-bottom: 4px solid #06b6d4; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
              .header p { margin: 5px 0 0; color: #666; font-weight: bold; }
              .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #888; font-weight: bold; text-transform: uppercase; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background: #f8fafc; text-align: left; padding: 12px 15px; font-size: 10px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
              td { padding: 12px 15px; font-size: 11px; border-bottom: 1px solid #f1f5f9; }
              .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>RASA-UR Nyarugenge</h1>
              <p>Stewardship Data Archive - Members Report</p>
            </div>
            <div class="meta">
              <span>Academic Year: ${filters.year || 'Global'}</span>
              <span>Generated: ${new Date().toLocaleString()}</span>
              <span>Total Members: ${members.length}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Level</th>
                  <th>Program</th>
                  <th>Diocese</th>
                  <th>Academic Year</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                ${members.map(m => `
                  <tr>
                    <td><strong>${m.fullName}</strong></td>
                    <td>${m.level}</td>
                    <td>${m.program}</td>
                    <td>${m.diocese}</td>
                    <td>${m.academicYear || 'N/A'}</td>
                    <td>${m.email}<br/>${m.phone}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              This is an official stewardship document generated from the Divine Kernel.
            </div>
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
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Members Archive & Reports</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Stewardship Data Repository</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToExcel} 
            disabled={!!isExporting}
            className="flex items-center gap-3 px-8 py-4 bg-[#107C41] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50 active:scale-95"
          >
            {isExporting === 'excel' ? <RefreshCw className="animate-spin" size={16}/> : <Binary size={16} />} 
            Excel Report
          </button>
          <button 
            onClick={exportToPDF} 
            disabled={!!isExporting}
            className="flex items-center gap-3 px-8 py-4 bg-[#E11D48] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50 active:scale-95"
          >
            {isExporting === 'pdf' ? <RefreshCw className="animate-spin" size={16}/> : <FileText size={16} />} 
            PDF Archive
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-cyan-900/5 border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50/50 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="space-y-2 relative">
          <label className="text-[9px] font-black uppercase text-cyan-600/60 ml-1 tracking-widest">Search Name</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" size={16} />
            <input type="text" name="name" placeholder="Filter identity..." value={filters.name} onChange={handleFilterChange} className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-cyan-500 outline-none transition-all shadow-inner" />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-[9px] font-black uppercase text-cyan-600/60 ml-1 tracking-widest">Academic Year</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors pointer-events-none" size={16} />
            <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full pl-11 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-cyan-500 outline-none appearance-none transition-all shadow-inner cursor-pointer hover:bg-gray-100/50">
              <option value="">Global Timeline</option>
              {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-[9px] font-black uppercase text-cyan-600/60 ml-1 tracking-widest">Clearance Level</label>
          <div className="relative group">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors pointer-events-none" size={16} />
            <select name="level" value={filters.level} onChange={handleFilterChange} className="w-full pl-11 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-cyan-500 outline-none appearance-none transition-all shadow-inner cursor-pointer hover:bg-gray-100/50">
              <option value="">All Tiers</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
              <option value="Level 5">Level 5</option>
              <option value="Post-RASA">Post-RASA</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-[9px] font-black uppercase text-cyan-600/60 ml-1 tracking-widest">Gender</label>
          <div className="relative group">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors pointer-events-none" size={16} />
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="w-full pl-11 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-cyan-500 outline-none appearance-none transition-all shadow-inner cursor-pointer hover:bg-gray-100/50">
              <option value="">All Essence</option>
              <option value="Male">Boy</option>
              <option value="Female">Girl</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-[9px] font-black uppercase text-cyan-600/60 ml-1 tracking-widest">Diocese</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors pointer-events-none" size={16} />
            <select name="diocese" value={filters.diocese} onChange={handleFilterChange} className="w-full pl-11 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-cyan-500 outline-none appearance-none transition-all shadow-inner cursor-pointer hover:bg-gray-100/50">
              <option value="">All Dioceses</option>
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
              <option value="Nyagatare">Nyagatare</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="flex items-end">
          <button onClick={() => setFilters({name: '', year: '', level: '', program: '', gender: '', diocese: ''})} className="w-full py-4 bg-gray-900 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-cyan-600 transition-all flex items-center justify-center gap-2 group active:scale-95">
            <X size={14} className="group-hover:rotate-90 transition-transform" /> Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Steward / Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Context</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Clearance & Protocol</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Territory</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sync Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
                      />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em]">Synchronizing Archives</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Consulting Divine Kernel...</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="bg-gray-50 inline-flex p-6 rounded-full mb-4"><Layers className="text-gray-300" size={32}/></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching sequences found in repository</p>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-cyan-50/20 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0 relative group-hover:scale-110 transition-transform">
                          {member.profileImage ? (
                            <img src={member.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-xl">
                              {member.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-[13px] text-gray-900 uppercase tracking-tight">{member.fullName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${member.gender === 'Male' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{member.gender || 'UNDEFINED'}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-cyan-500 transition-colors"><Calendar size={16} /></div>
                        <span className="text-[11px] font-black text-gray-600 uppercase">{member.academicYear || 'Eternal'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 text-cyan-600 rounded-lg">
                          <Layers size={12} strokeWidth={3} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">{member.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap size={12} className="text-gray-300" />
                          <span className="text-[10px] font-bold text-gray-400 line-clamp-1">{member.program}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg text-red-400"><MapPin size={16} /></div>
                        <span className="text-[11px] font-black text-gray-600 uppercase">{member.diocese}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          <p className="text-[11px] font-black text-gray-900 lowercase">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                          <p className="text-[10px] font-bold text-gray-400">{member.phone}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Sync Status Bar */}
        <div className="bg-gray-50 px-8 py-3 flex items-center justify-between border-t border-gray-100">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Divine Registry Connection: <span className="text-emerald-500">Active</span></p>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Identity Sequences: {members.length}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MembersReportTab;
