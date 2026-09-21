'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export type SignUpState = {
  success: boolean;
  message: string;
};

export async function signUpUser(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  try {
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().toLowerCase().trim();
    const password = formData.get('password')?.toString();
    const role = formData.get('role')?.toString() as 'CANDIDATE' | 'EMPLOYER' | undefined;
    const companyName = formData.get('companyName')?.toString().trim();

    if (!name || !email || !password || !role) {
      return { success: false, message: 'All fields are required.' };
    }

    if (!['CANDIDATE', 'EMPLOYER'].includes(role)) {
      return { success: false, message: 'Invalid role selected.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // For employers, create or find their company
    let companyId: string | undefined;
    if (role === 'EMPLOYER') {
      if (!companyName) {
        return { success: false, message: 'Company name is required for employers.' };
      }
      // Check if company with this email already exists
      let company = await prisma.company.findUnique({ where: { email } });
      if (!company) {
        company = await prisma.company.create({
          data: { name: companyName, email },
        });
      }
      companyId = company.id;
    }

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        ...(companyId ? { companyId } : {}),
      },
    });

    return { success: true, message: 'Account created! You can now log in.' };
  } catch (err) {
    console.error('signUpUser error:', err);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}