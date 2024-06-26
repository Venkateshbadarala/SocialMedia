"use client";
import React from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

const GoogleIcon = "/images/google.png";

const providers = [
    {
        name: "google", // Use the provider ID
        displayName: "Continue with Google",
        icon: GoogleIcon,
    },
];

const LoginProvider = () => {
    const handleSignin = (provider: string) => {
        console.log("calling from", provider);
        signIn(provider); 
    };

    return (
        <div>
            {providers.map((item, index) => (
                <button
                    onClick={() => handleSignin(item.name)}
                    key={index}
                    className='text-xl font-bold flex flex-row justify-center items-center gap-6
                      bg-blue-300 w-96 h-14 rounded  shadow-2xl'>
                    {item.displayName}
                    <Image src={item.icon} height={30} width={30} alt='U' />
                </button>
            ))}
        </div>
    );
};

export default LoginProvider;
