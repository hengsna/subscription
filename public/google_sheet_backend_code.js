/**
 * ============================================================================
 * EDUVAULT E-LEARNING PLATFORM — GOOGLE APPS SCRIPT DATABASE BACKEND
 * ============================================================================
 * Spreadsheet ID: 18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw
 * Spreadsheet URL: https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet in the browser.
 * 2. Click Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire file, and click Save (Ctrl+S).
 * 4. Run the function 'initializeDatabase' once to create and format the 5 tables.
 * 5. Click Deploy > New Deployment.
 * 6. Select type: 'Web app'.
 * 7. Set:
 *    - Description: "EduVault API v1"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (crucial for web app REST calls)
 * 8. Click Deploy, authorize permissions, and copy the Web App URL.
 * 9. Paste the Web App URL into the EduVault frontend's Google Sheet Backend Hub.
 * ============================================================================
 */

const HEADERS = {
  Users: [
    'ID', 'Name', 'Email', 'Role', 'Plan', 'EmailVerified',
    'QuotaRemaining', 'QuotaMax', 'RenewalDate', 'SinglePdfUnlockedIds', 'CreatedAt'
  ],
  Resources: [
    'ID', 'Title', 'Category', 'Author', 'Pages', 'Price',
    'Downloads', 'Abstract', 'PdfUrl', 'CreatedAt'
  ],
  Payments: [
    'ID', 'Date', 'UserName', 'UserEmail', 'PlanItem',
    'Gateway', 'Amount', 'Status', 'CreatedAt'
  ],
  Emails: [
    'ID', 'ToEmail', 'Subject', 'Timestamp', 'Body',
    'ActionType', 'Status', 'CreatedAt'
  ],
  Subscriptions: [
    'ID', 'UserId', 'UserEmail', 'PlanName', 'BillingCycle',
    'Price', 'Status', 'StartDate', 'NextBillingDate', 'CreatedAt'
  ]
};

