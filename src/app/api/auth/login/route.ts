import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, signToken, AUTH_COOKIE_NAME, AdminUser } from '@/lib/auth';

interface UserRow extends AdminUser {
  password_hash: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Query user by email
    const result = await query<UserRow>(
      `SELECT id, name, email, password_hash, role, status, avatar_color, last_login, created_at
       FROM admin_users
       WHERE LOWER(email) = $1
       LIMIT 1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password credentials.' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Check if account is active
    if (user.status !== 'Active') {
      return NextResponse.json(
        { success: false, error: 'Account has been deactivated. Please contact an administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password credentials.' },
        { status: 401 }
      );
    }

    // Update last_login
    await query(
      `UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [user.id]
    );

    // Audit log
    await query(
      `INSERT INTO activity_logs (action, details)
       VALUES ('AUTH_LOGIN', $1)`,
      [`Admin ${user.name} (${user.email}) logged in successfully as ${user.role}.`]
    );

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Strip password_hash from response
    const { password_hash, ...safeUser } = user;

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
      token,
    });

    // Set secure HTTP-only cookie (7 days)
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error('Error during admin login:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
