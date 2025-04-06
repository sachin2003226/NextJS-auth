import Link from 'next/link';
import { getUserFromToken } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import Todo from '@/models/Todo';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const userEmail = await getUserFromToken();
  let todos = [];

  console.log('User Email:', userEmail);
  
  try {
    await connectToDatabase();
    todos = await Todo.find({ user: userEmail }).sort({ createdAt: -1 }).limit(5);
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userEmail}</p>
        </div>
        
        <Link href="/dashboard/todos" className="btn btn-primary">
          Manage Todos
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Recent Tasks</h2>
            
            {todos.length > 0 ? (
              <div className="space-y-2 mt-4">
                {todos.map((todo) => (
                  <div key={todo._id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={todo.completed}
                      readOnly
                    />
                    <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                      {todo.title}
                    </span>
                  </div>
                ))}
                
                <div className="pt-4">
                  <Link href="/dashboard/todos" className="btn btn-sm btn-outline">
                    View All
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No tasks yet</p>
                <Link href="/dashboard/todos" className="btn btn-sm btn-primary mt-2">
                  Create Todo
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Quick Stats</h2>
            
            <div className="stats shadow mt-4">
              <div className="stat">
                <div className="stat-title">Total Tasks</div>
                <div className="stat-value">{todos.length}</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Completed</div>
                <div className="stat-value">
                  {todos.filter(todo => todo.completed).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}