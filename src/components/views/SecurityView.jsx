import React from 'react';
import PropTypes from 'prop-types';
import { Shield } from 'lucide-react';

const SecurityView = ({ rtData }) => {
  const { venue, send, connected, showToast } = rtData;
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
    <div className="p-8 max-w-4xl mx-auto text-white" role="main" aria-label="Security Dashboard">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Shield className="text-red-400" /> Security Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-[#aaa] bg-[#1A1A1A] p-3 rounded-lg border border-[#2a2a2a]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Camera 04 (Gate 2) - Normal
            </div>
            <div className="flex items-center gap-3 text-sm text-[#aaa] bg-[#1A1A1A] p-3 rounded-lg border border-[#2a2a2a]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Perimeter Scan - Clear
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SecurityView.propTypes = {
  rtData: PropTypes.shape({
    venue: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired,
    connected: PropTypes.bool.isRequired,
    showToast: PropTypes.func.isRequired
  }).isRequired
};

export default React.memo(SecurityView);
