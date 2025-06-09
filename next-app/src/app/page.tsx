'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';

type Todo = {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
};

const API_URL = 'http://localhost:8000';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todos/`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setTodos(data);
      setError('');
    } catch {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async () => {
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_URL}/todos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined }),
      });
      if (!res.ok) throw new Error('Create failed');
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setTitle('');
      setDescription('');
      setError('');
    } catch {
      setError('Failed to create todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setError('');
    } catch {
      setError('Failed to delete todo');
    }
  };

  const toggleComplete = async (todo: Todo) => {
    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !todo.is_completed }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setError('');
    } catch {
      setError('Failed to update todo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 max-w-7xl mx-auto text-black ">
      <h1 className="text-4xl font-bold mb-4 text-center">Todo List</h1>
      <p className="text-center text-gray-600 mb-8">Keep track of your tasks and stay organized</p>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo();
        }}
        className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Add some details (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          rows={3}
        />
        <button
          type="submit"
          className="w-full flex justify-center items-center bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus className="mr-2" /> Add Todo
        </button>
      </form>

      {/* Todos List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      ) : todos.length === 0 ? (
        <p className="text-center text-gray-500">No todos yet. Add one above!</p>
      ) : (
        todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between bg-white p-6 mb-4 rounded-xl shadow-sm border border-gray-100"
          >
            <button
              onClick={() => toggleComplete(todo)}
              className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${
                todo.is_completed ? 'bg-green-500' : 'bg-gray-300'
              }`}
              aria-label={todo.is_completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {todo.is_completed && <FaCheck className="text-white text-xs" />}
            </button>

            <div className="flex-1 ml-4">
              <h3 className={`text-lg font-semibold ${todo.is_completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`text-sm ${todo.is_completed ? 'text-gray-400' : 'text-gray-700'}`}>
                  {todo.description}
                </p>
              )}
            </div>

            <button
              onClick={() => deleteTodo(todo.id)}
              className="ml-4 text-gray-400 hover:text-red-600"
              aria-label="Delete todo"
            >
              <FaTrash />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
