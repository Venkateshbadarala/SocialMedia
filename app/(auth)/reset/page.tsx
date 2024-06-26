import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ResetForm from '@/components/resetForm/resetForm';
import {  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Marking this function as an async server component
export default async function RegisterPage() {
  // Retrieve the session
  const session = await getServerSession(authOptions);

  // redirect to the dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex items-center justify-center h-screen bg-hero-pattern bg-no-repeat bg-cover">
                <ToastContainer/>
      <div className="p-14 flex flex-col items-center justify-center gap-6 rounded-lg shadow-2xl backdrop-blur-md">
        <h1 className="text-3xl font-extrabold">RESET PASSWORD</h1>
        <ResetForm />
      </div>
    </div>
  );
}
