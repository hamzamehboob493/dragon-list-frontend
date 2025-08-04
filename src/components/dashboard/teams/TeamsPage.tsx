"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import TeamModal from "./TeamModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import ToastMessages, {
  showSuccessToast,
  // showErrorToast,
} from "@/components/common/ToastMessages";
import {
  createAction,
  deleteAction,
  getAction,
  updateAction,
} from "@/lib/actions/crudActions";
import { routes } from "@/lib/routes";
import { Team, TeamFormValues } from "@/lib/types/dashboard/types";
import Link from "next/link";
import Loader from "@/components/common/Loader";

const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !showActiveOnly || team.isActive;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    getTeamsData();
  }, []);

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
  };

  const getTeamsData = async () => {
    setLoading(true);
    try {
      const response = await getAction(routes.api.teams.index);
      if (response?.status === 200) {
        setTeams(response?.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitTeam = async (data: TeamFormValues) => {
    setLoading(true);
    try {
      let response;
      if (editingTeam?.id) {
        response = await updateAction(
          `${routes.api.teams.index}/${editingTeam.id}`,
          data,
        );
        if (response?.status === 200) {
          await getTeamsData();
          showSuccessToast("Team updated successfully");
        } else {
        }
      } else {
        response = await createAction(routes.api.teams.index, data);
        if (response?.status === 201) {
          await getTeamsData();
          showSuccessToast("Team created successfully");
        } else {
        }
      }
    } catch (error) {
      console.error("Error submitting team:", error);
    } finally {
      setShowModal(false);
      setEditingTeam(null);
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete?.id) return;
    setLoading(true);
    try {
      const response = await deleteAction(
        `${routes.api.teams.index}/${teamToDelete.id}`,
      );
      if (response?.status === 200) {
        await getTeamsData();
        showSuccessToast("Team deleted successfully");
      } else {
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    } finally {
      setLoading(false);
      setTeamToDelete(null);
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setShowModal(true);
  };

  const handleOpenDeleteModal = (team: Team) => {
    setTeamToDelete(team);
    setShowDeleteModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Teams Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor team accounts
            </p>
          </div>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setEditingTeam(null);
              setShowModal(true);
            }}
            disabled={loading}
          >
            <i className="fas fa-plus mr-2"></i>
            Add Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Total Teams",
              count: teams.length,
              icon: "fas fa-users",
              color: "blue",
            },
            {
              label: "Active Teams",
              count: teams.filter((u) => u.isActive).length,
              icon: "fas fa-user-check",
              color: "green",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transform hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 bg-${card.color}-100 dark:bg-${card.color}-900 rounded-lg`}
                >
                  <i
                    className={`${card.icon} text-${card.color}-600 text-xl dark:text-${card.color}-300`}
                  ></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.count}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Teams
              </label>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                value={showActiveOnly.toString()}
                onChange={(e) => setShowActiveOnly(e.target.value === "true")}
                disabled={loading}
              >
                <option value="false">All Teams</option>
                <option value="true">Active Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Name", "Code", "Description", "Status", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <Loader color="#fc8b28" />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTeams.map((team) => (
                    <tr
                      key={team.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {team.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                          {team.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {team.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(team.isActive)}`}
                        >
                          {team.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditTeam(team)}
                            className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 transform hover:scale-110 transition-transform duration-200"
                            disabled={loading}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(team)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transform hover:scale-110 transition-transform duration-200"
                            disabled={loading}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <Link
                            href={`${routes.ui.dashboard.teams}/${team.id}`}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 transform hover:scale-110 transition-transform duration-200"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      <TeamModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTeam(null);
        }}
        onSubmit={submitTeam}
        team={editingTeam}
        loading={loading}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTeam}
        title="Confirm Delete"
        message={`Are you sure you want to delete the team "${teamToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastMessages />
    </AdminLayout>
  );
};

export default TeamsPage;
