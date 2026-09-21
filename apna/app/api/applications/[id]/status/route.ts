// app/api/applications/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { pushToUser } from '@/app/api/sse/route';
import type { ApplicationStatus } from '@prisma/client';

const VALID_STATUSES: ApplicationStatus[] = ['PENDING', 'VIEWED', 'SHORTLISTED', 'REJECTED'];

/**
 * PATCH /api/applications/[id]/status
 * Employer updates a single application status.
 * Also writes a StatusHistory entry and creates a Notification for the candidate.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Employer access required.' } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const newStatus: ApplicationStatus = body.status;

    if (!VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: `Status must be one of: ${VALID_STATUSES.join(', ')}` } },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: { select: { title: true } } },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Application not found.' } },
        { status: 404 }
      );
    }

    // Verify this application belongs to the employer's company
    if (application.companyId !== session.user.companyId) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Access denied.' } },
        { status: 403 }
      );
    }

    const previousStatus = application.currentStatus;

    // Update status + write history + create notification atomically
    const [updated] = await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: { currentStatus: newStatus, updatedAt: new Date() },
      }),
      prisma.statusHistory.create({
        data: {
          applicationId: id,
          previousStatus,
          newStatus,
          changedBy: session.user.id,
        },
      }),
      prisma.notification.create({
        data: {
          userId: application.candidateId,
          applicationId: id,
          type: 'STATUS_CHANGED',
          message: `Your application for "${application.job.title}" has been updated to ${newStatus}.`,
        },
      }),
    ]);

    // Push real-time SSE notification to the candidate
    pushToUser(application.candidateId, {
      type: 'STATUS_CHANGED',
      applicationId: id,
      newStatus,
      message: `Your application for "${application.job.title}" has been updated to ${newStatus}.`,
    });

    return NextResponse.json({
      success: true,
      data: { id: updated.id, currentStatus: updated.currentStatus, updatedAt: updated.updatedAt.toISOString() },
    });
  } catch (err) {
    console.error('PATCH /api/applications/[id]/status error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update status.' } },
      { status: 500 }
    );
  }
}
