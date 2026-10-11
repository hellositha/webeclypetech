import { NextRequest, NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let sql = 'SELECT * FROM consultations';
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
      full_name,
      email,
      phone,
      company_name,
      business_size,
      division,
      preferred_date,
      preferred_time,
      notes,
    } = body;

    if (!full_name || !email || !company_name) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and company name are required.' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO consultations 
        (full_name, email, phone, company_name, business_size, division, preferred_date, preferred_time, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Scheduled')
       RETURNING *`,
      [
        full_name,
        email,
        phone || 'Not provided',
        company_name,
        business_size || '10-49 employees',
        division || 'Integrated Solutions',
        preferred_date || 'Flexible',
        preferred_time || 'Morning',
        notes || '',
      ]
    );

    await query(
      `INSERT INTO activity_logs (action, details) VALUES ($1, $2)`,
      [
        'NEW_CONSULTATION',
        `Consultation booked by ${full_name} from ${company_name} for ${division || 'General IT'}`,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
