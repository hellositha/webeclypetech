import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, getAuthenticatedUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (user) {
      await query(
        `INSERT INTO activity_logs (action, details)
         VALUES ('AUTH_LOGOUT', $1)`,
        [`Admin ${user.name} (${user.email}) logged out.`]
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Successfully logged out.',
    });

    // Clear session cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: unknown) {
    console.error('Error during admin logout:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
