import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/Database/db.connection/dbconnection';
import User from '@/app/Database/models/user';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest,{params}:{params:{id:string}}) {
  try {
  
    await dbConnect();
  
   const {id} = params;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' },{status:400});
    }

    const user = await User.findById(id).select('userPosts');
    if (!user) {
      console.error('User not found:', id);
      return NextResponse.json({ error: 'User not found' },{status:404});
    }
console.log(user)
    
    return NextResponse.json(user.userPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ error: 'Server error' });
  }
}
