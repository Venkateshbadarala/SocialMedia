import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialLikesCount: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLiked, initialLikesCount }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const LikeIcon = "/images/icons/like.png";

  const handleLike = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await axios.post(
        `/api/posts/like?id=${postId}`,
        { liked: !liked, userId: session.user.id },
      );

      if (response.status !== 200) {
        throw new Error('Failed to like post');
      }

      const { likesCount: updatedLikesCount, liked: updatedLiked } = response.data;

      setLiked(updatedLiked);
      setLikesCount(updatedLikesCount);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <button onClick={handleLike} className="flex items-center space-x-2">
      <Image
        src={LikeIcon}
        height={30}
        width={30}
        alt="Like Icon"
        className={`cursor-pointer ${liked ? 'fill-red-600' : 'invert'}`}
      />
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;
