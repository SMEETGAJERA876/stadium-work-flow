import React from 'react';
import PropTypes from 'prop-types';
import { Settings, RefreshCw } from 'lucide-react';
import FeatureCard from '../FeatureCard';

const SettingsView = ({ rtData }) => {
  const { settings, send, features, toggleFeature, featuresLoading, showToast } = rtData;
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
    <div className="p-8 max-w-5xl mx-auto text-white space-y-8" role="main" aria-label="System Settings">
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
};

SettingsView.propTypes = {
  rtData: PropTypes.shape({
    settings: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired,
    features: PropTypes.object.isRequired,
    toggleFeature: PropTypes.func.isRequired,
    featuresLoading: PropTypes.bool,
    showToast: PropTypes.func.isRequired
  }).isRequired
};

export default React.memo(SettingsView);
