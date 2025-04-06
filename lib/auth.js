import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get('token')?.value;
    return token;
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken() {
  const token = await getTokenFromCookies();
  if (!token) return null;
  
  const decodedToken = verifyToken(token);
  if (!decodedToken) return null;
  
  return decodedToken.email;
}