'use server';

import { prisma } from '@/lib/prisma';
import { Task, User } from '@prisma/client';

// Task 1 & 2: Use Prisma Client with typed returns (findMany)
export async function getTasks(): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return tasks;
}

// Task 1 & 2: Use Prisma Client with typed returns (findUnique)
export async function getTaskById(id: string): Promise<Task | null> {
  const task = await prisma.task.findUnique({
    where: { id },
  });
  return task;
}

// Task 2: Use create with typed returns
export async function createTask(title: string, userId: string): Promise<Task> {
  const newTask = await prisma.task.create({
    data: {
      title,
      userId,
    },
  });
  return newTask;
}

// Task 2: Use update with typed returns
export async function updateTaskCompletion(id: string, completed: boolean): Promise<Task> {
  const updatedTask = await prisma.task.update({
    where: { id },
    data: { completed },
  });
  return updatedTask;
}


