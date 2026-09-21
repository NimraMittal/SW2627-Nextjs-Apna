// app/api/applications/bulk-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { ApplicationStatus } from '@prisma/client';

const VALID_STATUSES: ApplicationStatus[] = ['PENDING', 'VIEWED', 'SHORTLISTED', 'REJECTED'];

/**
 * PATCH /api/applications/bulk-status
 * Employer bulk-updates statuses for multiple applications at once.
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Employer access required.' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { applicationIds, status }: { applicationIds: string[]; status: ApplicationStatus } = body;

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'applicationIds must be a non-empty array.' } },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: `Status must be one of: ${VALID_STATUSES.join(', ')}` } },
        { status: 400 }
      );
    }

    // Fetch all applications to verify ownership and get current statuses
    const applications = await prisma.application.findMany({
      where: { id: { in: applicationIds }, companyId: session.user.companyId },
      include: { job: { select: { title: true } } },
    });

    if (applications.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'No accessible applications found.' } },
        { status: 404 }
      );
    }

    // Build all operations in one transaction
    const historyCreates = applications.map((a) =>
      prisma.statusHistory.create({
        data: {
          applicationId: a.id,
          previousStatus: a.currentStatus,
          newStatus: status,
          changedBy: session.user.id,
        },
      })
    );

    const notificationCreates = applications.map((a) =>
      prisma.notification.create({
        data: {
          userId: a.candidateId,
          applicationId: a.id,
          type: 'STATUS_CHANGED',
          message: `Your application for "${a.job.title}" has been updated to ${status}.`,
        },
      })
    );

    const bulkUpdate = prisma.application.updateMany({
      where: { id: { in: applications.map((a) => a.id) } },
      data: { currentStatus: status, updatedAt: new Date() },
    });

    await prisma.$transaction([bulkUpdate, ...historyCreates, ...notificationCreates]);

    return NextResponse.json({
      success: true,
      data: { updatedCount: applications.length, status },
    });
  } catch (err) {
    console.error('PATCH /api/applications/bulk-status error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Bulk update failed.' } },
      { status: 500 }
    );
  }
}
