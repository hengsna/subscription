'use client';

import { useState } from 'react';
import { DEFAULT_SHEET_URL } from '@/lib/googleSheetClient';

export default function GoogleSheetHub({
  database,
  sheetStatus,
  webAppUrl,
  onSaveWebAppUrl,
  onSyncNow,
  onInitDatabase,
  auditLogs,
  onCopyScript
}) {
  const [activeTableTab, setActiveTableTab] = useState('users');
  const [inputUrl, setInputUrl] = useState(webAppUrl);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const tableCounts = {
    users: database.users?.length || 0,
    resources: database.resources?.length || 0,
    payments: database.payments?.length || 0,
    emails: database.emails?.length || 0,
    subscriptions: database.subscriptions?.length || 0
  };

  const handleSaveUrl = (e) => {
    e.preventDefault();
    onSaveWebAppUrl(inputUrl.trim());
  };

  const filterRows = (rows = []) => {
    if (!searchTerm) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Target Spreadsheet Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border-2 border-emerald-700 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
              <i className="fa-solid fa-database"></i>
              <span>Google Sheets Database Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Live Spreadsheet Backend & Table Inspector</h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
              Connect EduVault frontend to your Google Spreadsheet via Google Apps Script Web App REST API. Reads and writes all tables in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={DEFAULT_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-up-right-from-square text-emerald-600"></i>
              <span>Open Target Google Sheet</span>
            </a>
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-emerald-500 transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-book-bookmark"></i>
              <span>{showSetupGuide ? 'Hide Setup Guide' : 'Setup Guide (5 mins)'}</span>
            </button>
          </div>
        </div>

        {/* Connection Status Pill & Target Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-700/60 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-200">Target Sheet ID:</span>
            <code className="bg-emerald-950 px-2 py-0.5 rounded font-mono text-emerald-300 font-bold border border-emerald-800">
              18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw
            </code>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-emerald-200">Connection State:</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs ${
                sheetStatus === 'online'
                  ? 'bg-emerald-400 text-emerald-950'
                  : sheetStatus === 'syncing'
                  ? 'bg-amber-400 text-amber-950'
                  : 'bg-white/20 text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full mr-1.5 ${sheetStatus === 'online' ? 'bg-emerald-900 animate-pulse' : 'bg-slate-300'}`}></span>
              {sheetStatus === 'online'
                ? 'Connected to Google Sheet'
                : sheetStatus === 'syncing'
                ? 'Syncing...'
                : 'Local Resilient Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* SETUP GUIDE ACCORDION */}
      {showSetupGuide && (
        <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-code text-emerald-600"></i>
              <span>Google Apps Script Deployment in 4 Simple Steps</span>
            </h3>
            <button
              onClick={onCopyScript}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <i className="fa-solid fa-copy"></i>
              <span>Copy Apps Script Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-700">
            <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-700">1. Open Sheet</span>
              <p>
                Open your <a href={DEFAULT_SHEET_URL} target="_blank" rel="noreferrer" className="text-emerald-600 underline font-semibold">Google Sheet</a>, then click <strong>Extensions &gt; Apps Script</strong>.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-700">2. Paste Code</span>
              <p>
                Click <strong>"Copy Apps Script Code"</strong> above, paste it into <code>Code.gs</code>, and press <strong>Ctrl+S</strong> to save.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-700">3. Run Init</span>
              <p>
                Select function <code>initializeDatabase</code> from the toolbar and click <strong>Run</strong> to create all 5 tables automatically.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-700">4. Deploy Web App</span>
              <p>
                Click <strong>Deploy &gt; New deployment</strong>, select <strong>Web app</strong>, set access to <strong>"Anyone"</strong>, deploy, and paste the URL below!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Web App URL Configuration Card */}
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 space-y-4">
        <form onSubmit={handleSaveUrl} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800">
            Google Apps Script Web App Endpoint URL:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-grow px-4 py-2.5 rounded-xl border border-emerald-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition shrink-0 flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-check"></i>
              <span>Save & Connect</span>
            </button>
            <button
              type="button"
              onClick={onSyncNow}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs px-4 py-2.5 rounded-xl transition shrink-0 flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-arrows-rotate"></i>
              <span>Sync All Tables</span>
            </button>
            <button
              type="button"
              onClick={onInitDatabase}
              className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition shrink-0 flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-magic-wand-sparkles"></i>
              <span>Initialize Tables</span>
            </button>
          </div>
        </form>
      </div>

      {/* DATABASE TABLES INSPECTOR */}
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
        {/* Table Selector Tabs & Search */}
        <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['users', 'resources', 'payments', 'emails', 'subscriptions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTableTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition flex items-center gap-1.5 shrink-0 ${
                  activeTableTab === tab
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    activeTableTab === tab ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tableCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder={`Search ${activeTableTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Tabular Table Content */}
        <div className="overflow-x-auto max-h-[460px]">
          {/* USERS TABLE */}
          {activeTableTab === 'users' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-emerald-50/70 text-[11px] font-bold uppercase tracking-wider text-emerald-900 sticky top-0 border-b border-emerald-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Opt-In Verified</th>
                  <th className="py-3 px-4">Quota Left</th>
                  <th className="py-3 px-4">Renewal Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white">
                {filterRows(database.users).map((u) => (
                  <tr key={u.id} className="hover:bg-emerald-50/40">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">{u.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4 font-bold uppercase text-[10px] text-emerald-800">{u.role}</td>
                    <td className="py-3 px-4 font-semibold uppercase text-slate-700">{u.plan}</td>
                    <td className="py-3 px-4">
                      {u.emailVerified ? (
                        <span className="text-emerald-600 font-bold"><i className="fa-solid fa-check mr-1"></i>Verified</span>
                      ) : (
                        <span className="text-amber-600 font-semibold"><i className="fa-solid fa-clock mr-1"></i>Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">{u.plan === 'yearly' || u.role === 'admin' ? 'Unlimited' : `${u.quotaRemaining} / ${u.quotaMax}`}</td>
                    <td className="py-3 px-4 text-slate-500">{u.renewalDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* RESOURCES TABLE */}
          {activeTableTab === 'resources' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-emerald-50/70 text-[11px] font-bold uppercase tracking-wider text-emerald-900 sticky top-0 border-b border-emerald-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Pages</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Downloads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white">
                {filterRows(database.resources).map((r) => (
                  <tr key={r.id} className="hover:bg-emerald-50/40">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">#{r.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">{r.title}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold text-[10px]">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.author}</td>
                    <td className="py-3 px-4 font-mono">{r.pages}p</td>
                    <td className="py-3 px-4 font-bold text-slate-900">${Number(r.price).toFixed(2)}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">{r.downloads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAYMENTS TABLE */}
          {activeTableTab === 'payments' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-emerald-50/70 text-[11px] font-bold uppercase tracking-wider text-emerald-900 sticky top-0 border-b border-emerald-200">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Item / Plan</th>
                  <th className="py-3 px-4">Gateway</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white">
                {filterRows(database.payments).map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-50/40">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">{p.id}</td>
                    <td className="py-3 px-4 text-slate-600">{p.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.user}</td>
                    <td className="py-3 px-4 text-slate-700">{p.item}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {p.gateway}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">${Number(p.amount).toFixed(2)}</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold"><i className="fa-solid fa-circle-check mr-1"></i>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* EMAILS TABLE */}
          {activeTableTab === 'emails' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-emerald-50/70 text-[11px] font-bold uppercase tracking-wider text-emerald-900 sticky top-0 border-b border-emerald-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white">
                {filterRows(database.emails).map((e) => (
                  <tr key={e.id} className="hover:bg-emerald-50/40">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">#{e.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{e.to}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{e.subject}</td>
                    <td className="py-3 px-4 text-slate-500">{e.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {e.actionType || 'info'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* SUBSCRIPTIONS TABLE */}
          {activeTableTab === 'subscriptions' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-emerald-50/70 text-[11px] font-bold uppercase tracking-wider text-emerald-900 sticky top-0 border-b border-emerald-200">
                <tr>
                  <th className="py-3 px-4">Sub ID</th>
                  <th className="py-3 px-4">User Email</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Billing Cycle</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Next Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 bg-white">
                {filterRows(database.subscriptions).map((s) => (
                  <tr key={s.id} className="hover:bg-emerald-50/40">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">{s.id}</td>
                    <td className="py-3 px-4 text-slate-700">{s.userEmail}</td>
                    <td className="py-3 px-4 font-bold uppercase text-slate-800">{s.planName}</td>
                    <td className="py-3 px-4">{s.billingCycle}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">${Number(s.price).toFixed(2)}</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">{s.status}</td>
                    <td className="py-3 px-4 text-slate-500">{s.nextBillingDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* REAL-TIME SYNC AUDIT FEED */}
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-wave-square text-emerald-600"></i>
            <span>Google Sheet Sync & Mutation Activity Log</span>
          </h3>
          <span className="text-[11px] text-slate-500">Live Telemetry Feed</span>
        </div>
        <div className="bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl p-4 max-h-44 overflow-y-auto space-y-1">
          {auditLogs && auditLogs.length > 0 ? (
            auditLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className={log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                  {log.text}
                </span>
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic">No sync events yet. Connect your Web App URL to begin recording live telemetry.</div>
          )}
        </div>
      </div>
    </section>
  );
}
