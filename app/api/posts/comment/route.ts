import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log('Database connected');

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('id');
    const { userId, text } = await req.json();

    console.log('Post ID:', postId);
    console.log('User ID:', userId);
    console.log('Text:', text);

    if (!postId || !userId || !text) {
      return NextResponse.json({ message: 'Post ID, user ID, and text are required' }, { status: 400 });
    }

    // Find the user and the specific post within the user's posts
    const userWithPost = await User.findOne({ 'userPosts._id': postId });

    if (!userWithPost) {
      console.log('Post not found');
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const post = userWithPost.userPosts.id(postId);

    if (!post) {
      console.log("Post not found within user's posts");
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Fetch commenter details
    const commenter = await User.findById(userId);

    if (!commenter) {
      console.log('Commenter not found');
      return NextResponse.json({ message: 'Commenter not found' }, { status: 404 });
    }

    // Add the new comment
    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      userName: commenter.name, 
      userImage: commenter.image, 
      text,
      createdAt: new Date(),
    };
    post.comments.push(newComment);

    await userWithPost.save();

    return NextResponse.json({ commentCount: post.comments.length });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
