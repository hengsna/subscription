import { NextResponse } from 'next/server';
import { fetchGoogleSheetData, mutateGoogleSheet } from '@/lib/googleSheetClient';
import { INITIAL_DATABASE } from '@/lib/initialData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const webAppUrl = searchParams.get('webAppUrl') || process.env.GOOGLE_APPS_SCRIPT_WEBAPP_URL || '';

  const result = await fetchGoogleSheetData(webAppUrl);
  return NextResponse.json(result);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { webAppUrl, action, ...payload } = body;

    const targetUrl = webAppUrl || process.env.GOOGLE_APPS_SCRIPT_WEBAPP_URL || '';
    const result = await mutateGoogleSheet(targetUrl, action, payload);

    return NextResponse.json({
      status: 'success',
      action,
      result
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
