"use client";

import SignIn from "@/components/auth/SignIn";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignIn />
    </Suspense>
  );
};

export default page;
