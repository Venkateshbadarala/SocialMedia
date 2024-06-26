// friendRequestApi.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';




// PUT request handler for accepting or canceling friend requests
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, senderId, action } = await req.json();

    // Validate input
    if (!userId || !senderId || !action) {
      return NextResponse.json({ message: 'User ID, Sender ID, and action are required' });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' });
    }

    // Handle actions (accept or cancel)
    if (action === 'accept') {
      // Add sender to user's friends list
      user.friends.push(senderId); // Assuming `friends` is an array in the user schema
      // Remove friend request from user's friendRequests list
      user.friendRequests = user.friendRequests.filter((request:any) => request.senderId !== senderId);
      await user.save();
      return NextResponse.json({ message: 'Friend request accepted' });
    } else if (action === 'cancel') {
      // Remove friend request from user's friendRequests list
      user.friendRequests = user.friendRequests.filter((request:any) => request.senderId !== senderId);
      await user.save();
      return NextResponse.json({ message: 'Friend request canceled' });
    } else {
      return NextResponse.json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error handling friend request:', error);
    return NextResponse.json({ message: 'Internal server error' });
  }
}
