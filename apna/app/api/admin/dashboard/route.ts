import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';

export async function GET() {
  // Task 3: Centralized role check
  // Task 2: Admin-only route checks role and returns 403 for non-admins
  const check = await requireRole(['admin']);

  if (!check.authorized) {
    return NextResponse.json(
      { error: check.message },
      { status: check.status }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Welcome to the secure Admin Dashboard',
    user: check.session?.user,
  });
}