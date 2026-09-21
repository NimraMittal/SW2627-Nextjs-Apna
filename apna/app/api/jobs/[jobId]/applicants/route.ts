// app/api/jobs/[jobId]/applicants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/jobs/[jobId]/applicants
 * Employer views all applicants for a specific job.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Employer access required.' } },
        { status: 401 }
      );
    }

    const { jobId } = await params;

    // Verify the job belongs to this employer's company
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId: session.user.companyId },
    });
    if (!job) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Job not found or access denied.' } },
        { status: 404 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: { select: { id: true, name: true, email: true, resumeUrl: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const data = applications.map((a) => ({
      id: a.id,
      candidateId: a.candidateId,
      candidateName: a.candidate.name ?? 'Unknown',
      candidateEmail: a.candidate.email,
      resumeUrl: a.candidate.resumeUrl,
      status: a.currentStatus,
      appliedAt: a.appliedAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('GET /api/jobs/[jobId]/applicants error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch applicants.' } },
      { status: 500 }
    );
  }
}
