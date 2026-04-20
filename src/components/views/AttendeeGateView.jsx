import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, MapPin, Users, Activity, ArrowRightLeft } from 'lucide-react';
import { GATES } from '../../constants';

const AttendeeGateView = ({ showToast }) => {
  const [search, setSearch] = useState('');
  const [selectedGate, setSelectedGate] = useState(null);

  const filtered = GATES.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#0A0A0A]" role="main" aria-label="Attendee Gate Finder">
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 xl:p-6 space-y-6 max-w-4xl mx-auto w-full">
          <div className="space-y-2 text-center py-6">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Enter Stadium</h1>
            <p className="text-[#555] text-sm max-w-md mx-auto">Find the nearest gate with the lowest wait time and navigate to your block</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#141414] border border-[#1E1E1E] rounded-2xl p-2 flex items-center gap-3">
              <Search className="ml-3 text-[#444]" size={20} />
              <input 
                type="text"
                placeholder="Find my gate or block (e.g. Gate 1, Block A)..."
                className="w-full bg-transparent border-none py-3 text-white placeholder-[#333] outline-none text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search gates or blocks"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(g => {
              const status = g.fill >= 85 ? 'High' : g.fill >= 70 ? 'Moderate' : 'Low';
              const color = g.fill >= 85 ? 'red' : g.fill >= 70 ? 'amber' : 'green';
              return (
                <button 
                  key={g.id}
                  onClick={() => setSelectedGate(g)}
                  aria-label={`Select ${g.name}, ${g.wait} wait time`}
                  className={`relative group text-left bg-[#141414] border transition-all duration-300 rounded-2xl p-5 ${selectedGate?.id === g.id ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-[#1E1E1E] hover:border-[#333]'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-0.5">{g.name}</h3>
                      <p className="text-xs text-[#555] uppercase font-bold tracking-widest">{g.desc}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-black text-white tabular-nums">{g.wait}</div>
                      <div className="text-[10px] text-[#444] uppercase font-bold">Wait Time</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-[#555]">Current Load</span>
                      <span className={`text-${color}-500 flex items-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-current ${color === 'red' ? 'animate-pulse' : ''}`}></span>
                        {status} Traffic
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-700 bg-gradient-to-r from-${color}-600 to-${color}-400`} style={{width: `${g.fill}%`}}></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1E1E1E] flex items-center justify-between">
                    <div className="flex -space-x-1" aria-hidden="true">
                      {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-[#141414] bg-[#1A1A1A] flex items-center justify-center"><Users size={8} className="text-[#444]" /></div>)}
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Select Gate <ArrowRightLeft size={10} /></span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedGate && (
            <div className="bg-[#141414] border border-blue-500/30 rounded-2xl p-6 animate-in slide-in-from-bottom-4" role="region" aria-label="Gate Directions">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                    <MapPin size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Route to {selectedGate.name}</h2>
                    <p className="text-sm text-[#555]">Optimal path for blocks in {selectedGate.desc}</p>
                  </div>
                </div>
                <button onClick={() => showToast('Directions started', 'info')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-all">Start Directions</button>
              </div>
              <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl p-4 flex items-center justify-center h-48 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="text-center relative z-10">
                  <Activity size={32} className="text-[#222] mx-auto mb-3" />
                  <p className="text-[11px] font-bold text-[#333] uppercase tracking-[0.2em]">Live Map Simulation</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AttendeeGateView.propTypes = {
  showToast: PropTypes.func.isRequired
};

export default React.memo(AttendeeGateView);
