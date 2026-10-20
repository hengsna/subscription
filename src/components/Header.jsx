'use client';

export default function Header({
  currentTab,
  onSwitchTab,
  currentUser,
  onSwitchPersona,
  onOpenInbox,
  onLogout,
  onVerifyEmail,
  onResendVerification,
  emailCount,
  sheetStatus,
  onOpenGoogleSheetHub
}) {
  const getRoleBadge = (u) => {
    if (!u) return null;
    if (u.role === 'admin') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-white">ADMIN</span>;
    }
    if (u.plan === 'yearly') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">YEARLY PRO</span>;
    }
    if (u.plan === 'monthly') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">MONTHLY PRO</span>;
    }
    if (u.plan === 'single') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">SINGLE PDF</span>;
    }
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-slate-700 border border-emerald-200">FREE USER</span>;
  };

  const getQuotaDisplay = (u) => {
    if (!u) return '';
    if (u.plan === 'yearly' || u.role === 'admin') {
      return 'Quota: Unlimited PDFs';
    }
    return `Quota: ${u.quotaRemaining} / ${u.quotaMax} Downloads left`;
  };

  return (
    <>
      {/* SIMULATED ROLE SWITCHER & STATUS BAR */}
      <div className="bg-emerald-900 text-white text-xs sm:text-sm py-2 px-4 border-b border-emerald-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="font-semibold text-emerald-200">
              <i className="fa-solid fa-sliders mr-1.5"></i>Interactive Role Sandbox:
            </span>
            <span className="text-emerald-100/80 hidden md:inline">Test RBAC rules or verify transactional flows</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Google Sheet Sync Pill */}
            <button
              onClick={onOpenGoogleSheetHub}
              title="Click to configure Google Sheet Database"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition border ${
                sheetStatus === 'online'
                  ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-200 border-emerald-500'
                  : sheetStatus === 'syncing'
                  ? 'bg-amber-900 hover:bg-amber-800 text-amber-200 border-amber-500 animate-pulse'
                  : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
              }`}
            >
              <i className={`fa-solid ${sheetStatus === 'online' ? 'fa-table text-emerald-400' : sheetStatus === 'syncing' ? 'fa-arrows-rotate fa-spin text-amber-400' : 'fa-database text-emerald-400'}`}></i>
              <span>{sheetStatus === 'online' ? 'Sheet Connected' : sheetStatus === 'syncing' ? 'Syncing...' : 'Google Sheet Hub'}</span>
            </button>

            {/* Persona Switcher */}
            <label htmlFor="quick-role-select" className="text-emerald-100 font-medium text-xs">
              Persona:
            </label>
            <select
              id="quick-role-select"
              value={currentUser?.plan === 'monthly' ? 'premium_monthly' : currentUser?.plan === 'yearly' ? (currentUser?.role === 'admin' ? 'admin' : 'premium_yearly') : currentUser?.plan === 'single' ? 'single_buyer' : !currentUser?.emailVerified ? 'unverified' : 'normal'}
              onChange={(e) => onSwitchPersona(e.target.value)}
              className="bg-emerald-950 text-white border border-emerald-700 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              <option value="normal">Normal User (Free — View Only)</option>
              <option value="premium_monthly">Premium Monthly (15 PDFs/mo)</option>
              <option value="premium_yearly">Premium Yearly (Unlimited PDFs)</option>
              <option value="single_buyer">Single PDF Buyer (1-Time Quota)</option>
              <option value="unverified">Unverified User (Double Opt-in Pending)</option>
              <option value="admin">Platform Admin (Full Control)</option>
            </select>

            {/* Simulated Inbox Trigger */}
            <button
              onClick={onOpenInbox}
              className="relative bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm border border-emerald-400/30"
            >
              <i className="fa-solid fa-envelope-open-text"></i>
              <span>Simulated Inbox</span>
              <span className="bg-white text-emerald-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {emailCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION HEADER */}
      <header className="glass-bar sticky top-[37px] z-40 border-b border-emerald-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSwitchTab('library')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <i className="fa-solid fa-graduation-cap text-lg"></i>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Edu<span className="text-emerald-600">Vault</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] uppercase tracking-wider font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Pro E-Learning
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onSwitchTab('library')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                currentTab === 'library'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <i className="fa-solid fa-book-open mr-1.5"></i>Resource Library
            </button>

            <button
              onClick={() => onSwitchTab('pricing')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                currentTab === 'pricing'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <i className="fa-solid fa-credit-card mr-1.5"></i>Plans & Pay
            </button>

            <button
              onClick={() => onSwitchTab('workflow')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                currentTab === 'workflow'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <i className="fa-solid fa-diagram-project mr-1.5"></i>Workflow Diagram
            </button>

            <button
              onClick={() => onSwitchTab('admin')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center ${
                currentTab === 'admin'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <i className="fa-solid fa-shield-halved mr-1.5 text-emerald-600"></i>Admin
            </button>

            <button
              onClick={() => onSwitchTab('database')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center ${
                currentTab === 'database'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <i className="fa-solid fa-table-cells mr-1.5 text-emerald-600"></i>Google Sheet DB
            </button>

            <button
              onClick={() => onSwitchTab('auth')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                currentTab === 'auth'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <i className="fa-solid fa-user-lock mr-1.5"></i>Auth Portal
            </button>
          </nav>

          {/* User Status Pill & Quota Display */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center bg-white border border-emerald-200 rounded-xl px-3 py-1.5 space-x-3 shadow-sm">
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                    {getRoleBadge(currentUser)}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {getQuotaDisplay(currentUser)}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="text-slate-400 hover:text-emerald-700 transition p-1"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSwitchTab('auth')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition"
              >
                Sign In / Join
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden overflow-x-auto border-t border-emerald-100 px-3 py-2 space-x-2 bg-white">
          <button
            onClick={() => onSwitchTab('library')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'library' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => onSwitchTab('pricing')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'pricing' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600'
            }`}
          >
            Plans & Pay
          </button>
          <button
            onClick={() => onSwitchTab('workflow')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'workflow' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600'
            }`}
          >
            Workflow
          </button>
          <button
            onClick={() => onSwitchTab('admin')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'admin' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => onSwitchTab('database')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'database' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600'
            }`}
          >
            Sheet DB
          </button>
          <button
            onClick={() => onSwitchTab('auth')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentTab === 'auth' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-600'
            }`}
          >
            Auth
          </button>
        </div>
      </header>

      {/* EMAIL VERIFICATION WARNING BANNER (When Double Opt-In is Pending) */}
      {currentUser && !currentUser.emailVerified && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 text-emerald-950 text-sm">
              <i className="fa-solid fa-envelope-circle-check text-emerald-600 text-base"></i>
              <span>
                <strong>Email Verification Required (Double Opt-In):</strong> Your account is pending verification. PDF downloads and plan upgrades are restricted until verified.
              </span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={onResendVerification}
                className="text-xs font-semibold bg-white border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
              >
                Resend Confirmation
              </button>
              <button
                onClick={onVerifyEmail}
                className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition shadow-sm flex items-center"
              >
                <i className="fa-solid fa-check-double mr-1.5"></i>Simulate 1-Click Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
