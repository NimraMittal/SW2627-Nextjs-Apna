import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  // Task 4: Prevent regular users from accessing admin page
  if (!session || userRole !== 'admin') {
    return (
      <div style={{ maxWidth: '400px', margin: '60px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2 style={{ color: '#dc3545' }}>403 - Forbidden</h2>
        <p>You do not have administrative privileges to access this page.</p>
        <a href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>Return Home</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Admin Control Panel</h2>
      <p>Welcome back, Admin: {session.user?.email}</p>
    </div>
  );
}