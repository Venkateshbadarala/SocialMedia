// PrimaryNavigation.tsx
"use client"
import React from 'react';
import { useSession } from 'next-auth/react';
import DialogDemo from '@/components/Navbar/CreatePost/Createpost';
import Image from 'next/image';
import HoverCard from '@/components/Navbar/HoverCard';
import ThemeSwitch from './themes/ThemeSwitch';

const PrimaryNavigation: React.FC = () => {
  const icon = "/images/morales.png"
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center p-5  sm:justify-end lg:justify-between">
      <div className='  xsm:hidden lg:flex'>
        <h1 className='flex text-xl font-serif'>HELLO..<p className='font-mono typing'>{session?.user?.name}</p></h1>
      </div>
     <Image src={icon} alt='icon' width={80} height={10} className='sm:hidden'/>
     <div className="flex items-center gap-5 ">
       <div>
       <input
          type="text"
          placeholder="Search"
          className="w-96 h-12 xsm:w-[12rem] md:w-96 border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
       </div>

       <div>
       <DialogDemo />
       </div>
       <div className=' p-2'>
        <ThemeSwitch/>
       </div>
        
        <div className='xsm:hidden sm:block'>
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
  );
};

export default PrimaryNavigation;
