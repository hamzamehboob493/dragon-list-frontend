"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import ToastMessages from "@/components/common/ToastMessages";
import Loader from "@/components/common/Loader";
import { getAction } from "@/lib/actions/crudActions";
import { routes } from "@/lib/routes";
import { ShowMessage } from "./ShowMessage";
import { WhatsappMessagesPageProps } from "@/lib/types/dashboard/types";

const WhatsappMessagesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<WhatsappMessagesPageProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReadOnly, setShowReadOnly] = useState<boolean>(false);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<WhatsappMessagesPageProps | null>(null);

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.toNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.groupName && message.groupName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !showReadOnly || message.status === "read";
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    getMessagesData();
  }, []);

  const getStatusBadge = (status: string) => {
    return status === "read"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
  };

  const handleViewMessage = (message: WhatsappMessagesPageProps) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const getMessagesData = async () => {
    setLoading(true);
    try {
      const response = await getAction(routes.api.whatsappMessages.index);
      if (response?.status === 200) {
        setMessages(response?.data || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Messages Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and monitor message records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Total Messages",
              count: messages.length,
              icon: "fas fa-envelope",
              color: "blue",
            },
            {
              label: "Read Messages",
              count: messages.filter((m) => m.status === "read").length,
              icon: "fas fa-envelope-open",
              color: "green",
            },
            {
              label: "Group Messages",
              count: messages.filter((m) => m.isGroupMessage).length,
              icon: "fas fa-users",
              color: "purple",
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
                Search Messages
              </label>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search by sender, recipient, content, or group..."
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
                value={showReadOnly.toString()}
                onChange={(e) => setShowReadOnly(e.target.value === "true")}
                disabled={loading}
              >
                <option value="false">All Messages</option>
                <option value="true">Read Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Sender", "Recipient", "Content", "Status", "Timestamp", "Group", "View"].map(
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
                    <td colSpan={7} className="py-10 text-center">
                      <Loader color="#fc8b28" />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredMessages.map((message) => (
                    <tr
                      key={message.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {message.fromName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {message.toNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs">
                          {message.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(message.status)}`}
                        >
                          {message.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(message.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {message.groupName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium cursor-pointer">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 transform hover:scale-110 transition-transform duration-200"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
      <ShowMessage
        message={selectedMessage}
        isOpen={showMessageModal}
        onClose={() => {
          setShowMessageModal(false);
          setSelectedMessage(null);
        }}
      />
      <ToastMessages />
    </AdminLayout>
  );
};

export default WhatsappMessagesPage;
