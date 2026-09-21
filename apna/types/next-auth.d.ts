// types/next-auth.d.ts
// Extends the default NextAuth session/JWT types to include our custom fields.

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'CANDIDATE' | 'EMPLOYER';
      companyId?: string;
    };
  }

  interface User {
    id: string;
    role: 'CANDIDATE' | 'EMPLOYER';
    companyId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'CANDIDATE' | 'EMPLOYER';
    companyId?: string;
  }
}
