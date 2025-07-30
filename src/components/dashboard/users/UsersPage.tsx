"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import UserModal from "./UserModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import ToastMessages, { showSuccessToast, showErrorToast } from "@/components/common/ToastMessages";
import { createAction, deleteAction, getAction, updateAction } from "@/lib/actions/crudActions";
import { routes } from "@/lib/routes";
import Link from "next/link";
import Loader from "@/components/common/Loader";
import { User, UserFormValues } from "@/lib/types/dashboard/types";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null | undefined>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !showActiveOnly || user.status.id === 'active';
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    getUsersData();
  }, []);

  const getStatusBadge = (status: string) => {
    return status === 'active'
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

  const getUsersData = async () => {
    setLoading(true);
    try {
      const response = await getAction(routes.api.users.index);
      if (response?.status === 200) {
        setUsers(response?.data.data || []);
      } else {
        showErrorToast("Failed to fetch users");
      }
    } catch (error) {
      showErrorToast("Error fetching users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitUser = async (data: UserFormValues) => {
    setLoading(true);
    try {
      let response;
      if (editingUser?.id) {
        response = await updateAction(`${routes.api.users.index}/${editingUser.id}`, data);
        if (response?.status === 200) {
          await getUsersData();
          showSuccessToast("User updated successfully");
        } else {
          showErrorToast(response?.data.message || "Error updating user");
        }
      } else {
        response = await createAction(routes.api.users.index, data);
        if (response?.status === 201) {
          await getUsersData();
          showSuccessToast("User created successfully");
        } else {
          showErrorToast(response?.data.message || "Error creating user");
        }
      }
    } catch (error) {
      showErrorToast("Error submitting user");
      console.error("Error submitting user:", error);
    } finally {
      setShowModal(false);
      setEditingUser(null);
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete?.id) return;
    setLoading(true);
    try {
      const response = await deleteAction(`${routes.api.users.index}/${userToDelete.id}`);
      if (response?.status === 200) {
        await getUsersData();
        showSuccessToast("User deleted successfully");
      } else {
        showErrorToast(response?.data.message || "Error deleting user");
      }
    } catch (error) {
      showErrorToast("Error deleting user");
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
      setUserToDelete(null);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor user accounts</p>
          </div>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
            disabled={loading}
          >
            <i className="fas fa-plus mr-2"></i>
            Add User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Users", count: users.length, icon: "fas fa-users", color: "blue" },
            { label: "Active Users", count: users.filter(u => u.status.id === 'active').length, icon: "fas fa-user-check", color: "green" },
            { label: "Admins", count: users.filter(u => u.role.id === 'admin').length, icon: "fas fa-user-shield", color: "purple" },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transform hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center">
                <div className={`p-2 bg-${card.color}-100 dark:bg-${card.color}-900 rounded-lg`}>
                  <i className={`${card.icon} text-${card.color}-600 text-xl dark:text-${card.color}-300`}></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Users</label>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                value={showActiveOnly.toString()}
                onChange={(e) => setShowActiveOnly(e.target.value === "true")}
                disabled={loading}
              >
                <option value="false">All Users</option>
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
                  {['Name', 'Email', 'Role', 'Status', 'Team', 'Actions'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <Loader color="#fc8b28" />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{`${user.firstName} ${user.lastName}`}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role.id)}`}>
                          {/* {user.role.id.charAt(0).toUpperCase() + user.role.id.slice(1)} */}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status.id)}`}>
                          {/* {user.status.id.charAt(0).toUpperCase() + user.status.id.slice(1)} */}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {/* {user.team.name} */}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 transform hover:scale-110 transition-transform duration-200"
                            disabled={loading}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(user)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transform hover:scale-110 transition-transform duration-200"
                            disabled={loading}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <Link
                            href={`${routes.ui.dashboard.users}/${user.id}`}
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

      <UserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSubmit={submitUser}
        user={editingUser}
        loading={loading}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title="Confirm Delete"
        message={`Are you sure you want to delete the user "${userToDelete?.firstName} ${userToDelete?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastMessages />
    </AdminLayout>
  );
};

export default UsersPage;
