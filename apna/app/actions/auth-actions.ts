'use server';

import bcrypt from 'bcryptjs';

// Initialize mock DB on globalThis for server runtime
if (!globalThis.mockUsersDB) globalThis.mockUsersDB = [];

export async function signUpUser(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  try {
    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    // Check if user already exists
    const existingUser = globalThis.mockUsersDB!.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, message: 'User already exists with this email.' };
    }

    // Hash password with 12 salt rounds
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Plain-text password is never stored or logged
    const newUser = {
      id: Date.now().toString(),
      email,
      passwordHash,
    };

    globalThis.mockUsersDB!.push(newUser);

    return { success: true, message: 'Sign up successful! You can now sign in.' };
  } catch {
    return { success: false, message: 'Unable to sign up user.' };
  }
}