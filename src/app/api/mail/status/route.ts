import { NextResponse } from 'next/server';
import { getMailServerStatus } from '@/lib/mailServer';

export async function GET() {
  try {
    const status = await getMailServerStatus();
    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Mail server status check error:', error);
    const message = error instanceof Error ? error.message : 'Failed to query mail server status';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
