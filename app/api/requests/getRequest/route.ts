import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log("Database connected successfully");

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Validate input
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
    }

    // Find user by ID and return friend requests
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.friendRequests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
