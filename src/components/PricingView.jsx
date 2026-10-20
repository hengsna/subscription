'use client';

import { useState } from 'react';

export default function PricingView({
  resources,
  payments,
  onInitiateCheckout,
  onActivateFreePlan
}) {
  const [selectedDropdownPlan, setSelectedDropdownPlan] = useState('monthly');
  const [selectedSinglePdfId, setSelectedSinglePdfId] = useState(resources[0]?.id || 101);

  const handleDropdownCheckout = () => {
    if (selectedDropdownPlan === 'free') {
      onActivateFreePlan();
      return;
    }
    onInitiateCheckout(selectedDropdownPlan, selectedSinglePdfId);
  };

  const getCheckoutButtonLabel = () => {
    switch (selectedDropdownPlan) {
      case 'free':
        return 'Activate Free Plan ($0.00)';
      case 'monthly':
        return 'Proceed to Checkout ($19.00/mo)';
      case 'yearly':
        return 'Proceed to Checkout ($149.00/yr)';
      case 'single':
        return 'Buy Single PDF ($7.99)';
      default:
        return 'Proceed to Checkout';
    }
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Tiered Payment Logic
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900">Flexible E-Learning Subscriptions</h2>
        <p className="text-slate-600 text-sm sm:text-base">
          Choose a plan from the dropdown selector or cards below, complete the simulated Stripe or PayPal checkout, and watch your download quota and access rights activate immediately in Google Sheets.
        </p>
      </div>

      {/* Interactive Subscription Dropdown Bar */}
      <div className="bg-emerald-50/50 rounded-2xl p-6 border-2 border-emerald-200 shadow-sm max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label htmlFor="sub-select" className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              1. Select Subscription Type (Dropdown)
            </label>
            <select
              id="sub-select"
              value={selectedDropdownPlan}
              onChange={(e) => setSelectedDropdownPlan(e.target.value)}
              className="w-full bg-white border border-emerald-300 text-slate-900 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="free">• Normal (Free) — $0.00 (View Library Only)</option>
              <option value="monthly">• Premium Monthly Payment — $19.00 / month (15 PDFs/mo)</option>
              <option value="yearly">• Premium Yearly Payment — $149.00 / year (Unlimited PDFs)</option>
              <option value="single">• Single PDF Purchase — $7.99 One-Time (1 Specific PDF)</option>
            </select>
          </div>

          {/* Conditional PDF Selector when "Single PDF Purchase" is chosen */}
          {selectedDropdownPlan === 'single' && (
            <div className="md:col-span-4">
              <label htmlFor="pdf-target" className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                Select Target PDF Resource
              </label>
              <select
                id="pdf-target"
                value={selectedSinglePdfId}
                onChange={(e) => setSelectedSinglePdfId(Number(e.target.value))}
                className="w-full bg-white border border-emerald-300 text-slate-900 rounded-xl px-3.5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    #{r.id} — {r.title} (${r.price})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={`${selectedDropdownPlan === 'single' ? 'md:col-span-3' : 'md:col-span-7'} flex items-center justify-end`}>
            <button
              onClick={handleDropdownCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-lock"></i>
              <span>{getCheckoutButtonLabel()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Normal (Free) */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                View Only
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Normal (Free)</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-500 text-xs ml-1">/ forever</span>
            </div>
            <p className="text-xs text-slate-500">Browse catalog metadata and read interactive executive summaries.</p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-emerald-100">
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-600 mr-2"></i>Full Library Search & Preview</li>
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-600 mr-2"></i>Email Newsletter Opt-in</li>
              <li className="flex items-center text-slate-400"><i className="fa-solid fa-lock mr-2"></i>PDF Downloads Locked (0 Quota)</li>
            </ul>
          </div>
          <button
            onClick={onActivateFreePlan}
            className="mt-6 w-full py-2.5 px-4 rounded-xl border border-emerald-300 text-emerald-800 font-semibold text-xs hover:bg-emerald-50 transition"
          >
            Switch to Free Tier
          </button>
        </div>

        {/* Single PDF Purchase */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Pay-Per-Resource</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                1 Download
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Single PDF</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-extrabold text-slate-900">$7.99</span>
              <span className="text-slate-500 text-xs ml-1">/ one-time</span>
            </div>
            <p className="text-xs text-slate-500">Need just one handbook? Unlock a single 1-time download credit immediately.</p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-emerald-100">
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-600 mr-2"></i>1-Time PDF Download Access</li>
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-600 mr-2"></i>No Recurring Subscription</li>
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-600 mr-2"></i>Instant Stripe / PayPal Receipt</li>
            </ul>
          </div>
          <button
            onClick={() => onInitiateCheckout('single', resources[0]?.id || 101)}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-100 hover:bg-emerald-600 text-emerald-900 hover:text-white border border-emerald-300 font-bold text-xs transition shadow-sm"
          >
            Buy Single PDF ($7.99)
          </button>
        </div>

        {/* Premium Monthly */}
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-600 shadow-lg relative flex flex-col justify-between">
          <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
            Most Popular
          </span>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Pro Monthly</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                15 PDFs / mo
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Premium Monthly</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-extrabold text-slate-900">$19</span>
              <span className="text-slate-500 text-xs ml-1">/ month</span>
            </div>
            <p className="text-xs text-slate-500">Ideal for active learners downloading multiple engineering guides monthly.</p>
            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-emerald-100">
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-600 mr-2"></i>15 Full PDF Downloads / Month</li>
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-600 mr-2"></i>Auto-renews every 30 days</li>
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-600 mr-2"></i>Code samples & appendices</li>
            </ul>
          </div>
          <button
            onClick={() => onInitiateCheckout('monthly')}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-md"
          >
            Subscribe Monthly ($19)
          </button>
        </div>

        {/* Premium Yearly */}
        <div className="bg-emerald-700 text-white rounded-2xl p-6 border-2 border-emerald-800 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Best Value</span>
              <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-semibold">
                Unlimited Quota
              </span>
            </div>
            <h3 className="text-xl font-bold">Premium Yearly</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-extrabold">$149</span>
              <span className="text-emerald-100 text-xs ml-1">/ year (Save 35%)</span>
            </div>
            <p className="text-xs text-emerald-100">Unrestricted downloads across the entire vault for 365 days.</p>
            <ul className="space-y-2.5 text-xs text-white pt-2 border-t border-emerald-600">
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-200 mr-2"></i>Unlimited PDF Downloads (999/yr)</li>
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-200 mr-2"></i>Priority New Release Emails</li>
              <li className="flex items-center"><i className="fa-solid fa-check text-emerald-200 mr-2"></i>Verified Certificate of Completion</li>
            </ul>
          </div>
          <button
            onClick={() => onInitiateCheckout('yearly')}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs transition shadow-md"
          >
            Subscribe Yearly ($149)
          </button>
        </div>
      </div>

      {/* Current User Payment & Subscription Ledger */}
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/40 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Payment History & Subscription Ledger</h3>
            <p className="text-xs text-slate-500">Stored in Google Sheet database state and updated immediately upon gateway confirmation</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700">
            <i className="fa-solid fa-shield-check text-emerald-600 mr-1"></i>256-Bit TLS Encrypted
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50/70 text-[11px] font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Plan / Item</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 text-xs sm:text-sm bg-white">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-emerald-50/40 transition">
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-emerald-700">{p.id}</td>
                  <td className="py-3 px-4 text-slate-600">{p.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {p.item} <span className="text-xs font-normal text-slate-400">({p.user})</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.gateway}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">${Number(p.amount).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                      <i className="fa-solid fa-circle-check mr-1"></i>{p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
