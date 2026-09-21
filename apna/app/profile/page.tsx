import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ClientSessionView from './client-view';

export default async function ProfilePage() {
  // Task 4: Read session from a Server Component using configured options
  const session = await getServerSession(authOptions);

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>OAuth Profile & Session Demo</h2>

      <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '6px', margin: '15px 0' }}>
        <h3>Server Component Session:</h3>
        <pre style={{ fontSize: '12px', overflowX: 'auto' }}>
          {session ? JSON.stringify(session, null, 2) : 'Not signed in (Server)'}
        </pre>
      </div>

      <ClientSessionView />
    </div>
  );
}