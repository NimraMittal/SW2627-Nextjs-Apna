import { getUsersWithTasks } from '@/actions/relation-actions';

export default async function TestRelationsPage() {
  const result = await getUsersWithTasks();

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Relation Query Test</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}