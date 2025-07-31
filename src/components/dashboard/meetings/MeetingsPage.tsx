"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import MeetingModal from './MeetingModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import ToastMessages, { showSuccessToast, showErrorToast } from '@/components/common/ToastMessages';
import { createAction, deleteAction, getAction, updateAction } from '@/lib/actions/crudActions';
import { routes } from '@/lib/routes';
import { Meeting } from '@/lib/types/dashboard/types';
import Link from 'next/link';
import Loader from '@/components/common/Loader';

const MeetingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScheduledOnly, setShowScheduledOnly] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !showScheduledOnly || meeting.status === 'scheduled';
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    getMeetingsData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getMeetingsData = async () => {
    setLoading(true);
    try {
      const response = await getAction(routes.api.meetings.index);
      if (response?.status === 200) {
        setMeetings(response?.data.data || []);
      } else {
        showErrorToast('Failed to fetch meetings');
      }
    } catch (error) {
      showErrorToast('Error fetching meetings');
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitMeeting = async (data: Meeting) => {
    setLoading(true);
    try {
      let response;
      if (editingMeeting?.id) {
        response = await updateAction(`${routes.api.meetings.index}/${editingMeeting.id}`, data);
        if (response?.status === 200) {
          await getMeetingsData();
          showSuccessToast('Meeting updated successfully');
        } else {
          showErrorToast(response?.data.message || 'Error updating meeting');
        }
      } else {
        response = await createAction(routes.api.meetings.index, data);
        if (response?.status === 201) {
          await getMeetingsData();
          showSuccessToast('Meeting created successfully');
        } else {
          showErrorToast(response?.data.message || 'Error creating meeting');
        }
      }
    } catch (error) {
      showErrorToast('Error submitting meeting');
      console.error('Error submitting meeting:', error);
    } finally {
      setShowModal(false);
      setEditingMeeting(null);
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!meetingToDelete?.id) return;
    setLoading(true);
    try {
      const response = await deleteAction(`${routes.api.meetings.index}/${meetingToDelete.id}`);
      if (response?.status === 200) {
        await getMeetingsData();
        showSuccessToast('Meeting deleted successfully');
      } else {
        showErrorToast(response?.data.message || 'Error deleting meeting');
      }
    } catch (error) {
      showErrorToast('Error deleting meeting');
      console.error('Error deleting meeting:', error);
    } finally {
      setLoading(false);
      setMeetingToDelete(null);
    }
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setShowModal(true);
  };

  const handleOpenDeleteModal = (meeting: Meeting) => {
    setMeetingToDelete(meeting);
    setShowDeleteModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meetings Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor meeting schedules</p>
          </div>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              setEditingMeeting(null);
              setShowModal(true);
            }}
            disabled={loading}
          >
            <i className="fas fa-plus mr-2"></i>
            Add Meeting
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Meetings', count: meetings.length, icon: 'fas fa-calendar', color: 'blue' },
            { label: 'Scheduled Meetings', count: meetings.filter((m) => m.status === 'scheduled').length, icon: 'fas fa-calendar-check', color: 'green' },
            { label: 'Recurring Meetings', count: meetings.filter((m) => m.meetingType === 'recurring').length, icon: 'fas fa-redo', color: 'purple' },
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Meetings</label>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search by title or description..."
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
                value={showScheduledOnly.toString()}
                onChange={(e) => setShowScheduledOnly(e.target.value === 'true')}
                disabled={loading}
              >
                <option value="false">All Meetings</option>
                <option value="true">Scheduled Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Title', 'Team', 'Start Time', 'Status', 'Type', 'Actions'].map((header) => (
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
                  {filteredMeetings.map((meeting) => (
                    <tr key={meeting.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{meeting.title}</div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {teams.find((t) => t.id === meeting.teamId)?.name || 'Unknown Team'}
                        </div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{new Date(meeting.startTime).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(meeting.status)}`}>
                          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                          {meeting.meetingType === 'one_time' ? 'One-Time' : 'Recurring'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditMeeting(meeting)}
                            className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 transform hover:scale-110 transition-transform duration-200"
                            disabled={loading}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(meeting)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transform hover:scale-110 transition-transform duration-200"
                            disabled={loading}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <Link
                            href={`${routes.ui.dashboard.meetings}/${meeting.id}`}
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

      <MeetingModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMeeting(null);
        }}
        onSubmit={submitMeeting}
        meeting={editingMeeting}
        loading={loading}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteMeeting}
        title="Confirm Delete"
        message={`Are you sure you want to delete the meeting "${meetingToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastMessages />
    </AdminLayout>
  );
};

export default MeetingsPage;
