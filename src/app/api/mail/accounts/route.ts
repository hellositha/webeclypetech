import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createVirtualMailAccount } from '@/lib/mailServer';

export async function GET() {
  try {
    const usersRes = await query(
      `SELECT id, domain_id, email, name, maildir, quota_bytes, active, created_at 
       FROM mail_users 
       ORDER BY id ASC`
    );

    const domainsRes = await query(
      `SELECT id, name, active, created_at FROM mail_domains ORDER BY id ASC`
    );

    const aliasesRes = await query(
      `SELECT id, domain_id, source, destination, active, created_at FROM mail_aliases ORDER BY id ASC`
    );

    return NextResponse.json({
      success: true,
      accounts: usersRes.rows,
      domains: domainsRes.rows,
      aliases: aliasesRes.rows,
    });
  } catch (error: unknown) {
    console.error('Mail accounts fetch error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch accounts';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, quotaBytes } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Check duplicate
    const check = await query('SELECT id FROM mail_users WHERE LOWER(email) = $1', [cleanEmail]);
    if (check.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Mail account already exists with this email address' },
        { status: 409 }
      );
    }

    const newAccount = await createVirtualMailAccount({
      email: cleanEmail,
      plainPassword: String(password),
      name: String(name).trim(),
      quotaBytes: quotaBytes ? parseInt(quotaBytes, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: `Account ${cleanEmail} created successfully`,
      account: newAccount,
    });
  } catch (error: unknown) {
    console.error('Create mail account error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create account';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
