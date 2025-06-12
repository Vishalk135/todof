'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddTask = () => {
  const router = useRouter();
  const [task, setTask] = useState({
    name: '',
    description: '',
    status: 'InComplete',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    router.push('/');
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task Name"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="InComplete">InComplete</option>
          <option value="Complete">Complete</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;
