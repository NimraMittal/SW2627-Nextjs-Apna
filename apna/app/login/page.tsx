import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Login Required</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        You must be signed in to access this protected route.
      </p>
      <Link
        href="/api/auth/signin"
        style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#0070f3', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}
      >
        Sign In with NextAuth
      </Link>
    </div>
  );
}