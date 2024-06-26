import RegisterForm from '@/components/Signup/Signup';
import React from 'react';
import LoginProvider from '@/components/Provider/LoginProvider';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Marking this function as an async server component
export default async function RegisterPage() {
  // Retrieve the session
  const session = await getServerSession(authOptions);
 
  
  // If the user is already logged in, redirect to the dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex items-center justify-center h-screen bg-hero-pattern bg-no-repeat bg-cover">
      <ToastContainer />
      <div className=" p-14 flex flex-col items-center justify-center gap-4 rounded-lg backdrop-blur-md shadow-2xl bg-no-repeat bg-cover">
        <h1 className="text-3xl font-extrabold">REGISTER NOW</h1>
        <RegisterForm />
        
        <h1 className="font-extrabold">----------------OR----------------</h1>
        <LoginProvider />
        <h1 className='font-bold text-white'>Already create An Account? <Link href='/login'className='text-orange-600' >Login</Link></h1>
      </div>
    </div>
  );
}
