import Link from 'next/link';
import { prisma } from '@/lib/prisma';

interface PageProps {
  searchParams: Promise<{
    page?: string | string[] | undefined;
  }>;
}

export default async function PaginatedTasksPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  // Get page number from URL
  const page =
    typeof params.page === 'string'
      ? parseInt(params.page, 10)
      : 1;

  // Prevent invalid page numbers
  const currentPage = Math.max(
    Number.isNaN(page) ? 1 : page,
    1
  );

  // Number of tasks displayed per page
  const pageSize = 5;

  // Calculate how many records to skip
  const skip = (currentPage - 1) * pageSize;

  // Fetch tasks and total task count at the same time
  const [tasks, totalCount] = await Promise.all([
    prisma.task.findMany({
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    }),

    prisma.task.count(),
  ]);

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h2>Paginated Tasks Dashboard</h2>

      <p>
        Showing page <b>{currentPage}</b> of{' '}
        <b>{totalPages || 1}</b>
        {' '}| Total tasks: <b>{totalCount}</b>
      </p>

      {/* Task list */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '20px 0',
        }}
      >
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              padding: '12px',
              margin: '8px 0',
              background: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            <strong>{task.title}</strong>

            <p
              style={{
                margin: '4px 0 0',
                fontSize: '14px',
                color: '#666',
              }}
            >
              {task.description || 'No description'}
            </p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        {currentPage > 1 && (
          <Link
            href={`/tasks/paginated?page=${currentPage - 1}`}
            style={{
              padding: '8px 16px',
              background: '#0070f3',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
            }}
          >
            Previous
          </Link>
        )}

        {currentPage < totalPages && (
          <Link
            href={`/tasks/paginated?page=${currentPage + 1}`}
            style={{
              padding: '8px 16px',
              background: '#0070f3',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
            }}
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}