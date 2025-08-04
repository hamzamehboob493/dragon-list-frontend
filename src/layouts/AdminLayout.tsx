"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAppContext } from "@/contexts/AppContext";
import { AdminLayoutProps } from "@/lib/types/layouts/types";
import { routes } from "@/lib/routes";
import { sidebarItems } from "@/lib/constants/staticData";
import Spinner from "@/components/common/Spinner";
import { usePathname } from "next/navigation";

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser, isLoading } = useAppContext();

  const pathname = usePathname();

  const userName = currentUser?.name || "Admin User";
  const userEmail = currentUser?.email || "";

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/sign-in" });
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#121212]">
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 shadow-lg dark:shadow-none transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1
            className={`font-bold text-xl text-orange-500 dark:text-orange-400 ${
              !isSidebarOpen && "hidden"
            }`}
          >
            DRAGONS LIST 
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className={`fas fa-${isSidebarOpen ? "times" : "bars"}`}></i>
          </button>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href as string}
              className={`flex items-center px-4 py-3 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400 ${
                pathname.includes(item.href) &&
                !pathname.includes(`${item.href}/`)
                  ? "text-orange-500 dark:text-orange-400"
                  : "text-gray-700"
              }`}
            >
              <i className={`${item.icon} w-6`}></i>
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-none h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Dashboard
            </h2>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 dark:bg-orange-400 flex items-center justify-center text-white">
                {currentUser?.image ? (
                  <img
                    src={currentUser.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
              <div className="text-left">
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {userName}
                </span>
                {userEmail && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userEmail}
                  </p>
                )}
              </div>
              <i
                className={`fas fa-chevron-${
                  isProfileOpen ? "up" : "down"
                } text-gray-500 dark:text-gray-400`}
              ></i>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-10">
                <div className="px-4 py-2 border-b dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userEmail}
                    </p>
                  )}
                </div>
                <Link
                  href={routes.ui.dashboard.profile}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-600 hover:text-orange-500 dark:hover:text-orange-400"
                >
                  <i className="fas fa-user-circle mr-2"></i>
                  Profile
                </Link>
                <Link
                  href={routes.ui.dashboard.settings}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-600 hover:text-orange-500 dark:hover:text-orange-400"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Settings
                </Link>
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-600 hover:text-orange-500 dark:hover:text-orange-400"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-[#121212]">
          {children}
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
