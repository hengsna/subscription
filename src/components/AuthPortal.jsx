'use client';

import { useState } from 'react';

export default function AuthPortal({
  onLogin,
  onRegister,
  onResetPassword
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'reset'

  // Form states
  const [loginEmail, setLoginEmail] = useState('alex@eduvault.io');
  const [loginPassword, setLoginPassword] = useState('password123');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPlan, setRegPlan] = useState('free');
  const [regNewsletter, setRegNewsletter] = useState(true);

  const [resetEmail, setResetEmail] = useState('alex@eduvault.io');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(loginEmail);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegister({
      name: regName,
      email: regEmail,
      plan: regPlan,
      newsletter: regNewsletter
    });
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    onResetPassword(resetEmail);
  };

  return (
    <section className="max-w-md mx-auto py-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-lg overflow-hidden">
        {/* Auth Mode Switcher */}
        <div className="grid grid-cols-3 border-b border-emerald-200 bg-emerald-50/60 text-xs font-bold">
          <button
            onClick={() => setAuthMode('login')}
            className={`py-3.5 transition ${
              authMode === 'login'
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
                : 'text-slate-500 hover:text-emerald-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`py-3.5 transition ${
              authMode === 'register'
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
                : 'text-slate-500 hover:text-emerald-800'
            }`}
          >
            Register (Opt-In)
          </button>
          <button
            onClick={() => setAuthMode('reset')}
            className={`py-3.5 transition ${
              authMode === 'reset'
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
                : 'text-slate-500 hover:text-emerald-800'
            }`}
          >
            Reset Password
          </button>
        </div>

        <div className="p-6 sm:p-8 bg-white">
          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-xl font-extrabold text-slate-900">Welcome Back</h3>
                <p className="text-xs text-slate-500">Sign in to access your e-learning library & PDF quota</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition"
              >
                Sign In to Account
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-xl font-extrabold text-slate-900">Create Account</h3>
                <p className="text-xs text-slate-500">Triggers a simulated SendGrid Double Opt-In verification email</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jordan Lee"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Subscription Plan</label>
                <select
                  value={regPlan}
                  onChange={(e) => setRegPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-sm bg-emerald-50/40 font-medium cursor-pointer"
                >
                  <option value="free">Normal (Free — View Only)</option>
                  <option value="monthly">Premium Monthly ($19/mo)</option>
                  <option value="yearly">Premium Yearly ($149/yr)</option>
                </select>
              </div>
              <label className="flex items-start space-x-2 text-xs text-slate-600 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regNewsletter}
                  onChange={(e) => setRegNewsletter(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600"
                />
                <span>Subscribe to weekly engineering digests (Double Opt-In)</span>
              </label>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition"
              >
                Register & Send Verification Email
              </button>
            </form>
          )}

          {/* PASSWORD RESET FORM */}
          {authMode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-xl font-extrabold text-slate-900">Reset Password</h3>
                <p className="text-xs text-slate-500">We will dispatch a reset link to your Simulated Inbox</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Email</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3 rounded-xl shadow-md transition"
              >
                Send Reset Instructions
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
