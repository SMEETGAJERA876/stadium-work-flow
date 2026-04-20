import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Zap } from 'lucide-react';
import ToggleSwitch from '../ToggleSwitch';

const AlertRulesView = ({ showToast }) => {
  const [rules, setRules] = useState([
    { id: 1, name: 'Gate Saturation', trigger: 'Capacity > 85%', action: 'Auto-Reroute', status: 'Active' },
    { id: 2, name: 'Wait Time Alert', trigger: 'Wait > 12m', action: 'Notify Supervisor', status: 'Active' },
    { id: 3, name: 'Block Overflow', trigger: 'Block Density > 90%', action: 'Redirect adjacent', status: 'Inactive' }
  ]);

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
    showToast('Rule updated successfully', 'success');
  };

  return (
    <div className="p-6 space-y-6" role="main" aria-label="Automation Rules">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Automation Rules</h1>
          <p className="text-sm text-[#555]">Configure automatic triggers for crowd redistribution</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-all">
          + Create Rule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rules.map(rule => (
          <div key={rule.id} className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rule.status === 'Active' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-[#1A1A1A] border-[#222]'} border`} aria-hidden="true">
                <Zap size={18} className={rule.status === 'Active' ? 'text-blue-400' : 'text-[#444]'} />
              </div>
              <div>
                <h3 className="font-bold text-white">{rule.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Trigger: <span className="text-blue-400">{rule.trigger}</span></span>
                  <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider">Action: <span className="text-green-400">{rule.action}</span></span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${rule.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{rule.status}</span>
              <ToggleSwitch enabled={rule.status === 'Active'} onToggle={() => toggleRule(rule.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AlertRulesView.propTypes = {
  showToast: PropTypes.func.isRequired
};

export default React.memo(AlertRulesView);
