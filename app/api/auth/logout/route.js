import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
    cookieStore.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  return NextResponse.json({ success: true });
}