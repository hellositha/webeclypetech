import { NextResponse } from 'next/server';
import {
  verifyMailPassword,
  signMailToken,
  MAIL_AUTH_COOKIE_NAME,
  getAuthenticatedMailUser,
} from '@/lib/mailServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const account = await verifyMailPassword(cleanEmail, String(password));

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Invalid mail credentials or account is inactive' },
        { status: 401 }
      );
    }

    const token = signMailToken({
      accountId: account.id,
      email: account.email,
      name: account.name,
    });

    const response = NextResponse.json({
      success: true,
      message: `Logged in as ${account.email}`,
      user: account,
      token,
    });

    response.cookies.set({
      name: MAIL_AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error('Mail auth login error:', error);
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedMailUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user,
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
    console.error('Mail auth check error:', error);
    const message = error instanceof Error ? error.message : 'Session verification failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out from webmail successfully',
    });

    response.cookies.set({
      name: MAIL_AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: unknown) {
    console.error('Mail auth logout error:', error);
    const message = error instanceof Error ? error.message : 'Logout failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
