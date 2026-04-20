import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Activity, Shield, Users } from 'lucide-react';

const LoginView = ({ onLogin }) => {
  const [role, setRole] = useState('admin');
  const [name, setName] = useState('M. Okonkwo');

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D] p-6" role="main" aria-label="Login Page">
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
            <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-widest mb-2" htmlFor="display-name">Display Name</label>
            <input 
              id="display-name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-widest mb-2">Access Role</label>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Role selection">
              <button 
                type="button"
                role="radio"
                aria-checked={role === 'admin'}
                onClick={() => setRole('admin')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${role === 'admin' ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' : 'bg-[#0A0A0A] border-[#1E1E1E] text-[#555] hover:border-[#333]'}`}
              >
                <Shield size={20} />
                <span className="text-[12px] font-bold">Admin</span>
              </button>
              <button 
                type="button"
                role="radio"
                aria-checked={role === 'user'}
                onClick={() => setRole('user')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${role === 'user' ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' : 'bg-[#0A0A0A] border-[#1E1E1E] text-[#555] hover:border-[#333]'}`}
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
};

LoginView.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default React.memo(LoginView);
