"use client";
import { useEffect } from "react";
import Login from "@/components/Login";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Attempt to retrieve the token from localStorage
    const token = localStorage.getItem('token');
    console.log('tokentokentokentokentoken', token);
    // If a token is found, redirect to the /tasks route
    if (token) {
      router.push('/tasks');
    }
  }, [router]);
  return <Login />;
}
