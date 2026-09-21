import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function JwtProfilePage() {
  // Task 4: session.user is readable via getServerSession in a Server Component
  const session = await getServerSession(authOptions);

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>JWT Session Management Demo</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        This page reads session data encoded in a stateless JSON Web Token.
      </p>

      <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '6px', margin: '20px 0' }}>
        <h3>Server Session Payload:</h3>
        <pre style={{ fontSize: '12px', overflowX: 'auto' }}>
          {session ? JSON.stringify(session, null, 2) : 'Not authenticated. Please sign in.'}
        </pre>
      </div>
    </div>
  );
}