const SEED_DATA = {
  Users: [
    [1, 'Alex Rivera', 'alex@eduvault.io', 'premium', 'monthly', true, 12, 15, 'Nov 17, 2026', '[]', new Date().toISOString()],
    [2, 'Sophia Chen', 'sophia@stanford.edu', 'premium', 'yearly', true, 999, 999, 'Oct 17, 2027', '[]', new Date().toISOString()],
    [3, "Liam O'Connor", 'liam@freelance.dev', 'normal', 'free', true, 0, 0, 'N/A (Free)', '[]', new Date().toISOString()],
    [4, 'Maya Lin', 'maya@startup.io', 'normal', 'single', true, 1, 1, 'One-Time Credit', '[102]', new Date().toISOString()],
    [5, 'Noah Patel', 'noah@unverified.org', 'normal', 'free', false, 0, 0, 'Pending Opt-In', '[]', new Date().toISOString()],
    [6, 'Elena Vance (Admin)', 'admin@eduvault.io', 'admin', 'yearly', true, 999, 999, 'Permanent', '[]', new Date().toISOString()]
  ],
  Resources: [
    [
      101,
      'Distributed Systems & High-Availability Architecture',
      'System Design',
      'Dr. Elena Vance',
      184,
      7.99,
      118,
      'Master consensus algorithms (Raft, Paxos), event-driven microservices, idempotency keys, and multi-region failover blueprints used at scale.',
      'https://eduvault.io/downloads/101-distributed-systems.pdf',
      new Date().toISOString()
    ],
    [
      102,
      'Full-Stack React, Node.js & PostgreSQL Production Handbook',
      'Full-Stack',
      'Marcus Sterling',
      210,
      7.99,
      94,
      'End-to-end engineering guide covering JWT rotation, RBAC middleware, Prisma/PostgreSQL indexing, and Stripe webhook idempotency.',
      'https://eduvault.io/downloads/102-fullstack-production.pdf',
      new Date().toISOString()
    ],
    [
      103,
      'Applied Large Language Models & RAG Pipelines',
      'AI & Data',
      'Dr. Priya Nair',
      156,
      7.99,
      67,
      'Build low-latency vector search pipelines, semantic chunking strategies, and evaluation harnesses for enterprise AI assistants.',
      'https://eduvault.io/downloads/103-applied-llm-rag.pdf',
      new Date().toISOString()
    ],
    [
      104,
      'Zero-Trust Cloud Security & OAuth 2.1 Implementation',
      'Cloud & Security',
      'Devon Brooks',
      128,
      7.99,
      41,
      'Practical reference for PKCE flows, double opt-in verification tokens, hardware MFA, and container sandboxing in AWS & GCP.',
      'https://eduvault.io/downloads/104-zero-trust-cloud.pdf',
      new Date().toISOString()
    ],
    [
      105,
      'Database Internals: B-Trees, WAL & Query Optimizers',
      'System Design',
      'Prof. Kenji Sato',
      240,
      7.99,
      15,
      'Deep dive into storage engines, MVCC snapshot isolation, write-ahead logging, and diagnosing slow PostgreSQL execution plans.',
      'https://eduvault.io/downloads/105-database-internals.pdf',
      new Date().toISOString()
    ],
    [
      106,
      'Modern TailwindCSS Design Systems & Accessibility',
      'Full-Stack',
      'Claire Dubois',
      112,
      7.99,
      7,
      'Craft WCAG AA compliant interfaces, responsive fluid typography, dark-mode tokens, and reusable component primitives.',
      'https://eduvault.io/downloads/106-tailwindcss-a11y.pdf',
      new Date().toISOString()
    ]
  ],
  Payments: [
    ['TXN-99481', 'Oct 17, 2026', 'Alex Rivera', 'alex@eduvault.io', 'Premium Monthly Plan', 'Stripe', 19.00, 'Succeeded', new Date().toISOString()],
    ['TXN-99420', 'Oct 12, 2026', 'Sophia Chen', 'sophia@stanford.edu', 'Premium Yearly Plan', 'PayPal', 149.00, 'Succeeded', new Date().toISOString()],
    ['TXN-99385', 'Oct 09, 2026', 'Maya Lin', 'maya@startup.io', 'Single PDF (#102 Full-Stack Handbook)', 'Stripe', 7.99, 'Succeeded', new Date().toISOString()]
  ],
  Emails: [
    [
      1,
      'alex@eduvault.io',
      '[SendGrid] Double Opt-In Verified & Monthly Subscription Active',
      'Oct 17, 2026 • 09:15 AM',
      'Your email address has been verified via double opt-in. Your Premium Monthly quota of 15 PDF downloads is active until Nov 17, 2026.',
      'verify_email',
      'Delivered',
      new Date().toISOString()
    ]
  ],
  Subscriptions: [
    ['SUB-1001', 1, 'alex@eduvault.io', 'monthly', 'Monthly', 19.00, 'Active', 'Oct 17, 2026', 'Nov 17, 2026', new Date().toISOString()],
    ['SUB-1002', 2, 'sophia@stanford.edu', 'yearly', 'Annual', 149.00, 'Active', 'Oct 17, 2026', 'Oct 17, 2027', new Date().toISOString()],
    ['SUB-1003', 4, 'maya@startup.io', 'single', 'One-Time', 7.99, 'Active', 'Oct 09, 2026', 'Permanent', new Date().toISOString()]
  ]
};

