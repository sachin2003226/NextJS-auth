'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TodoForm({ todo, onSubmit }) {
  const router = useRouter();
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({ title, description });
      if (!todo) {
        // Clear form if creating new todo
        setTitle('');
        setDescription('');
      }
      router.refresh();
    } catch (error) {
      console.error('Todo form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="What needs to be done?"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          placeholder="Add some details (optional)"
          className="textarea textarea-bordered w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <button
        type="submit"
        className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
        disabled={isSubmitting}
      >
        {todo ? 'Update' : 'Create'} Todo
      </button>
    </form>
  );
}
