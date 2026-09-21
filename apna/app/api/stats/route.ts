// app/api/stats/route.ts
// Returns dashboard stats for the logged-in candidate.
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
    }

    const candidateId = session.user.id;
    const [total, pending, viewed, shortlisted, rejected, unreadNotifications] = await Promise.all([
      prisma.application.count({ where: { candidateId } }),
      prisma.application.count({ where: { candidateId, currentStatus: 'PENDING' } }),
      prisma.application.count({ where: { candidateId, currentStatus: 'VIEWED' } }),
      prisma.application.count({ where: { candidateId, currentStatus: 'SHORTLISTED' } }),
      prisma.application.count({ where: { candidateId, currentStatus: 'REJECTED' } }),
      prisma.notification.count({ where: { userId: candidateId, isRead: false } }),
    ]);

    return NextResponse.json({
      success: true,
      data: { total, pending, viewed, shortlisted, rejected, unreadNotifications },
    });
  } catch (err) {
    console.error('GET /api/stats error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
