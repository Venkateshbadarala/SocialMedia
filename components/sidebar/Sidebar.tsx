"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import HoverCard from '../Navbar/HoverCard';


const HomeIcon = "/images/icons/home.png";
const SearchIcon = "/images/icons/search.png";
const MessageIcon = "/images/icons/conversation.png";
const LikeIcon = "/images/icons/like.png";
const LogoutIcon = "/images/icons/exit.png";

const sidelist = [
  {
    title: "Home",
    linkUrl: "/dashboard",
    icon: HomeIcon
  },
  {
    title: "Search",
    linkUrl: "/search",
    icon: SearchIcon
  },
  {
    title: "Messages",
    linkUrl: "/message",
    icon: MessageIcon
  },
  {
    title: "Likes",
    linkUrl: "/likes",
    icon: LikeIcon
  },
];

const Sidebar = () => {
   const icon = "/images/morales1.png"
  const { data: session, status } = useSession();
  const [imageSrc, setImageSrc] = useState("https://placehold.co/300x300.png");

  useEffect(() => {
    if (session?.user?.image) {
      setImageSrc(session?.user?.image);
    }
  }, [session]);

  return (
    <div className='h-screen flex flex-col justify-around items-center sm:w-24 lg:w-52  shadow-lg'>
      <div className='top-6 absolute '>
      <Image src={icon} alt='icon' width={90} height={90} className='xsm:hidden sm:block lg:w-40'/>
      </div>
<div className="text-xl text-white flex flex-col gap-7 absolute">
        {sidelist.map((item, index) => (
          <Link href={item.linkUrl} key={index}>
            <div className='flex items-center gap-4 justify-start hover:bg-gray-700 rounded-md p-4'>
              <Image src={item.icon} height={25} width={25} alt={`${item.title} icon`} className='invert filter' />
              <span className='md:hidden lg:block'>{item.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className='text-xl absolute bottom-24 text-white flex items-center gap-3 hover:bg-gray-700 rounded-md p-4 md:left-3'>
      {session && (
          <HoverCard
            userId={session.user?.id || ''}
            userName={session.user?.name || ''}
            userImage={session.user?.image || ''}
          />
        )}
        <span className='md:hidden lg:block'>Profile</span>
      </div>

      <div className='text-xl absolute bottom-4 text-white flex items-center gap-3 hover:bg-gray-700 rounded-md p-4 lg:left-5'>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className='flex gap-4 items-center'>
          <Image src={LogoutIcon} height={25} width={25} alt='Logout Icon' className='invert filter shadow-2xl' />
          <span className='md:hidden lg:block'>LogOut</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
