'use server';

import 'server-only'; // Proves the action runs exclusively on the server

export async function createTaskAction(_prevState: unknown, formData: FormData) {
  try {
    const title = formData.get('title')?.toString();
    const priority = formData.get('priority')?.toString() || 'medium';

    if (!title || title.trim() === '') {
      return { success: false, message: 'Task title is required.' };
    }

    // Simulate database mutation / save workflow
    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      priority,
      createdAt: new Date().toISOString(),
    };

    // Return serializable plain JS object to the client
    return {
      success: true,
      message: `Task "${newTask.title}" created successfully!`,
      data: newTask,
    };
  } catch (error) {
    console.error('Server action error:', error);
    return { success: false, message: 'Internal server error during submission.' };
  }
}
