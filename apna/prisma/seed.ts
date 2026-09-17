import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed a User model using upsert (Task 4)
  const user = await prisma.user.upsert({
    where: { email: 'tamanna.dev@test.com' },
    update: {},
    create: {
      email: 'tamanna.dev@test.com',
      name: 'Tamanna Developer',
      bio: 'Full-stack software developer working on the Apna platform.',
    },
  });

  console.log(`Seeded user: ${user.name} (${user.email})`);

  // 2. Seed a related Task model using upsert (Task 1 & 4)
  const task = await prisma.task.upsert({
    where: { id: 'seed-task-01' }, // Or use a unique constraint field if available
    update: {
      title: 'Complete Database Seeding Assignment',
    },
    create: {
      id: 'seed-task-01',
      title: 'Complete Database Seeding Assignment',
      description: 'Implement idempotent prisma seed script with upsert.',
      completed: true,
      userId: user.id,
    },
  });

  console.log(`Seeded task: ${task.title}`);
  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });