'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { createTask } from '@/app/actions/task-actions';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function OptimisticTaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isPending, startTransition] = useTransition();

  // useOptimistic hook with correct syntax and closing parentheses
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks,
    (state, newTask: Task) => [...state, newTask]
  );

  async function handleAction(formData: FormData) {
    const title = formData.get('title') as string;
    if (!title) return; // Fixed typo

    const tempTask: Task = {
      id: Math.random().toString(),
      title,
      completed: false,
    };

    startTransition(async () => {
      setOptimisticTasks(tempTask);

      try {
        const result = await createTask(title, 'some-user-id');
        if (result) {
          setTasks((prev) => [...prev, result]);
        }
      } catch (error) {
        console.error('Failed to create task, rolling back optimistic update', error);
      }
    });
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Optimistic Tasks List</h2>
      
      <form action={handleAction} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          name="title" 
          placeholder="Enter a new task..." 
          required 
          style={{ padding: '8px', flex: 1 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add Task</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {optimisticTasks.map((task) => (
          <li 
            key={task.id} 
            style={{ 
              padding: '10px', 
              margin: '5px 0', 
              background: '#f4f4f4', 
              borderRadius: '4px',
              opacity: task.id.length < 10 ? 0.7 : 1 
            }}
          >
            {task.title} {task.id.length < 10 && ' (Saving...)'}
          </li>
        ))}
      </ul>
    </div>
  );
}