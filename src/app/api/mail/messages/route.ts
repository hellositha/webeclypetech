import { NextResponse } from 'next/server';
import { getAuthenticatedMailUser, syncMaildirToDb } from '@/lib/mailServer';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedMailUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'INBOX';
    const searchQuery = searchParams.get('q') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30', 10)));
    const offset = (page - 1) * limit;

    // Ingest any incoming emails from Maildir automatically
    if (folder === 'INBOX' || folder === 'all') {
      try {
        await syncMaildirToDb(user.email);
      } catch (err) {
        console.error('Auto sync error:', err);
      }
    }

    // Build SQL condition
    const conditions: string[] = ['account_id = $1'];
    const values: any[] = [user.id];

    if (folder === 'Starred') {
      conditions.push('is_starred = true');
      conditions.push("folder != 'Trash'");
    } else if (folder !== 'all') {
      values.push(folder);
      conditions.push(`folder = $${values.length}`);
    }

    if (searchQuery.trim()) {
      values.push(`%${searchQuery.trim()}%`);
      const searchIdx = values.length;
      conditions.push(
        `(subject ILIKE $${searchIdx} OR from_address ILIKE $${searchIdx} OR from_name ILIKE $${searchIdx} OR to_address ILIKE $${searchIdx} OR snippet ILIKE $${searchIdx} OR body_text ILIKE $${searchIdx})`
      );
    }

    const whereClause = conditions.join(' AND ');

    // Get count
    const countRes = await query<{ count: string }>(
      `SELECT COUNT(*) FROM mail_messages WHERE ${whereClause}`,
      values
    );
    const total = parseInt(countRes.rows[0]?.count || '0', 10);

    // Get messages (excluding large body text/html for fast list view, snippet is included)
    values.push(limit);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    const messagesRes = await query(
      `SELECT id, account_id, folder, message_id, from_address, from_name, to_address, cc_address, reply_to,
              subject, snippet, is_read, is_starred, is_draft, has_attachments, size_bytes, received_at, created_at
       FROM mail_messages
       WHERE ${whereClause}
       ORDER BY received_at DESC, id DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values
    );

    // Get counts for sidebar badges
    const badgeRes = await query<{
      inbox_unread: string;
      sent_total: string;
      drafts_total: string;
      trash_total: string;
      starred_total: string;
      archive_total: string;
    }>(
      `SELECT 
        COUNT(*) FILTER (WHERE folder = 'INBOX' AND is_read = false) as inbox_unread,
        COUNT(*) FILTER (WHERE folder = 'Sent') as sent_total,
        COUNT(*) FILTER (WHERE folder = 'Drafts') as drafts_total,
        COUNT(*) FILTER (WHERE folder = 'Trash') as trash_total,
        COUNT(*) FILTER (WHERE is_starred = true AND folder != 'Trash') as starred_total,
        COUNT(*) FILTER (WHERE folder = 'Archive') as archive_total
       FROM mail_messages
       WHERE account_id = $1`,
      [user.id]
    );

    const badges = {
      INBOX: parseInt(badgeRes.rows[0]?.inbox_unread || '0', 10),
      Sent: parseInt(badgeRes.rows[0]?.sent_total || '0', 10),
      Drafts: parseInt(badgeRes.rows[0]?.drafts_total || '0', 10),
      Trash: parseInt(badgeRes.rows[0]?.trash_total || '0', 10),
      Starred: parseInt(badgeRes.rows[0]?.starred_total || '0', 10),
      Archive: parseInt(badgeRes.rows[0]?.archive_total || '0', 10),
    };

    return NextResponse.json({
      success: true,
      messages: messagesRes.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      counts: badges,
    });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      typeof (error as { digest: unknown }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_')
    ) {
      throw error;
    }
    console.error('Get messages error:', error);
    const message = error instanceof Error ? error.message : 'Failed to retrieve messages';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
