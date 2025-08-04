"use client";

import AdminLayout from "@/layouts/AdminLayout";
import { getAction } from "@/lib/actions/crudActions";
import { formatDate } from "@/lib/helpers/formatDate";
import { routes } from "@/lib/routes";
import { Team as TeatType } from "@/lib/types/dashboard/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Team: React.FC = () => {
  const [team, setTeam] = useState<TeatType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await getAction(`${routes.api.teams.index}/${id}`);
        if (response?.data) {
          setTeam(response.data);
        } else {
          setError("Failed to load team data");
        }
      } catch (err) {
        setError("An error occurred while fetching team data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [id]);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Team Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed information about the team
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 p-4 rounded-lg">
            {error}
          </div>
        )}

        {team && !loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-users mr-2 text-orange-500"></i>
                Team Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {team.name}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Code
                  </div>
                  <div className="w-2/3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                      {team.code}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </div>
                  <div className="w-2/3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        team.isActive
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {team.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {team.description}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-info-circle mr-2 text-orange-500"></i>
                Metadata
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {team.id}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created At
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {formatDate(team.createdAt)}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Updated At
                  </div>
                  <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                    {formatDate(team.updatedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Members Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i className="fas fa-user-friends mr-2 text-orange-500"></i>
                Team Members
              </h2>
              <div className="text-sm text-gray-900 dark:text-white">
                {team.members.length > 0 ? (
                  <div className="space-y-4">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            Phone: {member.phoneNumber}
                          </p>
                        </div>
                        <div className="flex-1 text-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              member.role.name === "admin"
                                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {member.role.name}
                          </span>
                        </div>
                        <div className="flex-1 text-right">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              member.status.name === "active"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {member.status.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No members assigned to this team.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Team;
