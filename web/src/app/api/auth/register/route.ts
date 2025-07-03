import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, isParent } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        isParent: Boolean(isParent),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isParent: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Registration failed', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}