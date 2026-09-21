function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Check .env.local or your environment configuration.`
    );
  }
  return value;
}

// Export validated env object
export const env = {
  // Server-only secrets
  database: {
    url: requireEnv('DATABASE_URL'),
  },
  auth: {
    nextauthSecret: requireEnv('NEXTAUTH_SECRET'),
    nextauthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // Public variables
  public: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Apna Job Tracker',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
};