// app/api/applications/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/applications
 * Returns the logged-in candidate's applications.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Login required.' } },
        { status: 401 }
      );
    }

    const candidateId = session.user.id;
    const applications = await prisma.application.findMany({
      where: { candidateId },
      include: {
        job: { select: { id: true, title: true, mode: true, type: true, location: true } },
        company: { select: { name: true } },
        statusHistory: {
          orderBy: { changedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const data = applications.map((a) => ({
      id: a.id,
      jobId: a.jobId,
      jobTitle: a.job.title,
      jobLocation: a.job.location,
      jobMode: a.job.mode,
      jobType: a.job.type,
      companyName: a.company.name,
      candidateId: a.candidateId,
      candidateName: session.user.name ?? '',
      currentStatus: a.currentStatus,
      appliedAt: a.appliedAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      statusHistory: a.statusHistory.map((h) => ({
        previousStatus: h.previousStatus,
        newStatus: h.newStatus,
        changedAt: h.changedAt.toISOString(),
      })),
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('GET /api/applications error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch applications.' } },
      { status: 500 }
    );
  }
}
