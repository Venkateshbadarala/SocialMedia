"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
const HomeIcon = "/images/icons/home.png";
const SearchIcon = "/images/icons/search.png";
const MessageIcon = "/images/icons/conversation.png";
const LikeIcon = "/images/icons/like.png";
import HoverCard from '../Navbar/HoverCard';
import { useSession } from 'next-auth/react';

const sidelist = [
    {
     
      linkUrl: "/dashboard",
      icon: HomeIcon
    },
    {
      
      linkUrl: "/search",
      icon: SearchIcon
    },
    {
     
      linkUrl: "/message",
      icon: MessageIcon
    },
    {
      
      linkUrl: "/likes",
      icon: LikeIcon
    },
  ];

const Bottombar = () => {
    const { data: session, status } = useSession();
    const [imageSrc, setImageSrc] = useState("https://placehold.co/300x300.png");
    useEffect(() => {
        if (session?.user?.image) {
          setImageSrc(session?.user?.image);
        }
      }, [session]);
    return (
    <div>
        <div className="text-xl text-white flex flex-row gap-7 items-center justify-center">
        {sidelist.map((item, index) => (
          <Link href={item.linkUrl} key={index}>
            <div className='flex items-center gap-4 justify-start hover:bg-gray-700 rounded-md p-4'>
              <Image src={item.icon} height={25} width={25} alt='icon' className='invert filter' />
             
            </div>
          </Link>
        ))}
         <div className='w-8'>
         {session && (
          <HoverCard
            userId={session.user?.id || ''}
            userName={session.user?.name || ''}
            userImage={session.user?.image || ''}
          />
        )}
        </div>
        
      </div>
     </div>
  )
}

export default Bottombar