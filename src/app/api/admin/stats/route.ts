import { NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await initDb();

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'Unauthorized access. Please sign in to the Admin Portal.' },
        { status: 401 }
      );
    }

    const [
      inquiriesCount,
      consultationsCount,
      quotesCount,
      subscribersCount,
      adminUsersCount,
      recentInquiries,
      recentConsultations,
      recentQuotes,
      activityLogs,
    ] = await Promise.all([
      query('SELECT COUNT(*) FROM inquiries'),
      query('SELECT COUNT(*) FROM consultations'),
      query('SELECT COUNT(*) FROM quote_requests'),
      query('SELECT COUNT(*) FROM newsletter_subscribers'),
      query('SELECT COUNT(*) FROM admin_users'),
      query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 10'),
      query('SELECT * FROM consultations ORDER BY created_at DESC LIMIT 10'),
      query('SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 10'),
      query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 15'),
    ]);

    // Test DB response latency
    const pingStart = Date.now();
    await query('SELECT 1');
    const dbLatencyMs = Date.now() - pingStart;

    return NextResponse.json({
      success: true,
      authenticated: true,
      currentUser: user,
      stats: {
        totalInquiries: parseInt(inquiriesCount.rows[0].count, 10),
        totalConsultations: parseInt(consultationsCount.rows[0].count, 10),
        totalQuotes: parseInt(quotesCount.rows[0].count, 10),
        totalSubscribers: parseInt(subscribersCount.rows[0].count, 10),
        totalAdminUsers: parseInt(adminUsersCount.rows[0].count, 10),
        dbStatus: 'Healthy (PostgreSQL 18 Connected)',
        dbLatencyMs,
      },
      recent: {
        inquiries: recentInquiries.rows,
        consultations: recentConsultations.rows,
        quotes: recentQuotes.rows,
        activity: activityLogs.rows,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
