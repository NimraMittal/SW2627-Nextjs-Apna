import Link from 'next/link';
import { prisma } from '@/lib/prisma';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TasksPage({ searchParams }: PageProps) {
  // Task 1: A Server Component reads searchParams via the page props (awaiting the Promise in Next.js 15)
  const params = await searchParams;
  const filter = typeof params.filter === 'string' ? params.filter : '';
  const sort = typeof params.sort === 'string' ? params.sort : 'asc';

  // Fetch filtered data based on search params
  const tasks = await prisma.task.findMany({
    where: filter ? { title: { contains: filter, mode: 'insensitive' } } : undefined,
    orderBy: { title: sort === 'desc' ? 'desc' : 'asc' },
  });

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Tasks Filter & Sort Dashboard</h2>

      {/* Task 3: Controls (links) updating the URL query params */}
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <Link href="/tasks?filter=Complete" style={{ padding: '8px 12px', background: '#ddd', borderRadius: '4px' }}>
          Filter: Complete
        </Link>
        <Link href="/tasks?sort=desc" style={{ padding: '8px 12px', background: '#ddd', borderRadius: '4px' }}>
          Sort: Z-A
        </Link>
        <Link href="/tasks" style={{ padding: '8px 12px', background: '#eee', borderRadius: '4px' }}>
          Reset
        </Link>
      </div>

      {/* Task 2: UI reflects the query params state */}
      <p>Current Filter: <b>{filter || 'None'}</b> | Sort: <b>{sort}</b></p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ padding: '10px', margin: '5px 0', background: '#f9f9f9', border: '1px solid #ddd' }}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}