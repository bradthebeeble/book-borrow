import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, isParent } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
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

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        id: { not: session.user.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email is already in use by another account' },
        { status: 409 }
      );
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        isParent: Boolean(isParent),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isParent: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: updatedUser 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Profile update failed', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        isParent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Profile fetch error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}