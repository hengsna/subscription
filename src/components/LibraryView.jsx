'use client';

import { useState } from 'react';

export default function LibraryView({
  resources,
  currentUser,
  onOpenPreview,
  onDownloadPdf,
  onUnlockPdf,
  onSwitchTab
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'System Design', 'Full-Stack', 'AI & Data', 'Cloud & Security'];

  const planLabels = {
    free: 'Normal (Free — View Only)',
    monthly: 'Premium Monthly Plan',
    yearly: 'Premium Yearly Plan (Unlimited)',
    single: 'Single PDF Purchase Tier'
  };

  const canUserDownload = (resourceId) => {
    if (!currentUser) return { allowed: false, reason: 'Please sign in first' };
    if (!currentUser.emailVerified) return { allowed: false, reason: 'Verify Email first' };
    if (currentUser.role === 'admin' || currentUser.plan === 'yearly') {
      return { allowed: true, reason: 'Unlimited Access' };
    }
    if (currentUser.plan === 'monthly' && currentUser.quotaRemaining > 0) {
      return { allowed: true, reason: `Use 1 Quota (${currentUser.quotaRemaining} left)` };
    }
    if (currentUser.singlePdfUnlockedIds?.includes(resourceId) && currentUser.quotaRemaining > 0) {
      return { allowed: true, reason: '1-Time Purchased PDF' };
    }
    return { allowed: false, reason: 'Locked (Upgrade or Buy Single PDF)' };
  };

  const filteredResources = resources.filter((r) => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const quotaPercent =
    currentUser && currentUser.quotaMax > 0
      ? Math.min(100, Math.round((currentUser.quotaRemaining / currentUser.quotaMax) * 100))
      : 0;

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Hero Status & Live Quota Card */}
      <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-6 sm:p-8 text-slate-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-white border border-emerald-300 rounded-full px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-sm">
              <i className="fa-solid fa-leaf text-emerald-600"></i>
              <span>Active Tier: {currentUser ? planLabels[currentUser.plan] || 'Free' : 'Guest'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Curated Computer Science & Engineering PDF Library
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
              Access peer-reviewed handbooks, architecture blueprints, and interactive workbooks. Access rights dynamically adapt to your role, verification status, and subscription plan stored in Google Sheets.
            </p>
          </div>

          {/* Live Access & Quota Telemetry Panel */}
          <div className="lg:col-span-5 bg-white border-2 border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-600 font-bold">Current Access Rule</p>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {currentUser ? planLabels[currentUser.plan] || 'Normal (Free)' : 'Guest'}
                </h3>
              </div>
              <span className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <i className="fa-solid fa-unlock-keyhole text-lg"></i>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Download Quota Remaining</span>
                <span className="font-bold text-emerald-700">
                  {currentUser?.plan === 'yearly' || currentUser?.role === 'admin'
                    ? 'Unlimited'
                    : `${currentUser?.quotaRemaining || 0} / ${currentUser?.quotaMax || 0} PDFs`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: currentUser?.plan === 'yearly' || currentUser?.role === 'admin' ? '100%' : `${quotaPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-emerald-50/60 rounded-xl p-2.5 border border-emerald-100">
                <span className="text-slate-500 block">Renewal / Expiry</span>
                <span className="font-bold text-slate-800">{currentUser?.renewalDate || 'N/A'}</span>
              </div>
              <div className="bg-emerald-50/60 rounded-xl p-2.5 border border-emerald-100">
                <span className="text-slate-500 block">Email Opt-In</span>
                <span className={`font-bold ${currentUser?.emailVerified ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {currentUser?.emailVerified ? (
                    <>
                      <i className="fa-solid fa-circle-check mr-1"></i>Verified (Double Opt-In)
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-clock mr-1"></i>Unverified (Pending)
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => onSwitchTab('pricing')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-sm"
              >
                <i className="fa-solid fa-arrow-up-right-dots mr-1.5"></i>Change Plan or Buy Single PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-sm"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PDF title, topic, or author..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {cat === 'All' ? 'All Resources' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-emerald-200">
            <i className="fa-solid fa-folder-open text-3xl text-emerald-300 mb-2"></i>
            <p className="font-bold text-slate-700">No matching PDF resources found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search filter or upload a new PDF in the Admin view.</p>
          </div>
        ) : (
          filteredResources.map((r) => {
            const access = canUserDownload(r.id);
            const isSingleUnlocked = currentUser?.singlePdfUnlockedIds?.includes(r.id);

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition flex flex-col justify-between p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      <i className="fa-solid fa-file-pdf text-emerald-600 mr-1"></i>
                      {r.pages} pages
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">{r.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{r.abstract}</p>
                </div>

                <div className="pt-5 mt-5 border-t border-emerald-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      <i className="fa-solid fa-user-pen text-emerald-600 mr-1"></i>
                      {r.author}
                    </span>
                    <span>
                      <i className="fa-solid fa-download text-emerald-600 mr-1"></i>
                      {r.downloads} downloads
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenPreview(r)}
                      className="py-2 px-3 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-regular fa-eye"></i>
                      <span>View Preview</span>
                    </button>

                    {access.allowed ? (
                      <button
                        onClick={() => onDownloadPdf(r)}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <i className="fa-solid fa-cloud-arrow-down"></i>
                        <span>{isSingleUnlocked ? '1-Time Download' : 'Download PDF'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onUnlockPdf(r)}
                        className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <i className="fa-solid fa-lock text-emerald-600"></i>
                        <span>Unlock (${r.price})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