/**
 * HTTP GET Handler (Read Endpoints)
 */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : 'getData';

    if (action === 'ping') {
      return jsonResponse({
        status: 'success',
        message: 'EduVault Google Sheets Backend Active',
        spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'initDatabase') {
      initializeDatabase();
      return jsonResponse({
        status: 'success',
        message: 'All 5 tables initialized successfully with headers and seed data.'
      });
    }

    // Default: fetch all 5 tables
    const db = fetchAllDatabaseTables();
    return jsonResponse({
      status: 'success',
      data: db,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return jsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * HTTP POST Handler (Mutation Endpoints)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    switch (action) {
      case 'initializeDatabase': {
        initializeDatabase();
        return jsonResponse({ status: 'success', message: 'Database initialized' });
      }

      case 'addUser': {
        const sheet = ss.getSheetByName('Users');
        if (!sheet) throw new Error('Users sheet not found');
        const user = payload.user;
        const newRow = [
          user.id || Date.now(),
          user.name,
          user.email,
          user.role || 'normal',
          user.plan || 'free',
          user.emailVerified ? true : false,
          user.quotaRemaining !== undefined ? user.quotaRemaining : 0,
          user.quotaMax !== undefined ? user.quotaMax : 0,
          user.renewalDate || 'N/A',
          JSON.stringify(user.singlePdfUnlockedIds || []),
          new Date().toISOString()
        ];
        sheet.appendRow(newRow);
        return jsonResponse({ status: 'success', message: 'User added', data: user });
      }

      case 'updateUser': {
        const sheet = ss.getSheetByName('Users');
        if (!sheet) throw new Error('Users sheet not found');
        const user = payload.user;
        const data = sheet.getDataRange().getValues();
        let updated = false;

        for (let i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(user.id) || String(data[i][2]).toLowerCase() === String(user.email).toLowerCase()) {
            if (user.name !== undefined) sheet.getRange(i + 1, 2).setValue(user.name);
            if (user.role !== undefined) sheet.getRange(i + 1, 4).setValue(user.role);
            if (user.plan !== undefined) sheet.getRange(i + 1, 5).setValue(user.plan);
            if (user.emailVerified !== undefined) sheet.getRange(i + 1, 6).setValue(user.emailVerified);
            if (user.quotaRemaining !== undefined) sheet.getRange(i + 1, 7).setValue(user.quotaRemaining);
            if (user.quotaMax !== undefined) sheet.getRange(i + 1, 8).setValue(user.quotaMax);
            if (user.renewalDate !== undefined) sheet.getRange(i + 1, 9).setValue(user.renewalDate);
            if (user.singlePdfUnlockedIds !== undefined) sheet.getRange(i + 1, 10).setValue(JSON.stringify(user.singlePdfUnlockedIds));
            updated = true;
            break;
          }
        }
        return jsonResponse({ status: 'success', updated: updated, message: updated ? 'User updated' : 'User not found' });
      }

      case 'addPayment': {
        const sheet = ss.getSheetByName('Payments');
        if (!sheet) throw new Error('Payments sheet not found');
        const p = payload.payment;
        const newRow = [
          p.id || ('TXN-' + Math.floor(10000 + Math.random() * 90000)),
          p.date || 'Just now',
          p.user || p.userName || 'Customer',
          p.userEmail || '',
          p.item || p.planItem || '',
          p.gateway || 'Stripe',
          Number(p.amount) || 0,
          p.status || 'Succeeded',
          new Date().toISOString()
        ];
        sheet.appendRow(newRow);
        return jsonResponse({ status: 'success', message: 'Payment recorded', id: newRow[0] });
      }

      case 'updateQuota': {
        // Atomic decrement quota for user and increment download for resource
        const uSheet = ss.getSheetByName('Users');
        const rSheet = ss.getSheetByName('Resources');
        const userId = payload.userId;
        const resourceId = payload.resourceId;

        if (uSheet && userId) {
          const uData = uSheet.getDataRange().getValues();
          for (let i = 1; i < uData.length; i++) {
            if (String(uData[i][0]) === String(userId)) {
              const currentQuota = Number(uData[i][6]) || 0;
              const newQuota = Math.max(0, currentQuota - 1);
              uSheet.getRange(i + 1, 7).setValue(newQuota);
              break;
            }
          }
        }

        if (rSheet && resourceId) {
          const rData = rSheet.getDataRange().getValues();
          for (let j = 1; j < rData.length; j++) {
            if (String(rData[j][0]) === String(resourceId)) {
              const currentDl = Number(rData[j][6]) || 0;
              rSheet.getRange(j + 1, 7).setValue(currentDl + 1);
              break;
            }
          }
        }

        return jsonResponse({ status: 'success', message: 'Quota and download count updated' });
      }

      case 'addResource': {
        const sheet = ss.getSheetByName('Resources');
        if (!sheet) throw new Error('Resources sheet not found');
        const r = payload.resource;
        const newRow = [
          r.id || Date.now(),
          r.title,
          r.category,
          r.author,
          Number(r.pages) || 50,
          Number(r.price) || 7.99,
          0,
          r.abstract || '',
          r.pdfUrl || '',
          new Date().toISOString()
        ];
        sheet.appendRow(newRow);
        return jsonResponse({ status: 'success', message: 'Resource published', data: r });
      }

      case 'deleteResource': {
        const sheet = ss.getSheetByName('Resources');
        if (!sheet) throw new Error('Resources sheet not found');
        const rId = String(payload.resourceId);
        const data = sheet.getDataRange().getValues();
        let deleted = false;
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][0]) === rId) {
            sheet.deleteRow(i + 1);
            deleted = true;
            break;
          }
        }
        return jsonResponse({ status: 'success', deleted: deleted, message: deleted ? 'Resource deleted' : 'Resource not found' });
      }

      case 'logEmail': {
        const sheet = ss.getSheetByName('Emails');
        if (!sheet) throw new Error('Emails sheet not found');
        const mail = payload.email;
        const newRow = [
          mail.id || Date.now(),
          mail.to || mail.toEmail,
          mail.subject,
          mail.timestamp || 'Just now',
          mail.body,
          mail.actionType || 'info',
          mail.status || 'Delivered',
          new Date().toISOString()
        ];
        sheet.appendRow(newRow);
        return jsonResponse({ status: 'success', message: 'Email logged' });
      }

      case 'verifyEmail': {
        const sheet = ss.getSheetByName('Users');
        if (!sheet) throw new Error('Users sheet not found');
        const email = String(payload.email).toLowerCase();
        const data = sheet.getDataRange().getValues();
        let verified = false;
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][2]).toLowerCase() === email) {
            sheet.getRange(i + 1, 6).setValue(true);
            verified = true;
            break;
          }
        }
        return jsonResponse({ status: 'success', verified: verified, message: verified ? 'Email verified' : 'User not found' });
      }

      default:
        return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
    }
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * Initialize all 5 database sheets with styled headers and initial records
 */
function initializeDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(HEADERS).forEach(function (sheetName) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Check if headers exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS[sheetName]);

      // Seed data if available
      if (SEED_DATA[sheetName] && SEED_DATA[sheetName].length > 0) {
        const rows = SEED_DATA[sheetName];
        sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
      }
    }

    formatSheetHeader(sheet);
  });

  // Remove default "Sheet1" if it's empty
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    ss.deleteSheet(defaultSheet);
  }
}

/**
 * Apply Emerald Theme Header Formatting
 */
function formatSheetHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground('#064e3b'); // Dark Emerald
  headerRange.setFontColor('#ffffff'); // White
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Inter');
  headerRange.setFontSize(10);
  sheet.setFrozenRows(1);
  for (let col = 1; col <= sheet.getLastColumn(); col++) {
    sheet.autoResizeColumn(col);
  }
}

/**
 * Read all 5 tables and map to clean JSON
 */
function fetchAllDatabaseTables() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tables = ['Users', 'Resources', 'Payments', 'Emails', 'Subscriptions'];
  const result = {};

  tables.forEach(function (tableName) {
    const sheet = ss.getSheetByName(tableName);
    if (!sheet) {
      result[tableName.toLowerCase()] = [];
      return;
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      result[tableName.toLowerCase()] = [];
      return;
    }

    const headers = data[0];
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const item = {};
      for (let j = 0; j < headers.length; j++) {
        let val = row[j];
        const key = headers[j];

        // Format specific columns
        if (key === 'SinglePdfUnlockedIds' && typeof val === 'string') {
          try {
            val = JSON.parse(val);
          } catch (e) {
            val = [];
          }
        }
        item[key] = val;
      }
      rows.push(item);
    }

    result[tableName.toLowerCase()] = rows;
  });

  return result;
}

/**
 * Return JSON with CORS headers
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
