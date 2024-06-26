import { NextRequest } from 'next/server';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    const { liked, userId } = await req.json();

    const userWithPost = await User.findOne({ "userPosts._id": postId });

    if (!userWithPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const post = userWithPost.userPosts.id(postId);

    if (!post) {
      return NextResponse.json({ message: 'Post not found within user\'s posts' }, { status: 404 });
    }

    const liker = await User.findById(userId);

    if (!liker) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const alreadyLiked = post.likes.some((like: any) => like.userId === liker._id.toString());

    let updatedPost;

    if (liked && !alreadyLiked) {
      const updatedUser = await User.findOneAndUpdate(
        { "userPosts._id": postId },
        { $push: { "userPosts.$.likes": { userId: liker._id.toString(), userName: liker.name, userImage: liker.image } } },
        { new: true }
      );
      updatedPost = updatedUser.userPosts.id(postId);
    } else if (!liked && alreadyLiked) {
      const updatedUser = await User.findOneAndUpdate(
        { "userPosts._id": postId },
        { $pull: { "userPosts.$.likes": { userId: liker._id.toString() } } },
        { new: true }
      );
      updatedPost = updatedUser.userPosts.id(postId);
    } else {
      updatedPost = post;
    }

    return NextResponse.json({ likesCount: updatedPost.likes.length, liked: liked });

  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
