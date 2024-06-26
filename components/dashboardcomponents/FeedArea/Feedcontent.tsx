"use client";
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HoverCard from '@/components/Navbar/HoverCard';
import LikeButton from '@/components/dashboardcomponents/FeedArea/LikeButton';
import CommentDrawer from '@/components/dashboardcomponents/FeedArea/CommentDrawer';

interface Comment {
  userId: string;
  userName: string;
  userImage: string;
  text: string;
}

interface Post {
  postId: string;
  userId: string;
  userName: string;
  userImage: string;
  caption: string;
  photos: string[];
  comments: Comment[];
  likes: { userId: string; userName: string; userImage: string }[];
}

const FeedContent = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const postData: Post[] = await response.json();

        if (!Array.isArray(postData)) {
          throw new Error('Invalid data format');
        }

        setPosts(postData);
        setError(null); 
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts');
        setPosts([]); 
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className='flex flex-col bg-black p-5 gap-4 rounded-md shadow-2xl max-h-[80vh] overflow-y-scroll no-scrollbar  '>
      {error ? (
        <div className='text-red-500'>{error}</div>
      ) : (
        posts.length > 0 ? (
          posts.map(post => (
            <div key={post.postId} className='flex flex-col bg-black border rounded-xl shadow-lg w-[25rem] '>
              <div className='flex flex-row items-center gap-2 p-3'>
                <HoverCard
                  userId={post.userId}
                  userName={post.userName}
                  userImage={post.userImage}
                />
                <span>{post.userName}</span>
              </div>
              <div className='relative h-80 w-full'>
                <Image
                  src={post.photos[0] || "/placeholder.png"}
                  alt="User Post"
                  layout="fill"
                  objectFit="cover"
                  className="shadow-2xl"
                  onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex gap-3 p-3'>
                  <LikeButton
                    postId={post.postId}
                    initialLiked={post.likes.some(like => like.userId === session?.user?.id)}
                    initialLikesCount={post.likes.length}
                  />
                  <CommentDrawer 
                    postId={post.postId} 
                    initialCommentCount={post.comments.length} 
                  />
                </div>
                <div className='p-2'>
                  <span className='font-bold'>{post.comments.length} comments</span>
                </div>
              </div>
              <div className='font-bold text-white px-4 py-2 flex gap-3'>{post.userName}__<p>{post.caption}</p></div>
            </div>
          ))
        ) : (
          <div className='text-gray-500'>No posts available</div>
        )
      )}
    </div>
  );
};

export default FeedContent;
