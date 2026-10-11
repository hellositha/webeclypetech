import { NextRequest, NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let sql = 'SELECT * FROM quote_requests';
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
      client_name,
      email,
      phone,
      company,
      selected_services,
      deployment_type,
      user_count,
      estimated_monthly,
      estimated_onetime,
      timeline,
      requirements,
    } = body;

    if (!client_name || !email || !company) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and company are required.' },
        { status: 400 }
      );
    }

    const servicesJson = JSON.stringify(selected_services || []);

    const result = await query(
      `INSERT INTO quote_requests 
        (client_name, email, phone, company, selected_services, deployment_type, user_count, estimated_monthly, estimated_onetime, timeline, requirements, status)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, $11, 'Reviewing')
       RETURNING *`,
      [
        client_name,
        email,
        phone || null,
        company,
        servicesJson,
        deployment_type || 'Hybrid Cloud',
        Number(user_count) || 10,
        Number(estimated_monthly) || 0,
        Number(estimated_onetime) || 0,
        timeline || 'Flexible',
        requirements || '',
      ]
    );

    await query(
      `INSERT INTO activity_logs (action, details) VALUES ($1, $2)`,
      [
        'NEW_QUOTE_REQUEST',
        `Quote estimator submission from ${client_name} (${company}) with est. monthly: $${estimated_monthly || 0}`,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
