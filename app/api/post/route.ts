import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest) {
 

  try {
    await dbConnect();

    
    const users = await User.aggregate([
      {
        $unwind: '$userPosts'
      },
      {
        $project: {
          _id: 0,
          postId: '$userPosts._id',
          userId: '$_id',
          userName: '$name',
          userImage: '$image',
          caption: '$userPosts.caption',
          photos: '$userPosts.photos',
          likes: '$userPosts.likes',
          comments: '$userPosts.comments'
        }
      }
    ]);
    console.log(users)

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Server error' });
  }
}
