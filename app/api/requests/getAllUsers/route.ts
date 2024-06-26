// getAllUsers.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Fetch all users
    const users = await User.find({});

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
