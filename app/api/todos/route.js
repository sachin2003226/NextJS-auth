// app/api/todos/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Todo from '@/models/Todo';
import { getUserFromToken } from '@/lib/auth';

export async function GET() {
  try {
    const userEmail = await getUserFromToken();
    
    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const todos = await Todo.find({ user: userEmail }).sort({ createdAt: -1 });
    
    return NextResponse.json(todos);
  } catch (error) {
    console.error("Get todos error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userEmail = await getUserFromToken();
    
    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const { title, description } = await request.json();
    
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const newTodo = new Todo({
      title,
      description: description || '',
      user: userEmail,
    });
    
    await newTodo.save();
    
    return NextResponse.json(newTodo);
  } catch (error) {
    console.error("Create todo error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}