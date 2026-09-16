declare global {
  // in-memory mock DB for development/demo only
  var mockUsersDB: { id: string; email: string; passwordHash: string }[] | undefined;
}

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}

export {};
