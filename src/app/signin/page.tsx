"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { signIn } from 'next-auth/react';
import {toast, ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        console.error(result.error);
      } else {
        router.push('/chatbot');
        console.log("Logged in successfully");
        toast.success("Login successfully")
      }
    } catch (error: any) {
      setError('An error occurred during sign-in');
      toast.error("Error in login")
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
      <ToastContainer></ToastContainer>
      <div className="container mx-auto">
        <div className="max-w-md mx-auto my-10">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Sign in</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to access your account</p>
          </div>
          <div className="m-7">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required id="email" placeholder="you@company.com" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" />
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-400">Password</label>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required id="password" placeholder="Your Password" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" />
              </div>
              <div className="mb-6">
                <button type="submit" className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none">Sign in</button>
              </div>
              <p className="text-sm text-center text-gray-400">Don't have an account yet? <Link href="/signup" className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800">Sign up</Link>.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

