import React from 'react';
import Link from 'next/link';
import LoginForm from '@/components/login/LoginCredentials';
import LoginProvider from '@/components/Provider/LoginProvider';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session) { 
       return redirect('/dashboard');
    }
        
    

    return (
        <div className="flex items-center justify-center h-screen bg-hero-pattern bg-no-repeat bg-cover">
            <ToastContainer />
            <div className=" p-16 flex flex-col items-center justify-center gap-3 rounded-2xl backdrop-blur-md shadow-2xl ">
                <h1 className="text-3xl font-extrabold ">LOGIN</h1>
                <LoginForm />
                
                <h1 className="font-extrabold ">----------------OR----------------</h1>
                <LoginProvider />
                <h1 className='font-bold text-white'>New Here? <Link href='/register' className='text-orange-600'>Create An Account</Link></h1>
                
            </div>
           
            
        </div>
    );
}
