import { getMockTasks } from '@/app/actions/revalidate-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type Task = {
  id: string;
  title: string;
  priority: string;
};

export default async function RevalidatedListPage() {
  const tasks = getMockTasks();

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Task List (Revalidated via Path/Tag)</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        New tasks added here will instantly reflect without manual page refreshes.
      </p>

      <div style={{ margin: '20px 0' }}>
        <Link
          href="/tasks/revalidated-list/new"
          style={{ padding: '8px 12px', background: '#0070f3', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}
        >
          + Add New Task
        </Link>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.map((task: Task) => (
          <li
            key={task.id}
            style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', background: '#f9f9f9' }}
          >
            <strong>{task.title}</strong> — <span style={{ textTransform: 'capitalize' }}>{task.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
