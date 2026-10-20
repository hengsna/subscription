import { INITIAL_DATABASE } from './initialData';

const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit?usp=sharing';

/**
 * Sanitizes input string to prevent CSV / Google Sheet formula injection
 * (e.g. '=cmd|...', '+...', '-...', '@...', '|...')
 */
export function sanitizeSpreadsheetString(val) {
  if (typeof val !== 'string') return val;
  if (/^[=+\-@|\t\r]/.test(val)) {
    return `'${val}`;
  }
  return val;
}

/**
 * Client for communicating with Google Apps Script Web App API
 */
export async function fetchGoogleSheetData(webAppUrl) {
  if (!webAppUrl) {
    return {
      status: 'offline',
      source: 'local_fallback',
      message: 'No Google Apps Script Web App URL configured. Operating in resilient local mode.',
      data: INITIAL_DATABASE
    };
  }

  try {
    const url = `${webAppUrl}?action=getData&_t=${Date.now()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Google Sheet returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.status === 'success' && json.data) {
      return {
        status: 'online',
        source: 'google_sheet',
        data: normalizeSheetData(json.data)
      };
    }

    throw new Error(json.message || 'Malformed response from Google Sheet API');
  } catch (err) {
    return {
      status: 'offline',
      source: 'local_fallback',
      message: err.message || 'Failed to connect to Google Sheet Web App',
      data: INITIAL_DATABASE
    };
  }
}

/**
 * Execute Mutation against Google Apps Script Web App
 */
export async function mutateGoogleSheet(webAppUrl, action, payload = {}) {
  if (!webAppUrl) {
    return { status: 'mocked', message: `Simulated local action: ${action}` };
  }

  // Sanitize all string fields in payload to prevent formula injection
  const sanitizedPayload = {};
  for (const [key, val] of Object.entries(payload)) {
    if (typeof val === 'string') {
      sanitizedPayload[key] = sanitizeSpreadsheetString(val);
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      sanitizedPayload[key] = {};
      for (const [subKey, subVal] of Object.entries(val)) {
        sanitizedPayload[key][subKey] = typeof subVal === 'string' ? sanitizeSpreadsheetString(subVal) : subVal;
      }
    } else {
      sanitizedPayload[key] = val;
    }
  }

  try {
    const res = await fetch(webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...sanitizedPayload })
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.warn(`[GoogleSheetClient] Mutation '${action}' fallback to local:`, err);
    return { status: 'fallback', error: err.message };
  }
}

/**
 * Normalize sheet keys from PascalCase (Google Sheet) to camelCase (Frontend)
 */
function normalizeSheetData(raw) {
  const norm = {
    users: [],
    resources: [],
    payments: [],
    emails: [],
    subscriptions: []
  };

  if (Array.isArray(raw.users)) {
    norm.users = raw.users.map(u => {
      let unlockedIds = [];
      if (Array.isArray(u.SinglePdfUnlockedIds)) {
        unlockedIds = u.SinglePdfUnlockedIds;
      } else if (typeof u.SinglePdfUnlockedIds === 'string') {
        try {
          unlockedIds = JSON.parse(u.SinglePdfUnlockedIds || '[]');
        } catch {
          unlockedIds = [];
        }
      }

      return {
        id: Number(u.ID || u.id),
        name: u.Name || u.name || '',
        email: u.Email || u.email || '',
        role: (u.Role || u.role || 'normal').toLowerCase(),
        plan: (u.Plan || u.plan || 'free').toLowerCase(),
        emailVerified: Boolean(u.EmailVerified !== undefined ? u.EmailVerified : u.emailVerified),
        quotaRemaining: Number(u.QuotaRemaining !== undefined ? u.QuotaRemaining : u.quotaRemaining),
        quotaMax: Number(u.QuotaMax !== undefined ? u.QuotaMax : u.quotaMax),
        renewalDate: u.RenewalDate || u.renewalDate || 'N/A',
        singlePdfUnlockedIds: Array.isArray(unlockedIds) ? unlockedIds : []
      };
    });
  }

  if (Array.isArray(raw.resources)) {
    norm.resources = raw.resources.map(r => ({
      id: Number(r.ID || r.id),
      title: r.Title || r.title || '',
      category: r.Category || r.category || 'General',
      author: r.Author || r.author || 'Instructor',
      pages: Number(r.Pages || r.pages || 100),
      price: Number(r.Price || r.price || 7.99),
      downloads: Number(r.Downloads || r.downloads || 0),
      abstract: r.Abstract || r.abstract || ''
    }));
  }

  if (Array.isArray(raw.payments)) {
    norm.payments = raw.payments.map(p => ({
      id: p.ID || p.id || 'TXN-00000',
      date: p.Date || p.date || 'Recent',
      user: p.UserName || p.user || 'Customer',
      item: p.PlanItem || p.item || 'Subscription',
      gateway: p.Gateway || p.gateway || 'Stripe',
      amount: Number(p.Amount || p.amount || 0),
      status: p.Status || p.status || 'Succeeded'
    }));
  }

  if (Array.isArray(raw.emails)) {
    norm.emails = raw.emails.map(e => ({
      id: Number(e.ID || e.id || Date.now()),
      to: e.ToEmail || e.to || '',
      subject: e.Subject || e.subject || '',
      timestamp: e.Timestamp || e.timestamp || 'Just now',
      body: e.Body || e.body || '',
      actionType: e.ActionType || e.actionType || null
    }));
  }

  if (Array.isArray(raw.subscriptions)) {
    norm.subscriptions = raw.subscriptions.map(s => ({
      id: s.ID || s.id || 'SUB-000',
      userId: Number(s.UserId || s.userId || 1),
      userEmail: s.UserEmail || s.userEmail || '',
      planName: s.PlanName || s.planName || 'monthly',
      billingCycle: s.BillingCycle || s.billingCycle || 'Monthly',
      price: Number(s.Price || s.price || 19),
      status: s.Status || s.status || 'Active',
      startDate: s.StartDate || s.startDate || '',
      nextBillingDate: s.NextBillingDate || s.nextBillingDate || ''
    }));
  }

  return norm;
}

export { DEFAULT_SHEET_URL };
