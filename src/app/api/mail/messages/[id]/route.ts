import { NextResponse } from 'next/server';
import { getAuthenticatedMailUser } from '@/lib/mailServer';
import { query } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const user = await getAuthenticatedMailUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const messageId = parseInt(id, 10);
    if (isNaN(messageId)) {
      return NextResponse.json({ success: false, error: 'Invalid message ID' }, { status: 400 });
    }

    const res = await query(
      `SELECT * FROM mail_messages WHERE id = $1 AND account_id = $2`,
      [messageId, user.id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    const message = res.rows[0];

    // Automatically mark read if unread
    if (!message.is_read) {
      await query(
        `UPDATE mail_messages SET is_read = true WHERE id = $1 AND account_id = $2`,
        [messageId, user.id]
      );
      message.is_read = true;
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error: unknown) {
    console.error('Get message details error:', error);
    const message = error instanceof Error ? error.message : 'Failed to retrieve message';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getAuthenticatedMailUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const messageId = parseInt(id, 10);
    if (isNaN(messageId)) {
      return NextResponse.json({ success: false, error: 'Invalid message ID' }, { status: 400 });
    }

    const body = await request.json();
    const { is_read, is_starred, folder } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (typeof is_read === 'boolean') {
      values.push(is_read);
      updates.push(`is_read = $${values.length}`);
    }

    if (typeof is_starred === 'boolean') {
      values.push(is_starred);
      updates.push(`is_starred = $${values.length}`);
    }

    if (typeof folder === 'string') {
      const validFolders = ['INBOX', 'Sent', 'Drafts', 'Trash', 'Archive', 'Spam'];
      if (validFolders.includes(folder)) {
        values.push(folder);
        updates.push(`folder = $${values.length}`);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    values.push(messageId);
    values.push(user.id);

    const updateRes = await query(
      `UPDATE mail_messages 
       SET ${updates.join(', ')} 
       WHERE id = $${values.length - 1} AND account_id = $${values.length}
       RETURNING *`,
      values
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: updateRes.rows[0],
    });
  } catch (error: unknown) {
    console.error('Update message error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update message';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const user = await getAuthenticatedMailUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const messageId = parseInt(id, 10);
    if (isNaN(messageId)) {
      return NextResponse.json({ success: false, error: 'Invalid message ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    // Check message existence and current folder
    const check = await query(
      `SELECT folder FROM mail_messages WHERE id = $1 AND account_id = $2`,
      [messageId, user.id]
    );

    if (check.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    const currentFolder = check.rows[0].folder;

    if (permanent || currentFolder === 'Trash') {
      // Permanently delete
      await query(`DELETE FROM mail_messages WHERE id = $1 AND account_id = $2`, [
        messageId,
        user.id,
      ]);
      return NextResponse.json({
        success: true,
        message: 'Message permanently deleted',
        action: 'deleted',
      });
    } else {
      // Soft-delete to Trash
      await query(
        `UPDATE mail_messages SET folder = 'Trash' WHERE id = $1 AND account_id = $2`,
        [messageId, user.id]
      );
      return NextResponse.json({
        success: true,
        message: 'Message moved to Trash',
        action: 'trashed',
      });
    }
  } catch (error: unknown) {
    console.error('Delete message error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete message';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
