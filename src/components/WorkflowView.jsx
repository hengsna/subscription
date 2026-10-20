'use client';

import { useState } from 'react';

export default function WorkflowView({ currentUser, onSwitchPersona }) {
  const [selectedNode, setSelectedNode] = useState('signup');

  const details = {
    signup: {
      title: 'Step 1: User Registration & JWT Authentication',
      desc: 'Validates email/password payload, stores credential record in Google Sheets Users table, and creates initial token session.',
      code: 'POST /api/sheet (action: "addUser") -> 200 OK'
    },
    verify: {
      title: 'Step 2: Double Opt-In Email Verification (SendGrid)',
      desc: 'Dispatches a verification token link. Restricts full PDF downloads until EmailVerified is set to true in Google Sheets.',
      code: 'POST /api/sheet (action: "verifyEmail") -> 200 OK'
    },
    select_sub: {
      title: 'Step 3: Tiered Subscription & Pricing Selector',
      desc: 'Supports choosing Free ($0), Monthly ($19), Yearly ($149), or Single PDF ($7.99) with dynamic quota mapping.',
      code: 'GET /api/sheet (action: "getData") -> [users, resources, payments]'
    },
    gateway: {
      title: 'Step 4: Stripe & PayPal Payment Webhook Handler',
      desc: 'Processes checkout confirmation, appends transaction row to Payments sheet, and increments user quota.',
      code: 'POST /api/sheet (action: "addPayment") -> TXN-XXXXX'
    },
    library: {
      title: 'Step 5: Role-Based Library Access Engine',
      desc: 'Normal users receive executive abstract previews; Premium and Single PDF buyers receive download authorization.',
      code: 'RBAC Access Guard: checks quotaRemaining & singlePdfUnlockedIds'
    },
    download: {
      title: 'Step 6: Atomic Quota Decrement & PDF Download',
      desc: 'Verifies remaining quota > 0, decrements user quota and increments resource download count in Google Sheets.',
      code: 'POST /api/sheet (action: "updateQuota") -> 200 OK'
    },
    admin_login: {
      title: 'Admin Flow: Role Guard & Elevated Session',
      desc: 'Enforces role === "admin" permission check before exposing user quota replenishment and resource uploads.',
      code: 'requireRole("admin") Guard'
    },
    admin_users: {
      title: 'Admin Flow: User & Quota Governance',
      desc: 'Allows platform admins to manually verify user accounts or inject bonus PDF download credits directly into Google Sheets.',
      code: 'POST /api/sheet (action: "updateUser")'
    },
    admin_upload: {
      title: 'Admin Flow: Categorized Resource Ingestion',
      desc: 'Appends new PDF guide metadata (title, category, pages, abstract) as a new row in Google Sheets Resources table.',
      code: 'POST /api/sheet (action: "addResource")'
    },
    admin_payments: {
      title: 'Admin Flow: Real-Time Revenue & Conversion Analytics',
      desc: 'Aggregates Stripe & PayPal ledger rows by subscription tier and monitors download velocity across all catalogs.',
      code: 'GET /api/sheet -> compute MRR & conversions'
    }
  };

  const currentInfo = details[selectedNode] || details.signup;
  const plan = currentUser?.plan || 'free';

  return (
    <section className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Interactive System Blueprint</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">End-to-End User & Admin Workflow Diagram</h2>
            <p className="text-sm text-slate-600">Click any workflow node below to inspect its validation rules, API endpoints, and live state.</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Live Highlight:</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2 animate-pulse"></span>
              Synced with {currentUser?.name || 'Active Persona'}
            </span>
          </div>
        </div>

        {/* 1. USER PIPELINE */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center">
            <i className="fa-solid fa-user-graduate text-emerald-600 mr-2"></i>1. Primary User Journey Pipeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-stretch">
            <div
              onClick={() => setSelectedNode('signup')}
              className={`flow-node cursor-pointer p-4 rounded-xl border-2 bg-white flex flex-col justify-between ${
                selectedNode === 'signup' ? 'active-node border-emerald-600 bg-emerald-50' : 'border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 mb-2">
                <span>STEP 01</span>
                <i className="fa-solid fa-user-plus text-emerald-600 text-sm"></i>
              </div>
              <div className="font-bold text-sm text-slate-900">[Signup / Login]</div>
              <p className="text-[11px] text-slate-500 mt-1">Next.js API + Google Sheets User table</p>
            </div>

            <div
              onClick={() => setSelectedNode('verify')}
              className={`flow-node cursor-pointer p-4 rounded-xl border-2 bg-white flex flex-col justify-between ${
                selectedNode === 'verify' ? 'active-node border-emerald-600 bg-emerald-50' : 'border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 mb-2">
                <span>STEP 02</span>
                <i className="fa-solid fa-envelope-circle-check text-emerald-600 text-sm"></i>
              </div>
              <div className="font-bold text-sm text-slate-900">[Email Verification]</div>
              <p className="text-[11px] text-slate-500 mt-1">SendGrid Double Opt-In token link</p>
            </div>

            <div
              onClick={() => setSelectedNode('select_sub')}
              className={`flow-node cursor-pointer p-4 rounded-xl border-2 bg-white flex flex-col justify-between ${
                selectedNode === 'select_sub' ? 'active-node border-emerald-600 bg-emerald-50' : 'border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 mb-2">
                <span>STEP 03</span>
                <i className="fa-solid fa-list-check text-emerald-600 text-sm"></i>
              </div>
              <div className="font-bold text-sm text-slate-900">[Select Subscription]</div>
              <p className="text-[11px] text-slate-500 mt-1">Free, Monthly, Yearly, or Single PDF</p>
            </div>

            <div
              onClick={() => setSelectedNode('gateway')}
              className={`flow-node cursor-pointer p-4 rounded-xl border-2 bg-white flex flex-col justify-between ${
                selectedNode === 'gateway' ? 'active-node border-emerald-600 bg-emerald-50' : 'border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 mb-2">
                <span>STEP 04</span>
                <i className="fa-brands fa-stripe text-emerald-600 text-lg"></i>
              </div>
              <div className="font-bold text-sm text-slate-900">[Payment Gateway]</div>
              <p className="text-[11px] text-slate-500 mt-1">Stripe / PayPal webhook recorded</p>
            </div>

            <div
              onClick={() => setSelectedNode('library')}
              className={`flow-node cursor-pointer p-4 rounded-xl border-2 bg-white flex flex-col justify-between ${
                selectedNode === 'library' ? 'active-node border-emerald-600 bg-emerald-50' : 'border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 mb-2">
                <span>STEP 05</span>
                <i className="fa-solid fa-book-bookmark text-emerald-600 text-sm"></i>
              </div>
              <div className="font-bold text-sm text-slate-900">[Access Library]</div>
              <p className="text-[11px] text-slate-500 mt-1">RBAC checks user tier & quota</p>
            </div>

            <div
              onClick={() => setSelectedNode('download')}
              className={`flow-node cursor-pointer p-4 rounded-xl border-2 bg-white flex flex-col justify-between ${
                selectedNode === 'download' ? 'active-node border-emerald-600 bg-emerald-50' : 'border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 mb-2">
                <span>STEP 06</span>
                <i className="fa-solid fa-file-arrow-down text-emerald-600 text-sm"></i>
              </div>
              <div className="font-bold text-sm text-slate-900">[Download PDFs]</div>
              <p className="text-[11px] text-slate-500 mt-1">Decrement quota in Google Sheet</p>
            </div>
          </div>
        </div>

        {/* 2. DECISION BRANCHES */}
        <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center">
              <i className="fa-solid fa-code-branch text-emerald-600 mr-2"></i>2. Conditional Decision Branches (Access Control Engine)
            </h3>
            <span className="text-xs text-emerald-700 font-semibold">Click any branch to test persona</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => onSwitchPersona('normal')}
              className={`flow-node cursor-pointer p-4 rounded-xl bg-white border-2 flex items-start space-x-3.5 ${
                plan === 'free' ? 'active-node border-emerald-600' : 'border-emerald-200'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 font-bold text-sm">
                <i className="fa-solid fa-eye"></i>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-600">Condition A</span>
                <h4 className="font-bold text-sm text-slate-900">If Free → View Only</h4>
                <p className="text-xs text-slate-600 mt-1">User can browse catalog and read abstracts. Download returns locked prompt.</p>
              </div>
            </div>

            <div
              onClick={() => onSwitchPersona('premium_monthly')}
              className={`flow-node cursor-pointer p-4 rounded-xl bg-white border-2 flex items-start space-x-3.5 ${
                plan === 'monthly' || plan === 'yearly' ? 'active-node border-emerald-600' : 'border-emerald-200'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-sm">
                <i className="fa-solid fa-cloud-arrow-down"></i>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-600">Condition B</span>
                <h4 className="font-bold text-sm text-slate-900">If Premium → Download Access</h4>
                <p className="text-xs text-slate-600 mt-1">Monthly grants 15 downloads/cycle; Yearly grants unlimited access.</p>
              </div>
            </div>

            <div
              onClick={() => onSwitchPersona('single_buyer')}
              className={`flow-node cursor-pointer p-4 rounded-xl bg-white border-2 flex items-start space-x-3.5 ${
                plan === 'single' ? 'active-node border-emerald-600' : 'border-emerald-200'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-sm">
                <i className="fa-solid fa-file-shield"></i>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-600">Condition C</span>
                <h4 className="font-bold text-sm text-slate-900">If Single PDF → One Download Only</h4>
                <p className="text-xs text-slate-600 mt-1">Unlocks 1-time credit for purchased PDF ID. Consumed immediately upon download.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ADMIN WORKFLOW */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center">
            <i className="fa-solid fa-user-shield text-emerald-600 mr-2"></i>3. Administrator Governance Flow
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div onClick={() => setSelectedNode('admin_login')} className="flow-node cursor-pointer p-4 rounded-xl border border-emerald-600 bg-emerald-800 text-white">
              <div className="text-[10px] font-bold text-emerald-200 uppercase">Admin Step 1</div>
              <div className="font-bold text-sm mt-1">[Admin Login]</div>
              <p className="text-xs text-emerald-100 mt-1">Role verification (`role === admin`)</p>
            </div>
            <div onClick={() => setSelectedNode('admin_users')} className="flow-node cursor-pointer p-4 rounded-xl border border-emerald-600 bg-emerald-800 text-white">
              <div className="text-[10px] font-bold text-emerald-200 uppercase">Admin Step 2</div>
              <div className="font-bold text-sm mt-1">[Manage Users]</div>
              <p className="text-xs text-emerald-100 mt-1">Upgrade tiers, verify emails, add quotas</p>
            </div>
            <div onClick={() => setSelectedNode('admin_upload')} className="flow-node cursor-pointer p-4 rounded-xl border border-emerald-600 bg-emerald-800 text-white">
              <div className="text-[10px] font-bold text-emerald-200 uppercase">Admin Step 3</div>
              <div className="font-bold text-sm mt-1">[Upload Resources]</div>
              <p className="text-xs text-emerald-100 mt-1">Publish new categorized PDFs to Sheet</p>
            </div>
            <div onClick={() => setSelectedNode('admin_payments')} className="flow-node cursor-pointer p-4 rounded-xl border border-emerald-600 bg-emerald-800 text-white">
              <div className="text-[10px] font-bold text-emerald-200 uppercase">Admin Step 4</div>
              <div className="font-bold text-sm mt-1">[Monitor Payments]</div>
              <p className="text-xs text-emerald-100 mt-1">Audit Stripe/PayPal transactions & MRR</p>
            </div>
          </div>
        </div>

        {/* Node Inspector Detail Box */}
        <div className="bg-emerald-900 text-white rounded-xl p-5 border border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 bg-emerald-800 px-2.5 py-0.5 rounded">
              API & Logic Inspector
            </span>
            <h4 className="text-base font-bold">{currentInfo.title}</h4>
            <p className="text-xs text-emerald-100">{currentInfo.desc}</p>
          </div>
          <code className="text-xs bg-white text-emerald-900 font-bold px-3.5 py-2 rounded-lg font-mono shrink-0 border border-emerald-300">
            {currentInfo.code}
          </code>
        </div>
      </div>

      {/* TECH STACK ARCHITECTURE */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-lg">
            <i className="fa-brands fa-react"></i>
          </div>
          <h4 className="font-bold text-sm text-slate-900">Frontend Layer</h4>
          <p className="text-xs font-semibold text-emerald-600">Next.js + Tailwind CSS</p>
          <p className="text-xs text-slate-500">Fast React components, responsive layout, dynamic quota gauges.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-lg">
            <i className="fa-brands fa-node-js"></i>
          </div>
          <h4 className="font-bold text-sm text-slate-900">Backend API</h4>
          <p className="text-xs font-semibold text-emerald-600">Next.js API Routes</p>
          <p className="text-xs text-slate-500">Server-side proxy to Google Sheets, CORS resolution, error isolation.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-lg">
            <i className="fa-solid fa-table"></i>
          </div>
          <h4 className="font-bold text-sm text-slate-900">Database</h4>
          <p className="text-xs font-semibold text-emerald-600">Google Sheets + Apps Script</p>
          <p className="text-xs text-slate-500">5 relational sheets (Users, Resources, Payments, Emails, Subscriptions).</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-lg">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
          <h4 className="font-bold text-sm text-slate-900">Email Service</h4>
          <p className="text-xs font-semibold text-emerald-600">SendGrid / Mailchimp</p>
          <p className="text-xs text-slate-500">Simulated double opt-in verification and payment receipts.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-lg">
            <i className="fa-brands fa-stripe-s"></i>
          </div>
          <h4 className="font-bold text-sm text-slate-900">Payment Gateway</h4>
          <p className="text-xs font-semibold text-emerald-600">Stripe & PayPal</p>
          <p className="text-xs text-slate-500">Recurring billing simulation & single PDF checkouts.</p>
        </div>
      </div>
    </section>
  );
}
