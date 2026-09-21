// app/api/jobs/[jobId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/jobs/[jobId]
 * Returns a single job with full details.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: { select: { id: true, name: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Job not found.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: job.id,
        employerId: job.companyId,
        companyName: job.company.name,
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary,
        skills: job.skills,
        type: job.type,
        mode: job.mode,
        status: job.status,
        createdAt: job.createdAt.toISOString(),
        applicantCount: job._count.applications,
      },
    });
  } catch (err) {
    console.error('GET /api/jobs/[jobId] error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch job.' } },
      { status: 500 }
    );
  }
}
