'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { createTask } from '../actions/task-actions'; 

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function OptimisticTaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isPending, startTransition] = useTransition();

  // Task 1 & 2: useOptimistic hook with reducer/update logic
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks,
    (state, newTask: Task) => [...state, newTask] // appends immediately
  );

  async function handleAction(formData: FormData) {
    const title = formData.get('title') as string;
    if (!title) return;

    const tempTask: Task = {
      id: Math.random().toString(), // temporary optimistic ID
      title,
      completed: false,
    };

    startTransition(async () => {
      // Task 1: Show new item immediately via optimistic update
      setOptimisticTasks(tempTask);

      try {
        // Call actual server action
        const result = await createTask(title, 'some-user-id');
        if (result) {
          // Task 3: Revalidate/sync final state with real server response
          setTasks((prev) => [...prev, result]);
        }
      } catch (error) {
        // Task 2: Automatically reverts to original `tasks` state if action fails
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
              opacity: task.id.length < 10 ? 0.7 : 1 // visual cue for pending state
            }}
          >
            {task.title} {task.id.length < 10 && ' (Saving...)'}
          </li>
        ))}
      </ul>
    </div>
  );
}