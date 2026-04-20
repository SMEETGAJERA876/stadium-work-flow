import PropTypes from 'prop-types';

export default function ToggleSwitch({ enabled, onToggle, loading = false }) {
  return (
    <button 
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      disabled={loading}
      aria-label="Toggle feature"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#111] ${
        enabled ? 'bg-blue-600' : 'bg-[#2a2a2a]'
      } ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
    >
      <span className="sr-only">Toggle feature</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

ToggleSwitch.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
