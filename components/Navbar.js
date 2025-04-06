'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar({ userEmail }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link href={userEmail ? "/dashboard" : "/"} className="btn btn-ghost text-xl">
          Todo App
        </Link>
      </div>
      <div className="flex-none">
        {userEmail ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <span className="font-medium">{userEmail}</span>
              </li>
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
