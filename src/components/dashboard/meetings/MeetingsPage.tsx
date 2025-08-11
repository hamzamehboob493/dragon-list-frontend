"use client";

import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import MeetingModal from "./MeetingModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import ToastMessages, {
  showSuccessToast,
  showErrorToast,
  showParsingToast,
} from "@/components/common/ToastMessages";
import {
  createAction,
  deleteAction,
  getAction,
  updateAction,
} from "@/lib/actions/crudActions";
import { routes } from "@/lib/routes";
import { Meeting } from "@/lib/types/dashboard/types";
import Link from "next/link";
import Loader from "@/components/common/Loader";


interface ParseJob {
  id: string;
  meetingId: number;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
}

const MeetingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScheduledOnly, setShowScheduledOnly] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);
  const [parseJobs, setParseJobs] = useState<ParseJob[]>([]);
  const [parsingMeetings, setParsingMeetings] = useState<Set<number>>(new Set());

  const jobPollingRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Persistence keys
  const PARSE_JOBS_KEY = 'meetingParseJobs';
  const PARSING_MEETINGS_KEY = 'parsingMeetings';

  // Persistence helpers
  const saveParseJobs = (jobs: ParseJob[]) => {
    try {
      localStorage.setItem(PARSE_JOBS_KEY, JSON.stringify(jobs));
    } catch (error) {
      console.error('Error saving parse jobs:', error);
    }
  };

  const saveParsingMeetings = (meetingIds: Set<number>) => {
    try {
      localStorage.setItem(PARSING_MEETINGS_KEY, JSON.stringify(Array.from(meetingIds)));
    } catch (error) {
      console.error('Error saving parsing meetings:', error);
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !showScheduledOnly || meeting.status === "scheduled";
    return matchesSearch && matchesStatus;
  });

  // Load persisted parsing state on component mount
  useEffect(() => {
    const loadPersistedState = () => {
      try {
        // Load parse jobs
        const savedJobs = localStorage.getItem(PARSE_JOBS_KEY);
        if (savedJobs) {
          const jobs: ParseJob[] = JSON.parse(savedJobs);
          setParseJobs(jobs);

          // Restart polling for active jobs
          jobs.forEach(job => {
            if (job.status === 'active') {
              setParsingMeetings(prev => new Set(prev).add(job.meetingId));
              startJobPolling(job.id, job.meetingId);
            }
          });
        }

        // Load parsing meetings set
        const savedParsingMeetings = localStorage.getItem(PARSING_MEETINGS_KEY);
        if (savedParsingMeetings) {
          const meetingIds: number[] = JSON.parse(savedParsingMeetings);
          setParsingMeetings(new Set(meetingIds));
        }
      } catch (error) {
        console.error('Error loading persisted parsing state:', error);
        // Clear corrupted data
        localStorage.removeItem(PARSE_JOBS_KEY);
        localStorage.removeItem(PARSING_MEETINGS_KEY);
      }
    };

    getMeetingsData();
    loadPersistedState();

    // Cleanup polling intervals on unmount
    return () => {
      Object.values(jobPollingRef.current).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getMeetingsData = async () => {
    setLoading(true);
    try {
      const response = await getAction(routes.api.meetings.index);
      if (response?.status === 200) {
        setMeetings(response?.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitMeeting = async (data: Meeting) => {
    setLoading(true);
    try {
      let response;
      if (editingMeeting?.id) {
        response = await updateAction(
          `${routes.api.meetings.index}/${editingMeeting.id}`,
          data,
        );
        if (response?.status === 200) {
          await getMeetingsData();
          showSuccessToast("Meeting updated successfully");
        } else {
        }
      } else {
        response = await createAction(routes.api.meetings.index, data);
        if (response?.status === 201) {
          await getMeetingsData();
          showSuccessToast("Meeting created successfully");
        } else {
        }
      }
    } catch (error) {
      console.error("Error submitting meeting:", error);
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
      const response = await deleteAction(
        `${routes.api.meetings.index}/${meetingToDelete.id}`,
      );
      if (response?.status === 200) {
        await getMeetingsData();
        showSuccessToast("Meeting deleted successfully");
      } else {
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
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

  const startJobPolling = (jobId: string, meetingId: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await getAction(`${routes.api.jobs.status}/${jobId}/status`);
        const jobStatus = response?.data?.status;

        // Update job in state
        setParseJobs(prev => {
          const updatedJobs = prev.map(job =>
            job.id === jobId ? { ...job, status: jobStatus } : job
          );
          saveParseJobs(updatedJobs);
          return updatedJobs;
        });

        if (jobStatus === 'completed') {
          // Job completed successfully
          setParsingMeetings(prev => {
            const newSet = new Set(prev);
            newSet.delete(meetingId);
            saveParsingMeetings(newSet);
            return newSet;
          });

          showSuccessToast("Meeting parsing completed! You can now view the transcript tasks.");

          // Clear the polling interval
          clearInterval(jobPollingRef.current[jobId]);
          delete jobPollingRef.current[jobId];

          // Remove job from state
          setParseJobs(prev => {
            const filteredJobs = prev.filter(job => job.id !== jobId);
            saveParseJobs(filteredJobs);
            return filteredJobs;
          });
        } else if (jobStatus === 'failed') {
          // Job failed - fetch failure details
          try {
            const resultResponse = await getAction(`${routes.api.jobs.result}/${jobId}/result`);
            const errorMessage = resultResponse?.data?.message || "Meeting parsing failed. Please try again.";
            showErrorToast(errorMessage);
          } catch (resultError) {
            console.error("Error fetching job result:", resultError);
            showErrorToast("Meeting parsing failed. Please try again.");
          }

          setParsingMeetings(prev => {
            const newSet = new Set(prev);
            newSet.delete(meetingId);
            saveParsingMeetings(newSet);
            return newSet;
          });

          // Clear the polling interval
          clearInterval(jobPollingRef.current[jobId]);
          delete jobPollingRef.current[jobId];

          // Remove job from state
          setParseJobs(prev => {
            const filteredJobs = prev.filter(job => job.id !== jobId);
            saveParseJobs(filteredJobs);
            return filteredJobs;
          });
        }
        // If status is 'pending' or 'processing', continue polling
      } catch (error) {
        console.error("Error polling job status:", error);
        showErrorToast("Error checking job status.");

        // Clear the polling interval on error
        clearInterval(jobPollingRef.current[jobId]);
        delete jobPollingRef.current[jobId];

        setParsingMeetings(prev => {
          const newSet = new Set(prev);
          newSet.delete(meetingId);
          saveParsingMeetings(newSet);
          return newSet;
        });

        setParseJobs(prev => {
          const filteredJobs = prev.filter(job => job.id !== jobId);
          saveParseJobs(filteredJobs);
          return filteredJobs;
        });
      }
    }, 3000); // Poll every 3 seconds

    // Store the interval reference
    jobPollingRef.current[jobId] = pollInterval;
  };

  const handleParseMeeting = async (meeting: Meeting) => {
    if (!meeting.id) return;

    try {
      setParsingMeetings(prev => {
        const newSet = new Set(prev).add(meeting.id!);
        saveParsingMeetings(newSet);
        return newSet;
      });

      // Step 1: Process transcript first
      await createAction(`${routes.api.meetings.processTranscript}/${meeting.googleMeetId}`, {});

      // Step 2: Generate Dragons List
      const response = await createAction(`${routes.api.meetings.parse}/${meeting.id}`, {});
      const jobId = response?.data?.jobId || response?.data?.id;

      if (!jobId) {
        throw new Error("No job ID returned from API");
      }

      // Add job to state
      const newJob: ParseJob = {
        id: jobId,
        meetingId: meeting.id,
        status: 'active'
      };
      setParseJobs(prev => {
        const updatedJobs = [...prev, newJob];
        saveParseJobs(updatedJobs);
        return updatedJobs;
      });

      showParsingToast(`Meeting parsing started! This may take several minutes. Feel free to continue using the app - you'll be notified when it's ready. Job ID: ${jobId}`);

      // Start polling for job status
      startJobPolling(jobId, meeting.id);

    } catch (error) {
      console.error("Error parsing meeting:", error);
      showErrorToast("Failed to start meeting parsing. Please try again.");

      setParsingMeetings(prev => {
        const newSet = new Set(prev);
        newSet.delete(meeting.id!);
        saveParsingMeetings(newSet);
        return newSet;
      });
    }
  };

  const getJobStatus = (meetingId: number) => {
    return parseJobs.find(job => job.meetingId === meetingId);
  };

  const isMeetingParsing = (meetingId: number) => {
    return parsingMeetings.has(meetingId);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meetings Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor meeting schedules
            </p>
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
            {
              label: "Total Meetings",
              count: meetings.length,
              icon: "fas fa-calendar",
              color: "blue",
            },
            {
              label: "Scheduled Meetings",
              count: meetings.filter((m) => m.status === "scheduled").length,
              icon: "fas fa-calendar-check",
              color: "green",
            },
            {
              label: "Recurring Meetings",
              count: meetings.filter((m) => m.meetingType === "recurring")
                .length,
              icon: "fas fa-redo",
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
                Search Meetings
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                value={showScheduledOnly.toString()}
                onChange={(e) =>
                  setShowScheduledOnly(e.target.value === "true")
                }
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
                  {[
                    "Title",
                    "Team",
                    "Start Time",
                    "Status",
                    "Type",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
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
                  {filteredMeetings.map((meeting) => {
                    const isParsing = isMeetingParsing(meeting.id!);
                    const jobStatus = getJobStatus(meeting.id!);

                    return (
                      <tr
                        key={meeting.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {meeting.title}
                          </div>
                          {isParsing && (
                            <div className="text-xs text-orange-500 mt-1 flex items-center">
                              <i className="fas fa-spinner fa-spin mr-1"></i>
                              Parsing... {jobStatus && `(${jobStatus.status})`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <Link href={`${routes.ui.dashboard.teams}/${meeting.team?.id}`} className="text-orange-500">{meeting.team?.name}</Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(meeting.startTime).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(meeting.status)}`}
                          >
                            {meeting.status.charAt(0).toUpperCase() +
                              meeting.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                            {meeting.meetingType === "one_time"
                              ? "One-Time"
                              : "Recurring"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditMeeting(meeting)}
                              className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 transform hover:scale-110 transition-transform duration-200"
                              disabled={loading}
                              title="Edit Meeting"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(meeting)}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transform hover:scale-110 transition-transform duration-200"
                              disabled={loading}
                              title="Delete Meeting"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            <Link
                              href={`${routes.ui.dashboard.meetings}/${meeting.id}`}
                              className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 transform hover:scale-110 transition-transform duration-200"
                              title="View Meeting"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>
                            <button
                              onClick={() => handleParseMeeting(meeting)}
                              className={`transform hover:scale-110 transition-transform duration-200 ${isParsing
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-purple-600 hover:text-purple-900 dark:hover:text-purple-400"
                                }`}
                              disabled={loading || isParsing}
                              title={isParsing ? "Parsing in progress..." : "Parse Meeting"}
                            >
                              <i className={`fas ${isParsing ? "fa-spinner fa-spin" : "fa-cogs"}`}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
