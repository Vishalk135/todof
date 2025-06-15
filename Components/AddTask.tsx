'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
//import { baseURL } from '../pages/utils/constant';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/tasks';

const AddTask: React.FC = () => {
  const router = useRouter();

  const [task, setTask] = useState({
    name: '',
    description: '',
    status: 'Complete',
  });

  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.name.trim() || !task.description.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    router.push('/');
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Task</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Task Name</label>
          <input
            type="text"
            name="name"
            value={task.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter task name"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter task description"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Complete">Complete</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
