
// app/api/todos/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Todo from '@/models/Todo';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const userEmail = await getUserFromToken();
    
    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const { id } = params;
    
    await connectToDatabase();
    
    const todo = await Todo.findOne({ _id: id, user: userEmail });
    
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    return NextResponse.json(todo);
  } catch (error) {
    console.error("Get todo error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const userEmail = await getUserFromToken();
    
    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const { id } = params;
    const { title, description, completed } = await request.json();
    
    await connectToDatabase();
    
    const todo = await Todo.findOne({ _id: id, user: userEmail });
    
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    if (title) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    
    await todo.save();
    
    return NextResponse.json(todo);
  } catch (error) {
    console.error("Update todo error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userEmail = await getUserFromToken();
    
    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const { id } = params;
    
    await connectToDatabase();
    
    const todo = await Todo.findOneAndDelete({ _id: id, user: userEmail });
    
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete todo error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
