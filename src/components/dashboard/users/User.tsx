"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { getAction } from "@/lib/actions/crudActions";
import { routes } from "@/lib/routes";
import { User as UserType } from "@/lib/types/dashboard/types";
import Loader from "@/components/common/Loader";
import { useParams } from "next/navigation";

const User: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getAction(`${routes.api.users.index}/${id}`);
        if (response?.data) {
          setUser(response.data);
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        setError("An error occurred while fetching user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300";
      case "manager":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300";
      case "user":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Details</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Detailed information about the user</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader color="#fc8b28" />
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 p-4 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        {user && !loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transform hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-user mr-2 text-orange-500"></i>
                User Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">{`${user.firstName} ${user.lastName}`}</div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Email</div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">{user.email}</div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">{user.phoneNumber}</div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Role</div>
                  <div className="w-2/3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role.id)}`}>
                      {/* {user.role.id.charAt(0).toUpperCase() + user.role.id.slice(1)} */}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Status</div>
                  <div className="w-2/3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status.id)}`}>
                    </span>
                  </div>
                </div>
                {user.photo && (
                  <div className="flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Photo ID</div>
                    <img
                      src={user.photo.path}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                      />
                  </div>
                )}
              </div>
            </div>

            {
              user.team && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 transform hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <i className="fas fa-users mr-2 text-orange-500"></i>
                    Team Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Team Name</div>
                      <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                        {user.team.name}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Team Code</div>
                      <div className="w-2/3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                          {user.team.code}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Team Status</div>
                      <div className="w-2/3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.team.isActive
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {user.team.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">Team Description</div>
                      <div className="w-2/3 text-sm text-gray-900 dark:text-white">{user.team.description}</div>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default User;
