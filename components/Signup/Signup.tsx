"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserRegister {
  name: string;
  password: string;
  email: string;
}

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UserRegister>();

  const handleSubmitForm = async (data: UserRegister) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/register", data);
      toast.success('User registered successfully!');
      toast.success('Link sent to your email');
    } catch (error: any) {
      if (error.response?.data?.error === "Email already exists") {
        toast.error('Email already exists');
      } else {
        toast.error(`Failed to register user: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     
      <form onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col items-center justify-center gap-5 rounded'>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="name" className='text-base font-bold'>Username:</label>
          <input
            type="text"
            id="name"
            placeholder="venkatesh"
            {...register("name", { required: "Name is required" })}
            className='w-96 h-12'
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="email" className='text-base font-bold'>Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Example@gmail.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className='w-96 h-12'
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="password" className='text-base font-bold'>Password:</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            className='w-96 h-12'
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <button type='submit' className='w-full h-12 bg-blue-600' disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
