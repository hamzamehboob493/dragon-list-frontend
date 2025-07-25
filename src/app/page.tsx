"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(routes.ui.signIn);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent"></div>
    </div>
  );
};

export default Home;
