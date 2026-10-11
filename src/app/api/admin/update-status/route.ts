import { NextRequest, NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initDb();

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'Unauthorized access. Please sign in to the Admin Portal.' },
        { status: 401 }
      );
    }

    const { table, id, status } = await request.json();

    const allowedTables = ['inquiries', 'consultations', 'quote_requests'];
    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { success: false, error: 'Invalid target table specified.' },
        { status: 400 }
      );
    }

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Record ID and new status are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE ${table} SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found.' },
        { status: 404 }
      );
    }

    await query(
      `INSERT INTO activity_logs (action, details) VALUES ($1, $2)`,
      [
        'STATUS_UPDATE',
        `Admin ${user.name} (${user.email}) updated record #${id} in ${table} to status: ${status}`,
      ]
    );

    return NextResponse.json({ success: true, updated: result.rows[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
