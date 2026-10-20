# EduVault E-Learning Platform — Google Sheets Backend Setup Guide

This guide explains how to connect the **EduVault E-Learning Platform** to your Google Sheet:
👉 **Target Spreadsheet:** [https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit](https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit)

---

## 5-Minute Setup Instructions

### Step 1: Open Google Apps Script Editor
1. Open the [Google Spreadsheet](https://docs.google.com/spreadsheets/d/18KbYjseMn8_qXwkh8Fe417DbHLq5V3CZFVCzs4UQQOw/edit).
2. In the top menu bar, click **Extensions** > **Apps Script**.

### Step 2: Paste the Backend Code
1. In the Apps Script editor, open the file `Code.gs` (or replace any existing template code).
2. Open the file [`google_sheet_backend_code.js`](./google_sheet_backend_code.js) in this repository.
3. Select all code (`Ctrl+A`), copy it (`Ctrl+C`), and paste it into `Code.gs`.
4. Click the **Save** icon (or press `Ctrl+S`).

### Step 3: Initialize Database Tables
1. At the top of the Apps Script toolbar, locate the function dropdown (it might say `doGet` or `myFunction`).
2. Select **`initializeDatabase`** from the dropdown.
3. Click **▷ Run**.
4. If prompted with *"Authorization required"*, click **Review Permissions** > select your Google account > click **Advanced** > click **Go to Untitled project (unsafe)** > click **Allow**.
5. Switch back to your Google Sheet tab. You will see 5 beautifully formatted green sheets created automatically:
   - 👥 **Users** (ID, Name, Email, Role, Plan, EmailVerified, QuotaRemaining, QuotaMax, RenewalDate, SinglePdfUnlockedIds)
   - 📚 **Resources** (ID, Title, Category, Author, Pages, Price, Downloads, Abstract, PdfUrl)
   - 💳 **Payments** (ID, Date, UserName, UserEmail, PlanItem, Gateway, Amount, Status)
   - ✉️ **Emails** (ID, ToEmail, Subject, Timestamp, Body, ActionType, Status)
   - 🔄 **Subscriptions** (ID, UserId, UserEmail, PlanName, BillingCycle, Price, Status, StartDate, NextBillingDate)

### Step 4: Deploy as a Web App (REST API)
1. At the top right of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Fill in the deployment configuration:
   - **Description:** `EduVault API v1`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone` *(Crucial: This enables the Next.js app to read and write without authentication hurdles)*
4. Click **Deploy**.
5. Copy the generated **Web App URL** (it looks like `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 5: Connect EduVault Frontend
1. Launch the EduVault Next.js application:
   ```bash
   npm run dev
   ```
2. In the web app, click on the **Google Sheet Backend** tab in the navigation bar.
3. Paste your Web App URL into the **Google Apps Script Web App URL** input field.
4. Click **Test & Save Connection**.
5. The status pill will turn **🟢 Connected to Google Sheet** and all live tables will synchronize in real time!

---

## Relational Database Tables Overview

| Table | Primary Key | Description |
|---|---|---|
| **Users** | `ID` | Stores accounts, subscription tiers, email verification state, and download quotas. |
| **Resources** | `ID` | The PDF catalog with titles, categories, pricing, and download metrics. |
| **Payments** | `ID` (TXN-*) | Transaction ledger capturing Stripe & PayPal checkout confirmations. |
| **Emails** | `ID` | Audit log for SendGrid double opt-in verification and payment receipts. |
| **Subscriptions** | `ID` (SUB-*) | Active recurring billing subscriptions and renewal cycles. |

---

## Offline / Local Resilience
If you haven't deployed the Google Apps Script yet or run the app offline, EduVault automatically uses its built-in local state and `localStorage`, ensuring the UI is 100% interactive and testable at all times.
