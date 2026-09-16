'use server';

import { z } from 'zod';

// Define Zod validation schema for form fields
const taskSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters long'),
  priority: z.enum(['low', 'medium', 'high']),
});

export type FormState = {
  success: boolean;
  message?: string;
  errors?: {
    title?: string[];
    priority?: string[];
  };
  fields?: {
    title?: string;
    priority?: string;
  };
};

export async function validateAndCreateTask(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFields = {
    title: formData.get('title')?.toString() || '',
    priority: formData.get('priority')?.toString() || '',
  };

  // Safe parse prevents throwing errors and returns a result object
  const parsed = taskSchema.safeParse(rawFields);

  if (!parsed.success) {
    // Return structured error state object alongside preserved fields
    return {
      success: false,
      message: 'Validation failed. Please correct the fields below.',
      errors: parsed.error.flatten().fieldErrors as FormState['errors'],
      fields: rawFields,
    };
  }

  // Successful mutation logic (Simulated DB save)
  const { title } = parsed.data;

  // Clear form or return success response
  return {
    success: true,
    message: `Task "${title}" created successfully!`,
    fields: { title: '', priority: 'medium' }, // Clears/resets form fields
  };
}