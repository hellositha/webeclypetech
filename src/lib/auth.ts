import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET =
  process.env.JWT_SECRET || 'eclype_tech_enterprise_jwt_secret_key_2026_secured_98f12a';

export const AUTH_COOKIE_NAME = 'eclype_admin_token';

export interface AdminJWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar_color?: string;
  last_login?: string | null;
  created_at: string;
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export function signToken(payload: AdminJWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminJWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminJWTPayload;
  } catch {
    return null;
  }
}

export function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function getAuthenticatedUser(request: Request): Promise<AdminUser | null> {
  try {
    let token: string | null = null;

    // Check Authorization header first
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Fallback to cookie
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      token = parseCookie(cookieHeader, AUTH_COOKIE_NAME);
    }

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    const result = await query<AdminUser>(
      `SELECT id, name, email, role, status, avatar_color, last_login, created_at 
       FROM admin_users 
       WHERE id = $1 AND status = 'Active' 
       LIMIT 1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
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
    console.error('getAuthenticatedUser error:', error);
    return null;
  }
}
