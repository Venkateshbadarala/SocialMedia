import React from 'react';
import ForgotForm from '@/components/forgotPasswordForm/ForgotForm';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPage = () => {
  return (
    <div className='flex items-center justify-center h-screen bg-hero-pattern'>
       <ToastContainer />
      <div className='p-14 flex flex-col items-center justify-center gap-6 rounded-lg shadow-2xl backdrop-blur-md'>
        <h1 className='text-3xl font-extrabold'>RESET PASSWORD</h1>
        <ForgotForm />
        <h1 className='font-bold text-white'>Already created an account? <Link href='/login' className='text-black'>Login</Link></h1>
       
      </div>
    </div>
  );
}

export default ForgotPage;
