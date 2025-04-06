export const runtime = 'nodejs';


import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if OTP is valid and not expired
    if (user.otp !== otp || !user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }
    
    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    
    // Generate JWT token
    const token = generateToken(email);
    
    // Set JWT as HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
