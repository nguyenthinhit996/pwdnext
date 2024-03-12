"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";

import { Loader } from "@/components/common/Loader";

export function Guard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    if (loading) {
      setLoading(!token);
    }
    if (!token) router.push("/login");
  }, [router, loading]);
  if (loading) return <Loader />;
  return <>{children}</>;
}
