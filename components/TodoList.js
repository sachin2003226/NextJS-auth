

import TodoItem from './TodoItem';

export default function TodoList({ todos }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No todos yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </div>
  );
}