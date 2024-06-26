"use client";
import React,{useState} from 'react';
import { useForm } from 'react-hook-form';

import { signIn } from 'next-auth/react';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
interface UserRegister {
  password: string;
  email: string;
}

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegister>({
    reValidateMode: "onChange",
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitForm = async (data: UserRegister) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
      
      });

      if (result?.error) {
        toast.success("Login failed");
      } else {
        toast.success("Login successful");
      
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSubmitForm)} className='items-center justify-center flex flex-col gap-4 rounded'>
        
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="email" className='text-base font-bold '>Email</label>
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
          <label htmlFor="password" className='text-base font-bold '>Password</label>
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
           <Link href="/forgotpassword" className="text-blue-600"> forgot password</Link>
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <button type='submit' className='w-full h-12 bg-blue-600' disabled={loading}>{loading ? "Loading..."  : "Login"}</button>
      </form>
    </div>
  );
};

export default LoginForm;
