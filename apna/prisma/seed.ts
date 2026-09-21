import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Apna job portal database...');

  const passwordHash = await bcrypt.hash('password123', 12);

  // 1. Seed Companies
  const techCorp = await prisma.company.upsert({
    where: { email: 'contact@techcorp.com' },
    update: {},
    create: {
      name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      description: 'Leading provider of enterprise cloud infrastructure and modern tooling.',
      logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=60',
    },
  });

  const google = await prisma.company.upsert({
    where: { email: 'careers@google.com' },
    update: {},
    create: {
      name: 'Google',
      email: 'careers@google.com',
      description: 'Organizing the world’s information and making it universally accessible and useful.',
      logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=60',
    },
  });

  const finServe = await prisma.company.upsert({
    where: { email: 'hiring@finserve.io' },
    update: {},
    create: {
      name: 'FinServe Global',
      email: 'hiring@finserve.io',
      description: 'Next-generation algorithmic trading and high-frequency financial platforms.',
      logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
    },
  });

  // 2. Seed Users
  // Candidate
  const candidate = await prisma.user.upsert({
    where: { email: 'candidate@apna.com' },
    update: { passwordHash },
    create: {
      email: 'candidate@apna.com',
      name: 'Alex Johnson',
      passwordHash,
      role: 'CANDIDATE',
      bio: 'Full-stack software developer with 4 years experience in React, Next.js, and TypeScript.',
      resumeUrl: 'https://example.com/resumes/alex-johnson.pdf',
    },
  });
  console.log(`Seeded candidate: ${candidate.email} / password123`);

  // Employer
  const employer = await prisma.user.upsert({
    where: { email: 'employer@techcorp.com' },
    update: { passwordHash, companyId: techCorp.id },
    create: {
      email: 'employer@techcorp.com',
      name: 'Sarah Chen',
      passwordHash,
      role: 'EMPLOYER',
      companyId: techCorp.id,
      bio: 'Head of Talent Acquisition at TechCorp Solutions.',
    },
  });
  console.log(`Seeded employer: ${employer.email} / password123`);

  // 3. Seed Jobs
  const job1 = await prisma.job.upsert({
    where: { id: 'seed-job-senior-frontend' },
    update: {},
    create: {
      id: 'seed-job-senior-frontend',
      companyId: techCorp.id,
      title: 'Senior Frontend Engineer',
      description: 'Looking for a skilled React and Next.js developer to lead our dashboard and real-time streaming analytics product.',
      location: 'San Francisco, CA',
      salary: '$140,000 - $175,000',
      skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
      type: 'Full-time',
      mode: 'Hybrid',
      status: 'OPEN',
    },
  });

  await prisma.job.upsert({
    where: { id: 'seed-job-backend-node' },
    update: {},
    create: {
      id: 'seed-job-backend-node',
      companyId: techCorp.id,
      title: 'Senior Backend Engineer (Node/Postgres)',
      description: 'Design robust microservices and real-time event-driven pipelines using Node.js, Prisma, and PostgreSQL.',
      location: 'Remote',
      salary: '$150,000 - $190,000',
      skills: ['Node.js', 'PostgreSQL', 'Prisma', 'Docker'],
      type: 'Full-time',
      mode: 'Remote',
      status: 'OPEN',
    },
  });

  const job3 = await prisma.job.upsert({
    where: { id: 'seed-job-software-engineer-google' },
    update: {},
    create: {
      id: 'seed-job-software-engineer-google',
      companyId: google.id,
      title: 'Software Engineer III',
      description: 'Build high-scale distributed systems powering search and AI products.',
      location: 'Mountain View, CA',
      salary: '$165,000 - $210,000',
      skills: ['Go', 'C++', 'Distributed Systems', 'Cloud'],
      type: 'Full-time',
      mode: 'On-site',
      status: 'OPEN',
    },
  });

  await prisma.job.upsert({
    where: { id: 'seed-job-ui-ux-designer' },
    update: {},
    create: {
      id: 'seed-job-ui-ux-designer',
      companyId: finServe.id,
      title: 'Product UI/UX Designer',
      description: 'Create intuitive, sleek fintech experiences for traders and financial institutions.',
      location: 'New York, NY',
      salary: '$120,000 - $150,000',
      skills: ['Figma', 'UI Design', 'Design Systems', 'Prototyping'],
      type: 'Full-time',
      mode: 'Hybrid',
      status: 'OPEN',
    },
  });

  // 4. Seed Applications for Candidate
  const existingApp1 = await prisma.application.findFirst({
    where: { jobId: job1.id, candidateId: candidate.id },
  });

  if (!existingApp1) {
    await prisma.application.create({
      data: {
        jobId: job1.id,
        candidateId: candidate.id,
        companyId: techCorp.id,
        currentStatus: 'SHORTLISTED',
        statusHistory: {
          create: [
            { previousStatus: 'PENDING', newStatus: 'PENDING', changedBy: candidate.id },
            { previousStatus: 'PENDING', newStatus: 'VIEWED', changedBy: employer.id },
            { previousStatus: 'VIEWED', newStatus: 'SHORTLISTED', changedBy: employer.id },
          ],
        },
        notifications: {
          create: [
            {
              userId: candidate.id,
              message: 'TechCorp Solutions has shortlisted your application for Senior Frontend Engineer.',
              type: 'STATUS_CHANGED',
            },
          ],
        },
      },
    });
  }

  const existingApp2 = await prisma.application.findFirst({
    where: { jobId: job3.id, candidateId: candidate.id },
  });

  if (!existingApp2) {
    await prisma.application.create({
      data: {
        jobId: job3.id,
        candidateId: candidate.id,
        companyId: google.id,
        currentStatus: 'VIEWED',
        statusHistory: {
          create: [
            { previousStatus: 'PENDING', newStatus: 'PENDING', changedBy: candidate.id },
            { previousStatus: 'PENDING', newStatus: 'VIEWED', changedBy: candidate.id },
          ],
        },
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });