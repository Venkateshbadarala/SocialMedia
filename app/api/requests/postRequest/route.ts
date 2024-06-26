import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';


export async function POST(req: NextRequest) {
    try {
      await dbConnect();
      const { senderId, receiverId } = await req.json();
  
      // Validate input
      if (!senderId || !receiverId) {
        return NextResponse.json({ message: 'Sender ID and Receiver ID are required' });
      }
  
      // Find sender and receiver
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
  
      if (!sender || !receiver) {
        return NextResponse.json({ message: 'User not found' });
      }
  
      // Add friend request to receiver's list
      receiver.friendRequests.push({ senderId, senderName: sender.name, senderImage: sender.image });
      await receiver.save();
  
      return NextResponse.json({ message: 'Friend request sent' });
    } catch (error) {
      console.error('Error sending friend request:', error);
      return NextResponse.json({ message: 'Internal server error' });
    }
  }
  