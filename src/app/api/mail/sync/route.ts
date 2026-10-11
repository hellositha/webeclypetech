import { NextResponse } from 'next/server';
import { getAuthenticatedMailUser, syncMaildirToDb } from '@/lib/mailServer';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedMailUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const count = await syncMaildirToDb(user.email);

    return NextResponse.json({
      success: true,
      syncedCount: count,
      message: count > 0 ? `Synced ${count} new email(s)` : 'Mailbox is up to date',
    });
  } catch (error: unknown) {
    console.error('Mail sync error:', error);
    const message = error instanceof Error ? error.message : 'Sync failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
