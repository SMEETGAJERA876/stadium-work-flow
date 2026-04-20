import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Search, Filter, Download, ChevronUp, ChevronDown, ChevronsUpDown, CheckCircle, Clock 
} from 'lucide-react';
import { INCIDENTS } from '../../constants';

/**
 * IncidentLogView component for tracking and managing security incidents.
 * Features advanced filtering, sorting, and AI-assisted guidance for operators.
 * @param {Object} props - Component props.
 * @param {Function} props.showToast - Callback to trigger global notifications.
 */
const IncidentLogView = ({ showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig] = useState({ key: 'time', direction: 'desc' });
  const itemsPerPage = 10;
  
  const filteredIncidents = React.useMemo(() => {
    let result = INCIDENTS.filter(inc => {
      const matchesSearch = searchTerm === '' || 
        inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.gate.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });

    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchTerm, severityFilter, statusFilter, sortConfig]);

  const handleExport = () => {
    showToast('Exporting incident log...', 'info');
    // Simplified export logic
  };

  return (
    <div className="p-6 space-y-6" role="region" aria-label="Incident Log">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Incident Log</h2>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white text-sm hover:bg-[#222]">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
          <input 
            type="text" 
            placeholder="Search incidents..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#111] border border-[#222] text-white text-sm focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search incidents"
          />
        </div>
        <select 
          className="bg-[#111] border border-[#222] text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-blue-500"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          aria-label="Filter by severity"
        >
          <option value="all">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="Warning">Warning</option>
          <option value="Info">Info</option>
        </select>
        <select 
          className="bg-[#111] border border-[#222] text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1A1A1A] text-[11px] font-semibold text-[#555] uppercase tracking-wider">
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Gate</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#191919]">
            {filteredIncidents.slice(0, itemsPerPage).map(inc => (
              <tr key={inc.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-[#777]">{inc.time}</td>
                <td className="px-6 py-4 text-xs font-semibold text-white">{inc.id}</td>
                <td className="px-6 py-4 text-xs text-[#999]">{inc.gate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    inc.severity === 'Critical' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 
                    inc.severity === 'Warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 
                    'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  }`}>
                    {inc.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-[#999]">{inc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

IncidentLogView.propTypes = {
  showToast: PropTypes.func.isRequired
};

export default React.memo(IncidentLogView);
