'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Task {
  id: number;
  name: string;
  description: string;
  status: 'Complete' | 'InComplete';
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', status: 'Complete' });
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:4000/tasks');
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:4000/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditForm({ name: task.name, description: task.description, status: task.status });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '', status: 'Complete' });
  };

  const handleEditSubmit = async (id: number) => {
    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchTasks();
  };

  const filteredTasks = tasks
    .filter((task) => filter === 'All' || task.status === filter)
    .filter((task) => task.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  return (
    <div className="p-6 md:p-10 animate-fade-in">
      <h1 className="text-4xl font-bold mb-2 text-blue-600">TODO List</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        
        <div className="flex flex-wrap gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded shadow-sm text-sm"
          >
            <option value="All">All</option>
            <option value="Complete">Complete</option>
            <option value="InComplete">InComplete</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded shadow-sm text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>

          <input
            type="text"
            placeholder="Search task name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded shadow-sm text-sm"
          />
        </div>

        
        <button
          onClick={() => router.push('/add-task')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-all shadow-md"
        >
          + Add Task
        </button>
      </div>


      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="w-full table-auto bg-white">
          <thead className="bg-blue-100 text-blue-900 text-left text-sm">
            <tr>
              <th className="px-4 py-2">Task No.</th>
              <th className="px-4 py-2">Task Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Edit</th>
              <th className="px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <tr key={task.id} className="border-t hover:bg-blue-50 transition-all text-sm">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {editingId === task.id ? (
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      task.name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === task.id ? (
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      task.description
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === task.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Task['status'] })}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="Complete">Complete</option>
                        <option value="InComplete">InComplete</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded font-medium ${
                          task.status === 'Complete'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === task.id ? (
                      <>
                        <button
                          onClick={() => handleEditSubmit(task.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(task)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="h-6 w-6 text-black" />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-6 w-6 text-black" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No matching tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
