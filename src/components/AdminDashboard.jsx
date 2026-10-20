'use client';

export default function AdminDashboard({
  users,
  resources,
  payments,
  onOpenUploadModal,
  onAdminVerifyUser,
  onAdminGrantQuota,
  onAdminDeleteResource
}) {
  const totalRevenue = payments.reduce((acc, p) => acc + Number(p.amount), 1252.98);
  const totalDownloads = resources.reduce((acc, r) => acc + Number(r.downloads), 0);

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Admin Header Banner */}
      <div className="bg-emerald-800 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-200 mb-1">
            <i className="fa-solid fa-shield-halved"></i>
            <span>Role-Based Admin Control Center</span>
          </div>
          <h2 className="text-2xl font-extrabold">Platform Operations, Users & Revenue</h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Manage users, replenish download quotas, and inspect real-time Stripe/PayPal payment records synced with Google Sheets.
          </p>
        </div>
        <button
          onClick={onOpenUploadModal}
          className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 shadow-md"
        >
          <i className="fa-solid fa-cloud-arrow-up text-emerald-600"></i>
          <span>Upload New Learning PDF</span>
        </button>
      </div>

      {/* KPI Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Total Revenue</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <i className="fa-solid fa-dollar-sign"></i>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            <i className="fa-solid fa-arrow-trend-up mr-1"></i>+18.4% vs last month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Registered Users</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <i className="fa-solid fa-users"></i>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{users.length}</div>
          <p className="text-xs text-slate-500 mt-1">Across Free, Monthly, Yearly & Admin</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Total PDF Downloads</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <i className="fa-solid fa-file-arrow-down"></i>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalDownloads}</div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Tracked in Google Sheets</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Library Resources</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <i className="fa-solid fa-book"></i>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{resources.length} PDFs</div>
          <p className="text-xs text-slate-500 mt-1">4 Active Categories</p>
        </div>
      </div>

      {/* Admin Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User & Subscription Management Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/40 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manage Users & Subscriptions</h3>
              <p className="text-xs text-slate-500">Modify user plans, verify emails, or replenish download quotas</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/70 text-[11px] font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-200">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4">Plan / Role</th>
                  <th className="py-3 px-4">Quota Left</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 text-xs bg-white">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-emerald-50/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {u.emailVerified ? (
                        <span className="text-emerald-600 font-bold">
                          <i className="fa-solid fa-check mr-1"></i>Yes
                        </span>
                      ) : (
                        <button
                          onClick={() => onAdminVerifyUser(u.id)}
                          className="text-emerald-700 underline font-semibold hover:text-emerald-900"
                        >
                          Verify Now
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 uppercase font-bold text-[11px] text-emerald-700">{u.plan}</td>
                    <td className="py-3 px-4 font-semibold">
                      {u.plan === 'yearly' || u.role === 'admin' ? 'Unlimited' : u.quotaRemaining}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => onAdminGrantQuota(u.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-[11px] transition"
                      >
                        +5 Quota
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Breakdown & Resource Mini-List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue by Subscription Tier</h3>
              <p className="text-xs text-slate-500">Live distribution across payment models</p>
            </div>
            <i className="fa-solid fa-chart-pie text-emerald-600 text-lg"></i>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Premium Yearly ($149/yr)</span>
                <span className="text-emerald-800 font-bold">62% ($894.00)</span>
              </div>
              <div className="w-full h-2.5 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Premium Monthly ($19/mo)</span>
                <span className="text-emerald-800 font-bold">28% ($399.00)</span>
              </div>
              <div className="w-full h-2.5 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Single PDF Purchases ($7.99)</span>
                <span className="text-emerald-800 font-bold">10% ($135.97)</span>
              </div>
              <div className="w-full h-2.5 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
              Recently Uploaded Resources
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {resources.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-800">{r.title}</span>
                    <span className="block text-[10px] text-slate-500">
                      {r.category} • {r.downloads} downloads
                    </span>
                  </div>
                  <button
                    onClick={() => onAdminDeleteResource(r.id)}
                    title="Delete resource"
                    className="text-slate-400 hover:text-rose-600 p-1 transition"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
