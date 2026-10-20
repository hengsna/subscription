import { NextResponse } from 'next/server';
import { fetchGoogleSheetData, mutateGoogleSheet } from '@/lib/googleSheetClient';

// Allowed actions whitelist to prevent arbitrary execution
const ALLOWED_ACTIONS = new Set([
  'init',
  'read',
  'write_resource',
  'write_user',
  'write_payment',
  'write_email',
  'write_subscription',
  'update_user_plan'
]);

// Maximum payload size (100 KB)
const MAX_PAYLOAD_BYTES = 100 * 1024;

/**
 * Validates that an external URL strictly targets Google Apps Script
 * to prevent Server-Side Request Forgery (SSRF) and local network scanning.
 */
function isSafeGoogleScriptUrl(url) {
  if (!url || typeof url !== 'string') return true; // empty allows local fallback
  const trimmed = url.trim();
  // Must be strictly HTTPS and on script.google.com with valid macro exec path
  const googleScriptRegex = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
  return googleScriptRegex.test(trimmed);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const webAppUrl = searchParams.get('webAppUrl') || process.env.GOOGLE_APPS_SCRIPT_WEBAPP_URL || '';

    // SSRF Guard
    if (webAppUrl && !isSafeGoogleScriptUrl(webAppUrl)) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'UNTRUSTED_URL',
          message: 'Access Denied: Only official Google Apps Script Web App URLs (https://script.google.com/macros/s/.../exec) are permitted.'
        },
        { status: 403 }
      );
    }

    const result = await fetchGoogleSheetData(webAppUrl);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to process request.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Read raw body to enforce size limits
    const rawBody = await request.text();
    if (rawBody.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { status: 'error', message: 'Payload Too Large: Maximum allowed size is 100KB.' },
        { status: 413 }
      );
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { status: 'error', message: 'Bad Request: Malformed JSON payload.' },
        { status: 400 }
      );
    }

    const { webAppUrl, action, ...payload } = body;

    // Action Whitelist Guard
    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'INVALID_ACTION',
          message: `Bad Request: Action '${action}' is not authorized. Allowed actions: ${Array.from(ALLOWED_ACTIONS).join(', ')}`
        },
        { status: 400 }
      );
    }

    // SSRF Guard
    const targetUrl = webAppUrl || process.env.GOOGLE_APPS_SCRIPT_WEBAPP_URL || '';
    if (targetUrl && !isSafeGoogleScriptUrl(targetUrl)) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'UNTRUSTED_URL',
          message: 'Access Denied: Only official Google Apps Script Web App URLs are permitted.'
        },
        { status: 403 }
      );
    }

    const result = await mutateGoogleSheet(targetUrl, action, payload);

    return NextResponse.json({
      status: 'success',
      action,
      result
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
