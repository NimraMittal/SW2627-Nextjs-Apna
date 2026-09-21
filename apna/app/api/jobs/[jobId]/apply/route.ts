// app/api/jobs/[jobId]/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/jobs/[jobId]/apply
 * Candidate applies to a job — creates an Application with PENDING status.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CANDIDATE') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Candidate login required.' } },
        { status: 401 }
      );
    }

    const { jobId } = await params;
    const candidateId = session.user.id;

    // Check the job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: { select: { name: true } } },
    });
    if (!job) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Job not found.' } },
        { status: 404 }
      );
    }
    if (job.status !== 'OPEN') {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: 'This job is no longer accepting applications.' } },
        { status: 409 }
      );
    }

    // Check for duplicate application
    const existing = await prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId, jobId } },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: 'You have already applied to this job.' } },
        { status: 409 }
      );
    }

    const application = await prisma.application.create({
      data: {
        candidateId,
        jobId,
        companyId: job.companyId,
        currentStatus: 'PENDING',
      },
      include: {
        job: { select: { title: true } },
        company: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: application.id,
          jobId: application.jobId,
          jobTitle: application.job.title,
          companyName: application.company.name,
          candidateId: application.candidateId,
          currentStatus: application.currentStatus,
          appliedAt: application.appliedAt.toISOString(),
          updatedAt: application.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/jobs/[jobId]/apply error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to submit application.' } },
      { status: 500 }
    );
  }
}
