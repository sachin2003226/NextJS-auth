// app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero min-h-[80vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to Todo App</h1>
          <p className="py-6">
            A simple, secure todo application with email OTP authentication.
            Get started by logging in to manage your tasks effectively.
          </p>
          <Link href="/login" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}