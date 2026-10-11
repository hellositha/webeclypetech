import { NextRequest, NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO newsletter_subscribers (email) 
       VALUES ($1) 
       ON CONFLICT (email) DO UPDATE SET status = 'Active'
       RETURNING *`,
      [email.toLowerCase().trim()]
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to ECLYPE Technology tech briefs & security bulletins.',
      data: result.rows[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
