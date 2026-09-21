// app/api/employer/applications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/employer/applications
 * Returns all applications for the employer's company.
 * Supports ?jobId=, ?status= filters.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Employer access required.' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId') ?? undefined;
    const status = searchParams.get('status') ?? undefined;

    const applications = await prisma.application.findMany({
      where: {
        companyId: session.user.companyId,
        ...(jobId ? { jobId } : {}),
        ...(status ? { currentStatus: status as never } : {}),
      },
      include: {
        candidate: { select: { id: true, name: true, email: true, resumeUrl: true } },
        job: { select: { id: true, title: true, location: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const data = applications.map((a) => ({
      id: a.id,
      jobId: a.jobId,
      jobTitle: a.job.title,
      jobLocation: a.job.location,
      companyName: session.user.name ?? '',
      candidateId: a.candidateId,
      candidateName: a.candidate.name ?? 'Unknown',
      candidateEmail: a.candidate.email,
      resumeUrl: a.candidate.resumeUrl,
      currentStatus: a.currentStatus,
      appliedAt: a.appliedAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('GET /api/employer/applications error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch applications.' } },
      { status: 500 }
    );
  }
}
