// /api/posts/commentbox.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log('Database connected');

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('id');
    console.log('Post ID:', postId);

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

    // Map comments to include username
    const commentsWithUsernames = post.comments.map((comment: any) => ({
      _id: comment._id,
      userId: comment.userId,
      userName: comment.userName, 
      userImage: comment.userImage,
      text: comment.text,
      createdAt: comment.createdAt,
    }));

    // Return the comments
    return NextResponse.json({ comments: commentsWithUsernames });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
