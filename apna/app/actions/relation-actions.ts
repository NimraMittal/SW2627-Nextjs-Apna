'use server';

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getUsersWithTasks() {
  try {
    const users = await prisma.user.findMany({
      include: {
        tasks: true,
      },
    });
    return { success: true, users };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: message };
  }
}