import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedUser, hashPassword, AdminUser } from '@/lib/auth';

// PUT /api/admin/users/[id] - update existing admin account
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAuthenticatedUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to the Admin Portal.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const targetUserId = parseInt(id, 10);

    if (isNaN(targetUserId)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID.' }, { status: 400 });
    }

    // Only Super Admin can modify other users' roles or status.
    // Regular admins can only update their own profile (name, password).
    if (currentUser.role !== 'Super Admin' && currentUser.id !== targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Permission denied. Only Super Admin can manage staff permissions.' },
        { status: 403 }
      );
    }

    // Fetch target user
    const targetResult = await query<AdminUser>(
      'SELECT id, name, email, role, status FROM admin_users WHERE id = $1',
      [targetUserId]
    );

    if (targetResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    const targetUser = targetResult.rows[0];
    const body = await request.json();
    const { name, email, role, status, password, avatar_color } = body;

    // Safety check: Prevent deactivating or demoting the last active Super Admin
    if (
      targetUser.role === 'Super Admin' &&
      ((role && role !== 'Super Admin') || (status && status !== 'Active'))
    ) {
      const superAdminCount = await query(
        `SELECT COUNT(*) FROM admin_users WHERE role = 'Super Admin' AND status = 'Active'`
      );
      if (parseInt(superAdminCount.rows[0].count, 10) <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Action prohibited: Cannot demote or deactivate the sole active Super Administrator.',
          },
          { status: 400 }
        );
      }
    }

    // Prepare update parameters
    const updatedName = name ? name.trim() : targetUser.name;
    const updatedEmail = email ? email.trim().toLowerCase() : targetUser.email;
    const updatedRole = currentUser.role === 'Super Admin' && role ? role : targetUser.role;
    const updatedStatus = currentUser.role === 'Super Admin' && status ? status : targetUser.status;
    const updatedColor = avatar_color || targetUser.avatar_color || 'emerald';

    let updatedUser: AdminUser;

    if (password && password.trim().length > 0) {
      if (password.length < 8) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 8 characters long.' },
          { status: 400 }
        );
      }
      const newHash = await hashPassword(password);
      const res = await query<AdminUser>(
        `UPDATE admin_users
         SET name = $1, email = $2, role = $3, status = $4, avatar_color = $5, password_hash = $6
         WHERE id = $7
         RETURNING id, name, email, role, status, avatar_color, last_login, created_at`,
        [updatedName, updatedEmail, updatedRole, updatedStatus, updatedColor, newHash, targetUserId]
      );
      updatedUser = res.rows[0];
    } else {
      const res = await query<AdminUser>(
        `UPDATE admin_users
         SET name = $1, email = $2, role = $3, status = $4, avatar_color = $5
         WHERE id = $6
         RETURNING id, name, email, role, status, avatar_color, last_login, created_at`,
        [updatedName, updatedEmail, updatedRole, updatedStatus, updatedColor, targetUserId]
      );
      updatedUser = res.rows[0];
    }

    // Audit log
    await query(
      `INSERT INTO activity_logs (action, details)
       VALUES ('USER_UPDATE', $1)`,
      [`Admin ${currentUser.name} (${currentUser.email}) updated user profile for ${updatedUser.name} (#${targetUserId}, role: ${updatedRole}, status: ${updatedStatus}).`]
    );

    return NextResponse.json({
      success: true,
      message: `Account for ${updatedUser.name} updated successfully.`,
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error('Error updating admin user:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - delete admin account
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAuthenticatedUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to the Admin Portal.' },
        { status: 401 }
      );
    }

    // Only Super Admin can delete accounts
    if (currentUser.role !== 'Super Admin') {
      return NextResponse.json(
        { success: false, error: 'Permission denied. Only Super Admin can delete admin accounts.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const targetUserId = parseInt(id, 10);

    if (isNaN(targetUserId)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID.' }, { status: 400 });
    }

    // Cannot delete oneself
    if (currentUser.id === targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account while logged in.' },
        { status: 400 }
      );
    }

    // Target user check
    const target = await query<AdminUser>(
      'SELECT id, name, email, role FROM admin_users WHERE id = $1',
      [targetUserId]
    );

    if (target.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    const userToDelete = target.rows[0];

    // Safety: check remaining super admins
    if (userToDelete.role === 'Super Admin') {
      const superAdminCount = await query(
        `SELECT COUNT(*) FROM admin_users WHERE role = 'Super Admin'`
      );
      if (parseInt(superAdminCount.rows[0].count, 10) <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Action prohibited: Cannot delete the last remaining Super Admin.',
          },
          { status: 400 }
        );
      }
    }

    await query('DELETE FROM admin_users WHERE id = $1', [targetUserId]);

    // Audit log
    await query(
      `INSERT INTO activity_logs (action, details)
       VALUES ('USER_DELETE', $1)`,
      [`Super Admin ${currentUser.name} deleted admin account ${userToDelete.name} (${userToDelete.email}).`]
    );

    return NextResponse.json({
      success: true,
      message: `User ${userToDelete.name} has been removed.`,
    });
  } catch (error: unknown) {
    console.error('Error deleting admin user:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
