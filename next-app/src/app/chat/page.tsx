'use client';

import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000'; // Change if needed

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch(`${API_URL}/messages/`);
    const data = await response.json();
    setMessages(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    await fetch(`${API_URL}/messages/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });

    setMessage('');
    fetchMessages();
  };

  const handleClear = async () => {
    await fetch(`${API_URL}/messages/clear`, {
      method: 'DELETE',
    });
    fetchMessages();
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100 font-sans text-black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Clear All
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
        {messages.map((msg: any) => (
          <div key={msg.id} className="border-b border-gray-200 pb-2">
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
