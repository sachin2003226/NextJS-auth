

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TodoItem({ todo }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleStatus = async () => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });
      
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Toggle status error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteTodo = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/todos/${todo._id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Delete todo error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <input
              type="checkbox"
              className="checkbox checkbox-primary mt-1"
              checked={todo.completed}
              onChange={toggleStatus}
              disabled={isUpdating}
            />
            <div>
              <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {todo.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {formatDate(todo.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => router.push(`/dashboard/todos?id=${todo._id}`)}
              className="btn btn-sm btn-ghost"
            >
              Edit
            </button>
            <button 
              onClick={deleteTodo}
              className={`btn btn-sm btn-error ${isDeleting ? 'loading' : ''}`}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}