"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import axios from "axios";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter } from "next/navigation";

interface UserRegister {
  token: string;
  password: string;
}

const ResetForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verified = searchParams.get("verified");
  const router = useRouter();

  useEffect(() => {
    if (!token || verified !== "true") {
      router.push("/");
    }
  }, [token, verified, router]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegister>({
    reValidateMode: "onChange",
    mode: "onBlur",
    defaultValues: {
      token: "",
      password: "",
    },
  });

  const handleSubmitForm = async (data: UserRegister) => {
    try {
      data.token = token as string;
      setLoading(true);
      const response = await axios.post("/api/users/reset", data);
      router.push("/login");
      toast.success("User reset successfully!");
      // Handle success if needed
    } catch (error: any) {
      console.log("error", error?.message);
      if (error.response && error.response.data.error === "Email already exists") {
        toast.error("Email already exists");
      } else {
        setErrorMessage("Failed to reset user: " + error?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="items-center justify-center flex flex-col gap-5 rounded"
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="password" className="text-base font-bold">
            Password:
          </label>
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
            className="w-96 h-12"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="w-full h-12" disabled={loading}>
          {loading ? "Loading..." : "Reset"}
        </button>
      </form>
      
    </div>
  );
};

export default ResetForm;
