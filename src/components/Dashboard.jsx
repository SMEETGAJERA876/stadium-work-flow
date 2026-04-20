import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useRealtimeServer } from '../useRealtimeServer';
import { 
  LayoutDashboard, FileText, Users, Bell, Shield, Settings, Activity, 
  ChevronLeft, Radio, TriangleAlert, RefreshCw, Clock, Zap,
  DoorOpen, ArrowRightLeft, Lock, ChevronDown, CheckCircle, X, TrendingUp, Gauge,
  Search, Filter, Download, MessageSquare, ChevronUp, ChevronsUpDown
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, Legend 
} from 'recharts';
import { useFeatures } from '../useFeatures';
import FeatureCard from './FeatureCard';
import ToggleSwitch from './ToggleSwitch';

const CROWD_FLOW_DATA = [
  { time: '14:00', G1: 800, G2: 1200, G3: 1500, G4: 900, G5: 1100, G6: 1800, G7: 700, G8: 1000 },
  { time: '15:00', G1: 1500, G2: 2100, G3: 2400, G4: 1700, G5: 1900, G6: 3200, G7: 1300, G8: 1800 },
  { time: '16:00', G1: 2200, G2: 3200, G3: 3100, G4: 2500, G5: 2800, G6: 4500, G7: 2100, G8: 2600 },
  { time: '17:00', G1: 2800, G2: 4100, G3: 3800, G4: 3100, G5: 3500, G6: 5200, G7: 2900, G8: 3400 },
  { time: '18:00', G1: 3240, G2: 4524, G3: 4316, G4: 3800, G5: 4100, G6: 4732, G7: 3500, G8: 4000 },
];

const GATES = [
  { id: 1, name: 'Gate 1', desc: 'North Main', status: 'Open', color: 'blue', wait: '3m', rate: '42/min', fill: 62, count: '3,240' },
  { id: 2, name: 'Gate 2', desc: 'North East', status: 'Critical', color: 'red', wait: '11m', rate: '28/min', fill: 87, count: '4,524' },
  { id: 3, name: 'Gate 3', desc: 'East Upper', status: 'Warning', color: 'amber', wait: '8m', rate: '31/min', fill: 83, count: '4,316' },
  { id: 4, name: 'Gate 4', desc: 'South East', status: 'Open', color: 'blue', wait: '2m', rate: '55/min', fill: 38, count: '1,976' },
  { id: 5, name: 'Gate 5', desc: 'South Main', status: 'Warning', color: 'amber', wait: '6m', rate: '38/min', fill: 71, count: '3,692' },
  { id: 6, name: 'Gate 6', desc: 'South West', status: 'Critical', color: 'red', wait: '14m', rate: '19/min', fill: 91, count: '4,732', redirect: 'G7' },
  { id: 7, name: 'Gate 7', desc: 'West Lower', status: 'Open', color: 'blue', wait: '1m', rate: '61/min', fill: 33, count: '1,716' },
  { id: 8, name: 'Gate 8', desc: 'North West', status: 'Open', color: 'blue', wait: '4m', rate: '44/min', fill: 58, count: '3,016' },
];

const HEATMAP_BLOCKS = [
  { label: 'North', blocks: [{id:'A', fill:42, c:'emerald'}, {id:'B', fill:55, c:'amber'}, {id:'C', fill:68, c:'amber'}, {id:'D', fill:88, c:'red'}, {id:'E', fill:72, c:'orange'}, {id:'F', fill:91, c:'red'}, {id:'G', fill:35, c:'emerald'}] },
  { label: 'Mid', blocks: [{id:'H', fill:48, c:'emerald'}, {id:'I', fill:63, c:'amber'}, {id:'J', fill:77, c:'orange'}, {id:'K', fill:82, c:'orange'}, {id:'L', fill:94, c:'red'}, {id:'M', fill:29, c:'emerald'}, {id:'N', fill:44, c:'emerald'}] },
  { label: 'South', blocks: [{id:'O', fill:56, c:'amber'}, {id:'P', fill:71, c:'orange'}, {id:'Q', fill:38, c:'emerald'}, {id:'R', fill:86, c:'red'}, {id:'S', fill:67, c:'amber'}, {id:'T', fill:52, c:'amber'}, {id:'U', fill:79, c:'orange'}] },
  { label: 'VIP', blocks: [{id:'V', fill:93, c:'red'}, {id:'W', fill:41, c:'emerald'}, {id:'X', fill:58, c:'amber'}, {id:'Y', fill:33, c:'emerald'}, {id:'Z', fill:75, c:'orange'}] }
];

const INCIDENTS = [
  { id: 'INC-2026-0847', time: '05:38:22', gate: 'Gate 2', blocks: ['C','D','R','Z'], type: 'Overcrowding', severity: 'Critical', fill: '87%', redirect: 'Gate 1, Gate 8', operator: 'M. Okonkwo', status: 'Active', aiMsg: 'Gate 2 (North East) reached 87% capacity. Reroute to Gate 1 and Gate 8 recommended.' },
  { id: 'INC-2026-0846', time: '05:33:47', gate: 'Gate 6', blocks: ['K','L','V'], type: 'Reroute', severity: 'Critical', fill: '91%', redirect: 'Gate 7', operator: 'System (Auto)', status: 'Acknowledged', aiMsg: 'Gate 6 (South West) at 91% — automated reroute to Gate 7 initiated.' },
  { id: 'INC-2026-0845', time: '05:29:14', gate: 'Gate 3', blocks: ['E','F'], type: 'Overcrowding', severity: 'Warning', fill: '79%', redirect: 'Gate 4', operator: 'S. Patel', status: 'Acknowledged', aiMsg: 'Gate 3 (East Upper) approaching threshold at 79%. Recommend reroute blocks E, F to Gate 4.' },
  { id: 'INC-2026-0844', time: '05:21:33', gate: 'Gate 1', blocks: ['B'], type: 'Technical', severity: 'Warning', fill: '58%', redirect: '—', operator: 'T. Ndiaye', status: 'Resolved', aiMsg: 'Gate 1 scanner malfunction detected. Block B temporarily rerouted. Issue resolved by T. Ndiaye.' },
  { id: 'INC-2026-0843', time: '05:17:48', gate: 'Gate 5', blocks: ['U'], type: 'Overcrowding', severity: 'Warning', fill: '71%', redirect: 'Gate 4', operator: 'M. Okonkwo', status: 'Resolved', aiMsg: 'Gate 5 (South Main) reached 71%. Block U redirected to Gate 4 successfully.' },
  { id: 'INC-2026-0842', time: '05:12:09', gate: 'Gate 6', blocks: ['L','V'], type: 'Overcrowding', severity: 'Critical', fill: '84%', redirect: 'Gate 7', operator: 'System (Auto)', status: 'Resolved', aiMsg: 'Gate 6 overcrowding resolved. Automated reroute to Gate 7 completed for blocks L, V.' },
  { id: 'INC-2026-0841', time: '05:08:31', gate: 'Gate 2', blocks: ['D'], type: 'Security', severity: 'Warning', fill: '62%', redirect: 'Gate 1', operator: 'R. Vasquez', status: 'Resolved', aiMsg: 'Security incident at Gate 2. Block D access restricted. Resolved by R. Vasquez.' },
  { id: 'INC-2026-0840', time: '05:03:55', gate: 'Gate 8', blocks: ['P'], type: 'Overcrowding', severity: 'Info', fill: '58%', redirect: '—', operator: 'System (Monitor)', status: 'Resolved', aiMsg: 'Gate 8 moderate load at 58%. No action required — monitoring continues.' },
  { id: 'INC-2026-0839', time: '04:58:17', gate: 'Gate 3', blocks: ['F','S'], type: 'Reroute', severity: 'Warning', fill: '74%', redirect: 'Gate 4', operator: 'S. Patel', status: 'Resolved', aiMsg: 'Gate 3 blocks F, S rerouted to Gate 4 due to rising occupancy.' },
  { id: 'INC-2026-0838', time: '04:52:44', gate: 'Gate 7', blocks: ['M','N'], type: 'Technical', severity: 'Info', fill: '45%', redirect: '—', operator: 'T. Ndiaye', status: 'Resolved', aiMsg: 'Gate 7 turnstile calibration completed. No crowd impact observed.' },
  { id: 'INC-2026-0837', time: '04:47:05', gate: 'Gate 4', blocks: ['G','H'], type: 'Overcrowding', severity: 'Warning', fill: '76%', redirect: 'Gate 7', operator: 'M. Okonkwo', status: 'Resolved', aiMsg: 'Gate 4 (South East) reaching 76%. Blocks G, H diverted to Gate 7.' },
  { id: 'INC-2026-0836', time: '04:41:28', gate: 'Gate 1', blocks: ['A','B'], type: 'Security', severity: 'Info', fill: '52%', redirect: '—', operator: 'R. Vasquez', status: 'Resolved', aiMsg: 'Routine security sweep at Gate 1. No irregularities found.' },
  { id: 'INC-2026-0835', time: '04:31:08', gate: 'Gate 5', blocks: ['I','J'], type: 'Gate Closure', severity: 'Critical', fill: '88%', redirect: 'Gate 4', operator: 'System (Auto)', status: 'Resolved', aiMsg: 'Gate 5 temporarily closed due to 88% saturation. All traffic redirected to Gate 4.' },
  { id: 'INC-2026-0834', time: '04:22:36', gate: 'Gate 8', blocks: ['O','P'], type: 'Overcrowding', severity: 'Warning', fill: '69%', redirect: 'Gate 7', operator: 'System (Monitor)', status: 'Resolved', aiMsg: 'Gate 8 occupancy at 69%. Preventive reroute of blocks O, P to Gate 7.' },
  { id: 'INC-2026-0833', time: '04:15:02', gate: 'Gate 2', blocks: ['C'], type: 'Reroute', severity: 'Info', fill: '55%', redirect: 'Gate 1', operator: 'S. Patel', status: 'Resolved', aiMsg: 'Planned reroute of block C from Gate 2 to Gate 1 executed smoothly.' },
];

