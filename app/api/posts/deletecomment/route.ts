import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';
export async function DELETE(req: NextRequest) {
    try {
      await dbConnect();
      console.log('Database connected');
  
      const { searchParams } = new URL(req.url);
      const postId = searchParams.get('id');
      const { commentId } = await req.json();
  
      console.log('Post ID:', postId);
      console.log('Comment ID:', commentId);
  
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
  
      // Find and remove the comment or reply
      let deletedComment;
      const parentComment = post.comments.id(commentId);
      if (parentComment) {
        // If it's a top-level comment
        deletedComment = parentComment;
        parentComment.remove();
      } else {
        // Check in replies
        for (const comment of post.comments) {
          deletedComment = comment.replies.id(commentId);
          if (deletedComment) {
            deletedComment.remove();
            break;
          }
        }
      }
  
      if (!deletedComment) {
        console.log('Comment not found');
        return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
      }
  
      await userWithPost.save();
  
      return NextResponse.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }