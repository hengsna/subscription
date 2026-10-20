# EduVault — E-Learning & Subscription Platform

> **Modern E-Learning Web Application built with Next.js, HTML5, Tailwind CSS, JavaScript, and a live Google Sheets relational database backend.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Google Sheets](https://img.shields.io/badge/Database-Google%20Sheets-34A853?logo=googlesheets)](https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🌟 Overview & Key Features

EduVault is a full-featured e-learning resource hub featuring curated engineering and computer science PDF handbooks, flexible subscription billing models, role-based access control (RBAC), and a **live Google Sheets database backend**:

- **Target Google Spreadsheet Database:** [https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit](https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit?usp=sharing)
- **GitHub Repository:** [https://github.com/hengsna/subscription.git](https://github.com/hengsna/subscription.git)

### Core Capabilities:
1. **Curated Resource Library:**
   - Filter by domain: *System Design*, *Full-Stack*, *AI & Data*, *Cloud & Security*.
   - Instant search across titles, authors, and topics.
   - Public executive summary previews & dynamic download quota gates.
2. **Flexible Tiered Subscriptions & Payment Flow:**
   - **Normal (Free):** View-only browsing.
   - **Single PDF Purchase ($7.99):** One-time instant access credit.
   - **Premium Monthly ($19.00/mo):** 15 full PDF downloads per monthly billing cycle.
   - **Premium Yearly ($149.00/yr):** Unlimited downloads across the entire vault.
   - Interactive dropdown plan selector & Stripe/PayPal checkout simulation.
3. **Role-Based Access Control (RBAC) & Sandbox Switcher:**
   - Switch between personas on the fly (*Normal User*, *Monthly Pro*, *Yearly Pro*, *Single Buyer*, *Unverified*, *Platform Admin*).
4. **SendGrid Double Opt-In Email Verification:**
   - New registrations dispatch simulated double opt-in verification tokens to the in-app **Simulated Inbox**.
   - Downloads and upgrades remain securely guarded until confirmed.
5. **Admin Operations Dashboard:**
   - Real-time revenue analytics, user counts, and download velocity.
   - Manage user quotas (+5 bonus downloads) and toggle verification.
   - Upload new learning resources to the catalog and Google Sheet.
6. **Google Sheets Database Hub & Telemetry Feed:**
   - Live visual inspector for all 5 relational tables.
   - Connection status pill (`🟢 Connected` / `🟡 Syncing` / `⚪ Local Resilient Mode`).
   - One-click Google Apps Script code exporter.
   - Real-time mutation audit log.

---

## 📊 Google Sheets Relational Database Architecture

The Google Sheet is organized into **5 relational tables**:

```
+--------------------------------------------------------------------------+
|                       EDUVAULT GOOGLE SHEETS DATABASE                    |
|             (ID: 18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw)           |
+--------------------------------------------------------------------------+
  |
  +---> [Users]           (ID, Name, Email, Role, Plan, EmailVerified,
  |                        QuotaRemaining, QuotaMax, RenewalDate, SinglePdfUnlockedIds)
  |
  +---> [Resources]       (ID, Title, Category, Author, Pages, Price,
  |                        Downloads, Abstract, PdfUrl)
  |
  +---> [Payments]        (ID, Date, UserName, UserEmail, PlanItem,
  |                        Gateway, Amount, Status)
  |
  +---> [Emails]          (ID, ToEmail, Subject, Timestamp, Body,
  |                        ActionType, Status)
  |
  +---> [Subscriptions]   (ID, UserId, UserEmail, PlanName, BillingCycle,
                           Price, Status, StartDate, NextBillingDate)
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation & Local Run

```bash
# 1. Clone repository
git clone https://github.com/hengsna/subscription.git
cd subscription

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🔗 Connecting to Google Sheets (Google Apps Script API)

EduVault includes a turnkey Google Apps Script file: [`google_sheet_backend_code.js`](./google_sheet_backend_code.js).

1. Open your [Google Spreadsheet](https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit).
2. Go to **Extensions** > **Apps Script**.
3. Copy all code from `google_sheet_backend_code.js` and paste it into `Code.gs`.
4. Select `initializeDatabase` from the toolbar and click **Run** to format all 5 tables with emerald headers and sample records.
5. Click **Deploy** > **New deployment** > select type **Web app**.
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
6. Copy the generated Web App URL and paste it into the **Google Sheet DB** tab in the web app!

Detailed instructions with troubleshooting are available in [`GOOGLE_SHEET_SETUP.md`](./GOOGLE_SHEET_SETUP.md).

---

## 📁 Repository Structure

```
├── app / src/
│   ├── app/
│   │   ├── api/
│   │   │   └── sheet/
│   │   │       └── route.js          # Next.js Server API Proxy to Google Sheets
│   │   ├── globals.css               # Tailwind & custom scrollbar styles
│   │   ├── layout.js                 # HTML Head, fonts, metadata
│   │   └── page.js                   # Master App Orchestrator & State Engine
│   ├── components/
│   │   ├── Header.jsx                # Top bar, persona switcher, connection pill
│   │   ├── LibraryView.jsx           # Catalog, category filter, quota telemetry
│   │   ├── PricingView.jsx           # Plan dropdown, 4 pricing cards, payment ledger
│   │   ├── WorkflowView.jsx          # Pipeline diagrams, node inspector, tech stack
│   │   ├── AdminDashboard.jsx        # KPIs, user & quota manager, upload trigger
│   │   ├── AuthPortal.jsx            # Login, Double Opt-in registration, reset
│   │   ├── GoogleSheetHub.jsx        # 5-table live inspector, script exporter, audit feed
│   │   ├── CheckoutModal.jsx         # Stripe & PayPal simulation modal
│   │   ├── PreviewModal.jsx          # PDF abstract executive summary modal
│   │   ├── EmailInboxModal.jsx       # Transactional email client modal
│   │   ├── UploadModal.jsx           # Admin new PDF upload modal
│   │   └── Toast.jsx                 # Non-blocking notification toasts
│   └── lib/
│       ├── googleSheetClient.js      # REST client & data normalizer
│       └── initialData.js            # Seed data for all 5 tables
├── google_sheet_backend_code.js      # Turnkey Google Apps Script for Spreadsheet
├── GOOGLE_SHEET_SETUP.md             # Visual 5-minute setup documentation
├── eduvault_e_learning_platform.html # Standalone single-file companion web app
├── index.html                        # Mirror entry point for static hosting
├── package.json                      # Project dependencies & scripts
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.js                # Tailwind custom emerald theme
├── postcss.config.js                 # PostCSS autoprefixer
└── jsconfig.json                     # Path alias configuration (@/*)
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
