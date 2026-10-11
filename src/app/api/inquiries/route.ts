import { NextRequest, NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let sql = 'SELECT * FROM inquiries';
    const params: unknown[] = [];

    if (status && status !== 'all') {
      sql += ' WHERE status = $1';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      service_id,
      division_id,
      budget,
      urgency,
      message,
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO inquiries 
        (name, email, phone, company, service_id, division_id, budget, urgency, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending')
       RETURNING *`,
      [
        name,
        email,
        phone || null,
        company || null,
        service_id || 'general',
        division_id || 'general',
        budget || 'Not Specified',
        urgency || 'Normal',
        message,
      ]
    );

    await query(
      `INSERT INTO activity_logs (action, details) VALUES ($1, $2)`,
      [
        'NEW_INQUIRY',
        `New service inquiry from ${name} (${company || 'Individual'}) for service: ${service_id || 'General'}`,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
