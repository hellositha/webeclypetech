import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedUser, hashPassword, AdminUser } from '@/lib/auth';

// GET /api/admin/users - list all admin accounts
export async function GET(request: Request) {
  try {
    const currentUser = await getAuthenticatedUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to the Admin Portal.' },
        { status: 401 }
      );
    }

    const result = await query<AdminUser>(
      `SELECT id, name, email, role, status, avatar_color, last_login, created_at
       FROM admin_users
       ORDER BY id ASC`
    );

    return NextResponse.json({
      success: true,
      users: result.rows,
    });
  } catch (error: unknown) {
    console.error('Error fetching admin users:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/admin/users - create new admin account
export async function POST(request: Request) {
  try {
    const currentUser = await getAuthenticatedUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to the Admin Portal.' },
        { status: 401 }
      );
    }

    // Only Super Admin or Admin can create new users
    if (currentUser.role !== 'Super Admin' && currentUser.role !== 'Admin') {
      return NextResponse.json(
        { success: false, error: 'Permission denied. Only Super Admin and Admin can create staff accounts.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role, status, avatar_color } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required fields.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Check if email already registered
    const existing = await query(
      'SELECT id FROM admin_users WHERE LOWER(email) = $1',
      [cleanEmail]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An admin user with this email address already exists.' },
        { status: 409 }
      );
    }

    const assignedRole = role || 'Admin';
    // Non-superadmin cannot create Super Admin
    if (assignedRole === 'Super Admin' && currentUser.role !== 'Super Admin') {
      return NextResponse.json(
        { success: false, error: 'Only Super Administrators can create other Super Admin accounts.' },
        { status: 403 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userStatus = status || 'Active';
    const color = avatar_color || 'emerald';

    const insertResult = await query<AdminUser>(
      `INSERT INTO admin_users (name, email, password_hash, role, status, avatar_color)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, status, avatar_color, last_login, created_at`,
      [name.trim(), cleanEmail, passwordHash, assignedRole, userStatus, color]
    );

    const newUser = insertResult.rows[0];

    // Audit log
    await query(
      `INSERT INTO activity_logs (action, details)
       VALUES ('USER_CREATE', $1)`,
      [`Admin ${currentUser.name} (${currentUser.email}) created account for ${newUser.name} (${newUser.email}) with role '${assignedRole}'.`]
    );

    return NextResponse.json({
      success: true,
      message: `User ${newUser.name} created successfully.`,
      user: newUser,
    });
  } catch (error: unknown) {
    console.error('Error creating admin user:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
