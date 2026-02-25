import React, { useState, useEffect } from 'react';
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

  // Placeholder for future implementation
  const exportToExcel = () => {
    console.log("Exporting to Excel...");
  };

  const exportToPDF = () => {
    console.log("Exporting to PDF...");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Members Report</h1>
      
      {/* Filter UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 bg-gray-100 p-4 rounded-lg">
        <input
          type="text"
          name="name"
          placeholder="Search by name..."
          value={filters.name}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        {/* Add other filters for year, level, etc. here */}
      </div>

      {/* Action Buttons */}
      <div className="mb-4">
        <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Export to Excel</button>
        <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded">Export to PDF</button>
      </div>

      {/* Members Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4">Full Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Academic Year</th>
                <th className="py-2 px-4">Level</th>
                <th className="py-2 px-4">Program</th>
                <th className="py-2 px-4">Diocese</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className="border-b">
                  <td className="py-2 px-4">{member.fullName}</td>
                  <td className="py-2 px-4">{member.email}</td>
                  <td className="py-2 px-4">{member.phone}</td>
                  <td className="py-2 px-4">{member.academicYear}</td>
                  <td className="py-2 px-4">{member.level}</td>
                  <td className="py-2 px-4">{member.program}</td>
                  <td className="py-2 px-4">{member.diocese}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembersReport;
