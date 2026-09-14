import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireRole(allowedRoles: string[]) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { authorized: false, status: 401, message: 'Unauthorized: Please sign in.' };
  }

  const userRole = (session.user as any).role || 'user';

  if (!allowedRoles.includes(userRole)) {
    return { authorized: false, status: 403, message: 'Forbidden: Insufficient permissions.' };
  }

  return { authorized: true, session };
}