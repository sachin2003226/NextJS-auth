'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';

export default function TodosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const todoId = searchParams.get('id');
  
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  
  useEffect(() => {
    fetchTodos();
  }, []);
  
  useEffect(() => {
    if (todoId) {
      fetchTodoById(todoId);
      setIsEditMode(true);
    } else {
      setSelectedTodo(null);
      setIsEditMode(false);
    }
  }, [todoId]);
  
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/todos');
      
      if (res.ok) {
        const data = await res.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTodoById = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`);
      
      if (res.ok) {
        const data = await res.json();
        setSelectedTodo(data);
      }
    } catch (error) {
      console.error('Error fetching todo:', error);
    }
  };
  
  const createTodo = async (todoData) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    
    if (res.ok) {
      await fetchTodos();
    } else {
      throw new Error('Failed to create todo');
    }
  };
  
  const updateTodo = async (todoData) => {
    const res = await fetch(`/api/todos/${selectedTodo._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    
    if (res.ok) {
      router.push('/dashboard/todos');
      await fetchTodos();
    } else {
      throw new Error('Failed to update todo');
    }
  };
  
  const handleSubmit = async (todoData) => {
    if (isEditMode && selectedTodo) {
      await updateTodo(todoData);
    } else {
      await createTodo(todoData);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isEditMode ? 'Edit Todo' : 'My Todos'}
        </h1>
        
        {isEditMode && (
          <button
            onClick={() => router.push('/dashboard/todos')}
            className="btn btn-outline"
          >
            Cancel
          </button>
        )}
      </div>
      
      {isEditMode ? (
        selectedTodo && (
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Edit Todo</h2>
              <TodoForm todo={selectedTodo} onSubmit={handleSubmit} />
            </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card bg-base-100 shadow-md sticky top-4">
              <div className="card-body">
                <h2 className="card-title">Create New Todo</h2>
                <TodoForm onSubmit={handleSubmit} />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <TodoList todos={todos} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}