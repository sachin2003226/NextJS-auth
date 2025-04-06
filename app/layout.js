import './globals.css';
import { getUserFromToken } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Next.js Authentication & Todo App',
  description: 'A simple authentication and todo application with Next.js',
};

export default async function RootLayout({ children }) {
  const userEmail = await getUserFromToken();
  
  return (
    <html lang="en" data-theme="light">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navbar userEmail={userEmail} />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="py-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} - Next.js Authentication & Todo App
          </footer>
        </div>
      </body>
    </html>
  );
}