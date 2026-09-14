import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prismaClient = prisma as typeof prisma & {
      user: { count: () => Promise<number> };
      task: { count: () => Promise<number> };
    };

    const [usersCount, tasksCount] = await Promise.all([
      prismaClient.user.count(),
      prismaClient.task.count(),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Prisma Client connected and generated successfully!',
      stats: {
        usersCount,
        tasksCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}