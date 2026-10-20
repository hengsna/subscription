'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LibraryView from '@/components/LibraryView';
import PricingView from '@/components/PricingView';
import WorkflowView from '@/components/WorkflowView';
import AdminDashboard from '@/components/AdminDashboard';
import AuthPortal from '@/components/AuthPortal';
import GoogleSheetHub from '@/components/GoogleSheetHub';
import CheckoutModal from '@/components/CheckoutModal';
import PreviewModal from '@/components/PreviewModal';
import EmailInboxModal from '@/components/EmailInboxModal';
import UploadModal from '@/components/UploadModal';
import Toast from '@/components/Toast';
import { INITIAL_DATABASE } from '@/lib/initialData';

export default function Home() {
  // Database State
  const [database, setDatabase] = useState(INITIAL_DATABASE);
  const [currentUser, setCurrentUser] = useState(INITIAL_DATABASE.users[0]);
  const [currentTab, setCurrentTab] = useState('library');

  // Google Sheet Web App Integration
  const [webAppUrl, setWebAppUrl] = useState('');
  const [sheetStatus, setSheetStatus] = useState('offline'); // 'online' | 'offline' | 'syncing'
  const [auditLogs, setAuditLogs] = useState([
    { time: '12:00:00', text: 'System initialized in local resilient mode', type: 'info' }
  ]);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState('monthly');
  const [checkoutTargetResource, setCheckoutTargetResource] = useState(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState(null);

  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const addAuditLog = (text, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setAuditLogs((prev) => [{ time, text, type }, ...prev.slice(0, 49)]);
  };

  // Load configuration and data on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('eduvault_webapp_url') || '';
    if (savedUrl) {
      setWebAppUrl(savedUrl);
      syncDatabaseFromSheet(savedUrl);
    }
  }, []);

  // Fetch all 5 tables from Google Sheet
  const syncDatabaseFromSheet = async (targetUrl = webAppUrl) => {
    setSheetStatus('syncing');
    addAuditLog(`Connecting to Google Sheet endpoint: ${targetUrl ? targetUrl.slice(0, 35) + '...' : 'none'}`, 'info');

    try {
      const endpoint = `/api/sheet?webAppUrl=${encodeURIComponent(targetUrl || '')}`;
      const res = await fetch(endpoint);
      const json = await res.json();

      if (json.status === 'online' && json.data) {
        setDatabase(json.data);
        setSheetStatus('online');
        addAuditLog('Successfully synchronized 5 tables from Google Sheet', 'success');
        addToast('Synced with live Google Sheet database!', 'success');

        // Refresh current user session
        if (currentUser) {
          const match = json.data.users?.find((u) => u.id === currentUser.id);
          if (match) setCurrentUser(match);
        }
      } else {
        setSheetStatus('offline');
        addAuditLog(`Using local database state: ${json.message || 'Offline'}`, 'info');
      }
    } catch (err) {
      setSheetStatus('offline');
      addAuditLog(`Sync failed: ${err.message}. Retaining local state.`, 'error');
    }
  };

  // Dispatch Mutation to Google Sheet and update state locally
  const dispatchMutation = async (action, payload) => {
    addAuditLog(`Dispatched action: "${action}" to Google Sheets`, 'info');

    if (webAppUrl) {
      try {
        await fetch('/api/sheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webAppUrl,
            action,
            ...payload
          })
        });
        addAuditLog(`Action "${action}" successfully persisted to Google Sheet`, 'success');
      } catch (err) {
        addAuditLog(`Action "${action}" failed on remote: ${err.message}`, 'error');
      }
    }
  };

  // Persona Switcher
  const handleSwitchPersona = (key) => {
    let selected = null;
    if (key === 'normal') {
      selected = {
        id: 3, name: "Liam O'Connor", email: 'liam@freelance.dev',
        role: 'normal', plan: 'free', emailVerified: true,
        quotaRemaining: 0, quotaMax: 0, renewalDate: 'N/A (Free)',
        singlePdfUnlockedIds: []
      };
      addToast('Switched to Normal User (Free — View Only)', 'info');
    } else if (key === 'premium_monthly') {
      selected = {
        id: 1, name: 'Alex Rivera', email: 'alex@eduvault.io',
        role: 'premium', plan: 'monthly', emailVerified: true,
        quotaRemaining: 12, quotaMax: 15, renewalDate: 'Nov 17, 2026',
        singlePdfUnlockedIds: []
      };
      addToast('Switched to Premium Monthly (12/15 Quota)', 'success');
    } else if (key === 'premium_yearly') {
      selected = {
        id: 2, name: 'Sophia Chen', email: 'sophia@stanford.edu',
        role: 'premium', plan: 'yearly', emailVerified: true,
        quotaRemaining: 999, quotaMax: 999, renewalDate: 'Oct 17, 2027',
        singlePdfUnlockedIds: []
      };
      addToast('Switched to Premium Yearly (Unlimited Downloads)', 'success');
    } else if (key === 'single_buyer') {
      selected = {
        id: 4, name: 'Maya Lin', email: 'maya@startup.io',
        role: 'normal', plan: 'single', emailVerified: true,
        quotaRemaining: 1, quotaMax: 1, renewalDate: 'One-Time Credit',
        singlePdfUnlockedIds: [102]
      };
      addToast('Switched to Single PDF Buyer (1-Time Download)', 'warning');
    } else if (key === 'unverified') {
      selected = {
        id: 5, name: 'Noah Patel', email: 'noah@unverified.org',
        role: 'normal', plan: 'free', emailVerified: false,
        quotaRemaining: 0, quotaMax: 0, renewalDate: 'Pending Verification',
        singlePdfUnlockedIds: []
      };
      addToast('Switched to Unverified User (Double Opt-In Pending)', 'warning');
    } else if (key === 'admin') {
      selected = {
        id: 6, name: 'Elena Vance (Admin)', email: 'admin@eduvault.io',
        role: 'admin', plan: 'yearly', emailVerified: true,
        quotaRemaining: 999, quotaMax: 999, renewalDate: 'Permanent Admin',
        singlePdfUnlockedIds: []
      };
      addToast('Switched to Platform Admin', 'success');
    }

    if (selected) {
      setCurrentUser(selected);
      // Sync into users list
      setDatabase((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === selected.id ? selected : u))
      }));
    }
  };

  // PDF Download Action
  const handleDownloadPdf = (resource) => {
    if (!currentUser) return;

    let newQuota = currentUser.quotaRemaining;
    let newUnlockedIds = [...(currentUser.singlePdfUnlockedIds || [])];

    if (currentUser.plan === 'single' || newUnlockedIds.includes(resource.id)) {
      newUnlockedIds = newUnlockedIds.filter((id) => id !== resource.id);
      newQuota = Math.max(0, newQuota - 1);
      addToast(`Downloaded "${resource.title}". 1-Time credit consumed!`, 'success');
    } else if (currentUser.plan === 'monthly') {
      newQuota = Math.max(0, newQuota - 1);
      addToast(`Downloaded "${resource.title}". Remaining quota: ${newQuota}/${currentUser.quotaMax}`, 'success');
    } else {
      addToast(`Downloaded "${resource.title}" via Unlimited tier!`, 'success');
    }

    const updatedUser = {
      ...currentUser,
      quotaRemaining: newQuota,
      singlePdfUnlockedIds: newUnlockedIds
    };
    setCurrentUser(updatedUser);

    // Update resources and users in database state
    setDatabase((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === currentUser.id ? updatedUser : u)),
      resources: prev.resources.map((r) =>
        r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
      )
    }));

    // Dispatch atomic quota and download update to Google Sheets
    dispatchMutation('updateQuota', {
      userId: currentUser.id,
      resourceId: resource.id
    });
  };

  // Unlock PDF / Open Checkout
  const handleUnlockPdf = (resource) => {
    if (currentUser && !currentUser.emailVerified) {
      addToast('Please verify your email address (Double Opt-In) before unlocking PDFs.', 'warning');
      return;
    }
    setCheckoutPlan('single');
    setCheckoutTargetResource(resource);
    setIsCheckoutOpen(true);
  };

  const handleInitiateCheckout = (plan, resourceId = null) => {
    setCheckoutPlan(plan);
    if (resourceId) {
      const match = database.resources.find((r) => r.id === resourceId);
      setCheckoutTargetResource(match || database.resources[0]);
    } else {
      setCheckoutTargetResource(null);
    }
    setIsCheckoutOpen(true);
  };

  // Confirm Payment & Activate Subscription
  const handleConfirmPayment = (plan, amount, gateway, targetResourceId) => {
    if (!currentUser) {
      addToast('Please log in first to activate a subscription.', 'error');
      setCurrentTab('auth');
      setIsCheckoutOpen(false);
      return;
    }

    let itemDesc = 'Premium Monthly Plan';
    let newQuota = 15;
    let newQuotaMax = 15;
    let newRenewal = 'Nov 17, 2026';
    let newRole = 'premium';
    let unlocked = [...(currentUser.singlePdfUnlockedIds || [])];

    if (plan === 'yearly') {
      itemDesc = 'Premium Yearly Plan';
      newQuota = 999;
      newQuotaMax = 999;
      newRenewal = 'Oct 17, 2027';
      newRole = 'premium';
    } else if (plan === 'single') {
      const res = database.resources.find((r) => r.id === targetResourceId) || checkoutTargetResource;
      itemDesc = `Single PDF (#${targetResourceId || 101} ${res ? res.title.slice(0, 24) + '...' : ''})`;
      newQuota = currentUser.quotaRemaining + 1;
      newQuotaMax = Math.max(currentUser.quotaMax, newQuota);
      newRenewal = 'One-Time Credit';
      newRole = currentUser.role;
      if (targetResourceId && !unlocked.includes(targetResourceId)) {
        unlocked.push(targetResourceId);
      }
    }

    const updatedUser = {
      ...currentUser,
      role: newRole,
      plan: plan,
      quotaRemaining: newQuota,
      quotaMax: newQuotaMax,
      renewalDate: newRenewal,
      singlePdfUnlockedIds: unlocked
    };
    setCurrentUser(updatedUser);

    const txnId = 'TXN-' + Math.floor(10000 + Math.random() * 90000);
    const newPayment = {
      id: txnId,
      date: 'Today',
      user: currentUser.name,
      userEmail: currentUser.email,
      item: itemDesc,
      gateway: gateway,
      amount: amount,
      status: 'Succeeded'
    };

    const newEmail = {
      id: Date.now(),
      to: currentUser.email,
      subject: `[${gateway} Receipt] ${itemDesc} Activated (${txnId})`,
      timestamp: 'Just now',
      body: `Thank you ${currentUser.name}! Your payment of $${amount.toFixed(2)} via ${gateway} was confirmed. Your quota is ready in Google Sheets!`,
      actionType: null
    };

    setDatabase((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === currentUser.id ? updatedUser : u)),
      payments: [newPayment, ...prev.payments],
      emails: [newEmail, ...prev.emails]
    }));

    setIsCheckoutOpen(false);
    addToast(`${itemDesc} activated! Stored in Google Sheets.`, 'success');

    // Sync payment and user update to Google Sheets
    dispatchMutation('addPayment', { payment: newPayment });
    dispatchMutation('updateUser', { user: updatedUser });
    dispatchMutation('logEmail', { email: newEmail });
  };

  // Switch to Free Tier
  const handleActivateFreePlan = () => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      role: 'normal',
      plan: 'free',
      quotaRemaining: 0,
      quotaMax: 0,
      renewalDate: 'N/A (Free)'
    };
    setCurrentUser(updated);
    setDatabase((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === currentUser.id ? updated : u))
    }));
    addToast('Switched to Free Tier', 'info');
    dispatchMutation('updateUser', { user: updated });
  };

  // Auth: Login
  const handleLogin = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const match = database.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (match) {
      setCurrentUser(match);
      addToast(`Welcome back, ${match.name}!`, 'success');
    } else {
      const newUser = {
        id: Date.now(),
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'normal',
        plan: 'free',
        emailVerified: true,
        quotaRemaining: 0,
        quotaMax: 0,
        renewalDate: 'N/A (Free)',
        singlePdfUnlockedIds: []
      };
      setCurrentUser(newUser);
      setDatabase((prev) => ({ ...prev, users: [...prev.users, newUser] }));
      addToast(`Account created and signed in as ${newUser.name}`, 'success');
      dispatchMutation('addUser', { user: newUser });
    }
    setCurrentTab('library');
  };

  // Auth: Register (with SendGrid Double Opt-In Email)
  const handleRegister = ({ name, email, plan, newsletter }) => {
    const cleanEmail = email.trim().toLowerCase();
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      role: plan === 'free' ? 'normal' : 'premium',
      plan: plan,
      emailVerified: false, // Requires Double Opt-In confirmation!
      quotaRemaining: plan === 'monthly' ? 15 : plan === 'yearly' ? 999 : 0,
      quotaMax: plan === 'monthly' ? 15 : plan === 'yearly' ? 999 : 0,
      renewalDate: plan === 'free' ? 'N/A' : 'Nov 17, 2026',
      singlePdfUnlockedIds: []
    };

    const optInEmail = {
      id: Date.now(),
      to: cleanEmail,
      subject: '[Action Required] Confirm your EduVault Email (Double Opt-In)',
      timestamp: 'Just now',
      body: `Welcome ${name}! Please confirm your email address to complete your Double Opt-In verification and unlock your ${plan.toUpperCase()} capabilities.`,
      actionType: 'verify_email'
    };

    setCurrentUser(newUser);
    setDatabase((prev) => ({
      ...prev,
      users: [newUser, ...prev.users],
      emails: [optInEmail, ...prev.emails]
    }));

    addToast('Account created! Please open Simulated Inbox to verify your email.', 'warning');
    setIsInboxOpen(true);

    dispatchMutation('addUser', { user: newUser });
    dispatchMutation('logEmail', { email: optInEmail });
  };

  // Auth: Password Reset
  const handleResetPassword = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const resetMail = {
      id: Date.now(),
      to: cleanEmail,
      subject: '[SendGrid Security] Password Reset Link for EduVault',
      timestamp: 'Just now',
      body: `We received a request to reset your password for ${cleanEmail}. Click the button below to simulate saving a new password.`,
      actionType: 'reset_password'
    };

    setDatabase((prev) => ({
      ...prev,
      emails: [resetMail, ...prev.emails]
    }));

    addToast(`Password reset link sent to ${cleanEmail}! Opening inbox...`, 'info');
    setIsInboxOpen(true);
    dispatchMutation('logEmail', { email: resetMail });
  };

  // Email Double Opt-In Verification
  const handleConfirmDoubleOptIn = (email) => {
    const targetEmail = (email || currentUser?.email || '').toLowerCase();
    if (currentUser && currentUser.email.toLowerCase() === targetEmail) {
      setCurrentUser((prev) => ({ ...prev, emailVerified: true }));
    }

    setDatabase((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.email.toLowerCase() === targetEmail ? { ...u, emailVerified: true } : u
      )
    }));

    setIsInboxOpen(false);
    addToast('Email verified via Double Opt-In! Full downloads and upgrades unlocked.', 'success');
    dispatchMutation('verifyEmail', { email: targetEmail });
  };

  const handleSimulatePasswordReset = () => {
    setIsInboxOpen(false);
    addToast('Password updated! You can now log in with your credentials.', 'success');
    setCurrentTab('auth');
  };

  // Admin Actions
  const handleAdminVerifyUser = (userId) => {
    const match = database.users.find((u) => u.id === userId);
    if (!match) return;

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({ ...prev, emailVerified: true }));
    }

    setDatabase((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, emailVerified: true } : u))
    }));

    addToast(`Verified email for ${match.name}`, 'success');
    dispatchMutation('verifyEmail', { email: match.email });
  };

  const handleAdminGrantQuota = (userId) => {
    const match = database.users.find((u) => u.id === userId);
    if (!match) return;

    const newRemaining = match.quotaRemaining + 5;
    const newMax = Math.max(match.quotaMax, newRemaining);

    const updated = {
      ...match,
      quotaRemaining: newRemaining,
      quotaMax: newMax
    };

    if (currentUser?.id === userId) {
      setCurrentUser(updated);
    }

    setDatabase((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? updated : u))
    }));

    addToast(`Granted +5 quota to ${match.name}`, 'success');
    dispatchMutation('updateUser', { user: updated });
  };

  const handleAdminDeleteResource = (resourceId) => {
    setDatabase((prev) => ({
      ...prev,
      resources: prev.resources.filter((r) => r.id !== resourceId)
    }));
    addToast('Resource removed from catalog.', 'info');
    dispatchMutation('deleteResource', { resourceId });
  };

  const handleAdminUploadResource = (resData) => {
    const newRes = {
      id: 100 + database.resources.length + 1,
      downloads: 0,
      price: 7.99,
      ...resData
    };

    setDatabase((prev) => ({
      ...prev,
      resources: [newRes, ...prev.resources]
    }));

    addToast(`Published "${resData.title}" to library catalog!`, 'success');
    dispatchMutation('addResource', { resource: newRes });
  };

  // Google Sheet Web App Config Save
  const handleSaveWebAppUrl = (url) => {
    setWebAppUrl(url);
    localStorage.setItem('eduvault_webapp_url', url);
    addToast('Saved Google Apps Script Web App URL!', 'success');
    syncDatabaseFromSheet(url);
  };

  // Initialize Database in Google Sheet
  const handleInitRemoteDatabase = async () => {
    if (!webAppUrl) {
      addToast('Please enter and save your Google Apps Script Web App URL first.', 'warning');
      return;
    }
    addAuditLog('Calling "initializeDatabase" on remote spreadsheet...', 'info');
    try {
      await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webAppUrl,
          action: 'initializeDatabase'
        })
      });
      addToast('Google Sheet tables initialized with emerald headers and initial records!', 'success');
      syncDatabaseFromSheet(webAppUrl);
    } catch (err) {
      addToast(`Failed to initialize: ${err.message}`, 'error');
    }
  };

  // Copy Apps Script Code to clipboard
  const handleCopyScript = () => {
    // In browser, read from static script or provide full text
    fetch('/google_sheet_backend_code.js')
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => {
        const code = text || '// Please copy from google_sheet_backend_code.js in the repository';
        navigator.clipboard.writeText(code);
        addToast('Google Apps Script code copied to clipboard!', 'success');
      })
      .catch(() => {
        addToast('Please copy from google_sheet_backend_code.js in this repo.', 'info');
      });
  };

  return (
    <>
      <Header
        currentTab={currentTab}
        onSwitchTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchPersona={handleSwitchPersona}
        onOpenInbox={() => setIsInboxOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          addToast('Signed out of session.', 'info');
          setCurrentTab('auth');
        }}
        onVerifyEmail={() => handleConfirmDoubleOptIn(currentUser?.email)}
        onResendVerification={() => {
          addToast('Double Opt-In confirmation link re-sent to Simulated Inbox.', 'info');
          setIsInboxOpen(true);
        }}
        emailCount={database.emails.length}
        sheetStatus={sheetStatus}
        onOpenGoogleSheetHub={() => setCurrentTab('database')}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        {currentTab === 'library' && (
          <LibraryView
            resources={database.resources}
            currentUser={currentUser}
            onOpenPreview={(r) => {
              setPreviewResource(r);
              setIsPreviewOpen(true);
            }}
            onDownloadPdf={handleDownloadPdf}
            onUnlockPdf={handleUnlockPdf}
            onSwitchTab={setCurrentTab}
          />
        )}

        {currentTab === 'pricing' && (
          <PricingView
            resources={database.resources}
            payments={database.payments}
            onInitiateCheckout={handleInitiateCheckout}
            onActivateFreePlan={handleActivateFreePlan}
          />
        )}

        {currentTab === 'workflow' && (
          <WorkflowView
            currentUser={currentUser}
            onSwitchPersona={handleSwitchPersona}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            users={database.users}
            resources={database.resources}
            payments={database.payments}
            onOpenUploadModal={() => setIsUploadOpen(true)}
            onAdminVerifyUser={handleAdminVerifyUser}
            onAdminGrantQuota={handleAdminGrantQuota}
            onAdminDeleteResource={handleAdminDeleteResource}
          />
        )}

        {currentTab === 'database' && (
          <GoogleSheetHub
            database={database}
            sheetStatus={sheetStatus}
            webAppUrl={webAppUrl}
            onSaveWebAppUrl={handleSaveWebAppUrl}
            onSyncNow={() => syncDatabaseFromSheet(webAppUrl)}
            onInitDatabase={handleInitRemoteDatabase}
            auditLogs={auditLogs}
            onCopyScript={handleCopyScript}
          />
        )}

        {currentTab === 'auth' && (
          <AuthPortal
            onLogin={handleLogin}
            onRegister={handleRegister}
            onResetPassword={handleResetPassword}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-emerald-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-emerald-800">EduVault E-Learning</span>
            <span>•</span>
            <span>Next.js + Google Sheets Relational Database</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
            >
              <i className="fa-solid fa-table"></i>
              <span>Google Sheet (18KbYjse...)</span>
            </a>
            <span>•</span>
            <a
              href="https://github.com/hengsna/subscription.git"
              target="_blank"
              rel="noreferrer"
              className="text-slate-700 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <i className="fa-brands fa-github"></i>
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={checkoutPlan}
        targetResource={checkoutTargetResource}
        onConfirmPayment={handleConfirmPayment}
      />

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        resource={previewResource}
        canDownload={
          previewResource
            ? currentUser?.role === 'admin' ||
              currentUser?.plan === 'yearly' ||
              (currentUser?.plan === 'monthly' && currentUser?.quotaRemaining > 0) ||
              currentUser?.singlePdfUnlockedIds?.includes(previewResource.id)
            : false
        }
        downloadReason={
          currentUser?.plan === 'yearly'
            ? 'Unlimited'
            : currentUser?.singlePdfUnlockedIds?.includes(previewResource?.id)
            ? '1-Time Credit'
            : `${currentUser?.quotaRemaining || 0} Quota left`
        }
        onDownload={handleDownloadPdf}
        onUnlock={handleUnlockPdf}
      />

      <EmailInboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        emails={database.emails}
        onConfirmDoubleOptIn={handleConfirmDoubleOptIn}
        onSimulatePasswordReset={handleSimulatePasswordReset}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadResource={handleAdminUploadResource}
      />

      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </>
  );
}
