import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Prisma demo route is working.',
    ok: true,
  });
}
