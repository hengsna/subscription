'use client';

import { useState } from 'react';

export default function CheckoutModal({
  isOpen,
  onClose,
  plan,
  targetResource,
  onConfirmPayment
}) {
  const [gateway, setGateway] = useState('Stripe');

  if (!isOpen) return null;

  let planTitle = 'Premium Monthly Plan';
  let planDesc = '15 PDF Downloads / Month • Auto-renews every 30 days';
  let price = 19.00;

  if (plan === 'yearly') {
    planTitle = 'Premium Yearly Plan';
    planDesc = 'Unlimited PDF Downloads • Renews annually (Save 35%)';
    price = 149.00;
  } else if (plan === 'single') {
    planTitle = `Single PDF: ${targetResource ? targetResource.title : 'Handbook'}`;
    planDesc = 'One-Time Download Credit • Instant Unlock';
    price = 7.99;
  }

  const handleConfirm = () => {
    onConfirmPayment(plan, price, gateway, targetResource?.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full border-2 border-emerald-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-lock text-emerald-300"></i>
            <span className="font-bold text-sm">Secure Payment Gateway</span>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="p-6 space-y-5 bg-white">
          {/* Order Summary */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Selected Tier</span>
              <h4 className="font-bold text-slate-900 text-base">{planTitle}</h4>
              <p className="text-xs text-slate-600">{planDesc}</p>
            </div>
            <div className="text-xl font-extrabold text-emerald-800">${price.toFixed(2)}</div>
          </div>

          {/* Gateway Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-emerald-50 p-1 rounded-xl border border-emerald-200">
            <button
              type="button"
              onClick={() => setGateway('Stripe')}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                gateway === 'Stripe'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              <i className="fa-brands fa-stripe text-emerald-600 text-base"></i>
              <span>Card (Stripe)</span>
            </button>
            <button
              type="button"
              onClick={() => setGateway('PayPal')}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                gateway === 'PayPal'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              <i className="fa-brands fa-paypal text-emerald-600 text-sm"></i>
              <span>PayPal Express</span>
            </button>
          </div>

          {/* Simulated Stripe Card Fields */}
          {gateway === 'Stripe' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  defaultValue="Alex Rivera"
                  className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs font-medium bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Card Number (Sandbox Mode)</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    readOnly
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs font-mono bg-emerald-50/40"
                  />
                  <i className="fa-brands fa-cc-visa absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-base"></i>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Expiry</label>
                  <input
                    type="text"
                    defaultValue="08 / 29"
                    readOnly
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs font-mono bg-emerald-50/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">CVC</label>
                  <input
                    type="text"
                    defaultValue="884"
                    readOnly
                    className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-xs font-mono bg-emerald-50/40"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
              <i className="fa-brands fa-paypal text-3xl text-emerald-600"></i>
              <p className="text-xs text-slate-700 font-medium">
                You will authorize instant subscription activation via your verified PayPal balance.
              </p>
            </div>
          )}

          <button
            onClick={handleConfirm}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-circle-check"></i>
            <span>Pay & Activate via {gateway} (${price.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
