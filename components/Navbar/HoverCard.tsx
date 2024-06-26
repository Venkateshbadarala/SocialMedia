import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HoverCardProps {
  userId: string;
  userName: string;
  userImage: string;
}

const HoverCard: React.FC<HoverCardProps> = ({ userId, userName, userImage }) => {
  return (
    <Link href={`/users/${userId}`} passHref>
      <div className='flex items-center gap-2'>
        <Image
          src={userImage || "https://placehold.co/40x40.png"}
          alt={`${userName}'s profile picture`}
          width={40}
          height={40}
          className='rounded-full'
        />
        
      </div>
    </Link>
  );
};

export default HoverCard;
