"use client";

import { UserLayoutProps } from "@/lib/types/layouts/types";
import React from "react";

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="bg-orange-400 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">User Panel</h1>
      </header>
      <main className="flex-grow p-6">{children}</main>
      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  );
};

export default UserLayout;
