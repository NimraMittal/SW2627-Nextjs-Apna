// app/api/companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/companies
 * Creates a new company record.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'name and email are required.' } },
        { status: 400 }
      );
    }

    const existing = await prisma.company.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    const company = await prisma.company.create({ data: { name, email } });
    return NextResponse.json({ success: true, data: company }, { status: 201 });
  } catch (err) {
    console.error('POST /api/companies error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create company.' } },
      { status: 500 }
    );
  }
}

/**
 * GET /api/companies
 */
export async function GET() {
  try {
    const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ success: true, data: companies });
  } catch (err) {
    console.error('GET /api/companies error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch companies.' } },
      { status: 500 }
    );
  }
}