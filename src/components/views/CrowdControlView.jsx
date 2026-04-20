import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Activity, DoorOpen, TriangleAlert, Clock, Zap, ArrowRightLeft, Lock, CheckCircle, X
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell 
} from 'recharts';
import { GATES, CROWD_FLOW_DATA, HEATMAP_BLOCKS } from '../../constants';

const CrowdControlView = ({ rtData }) => {
  const { gates: rtGates, flowData: rtFlowData, showToast } = rtData;
  const liveGates = (rtGates && rtGates.length > 0) ? rtGates : GATES;
  const liveFlowData = (rtFlowData && rtFlowData.length > 0) ? rtFlowData : CROWD_FLOW_DATA;

  const [lockedGates, setLockedGates] = useState({});
  const [redirecting, setRedirecting] = useState({});
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const toggleLock = (gateId, gateName) => { 
    setLockedGates(p => { 
      const n = { ...p, [gateId]: !p[gateId] }; 
      showToast(`${gateName} ${n[gateId] ? 'LOCKED' : 'UNLOCKED'}`, n[gateId] ? 'critical' : 'success'); 
      return n; 
    }); 
  };

  const toggleRedirect = (gateId, gateName) => { 
    setRedirecting(p => { 
      const n = { ...p, [gateId]: !p[gateId] }; 
      const t = liveGates.filter(x => x.id !== gateId).reduce((a, b) => a.fill < b.fill ? a : b); 
      showToast(`${gateName} ${n[gateId] ? 'redirecting → ' + t.name : 'redirect off'}`, 'info'); 
      return n; 
    }); 
  };

  const processedGates = useMemo(() => {
    let updated = liveGates.map(g => ({ ...g, displayFill: g.fill }));
    liveGates.forEach(g => {
      if (lockedGates[g.id] && redirecting[g.id]) {
        const idx = updated.findIndex(x => x.id === g.id);
        updated[idx].displayFill = Math.max(8, updated[idx].displayFill - 50);
        const targets = liveGates.filter(x => x.id !== g.id && !lockedGates[x.id]);
        if (targets.length > 0) {
          const target = targets.reduce((a, b) => a.fill < b.fill ? a : b);
          const tIdx = updated.findIndex(x => x.id === target.id);
          updated[tIdx].displayFill = Math.min(98, updated[tIdx].displayFill + 30);
        }
      } else if (lockedGates[g.id]) {
        const idx = updated.findIndex(x => x.id === g.id);
        updated[idx].displayFill = 0;
      }
    });
    return updated;
  }, [liveGates, lockedGates, redirecting]);

  const ALERT_DATA = [
    { id: 'a1', severity: 'Critical', gate: 'Gate 2', desc: 'North East', msg: 'Gate 2 exceeded 85% capacity threshold', ai: '⚠️ Gate 2 at high capacity. Redirect blocks C, D, R, Z to Gate 1 or Gate 8.' },
    { id: 'a2', severity: 'Warning', gate: 'Gate 3', desc: 'East Upper', msg: 'Gate 3 approaching critical threshold', ai: '⚠️ Gate 3 approaching critical. Consider reroute of blocks E, F.' },
    { id: 'a3', severity: 'Warning', gate: 'Gate 8', desc: 'North West', msg: 'Gate 8 approaching critical — monitor closely', ai: '⚠️ Gate 8 moderate-high load. No action required yet.' },
  ];

  const visibleAlerts = ALERT_DATA.filter(a => !dismissedAlerts.includes(a.id));
  const densityVal = Math.round(processedGates.reduce((s, g) => s + g.displayFill, 0) / Math.max(1, processedGates.length));
  const densityColorHex = densityVal >= 85 ? '#EF4444' : densityVal >= 70 ? '#F59E0B' : '#10B981';
  const densityColor = densityVal >= 85 ? 'red-400' : densityVal >= 70 ? 'amber-500' : 'green-400';
  const densityText = densityVal >= 85 ? 'Critical' : densityVal >= 70 ? 'High' : 'Moderate';
  const openGatesCount = liveGates.filter(g => !lockedGates[g.id]).length;
  const avgWait = Math.round(liveGates.filter(g => !lockedGates[g.id]).reduce((s, g) => s + parseInt(g.wait || 0), 0) / Math.max(1, openGatesCount));
  const totalCount = liveGates.reduce((s, g) => s + (g.count || 0), 0);

  return (
    <div className="flex flex-col h-full min-h-0" role="main" aria-label="Crowd Control Dashboard">
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 xl:p-6 space-y-5 max-w-screen-2xl mx-auto w-full">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            <div className="col-span-2 bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none"></div>
              <svg width="72" height="72" viewBox="0 0 72 72" className="flex-shrink-0" aria-hidden="true">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#1E1E1E" strokeWidth="5"></circle>
                <circle cx="36" cy="36" r="28" fill="none" stroke={densityColorHex} strokeWidth="5" strokeDasharray="175.93" strokeLinecap="round" strokeDashoffset={175.93 - (175.93 * densityVal / 100)} className="transition-all duration-1000"></circle>
                <text x="36" y="40" textAnchor="middle" fill={densityColorHex} fontSize="13" fontWeight="700" fontFamily="IBM Plex Mono">{densityVal}%</text>
              </svg>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#555] uppercase tracking-widest mb-1">Venue Occupancy</p>
                <p className="text-3xl font-bold font-mono text-white tabular-nums leading-none">{totalCount.toLocaleString()}</p>
                <p className="text-[12px] text-[#555] mt-1">of 41,600 capacity</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-green-500/10 text-green-400 border-green-500/25">
                    <Activity size={9} /> Normal
                  </span>
                </div>
              </div>
            </div>
            
            <StatCard label="Gates" value={`${openGatesCount}/8`} subValue={openGatesCount === 8 ? 'All open' : openGatesCount === 0 ? 'All closed' : 'Partial closure'} icon={<DoorOpen size={13} />} color={openGatesCount === 0 ? 'red' : 'green'} />
            <StatCard label="Alerts" value={visibleAlerts.length} subValue="Active alerts" icon={<TriangleAlert size={13} />} color="red" />
            <StatCard label="Avg Wait" value={openGatesCount === 0 ? '—' : `${avgWait}m`} subValue={openGatesCount === 0 ? 'No entry allowed' : avgWait >= 10 ? 'High delays' : '✓ On target'} icon={<Clock size={13} />} color={openGatesCount === 0 ? 'stone' : avgWait >= 10 ? 'red' : 'green'} />
            <StatCard label="Density" value={densityVal} subValue={densityText} icon={<Zap size={13} color={densityColorHex} />} color={densityColor} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-7 space-y-5">
              <HeatmapSection heatmapBlocks={HEATMAP_BLOCKS} />
              <ChartsSection flowData={liveFlowData} gatesData={processedGates} lockedGates={lockedGates} />
            </div>
            <div className="xl:col-span-5 space-y-5">
              <GateControlsSection gates={processedGates} lockedGates={lockedGates} redirecting={redirecting} toggleLock={toggleLock} toggleRedirect={toggleRedirect} />
              <AlertsSection alerts={visibleAlerts} onAcknowledge={(msg) => showToast(msg, 'success')} onDismiss={(id, msg) => { setDismissedAlerts(p => [...p, id]); showToast(msg, 'info'); }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for better organization and memoization
const StatCard = React.memo(({ label, value, subValue, icon, color }) => (
  <div className={`bg-[#141414] border border-[#1E1E1E] rounded-2xl p-4 flex flex-col justify-between ${color === 'red' ? 'border-red-500/25' : ''}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-semibold text-[#555] uppercase tracking-widest">{label}</span>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-${color}-500/10 border border-${color}-500/20 border`}>
        {icon}
      </div>
    </div>
    <div>
      <p className={`text-2xl font-bold font-mono text-white tabular-nums ${color === 'red' ? 'text-red-400' : color === 'green' ? 'text-green-400' : ''}`}>{value}</p>
      <p className="text-[11px] text-[#555] mt-0.5">{subValue}</p>
    </div>
  </div>
));

const HeatmapSection = React.memo(({ heatmapBlocks }) => (
  <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
      <div>
        <h2 className="text-[14px] font-semibold text-white">Stadium Block Heatmap</h2>
        <p className="text-[11px] text-[#555] mt-0.5">A–Z blocks · live crowd density per zone</p>
      </div>
    </div>
    <div className="p-5">
      <div className="relative mb-4">
        <div className="relative z-10 space-y-2">
          {heatmapBlocks.map(row => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="text-[9px] text-[#333] font-semibold uppercase tracking-widest w-8 flex-shrink-0 text-right">{row.label}</span>
              <div className={`flex gap-1.5 flex-1 ${row.label === 'VIP' ? 'justify-center' : ''}`}>
                {row.blocks.map(b => (
                  <div key={b.id} className="relative flex-1 max-w-[64px]">
                    <button 
                      aria-label={`Block ${b.id}: ${b.fill}% density`}
                      className={`w-full aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10 relative bg-${b.c}-500/${b.fill > 85 ? '22' : '10'} border-${b.c}-500/${b.fill > 85 ? '55' : '30'} ${b.fill > 85 ? 'pulse-critical' : ''}`}
                    >
                      <span className={`text-[14px] font-bold leading-none text-${b.c}-300`}>{b.id}</span>
                      <span className={`text-[9px] font-mono mt-0.5 opacity-75 text-${b.c}-300`}>{b.fill}%</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

const ChartsSection = React.memo(({ flowData, gatesData, lockedGates }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5">
      <h2 className="text-[14px] font-semibold text-white mb-5">Crowd Flow — Today</h2>
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer>
          <AreaChart data={flowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000) + 'k'} />
            <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 12, fontSize: 12 }} />
            <Area type="monotone" dataKey="G1" stroke="#3B82F6" fillOpacity={0.1} />
            <Area type="monotone" dataKey="G2" stroke="#EF4444" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5">
      <h2 className="text-[14px] font-semibold text-white mb-4">Gate Throughput</h2>
      <div style={{ width: '100%', height: '150px' }}>
        <ResponsiveContainer>
          <BarChart data={gatesData.map(g => ({ name: 'G' + g.id, rate: lockedGates[g.id] ? 0 : g.rate, color: g.displayFill >= 85 ? '#EF4444' : g.displayFill >= 70 ? '#F59E0B' : '#10B981' }))}>
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {gatesData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
));

const GateControlsSection = React.memo(({ gates, lockedGates, redirecting, toggleLock, toggleRedirect }) => (
  <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden">
    <div className="px-5 py-4 border-b border-[#1E1E1E]">
      <h2 className="text-[14px] font-semibold text-white">Gate Capacity</h2>
    </div>
    <div className="divide-y divide-[#191919]">
      {gates.map(g => (
        <div key={g.id} className="px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-white">{g.name}</div>
              <div className={`h-1.5 w-full bg-[#1A1A1A] rounded-full mt-2 overflow-hidden`}>
                <div className={`h-full transition-all duration-700 ${g.displayFill >= 85 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${g.displayFill}%` }}></div>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleRedirect(g.id, g.name)} aria-label={`Redirect Gate ${g.id}`} className={`p-2 rounded-lg border ${redirecting[g.id] ? 'bg-blue-600 border-blue-500' : 'border-[#222]'}`}><ArrowRightLeft size={12} /></button>
              <button onClick={() => toggleLock(g.id, g.name)} aria-label={`Lock Gate ${g.id}`} className={`p-2 rounded-lg border ${lockedGates[g.id] ? 'bg-red-600 border-red-500' : 'border-[#222]'}`}><Lock size={12} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

const AlertsSection = React.memo(({ alerts, onAcknowledge, onDismiss }) => (
  <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
      <h2 className="text-[14px] font-semibold text-white">Active Alerts</h2>
    </div>
    <div className="divide-y divide-[#191919]">
      {alerts.map(a => (
        <div key={a.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="text-[12px] text-white font-semibold">{a.gate} — {a.severity}</div>
            <div className="flex gap-2">
              <button 
                onClick={() => onAcknowledge(`${a.gate} acknowledged`)} 
                className="text-[#555] hover:text-green-500 transition-colors"
                aria-label={`Acknowledge ${a.gate} alert`}
              >
                <CheckCircle size={14} />
              </button>
              <button 
                onClick={() => onDismiss(a.id, `${a.gate} dismissed`)} 
                className="text-[#555] hover:text-red-500 transition-colors"
                aria-label={`Dismiss ${a.gate} alert`}
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-[#777] mt-1">{a.msg}</p>
        </div>
      ))}
    </div>
  </div>
));

CrowdControlView.propTypes = {
  rtData: PropTypes.shape({
    gates: PropTypes.array,
    flowData: PropTypes.array,
    showToast: PropTypes.func.isRequired
  }).isRequired
};

export default CrowdControlView;
