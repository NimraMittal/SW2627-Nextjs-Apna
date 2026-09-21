// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/jobs
 * Returns all OPEN jobs. Supports ?companyId=, ?search=, ?location= filters.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId') ?? undefined;
    const search = searchParams.get('search') ?? undefined;
    const location = searchParams.get('location') ?? undefined;

    const jobs = await prisma.job.findMany({
      where: {
        status: 'OPEN',
        ...(companyId ? { companyId } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { skills: { has: search } },
              ],
            }
          : {}),
        ...(location
          ? { location: { contains: location, mode: 'insensitive' } }
          : {}),
      },
      include: {
        company: { select: { id: true, name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = jobs.map((j) => ({
      id: j.id,
      employerId: j.companyId,
      companyName: j.company.name,
      title: j.title,
      description: j.description,
      location: j.location,
      salary: j.salary,
      skills: j.skills,
      type: j.type,
      mode: j.mode,
      status: j.status,
      createdAt: j.createdAt.toISOString(),
      applicantCount: j._count.applications,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch jobs.' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jobs
 * Employer creates a new job listing.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'EMPLOYER') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Employer access required.' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, location, salary, skills, type, mode } = body;
    const companyId = session.user.companyId;

    if (!title || !description || !location || !companyId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'title, description, location are required.' } },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        companyId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        salary: salary?.trim() || null,
        skills: Array.isArray(skills) ? skills : [],
        type: type || 'Full-time',
        mode: mode || 'On-site',
      },
      include: { company: { select: { name: true } } },
    });

    return NextResponse.json(
      {
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
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/jobs error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create job.' } },
      { status: 500 }
    );
  }
}
