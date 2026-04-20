import React, { useState, useEffect, createContext, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useRealtimeServer } from '../useRealtimeServer';
import { useAuth } from '../contexts/AuthContext';
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

import { GATES, CROWD_FLOW_DATA, INCIDENTS } from '../constants';
// Lazy load views for better bundle efficiency
const CrowdControlView = lazy(() => import('./views/CrowdControlView'));
const IncidentLogView = lazy(() => import('./views/IncidentLogView'));
const AttendeeGateView = lazy(() => import('./views/AttendeeGateView'));
const AlertRulesView = lazy(() => import('./views/AlertRulesView'));
const SecurityView = lazy(() => import('./views/SecurityView'));
const SettingsView = lazy(() => import('./views/SettingsView'));
const LoginView = lazy(() => import('./views/LoginView'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
    <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"></div>
    <p className="text-[11px] font-mono text-[#555] uppercase tracking-widest">Loading Module...</p>
  </div>
);

const RealtimeContext = createContext(null);

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
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-trigger ${isOpen || value !== 'all' ? 'border-blue-500/50 text-blue-400' : ''}`}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : 'text-[#555]'}`} />
      </button>
      {isOpen && (
        <div className="dropdown-menu" role="listbox">
          {options.map((opt) => (
            <div 
              key={opt.value} 
              role="option"
              aria-selected={value === opt.value}
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

CustomDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  placeholder: PropTypes.string
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      <Suspense fallback={<LoadingFallback />}>
        <LoginView />
      </Suspense>
    );
  }

  const isUser = false; // Firebase Auth doesn't have roles by default
  const rtData = { ...rt, user, showToast, features, toggleFeature, featuresLoading };

  return (
    <RealtimeContext.Provider value={rtData}>
    <div className={`flex h-screen bg-main overflow-hidden text-main font-sans ${rt.settings?.theme === 'light' ? 'theme-light' : ''}`}>
      {!rt.connected && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center text-xs py-1 font-mono animate-pulse">
          ⚠ Connecting to StadiumFlow Realtime Server…
        </div>
      )}
      <aside className={`relative flex flex-col h-full border-r border-main bg-side transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-[220px]' : 'w-[70px]'}`} role="navigation">
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
          <div className="flex items-center gap-4">
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"
            >
              <LogIn size={14} className="rotate-180" /> Sign Out
            </button>
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#1A1A1A] border border-[#222]">
              <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <Activity size={12} className="text-blue-400" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-[11px] font-bold text-white leading-none">{user?.displayName || 'User'}</p>
                <p className="text-[9px] text-[#555] font-mono mt-0.5">ADMIN</p>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"} className="btn-circular absolute -right-3 top-[72px] z-10 w-6 h-6 text-[#666] hover:text-white">
          <ChevronLeft size={12} className={isSidebarOpen ? '' : 'rotate-180'} />
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
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
          <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={installProgress} aria-valuemin="0" aria-valuemax="100">
            <div className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_#3B82F6]" style={{ width: `${installProgress}%` }}></div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[11px] font-mono text-blue-400 shadow-2xl">
              Downloading App Assets... {installProgress}%
            </div>
          </div>
        )}

        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to={isUser ? "/attendee-gate-view" : "/crowd-control-dashboard"} replace />} />
            <Route path="/crowd-control-dashboard" element={isUser ? <Navigate to="/attendee-gate-view" /> : <CrowdControlView rtData={rtData} />} />
            <Route path="/incident-log" element={isUser ? <Navigate to="/attendee-gate-view" /> : <IncidentLogView showToast={showToast} />} />
            <Route path="/attendee-gate-view" element={<AttendeeGateView showToast={showToast} />} />
            <Route path="/alert-rules" element={<AlertRulesView showToast={showToast} />} />
            <Route path="/security" element={<SecurityView rtData={rtData} />} />
            <Route path="/settings" element={<SettingsView rtData={rtData} />} />
          </Routes>
        </Suspense>

        {toast && (
          <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl animate-[slideUp_0.3s_ease-out] text-[13px] font-medium ${
            toast.type === 'critical' ? 'bg-red-950 border-red-500/40 text-red-300' :
            toast.type === 'success' ? 'bg-green-950 border-green-500/40 text-green-300' :
            toast.type === 'info' ? 'bg-blue-950 border-blue-500/40 text-blue-300' :
            'bg-amber-950 border-amber-500/40 text-amber-300'
          }`} role="alert">
            {toast.type === 'success' ? <CheckCircle size={16} /> : <TriangleAlert size={16} />}
            <span>{toast.msg}</span>
          </div>
        )}
      </main>
    </div>
    </RealtimeContext.Provider>
  );
}