const RealtimeContext = createContext(null);
function useRealtime() { return useContext(RealtimeContext); }

function CustomDropdown({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || { label: placeholder || value, value };

  return (
    <div className="dropdown-container" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-trigger ${isOpen || value !== 'all' ? 'border-blue-500/50 text-blue-400' : ''}`}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : 'text-[#555]'}`} />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <div 
              key={opt.value} 
              className={`dropdown-item ${value === opt.value ? 'dropdown-item-active' : ''}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null); 
  const [toast, setToast] = useState(null);
  const [installProgress, setInstallProgress] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const rt = useRealtimeServer();
  const { features, toggleFeature, loading: featuresLoading } = useFeatures();

  const showToast = (msg, type='warning') => { setToast({msg, type}); setTimeout(() => setToast(null), 4000); };

  const handleInstallApp = () => {
    setInstallProgress(0);
    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setInstallProgress(null);
            showToast('Application installed successfully!', 'success');
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };


  // Auto-redirect if current feature is disabled
  useEffect(() => {
    const path = location.pathname.substring(1);
    const featureMap = {
      'crowd-control-dashboard': 'crowdControl',
      'incident-log': 'incidentLog',
      'attendee-gate-view': 'entryGates',
      'alert-rules': 'alerts',
      'security': 'security'
    };
    
    const featureId = featureMap[path];
    if (featureId && features[featureId] === false) {
      navigate('/');
      setTimeout(() => showToast('Module deactivated by system administrator.', 'warning'), 0);
    }
  }, [location.pathname, features, navigate]);

  if (!user) {
    return (
      <LoginView onLogin={(u) => { setUser(u); navigate('/crowd-control-dashboard'); }} />
    );
  }

  const isUser = user.role === 'user';

  return (
    <RealtimeContext.Provider value={{ ...rt, user, showToast, features, toggleFeature, featuresLoading }}>
    <div className={`flex h-screen bg-main overflow-hidden text-main font-sans ${rt.settings?.theme === 'light' ? 'theme-light' : ''}`}>
      {/* Connection indicator */}
      {!rt.connected && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center text-xs py-1 font-mono animate-pulse">
          ⚠ Connecting to StadiumFlow Realtime Server…
        </div>
      )}
      {/* Sidebar */}
      <aside className={`relative flex flex-col h-full border-r border-main bg-side transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-[220px]' : 'w-[70px]'}`}>
        <div className="flex items-center h-16 px-3 border-b border-[#1E1E1E] overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-blue-600/30 text-blue-400 font-bold text-xs flex-shrink-0 border border-blue-500/40">
              <Activity size={14} />
            </div>
            {isSidebarOpen && <span className="font-semibold text-[15px] text-white whitespace-nowrap tracking-tight">StadiumFlow</span>}
          </div>
        </div>

        {isSidebarOpen && (
          <div className="mx-3 mt-3 mb-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0D2B1A] border border-[#1A4A2E]">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${rt.connected ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${rt.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className={`text-[11px] font-medium tracking-wide ${rt.connected ? 'text-green-400' : 'text-red-400'}`}>{rt.connected ? 'LIVE — Event Active' : 'DISCONNECTED'}</span>
          </div>
        )}

        <nav className="flex-1 px-2 pt-3 overflow-hidden">
          {isSidebarOpen && <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-[#444] uppercase">Operations</p>}
          <ul className="space-y-0.5">
            {!isUser && (
              <>
                {features.crowdControl && (
                  <li>
                    <button onClick={() => navigate('/crowd-control-dashboard')} className={`btn-sidebar ${location.pathname === '/crowd-control-dashboard' ? 'btn-sidebar-active' : 'btn-sidebar-inactive'}`}>
                      <LayoutDashboard size={18} className="flex-shrink-0" />
                      {isSidebarOpen && (
                        <>
                          <span className="flex-1 whitespace-nowrap text-left">Crowd Control</span>
                          <span className="flex-shrink-0 text-[10px] font-bold bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/30 rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </>
                      )}
                    </button>
                  </li>
                )}
                {features.incidentLog && (
                  <li>
                    <button onClick={() => navigate('/incident-log')} className={`btn-sidebar ${location.pathname === '/incident-log' ? 'btn-sidebar-active' : 'btn-sidebar-inactive'}`}>
                      <FileText size={18} className="flex-shrink-0" />
                      {isSidebarOpen && <span className="flex-1 whitespace-nowrap text-left">Incident Log</span>}
                    </button>
                  </li>
                )}
              </>
            )}
            {features.entryGates && (
              <li>
                <button onClick={() => navigate('/attendee-gate-view')} className={`btn-sidebar ${location.pathname === '/attendee-gate-view' ? 'btn-sidebar-active' : 'btn-sidebar-inactive'}`}>
                  <Users size={18} className="flex-shrink-0" />
                  {isSidebarOpen && <span className="flex-1 whitespace-nowrap text-left">Attendee View</span>}
                </button>
              </li>
            )}
          </ul>

          <div className="mt-6 border-t border-[#1E1E1E] pt-6">
            {isSidebarOpen && <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-[#444] uppercase">System</p>}
            <ul className="space-y-0.5">
              {features.alerts && <li><button onClick={() => navigate('/alert-rules')} className={`btn-sidebar ${location.pathname === '/alert-rules' ? 'btn-sidebar-active' : 'btn-sidebar-inactive'}`}><Bell size={18} className="flex-shrink-0" />{isSidebarOpen && <span>Alert Rules</span>}</button></li>}
              {features.security && <li><button onClick={() => navigate('/security')} className={`btn-sidebar ${location.pathname === '/security' ? 'btn-sidebar-active' : 'btn-sidebar-inactive'}`}><Shield size={18} className="flex-shrink-0" />{isSidebarOpen && <span>Security</span>}</button></li>}
              <li><button onClick={() => navigate('/settings')} className={`btn-sidebar ${location.pathname === '/settings' ? 'btn-sidebar-active' : 'btn-sidebar-inactive'}`}><Settings size={18} className="flex-shrink-0" />{isSidebarOpen && <span>Settings</span>}</button></li>
            </ul>
          </div>
        </nav>

        <div className="border-t border-[#1E1E1E] p-3">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={logout} title="Click to logout">
            <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-600/40 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/30 group-hover:border-red-500/40 transition-all">
              <X size={13} className="text-blue-400 group-hover:text-red-400" />
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-[#555] truncate uppercase tracking-wider">{user.role}</p>
              </div>
            )}
          </div>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn-circular absolute -right-3 top-[72px] z-10 w-6 h-6 text-[#666] hover:text-white">
          <ChevronLeft size={12} className={isSidebarOpen ? '' : 'rotate-180'} />
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header with Install Button */}
        <header className="h-14 border-b border-[#1E1E1E] bg-[#111111]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-[14px] font-bold text-white uppercase tracking-wider">
              {location.pathname === '/' ? 'Overview' : location.pathname.substring(1).replace(/-/g, ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleInstallApp}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Download size={14} />
              Install App
            </button>
          </div>
        </header>

        {installProgress !== null && (
          <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-white/10 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_#3B82F6]" style={{ width: `${installProgress}%` }}></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[11px] font-mono text-blue-400 shadow-2xl">
              Downloading App Assets... {installProgress}%
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Navigate to={isUser ? "/attendee-gate-view" : "/crowd-control-dashboard"} replace />} />
          <Route path="/crowd-control-dashboard" element={isUser ? <Navigate to="/attendee-gate-view" /> : <CrowdControlView />} />
          <Route path="/incident-log" element={isUser ? <Navigate to="/attendee-gate-view" /> : <IncidentLogView />} />
          <Route path="/attendee-gate-view" element={<AttendeeGateView />} />
          <Route path="/alert-rules" element={<AlertRulesView />} />
          <Route path="/security" element={<SecurityView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>

        {toast && (
          <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl animate-[slideUp_0.3s_ease-out] text-[13px] font-medium ${
            toast.type === 'critical' ? 'bg-red-950 border-red-500/40 text-red-300' :
            toast.type === 'success' ? 'bg-green-950 border-green-500/40 text-green-300' :
            toast.type === 'info' ? 'bg-blue-950 border-blue-500/40 text-blue-300' :
            'bg-amber-950 border-amber-500/40 text-amber-300'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <TriangleAlert size={16} />}
            <span>{toast.msg}</span>
          </div>
        )}
      </main>
    </div>
    </RealtimeContext.Provider>
  );
}

function CrowdControlView() {
  const { gates: rtGates, flowData: rtFlowData, showToast } = useRealtime();
  const liveGates = (rtGates && rtGates.length > 0) ? rtGates : GATES;
  const liveFlowData = (rtFlowData && rtFlowData.length > 0) ? rtFlowData : CROWD_FLOW_DATA;


  const [lockedGates, setLockedGates] = React.useState({});
  const [redirecting, setRedirecting] = React.useState({});
  const [dismissedAlerts, setDismissedAlerts] = React.useState([]);

  const toggleLock = (gateId, gateName) => { setLockedGates(p => { const n={...p,[gateId]:!p[gateId]}; showToast(`${gateName} ${n[gateId]?'LOCKED':'UNLOCKED'}`, n[gateId]?'critical':'success'); return n; }); };
  const toggleRedirect = (gateId, gateName) => { setRedirecting(p => { const n={...p,[gateId]:!p[gateId]}; const t=liveGates.filter(x=>x.id!==gateId).reduce((a,b)=>a.fill<b.fill?a:b); showToast(`${gateName} ${n[gateId]?'redirecting → '+t.name:'redirect off'}`, 'info'); return n; }); };

  const processedGates = React.useMemo(() => {
    let updated = liveGates.map(g => ({ ...g, displayFill: g.fill }));
    
    // First pass: identify redirects
    liveGates.forEach(g => {
      if (lockedGates[g.id] && redirecting[g.id]) {
        const idx = updated.findIndex(x => x.id === g.id);
        // Reduce fill for locked/redirected gate
        updated[idx].displayFill = Math.max(8, updated[idx].displayFill - 50);
        
        // Find best target (lowest current fill among non-locked gates)
        const targets = liveGates.filter(x => x.id !== g.id && !lockedGates[x.id]);
        if (targets.length > 0) {
          const target = targets.reduce((a, b) => a.fill < b.fill ? a : b);
          const tIdx = updated.findIndex(x => x.id === target.id);
          // Increase fill for target gate
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
    { id:'a1', severity:'Critical', gate:'Gate 2', desc:'North East', msg:'Gate 2 exceeded 85% capacity threshold', ai:'⚠️ Gate 2 at high capacity. Redirect blocks C, D, R, Z to Gate 1 or Gate 8.' },
    { id:'a2', severity:'Warning', gate:'Gate 3', desc:'East Upper', msg:'Gate 3 approaching critical threshold', ai:'⚠️ Gate 3 approaching critical. Consider reroute of blocks E, F.' },
    { id:'a3', severity:'Warning', gate:'Gate 8', desc:'North West', msg:'Gate 8 approaching critical — monitor closely', ai:'⚠️ Gate 8 moderate-high load. No action required yet.' },
  ];

  const visibleAlerts = ALERT_DATA.filter(a => !dismissedAlerts.includes(a.id));
  const liveCritAlerts = visibleAlerts.filter(a => a.severity === 'Critical').length;
  
  const densityVal = Math.round(processedGates.reduce((s, g) => s + g.displayFill, 0) / Math.max(1, processedGates.length));
  const densityColor = densityVal >= 85 ? 'red-400' : densityVal >= 70 ? 'amber-500' : 'green-400';
  const densityColorHex = densityVal >= 85 ? '#EF4444' : densityVal >= 70 ? '#F59E0B' : '#10B981';
  const densityText = densityVal >= 85 ? 'Critical' : densityVal >= 70 ? 'High' : 'Moderate';
  const openGatesCount = liveGates.filter(g => !lockedGates[g.id]).length;
  const avgWait = Math.round(liveGates.filter(g => !lockedGates[g.id]).reduce((s, g) => s + parseInt(g.wait||0), 0) / Math.max(1, openGatesCount));
  
  const totalCount = liveGates.reduce((s, g) => s + (g.count || 0), 0);
  const critCount = processedGates.filter(g => g.displayFill >= 85).length;

  useEffect(() => {
    const t = setInterval(() => { }, 1000);
    return () => clearInterval(t);
  }, []);


  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 xl:p-6 space-y-5 max-w-screen-2xl mx-auto w-full">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            <div className="col-span-2 bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none"></div>
              <svg width="72" height="72" viewBox="0 0 72 72" className="flex-shrink-0">
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
            
            <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-[#555] uppercase tracking-widest">Gates</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${openGatesCount === 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'} border`}><DoorOpen size={13} className={openGatesCount === 0 ? 'text-red-400' : 'text-green-400'} /></div>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white tabular-nums">{openGatesCount}<span className="text-[#444] text-lg">/8</span></p>
                <p className="text-[11px] text-[#555] mt-0.5"><span className={openGatesCount === 8 ? 'text-green-400' : openGatesCount === 0 ? 'text-red-400' : 'text-amber-400'}>{openGatesCount === 8 ? 'All open' : openGatesCount === 0 ? 'All closed' : 'Partial closure'}</span></p>
              </div>
            </div>

            <div className="bg-[#141414] border rounded-2xl p-4 flex flex-col justify-between border-red-500/25">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-[#555] uppercase tracking-widest">Alerts</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/20"><TriangleAlert size={13} className="text-red-400" /></div>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono tabular-nums text-red-400">{visibleAlerts.length}</p>
                <p className="text-[11px] text-[#555] mt-0.5">Active alerts</p>
              </div>
            </div>

            <div className="bg-[#141414] border rounded-2xl p-4 flex flex-col justify-between border-[#1E1E1E]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-[#555] uppercase tracking-widest">Avg Wait</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${openGatesCount === 0 ? 'bg-[#1a1a1a] border-[#333]' : avgWait >= 10 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}><Clock size={13} className={openGatesCount === 0 ? 'text-[#666]' : avgWait >= 10 ? 'text-red-400' : 'text-green-400'} /></div>
              </div>
              <div>
                <p className={`text-2xl font-bold font-mono tabular-nums ${openGatesCount === 0 ? 'text-[#666]' : avgWait >= 10 ? 'text-red-400' : 'text-green-400'}`}>{openGatesCount === 0 ? '—' : avgWait}<span className="text-[14px] font-medium ml-0.5">{openGatesCount === 0 ? '' : 'm'}</span></p>
                <p className="text-[11px] mt-0.5 text-green-500/70">{openGatesCount === 0 ? 'No entry allowed' : avgWait >= 10 ? 'High delays' : '✓ On target'}</p>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-[#555] uppercase tracking-widest">Density</span>
                <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-[#222] flex items-center justify-center"><Zap size={13} color={densityColorHex} /></div>
              </div>
              <div>
                <p className={`text-2xl font-bold font-mono tabular-nums text-${densityColor}`}>{densityVal}</p>
                <p className="text-[11px] text-[#555] mt-0.5">{densityText}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-7 space-y-5">
              <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                  <div>
                    <h2 className="text-[14px] font-semibold text-white">Stadium Block Heatmap</h2>
                    <p className="text-[11px] text-[#555] mt-0.5">A–Z blocks · live crowd density per zone</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5 pulse-critical">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>5 critical
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5">
                      6 high
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="relative mb-4">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-0">
                      <div className="w-[200px] h-[52px] rounded-[50%] border border-dashed border-[#252525] flex items-center justify-center">
                        <span className="text-[9px] text-[#2a2a2a] font-semibold tracking-[0.2em] uppercase">Pitch</span>
                      </div>
                    </div>
                    <div className="relative z-10 space-y-2">
                      {HEATMAP_BLOCKS.map(row => (
                        <div key={row.label} className="flex items-center gap-2">
                          <span className="text-[9px] text-[#333] font-semibold uppercase tracking-widest w-8 flex-shrink-0 text-right">{row.label}</span>
                          <div className={`flex gap-1.5 flex-1 ${row.label === 'VIP' ? 'justify-center' : ''}`}>
                            {row.blocks.map(b => (
                              <div key={b.id} className="relative flex-1 max-w-[64px]">
                                <button className={`w-full aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10 relative bg-${b.c}-500/${b.fill > 85 ? '22' : '10'} border-${b.c}-500/${b.fill > 85 ? '55' : '30'} ${b.fill > 85 ? 'pulse-critical shadow-red-500/15' : ''}`}>
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
                  <div className="flex items-center gap-4 pt-3 border-t border-[#1A1A1A]">
                    <span className="text-[10px] text-[#444] uppercase tracking-wider">Density</span>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-400"></span><span className="text-[10px] text-[#555] capitalize">low</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-400"></span><span className="text-[10px] text-[#555] capitalize">moderate</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-orange-400"></span><span className="text-[10px] text-[#555] capitalize">high</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-400"></span><span className="text-[10px] text-[#555] capitalize">critical</span></div>
                    </div>
                    <div className="h-2 w-24 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500/60 via-amber-500/60 via-orange-500/60 to-red-500/60"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-[14px] font-semibold text-white">Crowd Flow — Today</h2>
                      <p className="text-[11px] text-[#555] mt-0.5">Cumulative attendees through critical gates</p>
                    </div>
                    {critCount > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1.5">
                        <TrendingUp size={10} /> {liveGates.filter(g=>g.fill>=85).map(g=>g.name).join(' & ')} at risk ↑
                      </div>
                    )}
                  </div>
                  <div style={{width:'100%', height:'220px'}}>
                    <ResponsiveContainer>
                      <AreaChart data={liveFlowData}>
                        <defs>
                          <linearGradient id="g1Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                          <linearGradient id="g2Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#EF4444" stopOpacity={0}/></linearGradient>
                          <linearGradient id="g3Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/><stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/></linearGradient>
                          <linearGradient id="g4Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                          <linearGradient id="g5Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366F1" stopOpacity={0}/></linearGradient>
                          <linearGradient id="g6Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/><stop offset="95%" stopColor="#A855F7" stopOpacity={0}/></linearGradient>
                          <linearGradient id="g7Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/><stop offset="95%" stopColor="#EC4899" stopOpacity={0}/></linearGradient>
                          <linearGradient id="g8Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/><stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
                        <XAxis dataKey="time" tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v => (v/1000)+'k'} />
                        <Tooltip 
                          contentStyle={{background:'#111', border:'1px solid #222', borderRadius:12, fontSize:12, boxShadow:'0 10px 15px -3px rgba(0,0,0,0.5)'}}
                          itemStyle={{fontSize:11, padding:'2px 0'}}
                        />
                        <Legend iconType="circle" wrapperStyle={{paddingTop: 10, fontSize:10}} />
                        <Area type="monotone" dataKey="G1" name="Gate 1" stroke="#3B82F6" fill="url(#g1Grad)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="G2" name="Gate 2" stroke="#EF4444" fill="url(#g2Grad)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="G3" name="Gate 3" stroke="#F59E0B" fill="url(#g3Grad)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="G4" name="Gate 4" stroke="#10B981" fill="url(#g4Grad)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="G5" name="Gate 5" stroke="#6366F1" fill="url(#g5Grad)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="G6" name="Gate 6" stroke="#A855F7" fill="url(#g6Grad)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="G7" name="Gate 7" stroke="#EC4899" fill="url(#g7Grad)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="G8" name="Gate 8" stroke="#14B8A6" fill="url(#g8Grad)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-[14px] font-semibold text-white">Gate Throughput</h2>
                      <p className="text-[11px] text-[#555] mt-0.5">Attendees / min · per gate</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#555] uppercase tracking-wider">Avg</p>
                      <p className="text-[13px] font-mono font-bold text-white">{Math.round(liveGates.reduce((s,g)=>s+g.rate,0)/liveGates.length)}<span className="text-[#555] text-[10px] ml-0.5">/min</span></p>
                    </div>
                  </div>
                  <div style={{width:'100%', height:'150px'}}>
                    <ResponsiveContainer>
                      <BarChart data={processedGates.map(g => ({name:'G'+g.id, rate:lockedGates[g.id] ? 0 : g.rate, fill:g.displayFill, isLocked:lockedGates[g.id]}))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
                        <XAxis dataKey="name" tick={{fill:'#888',fontSize:10}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#1E1E1E'}} contentStyle={{background:'#1A1A1A',border:'1px solid #2a2a2a',borderRadius:8,color:'#fff',fontSize:12}} itemStyle={{color:'#fff', fontWeight:'bold'}} labelStyle={{color:'#aaa', marginBottom:4}} formatter={(v) => [v+'/min','Rate']} />
                        <Bar dataKey="rate" radius={[4,4,0,0]} animationDuration={500}>
                          {processedGates.map((g, i) => (
                            <Cell key={i} fill={lockedGates[g.id] ? '#78716c' : g.displayFill >= 85 ? '#EF4444' : g.displayFill >= 70 ? '#F59E0B' : '#10B981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1A1A1A]">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-400"></span><span className="text-[10px] text-[#555]">Open</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-400"></span><span className="text-[10px] text-[#555]">Warning</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-400"></span><span className="text-[10px] text-[#555]">Critical</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-5 space-y-5">
              <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Gauge size={14} className="text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-[14px] font-semibold text-white">Gate Capacity</h2>
                      <p className="text-[11px] text-[#555]">Real-time fill · manual controls</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#555]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>Live
                  </div>
                </div>
                <div className="divide-y divide-[#191919]">
                  {processedGates.map(g => {
                    const isLocked = lockedGates[g.id];
                    const color = isLocked ? 'stone' : g.displayFill >= 85 ? 'red' : g.displayFill >= 70 ? 'amber' : 'green';
                    const status = isLocked ? 'Locked' : g.displayFill >= 85 ? 'Critical' : g.displayFill >= 70 ? 'Warning' : 'Open';
                    return (
                    <div key={g.id} className={`px-5 py-3 transition-all duration-500 ${g.displayFill >= 85 ? 'bg-red-500/5' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-[72px] flex-shrink-0">
                          <div className="text-[13px] font-semibold text-white">{g.name}</div>
                          <div className="text-[10px] text-[#555] truncate">{g.desc}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`badge-status badge-${color} ${status === 'Critical' ? 'pulse-critical' : ''}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>{status}
                              </span>
                              {redirecting[g.id] && <span className="text-[10px] text-blue-400 font-mono">→ {liveGates.filter(x=>x.id!==g.id).reduce((a,b)=>a.fill<b.fill?a:b).name}</span>}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-[#555]">
                              <span>{isLocked ? '—' : g.wait} wait</span><span className="text-[#333]">·</span><span>{isLocked ? '0' : g.rate}/min</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r from-${color}-600 to-${color}-400`} style={{width: `${g.displayFill}%`}}></div>
                            </div>
                            <span className={`text-[11px] font-mono font-bold tabular-nums w-8 text-right text-${color}-400`}>{Math.round(g.displayFill)}%</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-[10px] font-mono text-[#444]">{(g.count || 0).toLocaleString()} in</span>
                            <span className="text-[10px] font-mono text-[#444]">cap 5,200</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button onClick={() => toggleRedirect(g.id, g.name)} className={`btn-premium flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-medium border ${redirecting[g.id] ? 'bg-blue-600/30 text-blue-300 border-blue-500/50' : 'bg-blue-600/10 text-blue-400 border-blue-600/25 hover:bg-blue-600/20'}`}>
                            <ArrowRightLeft size={11} /><ChevronDown size={9} />
                          </button>
                          <button onClick={() => toggleLock(g.id, g.name)} className={`btn-premium p-1.5 rounded-xl border ${lockedGates[g.id] ? 'bg-red-600/30 text-red-300 border-red-500/50' : 'bg-red-600/10 text-red-400 border-red-600/25 hover:bg-red-600/20'}`}>
                            <Lock size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>


              <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-500/15 border border-red-500/30">
                      <Bell size={14} className="text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-[14px] font-semibold text-white">Active Alerts</h2>
                      <p className="text-[11px] text-[#555]">AI-generated reroute recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {liveCritAlerts > 0 && <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 rounded-full px-2 py-0.5 pulse-critical">{liveCritAlerts} critical</span>}
                    <span className="text-[10px] font-semibold text-[#666] bg-[#1A1A1A] border border-[#222] rounded-full px-2 py-0.5">{visibleAlerts.length} total</span>
                  </div>
                </div>
                <div className="divide-y divide-[#191919]">
                  {visibleAlerts.map(a => {
                    const ac = a.severity === 'Critical' ? 'red' : 'amber';
                    return (
                      <div key={a.id} className={`relative transition-all duration-200 ${ac === 'red' ? 'bg-red-500/5' : ''}`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-${ac}-500`}></div>
                        <div className="px-5 py-3.5 pl-6">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`badge-status badge-${ac} uppercase`}>{a.severity}</span>
                                <span className="text-[12px] font-semibold text-white">{a.gate} — {a.desc}</span>
                              </div>
                              <p className="text-[11px] text-[#777]">{a.msg}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => showToast(`${a.gate} alert acknowledged`, 'success')} className="btn-ghost p-1.5 rounded-xl hover:text-amber-400 hover:bg-amber-500/10" title="Acknowledge"><CheckCircle size={13} /></button>
                              <button onClick={() => { setDismissedAlerts(p => [...p, a.id]); showToast(`${a.gate} alert dismissed`, 'info'); }} className="btn-ghost p-1.5 rounded-xl hover:text-red-400 hover:bg-red-500/10" title="Dismiss"><X size={13} /></button>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-[#1E1E1E]">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Zap size={10} className="text-blue-400" />
                              <span className="text-[10px] font-semibold text-blue-400 uppercase">AI Recommendation</span>
                            </div>
                            <p className="text-[11px] text-[#999] leading-relaxed bg-[#0F0F0F] rounded-xl px-3 py-2.5 border border-[#1A1A1A]">{a.ai}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {visibleAlerts.length === 0 && <div className="px-5 py-8 text-center text-[#555] text-sm">All alerts dismissed ✓</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncidentLogView() {
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gateFilter, setGateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'time', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const [exportToast, setExportToast] = useState(false);
  const itemsPerPage = 10;
  
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  
  const filteredIncidents = React.useMemo(() => {
    let result = INCIDENTS.filter(inc => {
      const matchesSearch = searchTerm === '' || 
        inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.gate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
      const matchesGate = gateFilter === 'all' || inc.gate === gateFilter;
      const matchesType = typeFilter === 'all' || inc.type === typeFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesGate && matchesType;
    });

    // Sorting
    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchTerm, severityFilter, statusFilter, gateFilter, typeFilter, sortConfig]);

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const paginatedIncidents = filteredIncidents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isFiltered = searchTerm !== '' || severityFilter !== 'all' || statusFilter !== 'all' || gateFilter !== 'all' || typeFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setSeverityFilter('all');
    setStatusFilter('all');
    setGateFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  const handleExport = () => {
    const headers = ['Timestamp', 'Incident ID', 'Gate', 'Blocks', 'Type', 'Severity', 'Fill %', 'Redirect To', 'Operator', 'Status'];
    const rows = filteredIncidents.map(inc => [
      inc.time, inc.id, inc.gate, inc.blocks.join(', '), inc.type, inc.severity, inc.fill, inc.redirect, inc.operator, inc.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `incident_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportToast(true);
    setTimeout(() => setExportToast(false), 4000);
  };

  const handleMarkResolved = () => {
    // In a real app, we'd send these to the server
    // For now, we simulate the server response or just show success
    setExportToast({ msg: `${selectedIncidents.length} incidents marked as resolved.`, type: 'success' });
    setSelectedIncidents([]);
    // If connected, we'd loop through and send RESOLVE_INCIDENT
    // selectedIncidents.forEach(id => rt.send('RESOLVE_INCIDENT', { incidentId: id }));
  };

  const toggleSelection = (id) => {
    setSelectedIncidents(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIncidents.length === paginatedIncidents.length && paginatedIncidents.length > 0) setSelectedIncidents([]);
    else setSelectedIncidents(paginatedIncidents.map(inc => inc.id));
  };

  const getSeverityColor = (sev) => {
    switch(sev) {
      case 'Critical': return 'red';
      case 'Warning': return 'amber';
      case 'Info': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (stat) => {
    switch(stat) {
      case 'Active': return 'red';
      case 'Acknowledged': return 'amber';
      case 'Resolved': return 'green';
      default: return 'gray';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Overcrowding': return 'red';
      case 'Reroute': return 'blue';
      case 'Technical': return 'amber';
      case 'Security': return 'purple';
      case 'Gate Closure': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 relative view-enter view-enter-active">
      <header className="h-14 border-b border-[#1E1E1E] bg-[#111111]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-[15px] font-semibold text-white leading-none">Incident Log</h1>
            <p className="text-[11px] text-[#555] mt-0.5">Full audit trail — all gates, all events</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D1F0D] border border-[#1A3A1A]">
            <Radio size={11} className="text-green-500 animate-pulse" />
            <span className="text-[11px] font-medium text-green-400">LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg badge-red pulse-critical">
            <TriangleAlert size={13} className="text-red-400" />
            <span className="text-[12px] font-semibold">1 Active Alert</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#555]">
            <Clock size={11} />
            <span className="font-mono text-[#888]"></span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-5 xl:p-6 max-w-screen-2xl mx-auto w-full space-y-4">
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] text-[#666]">Total Incidents</span>
            <span className="text-xl font-bold font-mono tabular-nums text-white">{INCIDENTS.length}</span>
          </div>
          <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] text-[#666]">Active</span>
            <span className="text-xl font-bold font-mono tabular-nums text-red-400">{INCIDENTS.filter(i=>i.status==='Active').length}</span>
          </div>
          <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] text-[#666]">Acknowledged</span>
            <span className="text-xl font-bold font-mono tabular-nums text-amber-400">{INCIDENTS.filter(i=>i.status==='Acknowledged').length}</span>
          </div>
          <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] text-[#666]">Resolved</span>
            <span className="text-xl font-bold font-mono tabular-nums text-green-400">{INCIDENTS.filter(i=>i.status==='Resolved').length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={14} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search incidents, gates, operators..." 
                className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#2a2a2a] rounded-lg text-[13px] text-white placeholder-[#444] focus:outline-none focus:border-blue-600/50 transition-colors" 
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="text-[#555]" size={13} />
              <CustomDropdown 
                value={severityFilter} 
                onChange={setSeverityFilter}
                options={[
                  { label: 'All Severities', value: 'all' },
                  { label: 'Critical', value: 'Critical' },
                  { label: 'Warning', value: 'Warning' },
                  { label: 'Info', value: 'Info' },
                ]}
              />
              <CustomDropdown 
                value={statusFilter} 
                onChange={setStatusFilter}
                options={[
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Active', value: 'Active' },
                  { label: 'Acknowledged', value: 'Acknowledged' },
                  { label: 'Resolved', value: 'Resolved' },
                ]}
              />
              <CustomDropdown 
                value={gateFilter} 
                onChange={setGateFilter}
                options={[
                  { label: 'All Gates', value: 'all' },
                  ...[...new Set(INCIDENTS.map(i => i.gate))].sort().map(g => ({ label: g, value: g }))
                ]}
              />
              <CustomDropdown 
                value={typeFilter} 
                onChange={setTypeFilter}
                options={[
                  { label: 'All Types', value: 'all' },
                  { label: 'Overcrowding', value: 'Overcrowding' },
                  { label: 'Reroute', value: 'Reroute' },
                  { label: 'Technical', value: 'Technical' },
                  { label: 'Security', value: 'Security' },
                  { label: 'Gate Closure', value: 'Gate Closure' },
                ]}
              />
              
              {isFiltered && (
                <button 
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600/10 border border-blue-600/20 text-[12px] text-blue-400 hover:bg-blue-600/20 transition-all animate-in fade-in zoom-in duration-200"
                >
                  <X size={13} /> Clear
                </button>
              )}
            </div>
            <button className="ml-auto btn-global flex items-center gap-1.5" onClick={handleExport}>
              <Download size={13} /> Export CSV
            </button>
          </div>
          <div className="mt-2 text-[11px] text-[#555]">
            Showing <span className="text-[#888] font-mono">{filteredIncidents.length}</span> of <span className="text-[#888] font-mono">{INCIDENTS.length}</span> incidents
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]" role="table">
              <thead>
                <tr className="border-b border-[#1E1E1E] bg-[#111]">
                  <th className="w-10 px-4 py-3"><input type="checkbox" checked={paginatedIncidents.length > 0 && selectedIncidents.length === paginatedIncidents.length} onChange={toggleAll} className="accent-blue-500 w-3.5 h-3.5" /></th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap"><button onClick={() => handleSort('time')} className="flex items-center gap-1 btn-ghost">Timestamp {sortConfig.key === 'time' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-blue-400" /> : <ChevronDown size={12} className="text-blue-400" />) : <ChevronsUpDown size={12} className="text-[#444]" />}</button></th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap"><button onClick={() => handleSort('id')} className="flex items-center gap-1 btn-ghost">Incident ID</button></th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap"><button onClick={() => handleSort('gate')} className="flex items-center gap-1 btn-ghost">Gate</button></th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap">Blocks</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap"><button onClick={() => handleSort('type')} className="flex items-center gap-1 btn-ghost">Type</button></th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap"><button onClick={() => handleSort('severity')} className="flex items-center gap-1 btn-ghost">Severity {sortConfig.key === 'severity' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-blue-400" /> : <ChevronDown size={12} className="text-blue-400" />) : <ChevronsUpDown size={12} className="text-[#444]" />}</button></th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap"><button onClick={() => handleSort('fill')} className="flex items-center gap-1 btn-ghost">Fill % {sortConfig.key === 'fill' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-blue-400" /> : <ChevronDown size={12} className="text-blue-400" />) : <ChevronsUpDown size={12} className="text-[#444]" />}</button></th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap">Reroute To</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap">Operator</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap"><button onClick={() => handleSort('status')} className="flex items-center gap-1 btn-ghost">Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-blue-400" /> : <ChevronDown size={12} className="text-blue-400" />) : <ChevronsUpDown size={12} className="text-[#444]" />}</button></th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#555] uppercase tracking-wider whitespace-nowrap">AI Msg</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIncidents.map((inc, i) => {
                  const sevColor = getSeverityColor(inc.severity);
                  const statColor = getStatusColor(inc.status);
                  const typeColor = getTypeColor(inc.type);
                  const isSelected = selectedIncidents.includes(inc.id);
                  const isExpanded = expandedRows.includes(inc.id);
                  
                  return (
                    <React.Fragment key={inc.id}>
                      <tr 
                        onClick={() => toggleSelection(inc.id)}
                        className={`border-b border-[#1A1A1A] hover:bg-[#1C1C1C] transition-colors cursor-pointer ${isSelected ? 'bg-blue-600/5' : i % 2 === 0 ? 'bg-[#141414]' : 'bg-[#111111]'}`}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={isSelected} onChange={() => toggleSelection(inc.id)} className="accent-blue-500 w-3.5 h-3.5" /></td>
                        <td className="px-4 py-3 font-mono text-[12px] text-[#777] whitespace-nowrap">{inc.time}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-blue-400/80 whitespace-nowrap">{inc.id}</td>
                        <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{inc.gate}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {inc.blocks.map(b => (
                              <span key={b} className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#222] border border-[#333] text-[#aaa]">{b}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className={`badge-status badge-${typeColor}`}>{inc.type}</span></td>
                        <td className="px-4 py-3"><span className={`badge-status badge-${sevColor} uppercase`}>{inc.severity}</span></td>
                        <td className="px-4 py-3"><span className={`font-mono text-[12px] font-bold text-${sevColor === 'gray' ? '[#aaa]' : sevColor+'-400'}`}>{inc.fill}</span></td>
                        <td className="px-4 py-3 text-[12px] text-[#888] whitespace-nowrap"><span className={inc.redirect !== '—' ? 'text-blue-400' : 'text-[#444]'}>{inc.redirect}</span></td>
                        <td className="px-4 py-3 text-[12px] text-[#888] whitespace-nowrap">{inc.operator}</td>
                        <td className="px-4 py-3">
                          <span className={`badge-status badge-${statColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>{inc.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={(e) => toggleExpand(e, inc.id)}
                            className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'text-blue-400 bg-blue-500/10' : 'text-[#555] hover:text-blue-400 hover:bg-blue-500/10'}`}
                          >
                            <MessageSquare size={14} />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0D0D0D] border-b border-[#1A1A1A]">
                          <td colSpan="12" className="px-8 py-4">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold flex-shrink-0 mt-0.5">AI</div>
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-[13px] font-semibold text-blue-400">AI-Generated Alert Message</span>
                                  <span className="text-[10px] text-[#444] font-mono">OpenAI · 2026-04-18 {inc.time}</span>
                                </div>
                                <p className="text-[13px] text-[#999] leading-relaxed">{inc.aiMsg}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
                {filteredIncidents.length === 0 && (
                  <tr>
                    <td colSpan="12" className="px-4 py-12 text-center text-[#555] bg-[#111]">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={24} className="opacity-20" />
                        <p>No incidents found matching your criteria.</p>
                        <button onClick={clearFilters} className="text-blue-400 text-xs hover:underline mt-1">Clear all filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1E1E1E] bg-[#111]">
            <span className="text-[12px] text-[#555]">Showing <span className="font-mono text-[#888]">{Math.min(filteredIncidents.length, (currentPage - 1) * itemsPerPage + 1)}</span>–<span className="font-mono text-[#888]">{Math.min(filteredIncidents.length, currentPage * itemsPerPage)}</span> of <span className="font-mono text-[#888]">{filteredIncidents.length}</span> incidents</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-xl text-[12px] text-[#666] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150">Prev</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded-xl text-[12px] font-medium transition-all duration-150 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-[#666] hover:text-white hover:bg-white/5'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-xl text-[12px] text-[#666] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150">Next</button>
            </div>
          </div>
        </div>
      </div>

      {selectedIncidents.length > 0 && (
        <div className="floating-bar">
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-white font-medium">{selectedIncidents.length} selected</span>
            <button className="btn-resolve flex items-center gap-2" onClick={handleMarkResolved}>
              <CheckCircle size={14} /> Mark Resolved
            </button>
            <button className="p-1.5 rounded-lg text-[#666] hover:text-white transition-colors" onClick={() => setSelectedIncidents([])}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#1A2E1A] border border-[#2A4A2A] shadow-2xl animate-[slideUp_0.3s_ease-out]">
          <CheckCircle size={18} className="text-green-400" />
          <div>
            <p className="text-[13px] font-semibold text-white">Incident log exported</p>
            <p className="text-[11px] text-[#888]">{filteredIncidents.length} records exported as CSV.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AttendeeGateView() {
  const [scanStatus, setScanStatus] = useState('idle');
  const [assignedGate, setAssignedGate] = useState(null);

  const startScan = () => {
    setScanStatus('scanning');
    setTimeout(() => {
      setScanStatus('success');
      setAssignedGate(GATES[1]);
    }, 2500);
  };

  const resetScan = () => {
    setScanStatus('idle');
    setAssignedGate(null);
  };

  return (
    <div className="flex flex-col h-full min-h-0 view-enter view-enter-active">
      <header className="h-14 border-b border-[#1E1E1E] bg-[#111111]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-[15px] font-semibold text-white leading-none">Attendee Gate View</h1>
            <p className="text-[11px] text-[#555] mt-0.5">Your entry guide — live gate status</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D1F0D] border border-[#1A3A1A]">
            <Radio size={11} className="text-green-500 animate-pulse" />
            <span className="text-[11px] font-medium text-green-400">LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-[#555]">
            <RefreshCw size={11} className="text-[#555]" />
            <span>Next update in <span className="font-mono text-[#888]">15s</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#555]">
            <Clock size={11} />
            <span className="font-mono text-[#888]">{new Date().toLocaleTimeString('en-US',{hour12:false})}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 xl:p-6 bg-[#0D0D0D]">
        <div className="max-w-2xl mx-auto space-y-5">
          {scanStatus === 'idle' && (
            <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
              <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/20 border-b border-blue-800/30 px-6 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap size={14} className="text-blue-400" />
                      <span className="text-[11px] font-mono text-blue-400/70 tracking-widest uppercase">Member Ticket</span>
                    </div>
                    <h2 className="text-[20px] font-bold text-white tracking-tight">Priya Venkataraman</h2>
                    <p className="text-[13px] text-[#888] mt-0.5">MetroArena Season Opener 2026</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[11px] text-[#666] uppercase tracking-wider mb-1">Time</div>
                    <div className="text-[20px] font-bold font-mono text-white">19:00</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-blue-800/20">
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5">
                    <Users size={14} className="text-blue-400" />
                    <span className="text-[13px] font-semibold text-white">Block D</span>
                  </div>
                  <span className="text-[#444] font-bold">·</span>
                  <span className="text-[13px] text-[#aaa]">Row 14 · Seat 7</span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-48 h-48 rounded-3xl bg-[#0D0D0D] border-2 border-dashed border-[#2a2a2a] flex items-center justify-center mb-6 relative group cursor-pointer hover:border-blue-500/50 transition-colors" onClick={startScan}>
                  <div className="absolute inset-4 rounded-2xl bg-[#111] border border-[#1E1E1E] flex items-center justify-center">
                    <Search size={48} className="text-[#222] group-hover:text-blue-500/20 transition-colors" />
                  </div>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#333] rounded-tl-xl group-hover:border-blue-500 transition-colors"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#333] rounded-tr-xl group-hover:border-blue-500 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#333] rounded-bl-xl group-hover:border-blue-500 transition-colors"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#333] rounded-br-xl group-hover:border-blue-500 transition-colors"></div>
                </div>
                <button 
                  onClick={startScan}
                  className="w-full max-w-sm flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white text-[15px] font-bold hover:bg-blue-500 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)] transition-all duration-150 active:scale-[0.98]"
                >
                  <RefreshCw size={18} />
                  Scan Digital Ticket
                </button>
                <p className="text-[12px] text-[#555] mt-4 text-center">Your entry gate is calculated based on current crowd density</p>
              </div>
            </div>
          )}

          {scanStatus === 'scanning' && (
            <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-12 flex flex-col items-center justify-center shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="w-48 h-48 rounded-3xl bg-[#0D0D0D] border-2 border-blue-500/30 flex items-center justify-center mb-8 relative overflow-hidden pulse-blue">
                <div className="scan-line"></div>
                <Search size={48} className="text-blue-500/20" />
              </div>
              <h2 className="text-[20px] font-bold text-white mb-2">Analyzing Gates...</h2>
              <p className="text-[13px] text-[#555] text-center max-w-xs">Connecting to StadiumFlow core to find the fastest entry point for your zone.</p>
            </div>
          )}

          {scanStatus === 'success' && assignedGate && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-[0_15px_35px_-5px_rgba(37,99,235,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Recommended Entry</p>
                    <h2 className="text-[32px] font-black tracking-tighter">{assignedGate.name}</h2>
                    <p className="text-[14px] font-medium opacity-90">{assignedGate.desc}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                    <DoorOpen size={32} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5">
                  <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-2">Current Load</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-mono font-bold text-amber-400">{assignedGate.fill}%</span>
                    <span className="text-[12px] text-[#555] mb-1.5">Capacity</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{width: `${assignedGate.fill}%`}}></div>
                  </div>
                </div>
                <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5">
                  <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-2">Wait Time</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-mono font-bold text-green-400">{assignedGate.wait}</span>
                    <span className="text-[12px] text-[#555] mb-1.5">Estimated</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-[11px] text-green-500/80 font-semibold">
                    <CheckCircle size={10} /> Moving steadily
                  </div>
                </div>
              </div>

              <div className="bg-[#0D2B1A] border border-[#1A4A2E] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap size={18} className="text-green-400" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-green-400">Optimal Route Found</h4>
                  <p className="text-[13px] text-green-400/70 mt-1 leading-relaxed">Gate 2 is currently experiencing 20% lower traffic than Gate 1. Proceed to the North East corner for the fastest entry.</p>
                </div>
              </div>

              <button 
                onClick={resetScan}
                className="w-full py-4 rounded-2xl bg-[#141414] border border-[#1E1E1E] text-[13px] font-semibold text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-all"
              >
                Scan Another Ticket
              </button>
            </div>
          )}

          <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-6">
            <h3 className="text-[15px] font-bold text-white mb-4 flex items-center gap-2">
              <Shield size={16} className="text-blue-400" />
              Safety Instructions
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#222] flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white">01</div>
                <p className="text-[13px] text-[#888] leading-relaxed">Have your <span className="text-white font-medium">Digital ID</span> ready for verification at the turnstile.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#222] flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white">02</div>
                <p className="text-[13px] text-[#888] leading-relaxed">Follow the <span className="text-white font-medium">blue floor markers</span> for designated block D lanes.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#222] flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white">03</div>
                <p className="text-[13px] text-[#888] leading-relaxed">Contact venue staff immediately if you require <span className="text-white font-medium">accessibility assistance</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertRulesView() {
  const { showToast } = useRealtime();


  const handleSave = () => {
    showToast('Alert rules saved successfully!', 'success');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3"><Bell className="text-blue-400" /> Alert Rules Configuration</h1>
      <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Crowd Density Thresholds</h2>
        <p className="text-[#888] mb-4 text-sm">Trigger critical alerts when gates or zones exceed this capacity percentage.</p>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          <CheckCircle size={18} />
          Save Rules
        </button>
      </div>
    </div>
  );
}

function SecurityView() {
  const { venue, send, connected, showToast } = useRealtime();
  const [loading, setLoading] = React.useState(false);
  const isEvac = venue.status === 'EVACUATION_ACTIVE';

  const handleEvacuation = () => {
    setLoading(true);
    send('EVACUATE');
    showToast('Evacuation initiated!', 'critical');
    setTimeout(() => setLoading(false), 1000);
  };

  const cancelEvacuation = () => {
    send('CANCEL_EVACUATION');
    showToast('Evacuation cancelled.', 'success');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3"><Shield className="text-red-400" /> Security Dashboard</h1>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className={`border rounded-2xl p-6 transition-all duration-500 ${isEvac ? 'bg-red-500/20 border-red-500/50' : 'bg-red-500/10 border-red-500/30'}`}>
          <h2 className="text-lg font-semibold text-red-400 mb-2">Emergency Protocols</h2>
          <p className="text-[#888] mb-4 text-sm">Initiate venue-wide evacuation or lock down specific gates.</p>
          <div className={`mb-4 flex items-center gap-2 text-sm font-mono px-3 py-2 rounded-lg border ${isEvac ? 'bg-red-900/40 border-red-500/40 text-red-300' : 'bg-[#1A1A1A] border-[#2a2a2a] text-[#888]'}`}>
            <span className={`w-2 h-2 rounded-full ${isEvac ? 'bg-red-400 animate-pulse' : 'bg-green-500'}`}></span>
            Status: <span className="font-bold">{isEvac ? 'EVACUATION ACTIVE' : 'STANDBY'}</span>
          </div>
          {!isEvac ? (
            <button
              onClick={handleEvacuation}
              disabled={loading || !connected}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : 'INITIATE EVACUATION'}
            </button>
          ) : (
            <button
              onClick={cancelEvacuation}
              className="w-full py-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              CANCEL EVACUATION
            </button>
          )}
        </div>
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Live Threat Monitor</h2>
          <div className="flex items-center gap-3 text-sm text-[#aaa] bg-[#1A1A1A] p-3 rounded-lg border border-[#2a2a2a] mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Camera 04 (Gate 2) - Normal
          </div>
          <div className="flex items-center gap-3 text-sm text-[#aaa] bg-[#1A1A1A] p-3 rounded-lg border border-[#2a2a2a]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Perimeter Scan - Clear
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const { settings, send, features, toggleFeature, featuresLoading, showToast } = useRealtime();
  const [theme, setTheme] = React.useState(settings.theme || 'dark');
  const [tz, setTz] = React.useState(settings.timezone || 'UTC+5:30');
  const [saved, setSaved] = React.useState(false);
  const [localFeaturesLoading, setLocalFeaturesLoading] = React.useState({});

  const handleSave = () => {
    send('UPDATE_SETTINGS', { data: { theme, timezone: tz } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggle = async (id, name) => {
    setLocalFeaturesLoading(prev => ({ ...prev, [id]: true }));
    const result = await toggleFeature(id);
    setLocalFeaturesLoading(prev => ({ ...prev, [id]: false }));
    
    if (result.success) {
      showToast(`${name} ${result.newState ? 'Enabled' : 'Disabled'}`, result.newState ? 'success' : 'warning');
    } else {
      showToast(`Failed to update ${name}`, 'critical');
    }
  };

  const featureMetadata = [
    { id: 'crowdControl', name: 'Crowd Control', description: 'Real-time density monitoring and gate management.' },
    { id: 'entryGates', name: 'Entry Gates', description: 'Attendee throughput tracking and gate status.' },
    { id: 'incidentLog', name: 'Incident Log', description: 'Full audit trail of all security and tech events.' },
    { id: 'alerts', name: 'Alert Rules', description: 'Custom notification thresholds and rules.' },
    { id: 'security', name: 'Security', description: 'Threat monitoring and live perimeter scans.' },
    { id: 'analytics', name: 'Analytics', description: 'Crowd flow trends and historical throughput data.' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto text-white space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="text-[#888]" /> System Configuration
          </h1>
          <p className="text-[11px] text-[#555] mt-1 uppercase tracking-widest font-mono">
            Firestore Status: <span className={featuresLoading ? 'text-amber-500' : 'text-green-500'}>{featuresLoading ? 'Connecting...' : 'Connected (Live)'}</span>
          </p>
        </div>
        {featuresLoading && <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono uppercase tracking-widest"><RefreshCw size={10} className="animate-spin" /> Syncing...</div>}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureMetadata.map(f => (
          <FeatureCard 
            key={f.id}
            {...f}
            enabled={features[f.id]}
            loading={localFeaturesLoading[f.id]}
            onToggle={() => handleToggle(f.id, f.name)}
            onSettings={() => showToast(`${f.name} settings coming soon`, 'info')}
          />
        ))}
      </div>

      <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 border-b border-[#1E1E1E] pb-2">User Preferences</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[#888] text-xs uppercase mb-2">Theme</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-[#1A1A1A] border border-[#2a2a2a] rounded-lg p-2.5 text-sm text-white focus:outline-none">
              <option value="dark">Dark Mode (Default)</option>
              <option value="light">Light Mode (White)</option>
              <option value="high-contrast">High Contrast</option>
            </select>
          </div>
          <div>
            <label className="block text-[#888] text-xs uppercase mb-2">Timezone</label>
            <select value={tz} onChange={(e) => setTz(e.target.value)} className="w-full bg-[#1A1A1A] border border-[#2a2a2a] rounded-lg p-2.5 text-sm text-white focus:outline-none">
              <option value="UTC+5:30">UTC+5:30 (IST)</option>
              <option value="UTC-5">UTC-5 (EST)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
            </select>
          </div>
        </div>
        <button onClick={handleSave} className={`px-6 py-2 font-medium rounded-full transition-all active:scale-95 ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
          {saved ? '✓ Saved & Synced!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
function LoginView({ onLogin }) {
  const [role, setRole] = useState('admin');
  const [name, setName] = useState('M. Okonkwo');

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D] p-6">
      <div className="w-full max-w-md bg-[#111] border border-[#1E1E1E] rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center mb-4">
            <Activity size={32} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">StadiumFlow</h1>
          <p className="text-[13px] text-[#555] mt-1">Real-time Venue Command Center</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-widest mb-2">Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-main border border-main rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-widest mb-2">Access Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setRole('admin')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${role === 'admin' ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' : 'bg-main border-main text-[#555] hover:border-[#333]'}`}
              >
                <Shield size={20} />
                <span className="text-[12px] font-bold">Admin</span>
              </button>
              <button 
                onClick={() => setRole('user')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${role === 'user' ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' : 'bg-[#0D0D0D] border-[#1E1E1E] text-[#555] hover:border-[#333]'}`}
              >
                <Users size={20} />
                <span className="text-[12px] font-bold">Staff / User</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => onLogin({ name, role })}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] mt-4"
          >
            Access Dashboard
          </button>

          <p className="text-[11px] text-[#444] text-center mt-6">
            Authorized personnel only. System access is monitored.
          </p>
        </div>
      </div>
    </div>
  );
}
