import React from 'react';
import { Settings, Info, Activity, Shield, Bell, PieChart, Users, FileText } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

const ICONS = {
  crowdControl: <Activity size={20} />,
  entryGates: <Users size={20} />,
  alerts: <Bell size={20} />,
  analytics: <PieChart size={20} />,
  security: <Shield size={20} />,
  incidentLog: <FileText size={20} />
};

export default function FeatureCard({ id, name, description, enabled, onToggle, onSettings, loading }) {
  return (
    <div className={`relative group bg-[#141414] border transition-all duration-300 rounded-2xl p-5 ${
      enabled ? 'border-[#1e293b] shadow-lg shadow-blue-500/5' : 'border-[#1e1e1e] opacity-60'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${enabled ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'bg-[#1a1a1a] text-[#444] border border-[#222]'}`}>
          {ICONS[id] || <Info size={20} />}
        </div>
        <ToggleSwitch enabled={enabled} onToggle={onToggle} loading={loading} />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[15px] font-bold text-white tracking-tight">{name}</h3>
          <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
        </div>
        <p className="text-[12px] text-[#555] leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#1e1e1e]">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${enabled ? 'text-green-500/80' : 'text-red-500/80'}`}>
          {enabled ? 'Active' : 'Inactive'}
        </span>
        <button 
          onClick={onSettings}
          disabled={!enabled}
          className="p-2 rounded-lg hover:bg-[#1a1a1a] text-[#444] hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <Settings size={14} />
        </button>
      </div>
    </div>
  );
}
